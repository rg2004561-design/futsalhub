@component('mail::message')
# Konfirmasi Pembayaran

Halo {{ $userName }},

Pembayaran Anda telah berhasil diterima. Booking Anda sekarang aktif.

@component('mail::panel')
**Transaction ID:** {{ $transaction->transaction_id }}
**Lapangan:** {{ $courtName }}
**Jumlah Bayar:** Rp {{ $amount }}
**Metode Pembayaran:** {{ ucfirst(str_replace('_', ' ', $paymentMethod)) }}
**Status:** Pembayaran Selesai
@endcomponent

Anda sudah selesai dengan langkah pembayaran. Silakan datang ke lokasi pada waktu yang telah dijadwalkan.

@component('mail::button', ['url' => route('bookings.show', $booking)])
Lihat Rincian Booking
@endcomponent

Terima kasih atas pemesanan Anda!

Terima kasih,
{{ config('app.name') }}
@endcomponent
