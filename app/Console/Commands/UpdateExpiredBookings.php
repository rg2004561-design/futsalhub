<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Models\Transaction;
use Illuminate\Console\Command;
use Carbon\Carbon;

class UpdateExpiredBookings extends Command
{
    protected $signature = 'bookings:expire-outdated';
    protected $description = 'Update expired pending bookings and transactions';

    public function handle()
    {
        $now = Carbon::now();

        // Update pending bookings that exceeded 24 hours
        $expiredBookings = Booking::where('status', 'pending')
            ->where('expires_at', '<', $now)
            ->get();

        foreach ($expiredBookings as $booking) {
            $booking->update(['status' => 'cancelled']);
            $this->info("Booking {$booking->booking_code} expired and cancelled");
        }

        // Update expired pending transactions
        $expiredTransactions = Transaction::where('status', 'pending')
            ->whereHas('booking', function ($query) {
                $query->where('expires_at', '<', Carbon::now());
            })
            ->get();

        foreach ($expiredTransactions as $transaction) {
            $transaction->update(['status' => 'expire']);
            $this->info("Transaction {$transaction->transaction_id} expired");
        }

        // Update completed booking status for past dates
        $completedBookings = Booking::where('status', 'paid')
            ->where('booking_date', '<', $now->toDateString())
            ->get();

        foreach ($completedBookings as $booking) {
            $booking->update(['status' => 'completed']);
            $this->info("Booking {$booking->booking_code} marked as completed");
        }

        $this->info('Expired bookings updated successfully');
    }
}
