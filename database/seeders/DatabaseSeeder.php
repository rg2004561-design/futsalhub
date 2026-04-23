<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin Account
        User::create([
            'name' => 'Admin Dashboard',
            'email' => 'admin@futsalhub.local',
            'phone' => '081234567890',
            'address' => 'Jl. Admin No. 1, Jakarta',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Regular User Accounts (Mekanik/Pemain)
        User::create([
            'name' => 'Adi Wijaya',
            'email' => 'adi@futsalhub.local',
            'phone' => '081234567891',
            'address' => 'Jl. Merdeka No. 10, Jakarta',
            'password' => bcrypt('user123'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@futsalhub.local',
            'phone' => '081234567892',
            'address' => 'Jl. Sudirman No. 20, Jakarta',
            'password' => bcrypt('user123'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Citra Dewi',
            'email' => 'citra@futsalhub.local',
            'phone' => '081234567893',
            'address' => 'Jl. Gatot Subroto No. 5, Jakarta',
            'password' => bcrypt('user123'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        // Approver Account (Atasan/Manager)
        User::create([
            'name' => 'Doni Hermawan',
            'email' => 'approver@futsalhub.local',
            'phone' => '081234567894',
            'address' => 'Jl. Ahmad Yani No. 15, Jakarta',
            'password' => bcrypt('approver123'),
            'role' => 'approver',
            'email_verified_at' => now(),
        ]);

        // Tools Keeper Account (Petugas Verifikasi)
        User::create([
            'name' => 'Eka Putri',
            'email' => 'toolskeeper@futsalhub.local',
            'phone' => '081234567895',
            'address' => 'Jl. Pemuda No. 25, Jakarta',
            'password' => bcrypt('keeper123'),
            'role' => 'tools_keeper',
            'email_verified_at' => now(),
        ]);

        // Seed courts and pricing
        $this->call(CourtSeeder::class);
    }
}
