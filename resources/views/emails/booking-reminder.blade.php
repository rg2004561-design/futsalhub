@component('mail::message')
# Pengingat Booking Anda

Halo {{ $userName }},

Ini adalah pengingat untuk booking Anda yang akan datang.

@component('mail::panel')
**Booking Code:** {{ $booking->booking_code }}
**Lapangan:** {{ $courtName }}
**Tanggal:** {{ $bookingDate }}
@endcomponent

Pastikan Anda hadir tepat waktu sesuai dengan jam yang telah dipesan.

@component('mail::button', ['url' => route('bookings.show', $booking)])
Lihat Detail Booking
@endcomponent

Terima kasih,
{{ config('app.name') }}
@endcomponent
