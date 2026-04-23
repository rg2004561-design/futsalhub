<?php

namespace App\Providers;

use App\Models\Booking;
use App\Policies\BookingPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Policy registration
        Gate::policy(Booking::class, BookingPolicy::class);

        // Define admin gate
        Gate::define('admin', function (?Auth $user) {
            return $user && $user->role === 'admin';
        });
    }
}
