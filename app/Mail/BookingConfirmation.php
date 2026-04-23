<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingConfirmation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Booking $booking)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Konfirmasi Booking - ' . $this->booking->booking_code,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.booking-confirmation',
            with: [
                'booking' => $this->booking,
                'userName' => $this->booking->user->name,
                'courtName' => $this->booking->court->name,
                'bookingDate' => $this->booking->booking_date->format('d M Y'),
                'totalPrice' => number_format($this->booking->total_price, 0, ',', '.'),
            ],
        );
    }
}
