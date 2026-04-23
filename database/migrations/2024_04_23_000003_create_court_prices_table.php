<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('court_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('court_id')->constrained('courts')->onDelete('cascade');
            $table->enum('day_type', ['weekday', 'weekend'])->default('weekday');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('price'); // dalam rupiah
            $table->timestamps();
            
            $table->unique(['court_id', 'day_type', 'start_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('court_prices');
    }
};
