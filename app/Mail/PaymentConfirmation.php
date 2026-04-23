<?php

namespace App\Mail;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentConfirmation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Transaction $transaction)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Konfirmasi Pembayaran - ' . $this->transaction->transaction_id,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.payment-confirmation',
            with: [
                'transaction' => $this->transaction,
                'booking' => $this->transaction->booking,
                'userName' => $this->transaction->booking->user->name,
                'courtName' => $this->transaction->booking->court->name,
                'amount' => number_format($this->transaction->amount, 0, ',', '.'),
                'paymentMethod' => $this->transaction->payment_method,
            ],
        );
    }
}
