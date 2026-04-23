<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('court_id')->constrained('courts')->onDelete('cascade');
            $table->date('booking_date');
            $table->enum('status', ['draft', 'pending', 'paid', 'completed', 'cancelled'])->default('draft');
            $table->integer('total_price');
            $table->string('booking_code')->unique();
            $table->text('notes')->nullable();
            $table->timestamp('expires_at')->nullable(); // Untuk payment expiry
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('booking_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
