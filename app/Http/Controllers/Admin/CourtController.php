<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Court;
use App\Models\CourtPhoto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourtController extends Controller
{
    public function index()
    {
        $courts = Court::with('photos')
            ->withCount('bookings')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/courts/index', [
            'courts' => $courts,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/courts/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string|unique:courts',
            'description' => 'required|string',
            'price_per_hour' => 'required|numeric|min:0',
            'facilities' => 'array',
            'open_time' => 'required|date_format:H:i',
            'close_time' => 'required|date_format:H:i',
            'photos' => 'array',
            'photos.*' => 'image|max:5120',
        ]);

        $court = Court::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'],
            'price_per_hour' => $validated['price_per_hour'],
            'facilities' => $validated['facilities'] ?? [],
            'open_time' => $validated['open_time'],
            'close_time' => $validated['close_time'],
            'is_active' => true,
            'total_slots' => 10,
        ]);

        // Handle photo uploads
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $index => $photo) {
                $path = $photo->store('courts', 'public');
                CourtPhoto::create([
                    'court_id' => $court->id,
                    'path' => $path,
                    'order' => $index,
                    'is_primary' => $index === 0,
                ]);
            }
        }

        return redirect(route('admin.courts.index'))->with('success', 'Lapangan berhasil ditambahkan');
    }

    public function edit(Court $court)
    {
        return Inertia::render('admin/courts/edit', [
            'court' => $court->load('photos'),
        ]);
    }

    public function update(Request $request, Court $court)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price_per_hour' => 'required|numeric|min:0',
            'facilities' => 'array',
            'open_time' => ['required', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
            'close_time' => ['required', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
            'is_active' => 'boolean',
            'removed_photos' => 'array',
            'new_photos.*' => 'image|mimes:jpeg,jpg,png|max:2048',
        ]);

        $court->name = $validated['name'];
        $court->description = $validated['description'];
        $court->price_per_hour = $validated['price_per_hour'];
        $court->facilities = $validated['facilities'] ?? [];
        $court->open_time = strlen($validated['open_time']) === 5 ? $validated['open_time'].':00' : $validated['open_time'];
        $court->close_time = strlen($validated['close_time']) === 5 ? $validated['close_time'].':00' : $validated['close_time'];
        $court->is_active = $validated['is_active'] ?? false;
        $court->save();

        // Handle removed photos
        if ($request->has('removed_photos')) {
            $removedPhotos = $request->input('removed_photos');
            if (is_array($removedPhotos) && !empty($removedPhotos)) {
                CourtPhoto::whereIn('id', $removedPhotos)->delete();
            }
        }

        // Handle new photo uploads
        if ($request->hasFile('new_photos')) {
            $existingOrder = $court->photos()->max('order') ?? -1;
            foreach ($request->file('new_photos') as $photo) {
                $path = $photo->store('courts', 'public');
                CourtPhoto::create([
                    'court_id' => $court->id,
                    'path' => $path,
                    'order' => ++$existingOrder,
                ]);
            }
        }

        return redirect()->route('admin.courts.index')->with('success', 'Lapangan berhasil diupdate');
    }

    public function destroy(Court $court)
    {
        // Delete related photos
        $court->photos()->delete();
        $court->delete();

        return back()->with('success', 'Lapangan berhasil dihapus');
    }
}
