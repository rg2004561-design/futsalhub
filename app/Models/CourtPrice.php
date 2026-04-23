<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourtPrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'court_id',
        'day_type',
        'start_time',
        'end_time',
        'price',
    ];

    // Relationships
    public function court()
    {
        return $this->belongsTo(Court::class);
    }
}
