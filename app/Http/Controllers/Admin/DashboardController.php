<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Court;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->startOfDay();
        $todayEnd = now()->endOfDay();
        $thisMonth = now()->startOfMonth();
        $thisMonthEnd = now()->endOfMonth();

        // Get statistics
        $totalBookingsToday = Booking::whereBetween('booking_date', [$today, $todayEnd])->count();
        $totalRevenueToday = Transaction::where('status', 'settlement')
            ->whereBetween('created_at', [$today, $todayEnd])
            ->sum('amount');

        $totalBookingsMonth = Booking::whereBetween('booking_date', [$thisMonth, $thisMonthEnd])->count();
        $totalRevenueMonth = Transaction::where('status', 'settlement')
            ->whereBetween('created_at', [$thisMonth, $thisMonthEnd])
            ->sum('amount');

        $totalCourts = Court::count();
        $activeCourts = Court::where('is_active', true)->count();
        $totalUsers = User::count();

        // Get recent bookings
        $recentBookings = Booking::with('user', 'court')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Get daily revenue for last 7 days (for chart)
        $dailyRevenue = Transaction::where('status', 'settlement')
            ->whereBetween('created_at', [now()->subDays(7), now()])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->selectRaw('DATE(created_at) as date, SUM(amount) as total, COUNT(*) as count')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'total' => (int)$item->total,
                    'count' => (int)$item->count,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'bookings_today' => $totalBookingsToday,
                'revenue_today' => $totalRevenueToday,
                'bookings_month' => $totalBookingsMonth,
                'revenue_month' => $totalRevenueMonth,
                'total_courts' => $totalCourts,
                'active_courts' => $activeCourts,
                'total_users' => $totalUsers,
            ],
            'recent_bookings' => $recentBookings,
            'daily_revenue' => $dailyRevenue,
        ]);
    }
}
