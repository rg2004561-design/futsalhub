<?php

namespace App\Http\Controllers;

use App\Models\Court;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourtController extends Controller
{
    /**
     * Display a listing of all courts
     */
    public function index(Request $request)
    {
        $courts = Court::with('photos', 'prices')
            ->active()
            ->paginate(12);

        return Inertia::render('courts/index', [
            'courts' => [
                'data' => $courts->items(),
                'meta' => [
                    'current_page' => $courts->currentPage(),
                    'last_page' => $courts->lastPage(),
                    'per_page' => $courts->perPage(),
                    'total' => $courts->total(),
                ],
                'links' => $courts->getUrlRange(1, $courts->lastPage()),
            ],
        ]);
    }

    /**
     * Display the specified court with pricing and availability
     */
    public function show(Court $court, Request $request)
    {
        $court->load(['photos']);

        // Get available slots for a specific date
        $date = $request->query('date');
        $availableSlots = [];

        if ($date) {
            $availableSlots = $this->getAvailableSlots($court, $date);
        }

        // Return JSON if this is an AJAX request
        if ($request->wantsJson()) {
            return response()->json([
                'court' => $court,
                'availableSlots' => $availableSlots,
            ]);
        }

        return Inertia::render('courts/show', [
            'court' => $court,
            'availableSlots' => $availableSlots,
        ]);
    }

    /**
     * Get available time slots for a court on a specific date
     */
    private function getAvailableSlots(Court $court, $date)
    {
        // Get existing bookings for this date (only confirmed/pending ones block slots)
        $existingBookings = $court->bookings()
            ->where('booking_date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->get();

        // Generate 1-hour slots based on court's operating hours
        $slots = [];
        
        // Parse times properly
        $openTime = \Carbon\Carbon::createFromFormat('H:i:s', $court->open_time);
        $closeTime = \Carbon\Carbon::createFromFormat('H:i:s', $court->close_time);

        // Start from opening time and generate slots until closing time
        $currentSlotStart = $openTime->copy();
        
        while ($currentSlotStart->copy()->addHour() <= $closeTime) {
            $currentSlotEnd = $currentSlotStart->copy()->addHour();
            
            $slots[] = [
                'start_time' => $currentSlotStart->format('H:i'),
                'end_time' => $currentSlotEnd->format('H:i'),
                'price' => (int) $court->price_per_hour,
                'available' => true, // All slots available when no bookings
            ];
            
            // Move to next hour
            $currentSlotStart = $currentSlotEnd->copy();
        }

        return $slots;
    }
}
