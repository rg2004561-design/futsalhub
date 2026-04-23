<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('booking.user', 'booking.court')
            ->when(request('status'), function ($query) {
                return $query->where('status', request('status'));
            })
            ->when(request('date_from'), function ($query) {
                return $query->whereDate('created_at', '>=', request('date_from'));
            })
            ->when(request('date_to'), function ($query) {
                return $query->whereDate('created_at', '<=', request('date_to'));
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/transactions/index', [
            'transactions' => $transactions,
            'filters' => request()->only(['status', 'date_from', 'date_to']),
        ]);
    }
}
