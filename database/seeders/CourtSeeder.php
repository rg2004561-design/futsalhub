<?php

namespace Database\Seeders;

use App\Models\Court;
use App\Models\CourtPrice;
use Illuminate\Database\Seeder;

class CourtSeeder extends Seeder
{
    public function run(): void
    {
        // Create sample courts
        $courts = [
            [
                'name' => 'Lapangan Premium 1',
                'slug' => 'lapangan-premium-1',
                'description' => 'Lapangan futsal premium dengan perkerasaan berkualitas tinggi',
                'facilities' => ['WiFi', 'AC', 'Parkir', 'Kantin'],
                'total_slots' => 4,
                'open_time' => '06:00',
                'close_time' => '23:00',
                'is_active' => true,
            ],
            [
                'name' => 'Lapangan Premium 2',
                'slug' => 'lapangan-premium-2',
                'description' => 'Lapangan futsal premium dengan pencahayaan LED terbaik',
                'facilities' => ['WiFi', 'AC', 'Parkir', 'Kantin', 'Shower'],
                'total_slots' => 4,
                'open_time' => '06:00',
                'close_time' => '23:00',
                'is_active' => true,
            ],
            [
                'name' => 'Lapangan Standard',
                'slug' => 'lapangan-standard',
                'description' => 'Lapangan futsal standar dengan fasilitas lengkap',
                'facilities' => ['Parkir', 'Kantin'],
                'total_slots' => 2,
                'open_time' => '07:00',
                'close_time' => '22:00',
                'is_active' => true,
            ],
        ];

        foreach ($courts as $courtData) {
            $court = Court::create($courtData);

            // Create pricing for weekdays
            $weekdayTimes = [
                ['06:00', '07:00', 50000],
                ['07:00', '08:00', 50000],
                ['08:00', '17:00', 40000], // Morning/afternoon
                ['17:00', '19:00', 80000], // Peak hours
                ['19:00', '21:00', 100000], // Peak hours
                ['21:00', '23:00', 60000], // Night
            ];

            foreach ($weekdayTimes as [$startTime, $endTime, $price]) {
                CourtPrice::create([
                    'court_id' => $court->id,
                    'day_type' => 'weekday',
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'price' => $price,
                ]);
            }

            // Create pricing for weekends (higher rates)
            $weekendTimes = [
                ['06:00', '07:00', 60000],
                ['07:00', '08:00', 60000],
                ['08:00', '17:00', 70000], // Morning/afternoon
                ['17:00', '19:00', 120000], // Peak hours
                ['19:00', '21:00', 150000], // Peak hours
                ['21:00', '23:00', 100000], // Night
            ];

            foreach ($weekendTimes as [$startTime, $endTime, $price]) {
                CourtPrice::create([
                    'court_id' => $court->id,
                    'day_type' => 'weekend',
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'price' => $price,
                ]);
            }
        }
    }
}
