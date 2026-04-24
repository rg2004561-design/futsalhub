import React, { useState, useMemo } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { TopbarNavigation } from '@/components/topbar-navigation';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string | null;
}

interface Court {
    id: number;
    name: string;
    slug: string;
}

interface TimeSlot {
    start_time: string;
    end_time: string;
    price: number;
}

interface BookingCreateProps {
    court: Court;
    date: string;
    availableSlots: TimeSlot[];
    user: User;
}

export default function BookingCreate({ court, date, availableSlots, user }: BookingCreateProps) {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const { data, setData, post, processing, errors } = useForm({
        court_id: court.id,
        booking_date: date,
        slots: availableSlots || [],
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone,
        customer_address: user.address || '',
        notes: '',
    });

    const totalPrice = useMemo(
        () => data.slots.reduce((sum: number, slot: TimeSlot) => sum + slot.price, 0),
        [data.slots]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            // Filter slots to only send required fields
            const slotsToSend = availableSlots.map(slot => ({
                start_time: slot.start_time,
                end_time: slot.end_time,
                price: slot.price,
            }));

            const payload = {
                court_id: data.court_id,
                booking_date: data.booking_date,
                slots: slotsToSend,
                customer_name: data.customer_name,
                customer_email: data.customer_email,
                customer_phone: data.customer_phone,
                customer_address: data.customer_address,
                notes: data.notes,
            };

            const response = await axios.post('/bookings', payload);
            
            if (response.data.success && response.data.booking_id) {
                // Redirect to payment page
                router.visit(`/bookings/${response.data.booking_id}/payment`);
            } else {
                setErrorMessage('Gagal membuat booking. Silakan coba lagi.');
            }
        } catch (error: any) {
            // Handle validation errors
            if (error.response?.status === 422) {
                const validationErrors = error.response?.data?.errors;
                const errorMessages = Object.entries(validationErrors || {})
                    .map(([field, msgs]: any) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                    .join('\n');
                setErrorMessage(errorMessages || error.response?.data?.message || 'Validasi gagal. Silakan cek kembali data Anda.');
            } else {
                setErrorMessage(error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TopbarNavigation />
            
            {/* Header */}
            <div className="bg-white shadow mt-16">
                <div className="max-w-5xl mx-auto px-4 py-6">
                    <Link href={route('courts.show', { court: court.slug })} className="text-blue-600 hover:text-blue-800">
                        ← Kembali
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">Form Booking</h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6 space-y-6">
                            {/* Court & Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Lapangan</label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                                    {court.name} - {date}
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="border-t pt-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Pemesan</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nama</label>
                                        <input
                                            type="text"
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">No. HP</label>
                                        <input
                                            type="tel"
                                            value={data.customer_phone}
                                            onChange={(e) => setData('customer_phone', e.target.value)}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Alamat</label>
                                        <input
                                            type="text"
                                            value={data.customer_address}
                                            onChange={(e) => setData('customer_address', e.target.value)}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="border-t pt-6">
                                <label className="block text-sm font-medium text-gray-700">Catatan (Opsional)</label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Misal: ada kebutuhan khusus, jumlah peserta, dll"
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                                    rows={4}
                                />
                            </div>

                            {/* Terms */}
                            <div className="border-t pt-6">
                                <label className="flex items-center">
                                    <input type="checkbox" className="rounded w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" defaultChecked />
                                    <span className="ml-3 text-sm text-gray-900">
                                        Saya setuju dengan syarat dan ketentuan
                                    </span>
                                </label>
                            </div>

                            {/* Error Alert */}
                            {errorMessage && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    ⚠️ {errorMessage}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
                            >
                                {loading ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                            </button>
                        </div>
                    </form>

                    {/* Summary */}
                    <div>
                        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Booking</h2>

                            <div className="space-y-3">
                                <div className="pb-3 border-b">
                                    <p className="text-sm text-gray-600">Lapangan</p>
                                    <p className="font-semibold text-gray-900">{court.name}</p>
                                </div>

                                <div className="pb-3 border-b">
                                    <p className="text-sm text-gray-600">Tanggal</p>
                                    <p className="font-semibold text-gray-900">{date}</p>
                                </div>

                                <div className="pb-3 border-b">
                                    <p className="text-sm text-gray-600">Jam Booking</p>
                                    <div className="space-y-1 mt-1">
                                        {data.slots.map((slot, idx) => (
                                            <p key={idx} className="text-sm font-medium text-gray-900">
                                                {slot.start_time} - {slot.end_time}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Harga</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        Rp {totalPrice.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
