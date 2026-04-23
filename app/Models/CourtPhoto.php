<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourtPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'court_id',
        'path',
        'is_primary',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    // Relationships
    public function court()
    {
        return $this->belongsTo(Court::class);
    }
}
