import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import AdminLayout from '@/components/admin-layout';

interface Photo {
    id: number;
    path: string;
}

interface Court {
    id: number;
    name: string;
    slug: string;
    description: string;
    price_per_hour: number | string;
    is_active: boolean;
    open_time: string;
    close_time: string;
    photos: Photo[];
    bookings_count?: number;
}

interface CourtsIndexProps {
    courts: {
        data: Court[];
        meta: {
            current_page: number;
            last_page: number;
            total: number;
        };
    };
}

export default function CourtsIndex({ courts = { data: [], meta: { current_page: 1, last_page: 1, total: 0 } } }: CourtsIndexProps) {
    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Kelola Lapangan</h1>
                        <p className="text-gray-600 mt-1">Total: {courts?.meta?.total || 0} lapangan</p>
                    </div>
                    <Link
                        href={route('admin.courts.create')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                        <Plus size={20} /> Tambah Lapangan
                    </Link>
                </div>

                {/* Courts Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Lapangan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Foto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Jam Operasional</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Harga/Jam</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Booking</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {courts.data.map((court) => (
                                    <tr key={court.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{court.name}</p>
                                                <p className="text-sm text-gray-600">{court.slug}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {(court.photos?.length || 0) > 0 ? (
                                                <img
                                                    src={`/storage/${court.photos?.[0]?.path}`}
                                                    alt={court.name}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                                    No image
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {court.open_time} - {court.close_time}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            Rp {Number(court.price_per_hour).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {court.bookings_count || 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                court.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {court.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route('admin.courts.edit', court.id)}
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded transition"
                                                >
                                                    <Edit2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Yakin hapus lapangan ini?')) {
                                                            router.delete(route('admin.courts.destroy', court.id));
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {(courts?.meta?.last_page || 1) > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-2">
                            {Array.from({ length: courts?.meta?.last_page || 1 }).map((_, i) => (
                                <Link
                                    key={i + 1}
                                    href={route('admin.courts.index', { page: i + 1 })}
                                    className={`px-3 py-1 rounded ${
                                        i + 1 === courts?.meta?.current_page
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                                >
                                    {i + 1}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
