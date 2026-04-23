<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction as MidtransTransaction;

class MidtransService
{
    public function __construct()
    {
        // Setup Midtrans config
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$clientKey = config('services.midtrans.client_key');
        Config::$isProduction = config('services.midtrans.is_production', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;
        Config::$overrideNotifUrl = route('webhook.midtrans');
    }

    /**
     * Create payment token untuk Snap.js
     */
    public function createPaymentToken(Booking $booking): array
    {
        try {
            // Prepare transaction params
            $params = [
                'transaction_details' => [
                    'order_id' => $booking->booking_code,
                    'gross_amount' => $booking->total_price,
                ],
                'callbacks' => [
                    'finish' => route('payment.callback'),
                ],
                'customer_details' => [
                    'first_name' => $booking->user->name,
                    'email' => $booking->user->email,
                    'phone' => $booking->user->phone ?? '0000000000',
                    'billing_address' => [
                        'address' => $booking->user->address ?? '-',
                        'city' => 'Jakarta',
                        'postal_code' => '12000',
                        'country_code' => 'IDN',
                    ],
                ],
                'item_details' => $this->prepareItemDetails($booking),
            ];

            Log::info('Creating Midtrans transaction', [
                'order_id' => $booking->booking_code,
                'gross_amount' => $booking->total_price,
                'server_key_exists' => !empty(Config::$serverKey),
                'client_key_exists' => !empty(Config::$clientKey),
            ]);

            // Create transaction in Midtrans system
            $response = Snap::createTransaction($params);
            
            Log::info('Midtrans createTransaction response', [
                'response_type' => gettype($response),
                'response' => json_encode($response, JSON_UNESCAPED_SLASHES),
                'response_var_dump' => print_r($response, true),
            ]);

            // Get the redirect_url and token from transaction object
            $redirectUrl = null;
            $snapToken = null;
            
            if (is_object($response)) {
                if (isset($response->redirect_url)) {
                    $redirectUrl = $response->redirect_url;
                    Log::info('Redirect URL found via ->redirect_url property');
                }
                if (isset($response->token)) {
                    $snapToken = $response->token;
                    Log::info('Token found via ->token property');
                }
            } elseif (is_array($response)) {
                if (isset($response['redirect_url'])) {
                    $redirectUrl = $response['redirect_url'];
                    Log::info('Redirect URL found via array key');
                }
                if (isset($response['token'])) {
                    $snapToken = $response['token'];
                    Log::info('Token found via array key');
                }
            }

            // Prefer redirect_url for payment flow
            if (!$redirectUrl) {
                throw new \Exception('Could not extract redirect_url from Midtrans response: ' . json_encode($response));
            }

            Log::info('Snap payment URL created', [
                'token' => $snapToken,
                'redirect_url' => $redirectUrl,
                'booking_id' => $booking->id,
                'order_id' => $booking->booking_code,
            ]);

            // Check if transaction already exists
            $existingTransaction = Transaction::where('booking_id', $booking->id)->first();
            
            if (!$existingTransaction) {
                // Store transaction record in database
                Transaction::create([
                    'booking_id' => $booking->id,
                    'transaction_id' => $booking->booking_code,
                    'status' => 'pending',
                    'amount' => $booking->total_price,
                ]);
            }

            return [
                'success' => true,
                'token' => $snapToken,
                'redirect_url' => $redirectUrl,
            ];

        } catch (\Exception $e) {
            Log::error('Midtrans Token Generation Failed', [
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
                'booking_id' => $booking->id,
            ]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Check payment status
     */
    public function checkPaymentStatus(Transaction $transaction): array
    {
        try {
            $status = MidtransTransaction::status($transaction->transaction_id);

            return [
                'success' => true,
                'status' => is_object($status) ? ($status->transaction_status ?? null) : data_get($status, 'transaction_status'),
                'payment_type' => is_object($status) ? ($status->payment_type ?? null) : data_get($status, 'payment_type'),
                'data' => $status,
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Handle webhook notification dari Midtrans
     */
    public function handleNotification(array $notification): array
    {
        try {
            $orderId = $notification['order_id'];
            $transactionStatus = $notification['transaction_status'];
            $paymentType = $notification['payment_type'] ?? null;

            // Find transaction
            $transaction = Transaction::where('transaction_id', $orderId)->first();
            if (!$transaction) {
                return ['success' => false, 'message' => 'Transaction not found'];
            }

            // Update transaction based on status
            $this->updateTransactionStatus($transaction, $transactionStatus, $paymentType, $notification);

            return ['success' => true, 'message' => 'Notification handled'];

        } catch (\Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Update transaction and booking status based on payment status
     */
    private function updateTransactionStatus(
        Transaction $transaction,
        string $midtransStatus,
        ?string $paymentType,
        array $midtransResponse
    ): void {
        $transaction->update([
            'payment_method' => $paymentType,
            'midtrans_response' => $midtransResponse,
            'status' => $this->mapMidtransStatus($midtransStatus),
        ]);

        // Update booking status
        if ($midtransStatus === 'settlement') {
            $transaction->booking->update([
                'status' => 'paid',
            ]);

            $transaction->update(['paid_at' => now()]);
        } elseif (in_array($midtransStatus, ['cancel', 'deny', 'expire'])) {
            $transaction->booking->update([
                'status' => 'cancelled',
            ]);
        }
    }

    /**
     * Map Midtrans status to our transaction status
     */
    private function mapMidtransStatus(string $midtransStatus): string
    {
        $mapping = [
            'pending' => 'pending',
            'settlement' => 'settlement',
            'cancel' => 'cancel',
            'deny' => 'deny',
            'expire' => 'expire',
        ];

        return $mapping[$midtransStatus] ?? 'pending';
    }

    /**
     * Prepare item details for Midtrans
     */
    private function prepareItemDetails(Booking $booking): array
    {
        $items = [];

        foreach ($booking->slots as $slot) {
            $items[] = [
                'id' => 'slot_' . $slot->id,
                'price' => $slot->price,
                'quantity' => 1,
                'name' => 'Jam ' . $slot->start_time . ' - ' . $slot->end_time,
            ];
        }

        // Add court info as first item if needed
        array_unshift($items, [
            'id' => 'court_' . $booking->court->id,
            'price' => 0,
            'quantity' => 1,
            'name' => $booking->court->name . ' (' . $booking->booking_date . ')',
        ]);

        return $items;
    }

    /**
     * Get payment details dari Midtrans
     */
    public function getPaymentDetails(string $orderId): array
    {
        try {
            $transaction = Transaction::where('transaction_id', $orderId)->first();
            if (!$transaction) {
                return ['success' => false, 'message' => 'Transaction not found'];
            }

            $status = MidtransTransaction::status($orderId);

            return [
                'success' => true,
                'transaction' => $transaction,
                'midtrans_status' => $status,
            ];

        } catch (\Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
