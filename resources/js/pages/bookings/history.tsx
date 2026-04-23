import React from 'react';
import { Link } from '@inertiajs/react';
import { TopbarNavigation } from '@/components/topbar-navigation';

interface BookingSlot {
    start_time: string;
    end_time: string;
}

interface Transaction {
    payment_method: string;
    status: string;
}

interface Court {
    name: string;
    photos: any[];
}

interface Booking {
    id: number;
    booking_code: string;
    booking_date: string;
    status: string;
    total_price: number;
    court: Court;
    slots: BookingSlot[];
    transaction: Transaction | null;
}

interface BookingHistoryProps {
    bookings: {
        data?: Booking[];
        links?: any;
        meta?: {
            last_page?: number;
        };
    };
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

export default function BookingHistory({ bookings }: BookingHistoryProps) {
    const bookingList = bookings?.data ?? [];
    const lastPage = bookings?.meta?.last_page ?? 1;

    return (
        <div className="min-h-screen bg-gray-50">
            <TopbarNavigation />
            
            {/* Header */}
            <div className="bg-white shadow mt-16">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <Link href={route('home')} className="text-blue-600 hover:text-blue-800">
                        ← Kembali
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">Riwayat Booking</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {bookingList.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-600 mb-4">Anda belum memiliki booking</p>
                        <Link
                            href="/courts"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                        >
                            Pesan Lapangan Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookingList.map((booking) => {
                            const statusBadge = getStatusBadge(booking.status);
                            const bookingDate = new Date(booking.booking_date);
                            const slotTimes = booking.slots.map((s) => `${s.start_time}-${s.end_time}`).join(', ');

                            return (
                                <Link
                                    key={booking.id}
                                    href={`/bookings/${booking.id}`}
                                    className="bg-white rounded-lg shadow hover:shadow-md transition p-6 block"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                        {/* Info */}
                                        <div className="md:col-span-2">
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {booking.court.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Kode: <span className="font-mono text-gray-900">{booking.booking_code}</span>
                                            </p>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Tanggal: {bookingDate.toLocaleDateString('id-ID')}
                                            </p>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Jam: {slotTimes}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-start justify-between md:justify-center">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-lg font-semibold text-sm ${statusBadge.bg} ${statusBadge.text}`}
                                            >
                                                {statusBadge.label}
                                            </span>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right md:text-left">
                                            <p className="text-gray-600 text-sm">Total Harga</p>
                                            <p className="text-xl font-bold text-blue-600">
                                                Rp {booking.total_price.toLocaleString('id-ID')}
                                            </p>
                                            {booking.transaction?.payment_method && (
                                                <p className="text-gray-500 text-xs mt-2">
                                                    Metode: {formatPaymentMethod(booking.transaction.payment_method)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {lastPage > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {/* TODO: Add pagination */}
                    </div>
                )}
            </div>
        </div>
    );
}
