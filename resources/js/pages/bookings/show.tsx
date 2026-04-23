import React from 'react';
import { Link, router } from '@inertiajs/react';
import { TopbarNavigation } from '@/components/topbar-navigation';

interface BookingSlot {
    id: number;
    start_time: string;
    end_time: string;
    price: number;
}

interface Transaction {
    id: number;
    status: string;
    amount: number;
    payment_method: string;
    paid_at: string;
}

interface Court {
    id: number;
    name: string;
    slug: string;
    photos: any[];
}

interface Booking {
    id: number;
    booking_code: string;
    status: string;
    booking_date: string;
    total_price: number;
    notes: string;
    created_at: string;
    court: Court;
    slots: BookingSlot[];
    transaction: Transaction | null;
    user: { name: string; email: string; phone: string };
}

interface BookingShowProps {
    booking: Booking;
}

const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
        draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu Pembayaran' },
        paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Terbayar' },
        completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Selesai' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' },
    };
    return badges[status] || badges.draft;
};

const formatPaymentMethod = (method?: string | null) => {
    if (!method) {
        return '-';
    }

    const labels: Record<string, string> = {
        qris: 'QRIS',
        gopay: 'GoPay',
        shopeepay: 'ShopeePay',
        dana: 'DANA',
        ovo: 'OVO',
        bank_transfer: 'Transfer Bank',
        credit_card: 'Kartu Kredit',
        echannel: 'Mandiri Bill Payment',
        cstore: 'Convenience Store',
    };

    return labels[method] ?? method.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function BookingShow({ booking }: BookingShowProps) {
    const effectiveStatus = booking.transaction?.status === 'settlement'
        ? 'paid'
        : booking.transaction && ['cancel', 'deny', 'expire'].includes(booking.transaction.status)
            ? 'cancelled'
            : booking.status;

    const statusBadge = getStatusBadge(effectiveStatus);

    return (
        <div className="min-h-screen bg-gray-50">
            <TopbarNavigation />
            
            {/* Header */}
            <div className="bg-white shadow mt-16">
                <div className="max-w-5xl mx-auto px-4 py-6">
                    <Link href={route('bookings.history')} className="text-blue-600 hover:text-blue-800">
                        ← Kembali ke Riwayat
                    </Link>
                    <div className="mt-4 flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Booking {booking.booking_code}</h1>
                            <p className="text-gray-600 mt-1">Dibuat pada {new Date(booking.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-lg font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                            {statusBadge.label}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Court Info */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Lapangan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Nama Lapangan</p>
                                    <p className="text-lg font-semibold text-gray-900">{booking.court.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tanggal Booking</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {new Date(booking.booking_date).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Jam Booking</h2>
                            <div className="space-y-2">
                                {booking.slots.map((slot) => (
                                    <div key={slot.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium text-gray-900">
                                            {slot.start_time} - {slot.end_time}
                                        </span>
                                        <span className="text-blue-600 font-semibold">
                                            Rp {slot.price.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pemesan Info */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Pemesan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Nama</p>
                                    <p className="font-medium text-gray-900">{booking.user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium text-gray-900">{booking.user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">No. HP</p>
                                    <p className="font-medium text-gray-900">{booking.user.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {booking.notes && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Catatan</h2>
                                <p className="text-gray-700">{booking.notes}</p>
                            </div>
                        )}

                        {/* Payment Info */}
                        {booking.transaction && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pembayaran</h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Transaction ID:</span>
                                        <span className="font-medium text-gray-900">{booking.transaction.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Metode:</span>
                                        <span className="font-medium text-gray-900">
                                            {formatPaymentMethod(booking.transaction.payment_method)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="font-medium text-green-600">Terbayar</span>
                                    </div>
                                    {booking.transaction.paid_at && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tanggal Pembayaran:</span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(booking.transaction.paid_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Total Price */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600 mb-2">Total Harga</p>
                            <p className="text-3xl font-bold text-blue-600 mb-6">
                                Rp {booking.total_price.toLocaleString('id-ID')}
                            </p>

                            {/* Actions */}
                            {effectiveStatus === 'draft' && (
                                <>
                                    <button
                                        onClick={() => router.visit(`/bookings/${booking.id}/payment`)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold mb-2"
                                    >
                                        Lanjut Pembayaran
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Batalkan booking ini?')) {
                                                router.post(`/bookings/${booking.id}/cancel`);
                                            }
                                        }}
                                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold"
                                    >
                                        Batalkan
                                    </button>
                                </>
                            )}

                            {effectiveStatus === 'pending' && (
                                <Link
                                    href={`/bookings/${booking.id}/payment`}
                                    className="block w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold text-center"
                                >
                                    Bayar Sekarang
                                </Link>
                            )}

                            {effectiveStatus === 'paid' && (
                                <div className="w-full rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 text-center">
                                    Pembayaran sudah diterima.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
