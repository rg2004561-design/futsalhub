<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->onDelete('cascade');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('price');
            $table->timestamps();
            
            $table->index(['booking_id', 'start_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_slots');
    }
};
