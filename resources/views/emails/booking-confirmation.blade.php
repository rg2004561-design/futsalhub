@component('mail::message')
# Konfirmasi Booking Anda

Halo {{ $userName }},

Terima kasih telah melakukan booking di platform kami. Berikut detail booking Anda:

@component('mail::panel')
**Booking Code:** {{ $booking->booking_code }}
**Lapangan:** {{ $courtName }}
**Tanggal:** {{ $bookingDate }}
**Total Harga:** Rp {{ $totalPrice }}
@endcomponent

Booking Anda saat ini dalam status **DRAFT**. Silakan selesaikan pembayaran dalam waktu 24 jam untuk mengkonfirmasi booking.

@component('mail::button', ['url' => route('bookings.show', $booking)])
Lihat Detail Booking
@endcomponent

Jika Anda memiliki pertanyaan, silakan hubungi kami melalui email ini.

Terima kasih,
{{ config('app.name') }}
@endcomponent
