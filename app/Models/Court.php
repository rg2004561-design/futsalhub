<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Court extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price_per_hour',
        'facilities',
        'total_slots',
        'open_time',
        'close_time',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'facilities' => 'array',
        ];
    }

    // Relationships
    public function photos()
    {
        return $this->hasMany(CourtPhoto::class)->orderBy('order');
    }

    public function prices()
    {
        return $this->hasMany(CourtPrice::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
