import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/components/admin-layout';
import { Calendar } from 'lucide-react';

interface Booking {
    id: number;
    user: { name: string; email: string };
    court: { name: string };
    booking_date: string;
    status: string;
    created_at: string;
}

interface BookingsIndexProps {
    bookings: {
        data: Booking[];
        meta: {
            current_page: number;
            last_page: number;
            total: number;
        };
    };
    filters: {
        date?: string;
        status?: string;
    };
}

const statusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'confirmed':
            return 'bg-blue-100 text-blue-800';
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function BookingsIndex({ bookings = { data: [], meta: { current_page: 1, last_page: 1, total: 0 } }, filters = {} }: BookingsIndexProps) {
    const [filterValues, setFilterValues] = useState({
        date: filters.date || '',
        status: filters.status || '',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilterValues(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const applyFilters = () => {
        router.get(route('admin.bookings.index'), filterValues, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setFilterValues({
            date: '',
            status: '',
        });
        router.get(route('admin.bookings.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manajemen Booking</h1>
                    <p className="text-gray-600 mt-1">Total: {bookings?.meta?.total || 0} booking</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                            <input
                                type="date"
                                name="date"
                                value={filterValues.date}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                name="status"
                                value={filterValues.status}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                            >
                                <option value="">Semua Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={applyFilters}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                            >
                                Filter
                            </button>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Lapangan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Dibuat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {bookings.data.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{booking.id}</td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{booking.user.name}</p>
                                                <p className="text-xs text-gray-600">{booking.user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{booking.court.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                                            <Calendar size={16} />
                                            {new Date(booking.booking_date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(booking.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
