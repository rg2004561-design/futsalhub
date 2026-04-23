<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'transaction_id',
        'payment_method',
        'status',
        'amount',
        'midtrans_response',
        'midtrans_url',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'midtrans_response' => 'array',
            'paid_at' => 'datetime',
        ];
    }

    // Relationships
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    // Helper Methods
    public function isPaid()
    {
        return $this->status === 'settlement';
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isExpired()
    {
        return $this->status === 'expire';
    }
}
