<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\CourtController;
use App\Http\Controllers\TransactionController;
use App\Models\Court;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Get top 3 most booked courts
    $topCourts = Court::with(['photos'])->withCount('bookings')
        ->orderBy('bookings_count', 'desc')
        ->take(3)
        ->get();
    
    return Inertia::render('welcome', [
        'topCourts' => $topCourts,
    ]);
})->name('home');

// Public court browsing
Route::get('courts', [CourtController::class, 'index'])->name('courts.index');
Route::get('courts/{court:slug}', [CourtController::class, 'show'])->name('courts.show');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Booking routes - specific routes before resource routes
    Route::get('bookings/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::get('bookings', [BookingController::class, 'history'])->name('bookings.history');
    Route::post('bookings', [BookingController::class, 'store'])->name('bookings.store');
    
    // Booking detail & actions
    Route::get('bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::post('bookings/{booking}/submit', [BookingController::class, 'submit'])->name('bookings.submit');
    Route::post('bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

    // Payment routes
    Route::get('bookings/{booking}/payment', [TransactionController::class, 'create'])->name('transactions.create');
    Route::get('transactions/{transaction}/status', [TransactionController::class, 'status'])->name('transactions.status');
    Route::post('bookings/{booking}/retry', [TransactionController::class, 'retry'])->name('transactions.retry');

    // Admin routes
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::get('dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard.view');
        
        // Court management
        Route::get('courts', [\App\Http\Controllers\Admin\CourtController::class, 'index'])->name('courts.index');
        Route::get('courts/create', [\App\Http\Controllers\Admin\CourtController::class, 'create'])->name('courts.create');
        Route::post('courts', [\App\Http\Controllers\Admin\CourtController::class, 'store'])->name('courts.store');
        Route::get('courts/{court}/edit', [\App\Http\Controllers\Admin\CourtController::class, 'edit'])->name('courts.edit');
        Route::put('courts/{court}', [\App\Http\Controllers\Admin\CourtController::class, 'update'])->name('courts.update');
        Route::delete('courts/{court}', [\App\Http\Controllers\Admin\CourtController::class, 'destroy'])->name('courts.destroy');
        
        // Booking management
        Route::get('bookings', [\App\Http\Controllers\Admin\BookingController::class, 'index'])->name('bookings.index');
        Route::get('bookings/calendar', [\App\Http\Controllers\Admin\BookingController::class, 'calendar'])->name('bookings.calendar');
        
        // Transaction management
        Route::get('transactions', [\App\Http\Controllers\Admin\TransactionController::class, 'index'])->name('transactions.index');
        
        // Settings
        Route::get('settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
        Route::put('settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');
        
        // User management
        Route::get('users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    });
});

// Midtrans Webhook (no auth required)
Route::post('webhook/midtrans', [TransactionController::class, 'webhook'])->name('webhook.midtrans');

// Midtrans callback after payment
Route::get('payment-callback', [TransactionController::class, 'callback'])->name('payment.callback');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
