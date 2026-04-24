import { useEffect, useState } from 'react';

interface BookingSlot {
    start_time: string;
    end_time: string;
    price: number;
}

interface Court {
    id: number;
    name: string;
}

interface Booking {
    id: number;
    booking_code: string;
    booking_date: string;
    total_price: number;
    court: Court;
    slots: BookingSlot[];
}

interface PaymentIndexProps {
    booking: Booking;
    token?: string;
    redirectUrl?: string;
    clientKey: string;
}

export default function PaymentIndex({ booking, token, redirectUrl, clientKey }: PaymentIndexProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');

    const handlePayment = () => {
        if (!redirectUrl) {
            alert('URL pembayaran tidak tersedia. Silakan refresh halaman.');
            return;
        }

        setIsProcessing(true);
        setDebugInfo('Mengarahkan ke halaman pembayaran Midtrans...');
        
        // Redirect to Midtrans payment page
        window.location.href = redirectUrl;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-5xl mx-auto px-4 py-6">
                    <a href={`/bookings/${booking.id}`} className="text-blue-600 hover:text-blue-800">
                        ← Kembali
                    </a>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">Pembayaran</h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Ringkasan Pembayaran</h2>

                            {/* Booking Details */}
                            <div className="space-y-4 mb-6 pb-6 border-b">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Kode Booking:</span>
                                    <span className="font-semibold text-gray-900">{booking.booking_code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Lapangan:</span>
                                    <span className="font-semibold text-gray-900">{booking.court.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tanggal:</span>
                                    <span className="font-semibold text-gray-900">
                                        {new Date(booking.booking_date).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                            </div>

                            {/* Slots */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Jam Booking</h3>
                                <div className="space-y-2">
                                    {booking.slots.map((slot, idx) => (
                                        <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                                            <span className="text-gray-700">{slot.start_time} - {slot.end_time}</span>
                                            <span className="font-semibold text-gray-900">
                                                Rp {slot.price.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Methods Info */}
                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                <p className="text-sm text-gray-700">
                                    Anda akan diarahkan ke halaman pembayaran Midtrans yang aman. Berbagai metode pembayaran tersedia:
                                </p>
                                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                    <li>✓ Kartu Kredit / Debit</li>
                                    <li>✓ Transfer Bank</li>
                                    <li>✓ E-wallet (GCash, OVO, DANA, dll)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Total Bayar</h2>

                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                <p className="text-3xl font-bold text-blue-600">
                                    Rp {booking.total_price.toLocaleString('id-ID')}
                                </p>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={!redirectUrl || isProcessing}
                                className={`w-full py-3 rounded-lg font-semibold transition ${
                                    !redirectUrl || isProcessing
                                        ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {isProcessing ? 'Memproses...' : redirectUrl ? 'Bayar Sekarang' : 'Memuat...'}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Dengan mengklik tombol bayar, Anda menerima syarat dan ketentuan kami.
                            </p>

                            {debugInfo && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                                    {debugInfo}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
