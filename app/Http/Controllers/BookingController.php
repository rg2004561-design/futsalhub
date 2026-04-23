<?php

namespace App\Http\Controllers;

use App\Mail\BookingConfirmation;
use App\Models\Booking;
use App\Models\BookingSlot;
use App\Models\Court;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Show booking form with court and availability
     */
    public function create(Request $request)
    {
        $courtId = $request->query('court_id');
        $bookingDate = $request->query('booking_date');
        $slots = $request->query('slots');

        $court = Court::findOrFail($courtId);
        
        $selectedSlots = [];
        if ($slots) {
            $selectedSlots = json_decode($slots, true);
        }

        return Inertia::render('bookings/create', [
            'court' => $court->load('photos'),
            'date' => $bookingDate,
            'availableSlots' => $selectedSlots,
            'user' => Auth::user(),
        ]);
    }

    /**
     * Store a new booking (draft status)
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'court_id' => 'required|exists:courts,id',
                'booking_date' => 'required|date_format:Y-m-d|after:today',
                'slots' => 'required|array|min:1',
                'slots.*.start_time' => 'required|string',
                'slots.*.end_time' => 'required|string',
                'slots.*.price' => 'required|numeric|min:0',
                'notes' => 'nullable|string|max:500',
            ]);

            $booking = DB::transaction(function () use ($validated) {
                $court = Court::findOrFail($validated['court_id']);

                // Verify availability
                $this->validateSlotAvailability($court, $validated['booking_date'], $validated['slots']);

                // Calculate total price
                $totalPrice = collect($validated['slots'])->sum('price');

                // Create booking
                $booking = Booking::create([
                    'user_id' => Auth::id(),
                    'court_id' => $validated['court_id'],
                    'booking_date' => $validated['booking_date'],
                    'status' => 'draft',
                    'total_price' => $totalPrice,
                    'booking_code' => $this->generateBookingCode(),
                    'notes' => $validated['notes'] ?? null,
                ]);

                // Create booking slots
                foreach ($validated['slots'] as $slot) {
                    BookingSlot::create([
                        'booking_id' => $booking->id,
                        'start_time' => substr($slot['start_time'], 0, 5), // Ensure HH:MM format
                        'end_time' => substr($slot['end_time'], 0, 5),
                        'price' => (int)$slot['price'],
                    ]);
                }

                // Send confirmation email
                Mail::to($booking->user->email)->queue(new BookingConfirmation($booking));

                return $booking;
            });

            return response()->json([
                'success' => true,
                'booking_id' => $booking->id,
                'booking_code' => $booking->booking_code,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Booking validation error:', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 'Validasi data gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Booking error: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Show booking details
     */
    public function show(Booking $booking)
    {
        // Check if user owns this booking
        if ($booking->user_id !== Auth::id()) {
            return redirect()->route('bookings.history')
                ->with('error', 'Anda tidak memiliki akses ke booking ini');
        }

        $booking->load('court.photos', 'slots', 'transaction', 'user');

        if ($booking->transaction) {
            if ($booking->transaction->status === 'settlement' && $booking->status !== 'paid') {
                $booking->update(['status' => 'paid']);
                $booking->refresh();
                $booking->load('court.photos', 'slots', 'transaction', 'user');
            } elseif (in_array($booking->transaction->status, ['cancel', 'deny', 'expire']) && $booking->status !== 'cancelled') {
                $booking->update(['status' => 'cancelled']);
                $booking->refresh();
                $booking->load('court.photos', 'slots', 'transaction', 'user');
            }
        }

        return Inertia::render('bookings/show', [
            'booking' => $booking,
        ]);
    }

    /**
     * Show user's booking history
     */
    public function history()
    {
        $bookings = Booking::where('user_id', Auth::id())
            ->with('court.photos', 'slots', 'transaction')
            ->latest('created_at')
            ->paginate(10);

        return Inertia::render('bookings/history', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Submit booking (change status from draft to pending)
     */
    public function submit(Booking $booking)
    {
        // Check if user owns this booking
        if ($booking->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke booking ini',
            ], 403);
        }

        if ($booking->status !== 'draft') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya booking draft yang dapat di-submit',
            ], 422);
        }

        // Update status to pending
        $booking->update([
            'status' => 'pending',
            'expires_at' => Carbon::now()->addHours(24), // 24 hours to pay
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil di-submit',
            'booking' => $booking,
        ]);
    }

    /**
     * Cancel a booking
     */
    public function cancel(Booking $booking)
    {
        // Check if user owns this booking
        if ($booking->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke booking ini',
            ], 403);
        }

        if (!in_array($booking->status, ['draft', 'pending'])) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya booking draft atau pending yang dapat dibatalkan',
            ], 422);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil dibatalkan',
        ]);
    }

    /**
     * Get available slots for a court on a specific date
     */
    private function getAvailableSlots(Court $court, $date)
    {
        $dayOfWeek = Carbon::createFromFormat('Y-m-d', $date)->dayOfWeek;
        $dayType = ($dayOfWeek >= 1 && $dayOfWeek <= 5) ? 'weekday' : 'weekend';

        $prices = $court->prices()
            ->where('day_type', $dayType)
            ->orderBy('start_time')
            ->get();

        $existingBookings = $court->bookings()
            ->where('booking_date', $date)
            ->where('status', '!=', 'cancelled')
            ->with('slots')
            ->get();

        $slots = [];
        foreach ($prices as $price) {
            $slots[] = [
                'start_time' => $price->start_time,
                'end_time' => $price->end_time,
                'price' => $price->price,
                'available' => !$this->isSlotBooked($price->start_time, $price->end_time, $existingBookings),
            ];
        }

        return $slots;
    }

    /**
     * Check if a time slot is already booked
     */
    private function isSlotBooked($startTime, $endTime, $existingBookings)
    {
        foreach ($existingBookings as $booking) {
            foreach ($booking->slots as $slot) {
                if ($slot->start_time < $endTime && $slot->end_time > $startTime) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Validate slot availability and prevent double booking
     */
    private function validateSlotAvailability(Court $court, $date, $slots)
    {
        // Lock the rows for update to prevent race condition
        $existingBookings = $court->bookings()
            ->where('booking_date', $date)
            ->where('status', '!=', 'cancelled')
            ->with('slots')
            ->lockForUpdate()
            ->get();

        foreach ($slots as $slot) {
            if ($this->isSlotBooked($slot['start_time'], $slot['end_time'], $existingBookings)) {
                throw new \Exception("Slot {$slot['start_time']} - {$slot['end_time']} sudah dipesan");
            }
        }
    }

    /**
     * Generate unique booking code
     */
    private function generateBookingCode()
    {
        do {
            $code = 'BK' . date('Ymd') . strtoupper(substr(uniqid(), -6));
        } while (Booking::where('booking_code', $code)->exists());

        return $code;
    }
}
