<?php

namespace App\Http\Controllers;

use App\Mail\PaymentConfirmation;
use App\Models\Booking;
use App\Models\Transaction;
use App\Services\MidtransService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class TransactionController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    /**
     * Display payment form
     */
    public function create(Booking $booking)
    {
        // Check if user owns this booking
        if ($booking->user_id !== Auth::id()) {
            return redirect()->route('bookings.history')
                ->with('error', 'Anda tidak memiliki akses ke booking ini');
        }

        // Auto-transition draft → pending saat akan bayar
        if ($booking->status === 'draft') {
            $booking->update([
                'status' => 'pending',
                'expires_at' => now()->addHours(24),
            ]);
        }

        if (!in_array($booking->status, ['pending', 'draft'])) {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'Booking tidak bisa dibayar pada status saat ini');
        }

        // Create payment token
        $result = $this->midtransService->createPaymentToken($booking);

        if (!$result['success']) {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'Gagal membuat token pembayaran: ' . $result['message']);
        }

        return Inertia::render('payments/index', [
            'booking' => $booking->load('court', 'slots'),
            'token' => $result['token'] ?? null,
            'redirectUrl' => $result['redirect_url'] ?? null,
            'clientKey' => config('services.midtrans.client_key'),
        ]);
    }

    /**
     * Show payment status
     */
    public function status(Transaction $transaction)
    {
        // Check if user owns this transaction's booking
        if ($transaction->booking->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak',
            ], 403);
        }

        $result = $this->midtransService->checkPaymentStatus($transaction);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 422);
        }

        return response()->json([
            'success' => true,
            'status' => $result['status'],
            'transaction' => $transaction,
        ]);
    }

    /**
     * Handle Midtrans webhook notification
     */
    public function webhook(Request $request)
    {
        // Log untuk debugging
        Log::info('Midtrans Webhook:', $request->all());

        // Verify signature
        $signature = hash('sha512', 
            $request->order_id . 
            $request->status_code . 
            $request->gross_amount . 
            config('services.midtrans.server_key')
        );

        if ($signature !== $request->signature_key) {
            return response()->json(['success' => false, 'message' => 'Invalid signature'], 403);
        }

        // Handle notification
        $result = $this->midtransService->handleNotification($request->all());

        // Send email if payment is successful
        if ($result['success']) {
            $transaction = Transaction::where('transaction_id', $request->order_id)->first();
            if ($transaction && $transaction->isPaid()) {
                Mail::to($transaction->booking->user->email)->queue(new PaymentConfirmation($transaction));
            }
        }

        return response()->json($result);
    }

    /**
     * Callback after payment (user redirect)
     */
    public function callback(Request $request)
    {
        $orderId = $request->query('order_id');
        $transaction = Transaction::where('transaction_id', $orderId)->first();

        if (!$transaction) {
            return redirect()->route('home')->with('error', 'Transaksi tidak ditemukan');
        }

        // Check payment status
        $result = $this->midtransService->checkPaymentStatus($transaction);

        if ($result['success']) {
            $paymentStatus = $result['status'] ?? 'pending';
            $paymentMethod = $result['payment_type'] ?? $transaction->payment_method;

            $transaction->update([
                'status' => $paymentStatus,
                'payment_method' => $paymentMethod,
                'midtrans_response' => $result['data'] ?? null,
                'paid_at' => $paymentStatus === 'settlement' ? now() : $transaction->paid_at,
            ]);

            if ($paymentStatus === 'settlement') {
                $transaction->booking->update(['status' => 'paid']);
            } elseif (in_array($paymentStatus, ['cancel', 'deny', 'expire'])) {
                $transaction->booking->update(['status' => 'cancelled']);
            }
        }

        if ($result['success'] && $result['status'] === 'settlement') {
            return redirect()->route('bookings.show', $transaction->booking)
                ->with('success', 'Pembayaran berhasil! Booking Anda sudah dikonfirmasi');
        } else {
            return redirect()->route('bookings.show', $transaction->booking)
                ->with('warning', 'Status pembayaran: ' . ($result['status'] ?? 'unknown'));
        }
    }

    /**
     * Retry payment untuk booking yang pending
     */
    public function retry(Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak',
            ], 403);
        }

        if (!in_array($booking->status, ['draft', 'pending'])) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya Draft atau Pending booking yang dapat di-retry',
            ], 422);
        }

        // Ensure booking is pending
        if ($booking->status === 'draft') {
            $booking->update(['status' => 'pending']);
        }

        // Create new payment token
        $result = $this->midtransService->createPaymentToken($booking);

        return response()->json($result);
    }
}
