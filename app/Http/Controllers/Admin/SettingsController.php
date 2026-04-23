<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = [
            'opening_time' => '08:00',
            'closing_time' => '23:00',
            'slot_duration' => 60,
            'payment_timeout' => 15,
        ];

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
        ]);
    }

    public function update()
    {
        // Update settings logic
        return back()->with('success', 'Pengaturan berhasil disimpan');
    }
}
