<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'court_id' => 'required|integer|exists:courts,id',
            'booking_date' => 'required|date_format:Y-m-d|after:today',
            'slots' => 'required|array|min:1|max:8',
            'slots.*.start_time' => 'required|date_format:H:i',
            'slots.*.end_time' => 'required|date_format:H:i|after:slots.*.start_time',
            'slots.*.price' => 'required|integer|min:1000',
            'notes' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'court_id.required' => 'Lapangan harus dipilih',
            'court_id.exists' => 'Lapangan tidak valid',
            'booking_date.required' => 'Tanggal booking harus diisi',
            'booking_date.after' => 'Tanggal booking harus di masa depan',
            'slots.required' => 'Minimal 1 slot harus dipilih',
            'slots.*.start_time.required' => 'Jam mulai harus diisi',
            'slots.*.end_time.required' => 'Jam selesai harus diisi',
            'slots.*.end_time.after' => 'Jam selesai harus setelah jam mulai',
            'slots.*.price.required' => 'Harga slot harus diisi',
            'slots.*.price.min' => 'Harga minimal Rp 1.000',
        ];
    }
}
