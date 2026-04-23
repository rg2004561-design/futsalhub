<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with('user', 'court')
            ->orderBy('booking_date', 'desc')
            ->paginate(20);

        return Inertia::render('admin/bookings/index', [
            'bookings' => $bookings,
        ]);
    }

    public function calendar()
    {
        $bookings = Booking::with('user', 'court')
            ->where('booking_date', '>=', now()->startOfMonth())
            ->where('booking_date', '<=', now()->endOfMonth())
            ->get();

        return Inertia::render('admin/bookings/calendar', [
            'bookings' => $bookings,
        ]);
    }
}
