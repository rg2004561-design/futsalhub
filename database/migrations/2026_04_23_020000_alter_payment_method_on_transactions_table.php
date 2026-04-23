<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE transactions MODIFY payment_method VARCHAR(50) NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE transactions MODIFY payment_method ENUM('credit_card', 'bank_transfer', 'e_wallet') NULL");
    }
};