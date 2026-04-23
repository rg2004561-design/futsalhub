import React from 'react';
import { Link } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Grid3x3, BookOpen, DollarSign, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/admin-layout';

interface Stat {
    bookings_today: number;
    revenue_today: number;
    bookings_month: number;
    revenue_month: number;
    total_courts: number;
    active_courts: number;
    total_users: number;
}

interface DailyRevenue {
    date: string;
    total: number;
    count: number;
}

interface Booking {
    id: number;
    user: { name: string };
    court: { name: string };
    booking_date: string;
    status: string;
}

interface DashboardProps {
    stats: Stat;
    recent_bookings: Booking[];
    daily_revenue: DailyRevenue[];
}

export default function AdminDashboard({ stats, recent_bookings, daily_revenue }: DashboardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
                    <p className="text-gray-600 mt-1">Selamat datang kembali! Berikut ringkasan sistem Anda.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Bookings Today */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Booking Hari Ini</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.bookings_today}</p>
                                <p className="text-gray-600 text-xs mt-2">vs {stats.bookings_month} bulan ini</p>
                            </div>
                            <BookOpen className="text-blue-600" size={24} />
                        </div>
                    </div>

                    {/* Revenue Today */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Pendapatan Hari Ini</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(stats.revenue_today)}</p>
                                <p className="text-gray-600 text-xs mt-2">vs {formatCurrency(stats.revenue_month)} bulan ini</p>
                            </div>
                            <DollarSign className="text-green-600" size={24} />
                        </div>
                    </div>

                    {/* Total Courts */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Lapangan</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_courts}</p>
                                <p className="text-gray-600 text-xs mt-2">{stats.active_courts} aktif</p>
                            </div>
                            <Grid3x3 className="text-purple-600" size={24} />
                        </div>
                    </div>

                    {/* Total Users */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total User</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_users}</p>
                                <p className="text-gray-600 text-xs mt-2">Pengguna terdaftar</p>
                            </div>
                            <Users className="text-orange-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Pendapatan 7 Hari Terakhir</h2>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={daily_revenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Akses Cepat</h2>
                        <div className="space-y-2">
                            <Link
                                href={route('admin.courts.create')}
                                className="block w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition text-center"
                            >
                                + Tambah Lapangan
                            </Link>
                            <Link
                                href={route('admin.bookings.index')}
                                className="block w-full p-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg font-medium transition text-center"
                            >
                                Lihat Booking
                            </Link>
                            <Link
                                href={route('admin.transactions.index')}
                                className="block w-full p-3 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg font-medium transition text-center"
                            >
                                Transaksi
                            </Link>
                            <Link
                                href={route('admin.courts.index')}
                                className="block w-full p-3 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg font-medium transition text-center"
                            >
                                Kelola Lapangan
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Booking Terbaru</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Lapangan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recent_bookings.length > 0 ? (
                                    recent_bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.user.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{booking.court.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(booking.booking_date).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    booking.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : booking.status === 'cancelled'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-600">
                                            Belum ada booking
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
