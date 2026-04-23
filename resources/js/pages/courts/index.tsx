import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { TopbarNavigation } from '@/components/topbar-navigation';
import { formatCurrency } from '@/lib/utils';

interface Court {
    id: number;
    name: string;
    slug: string;
    description: string;
    facilities: string[];
    open_time: string;
    close_time: string;
    photos: { id: number; path: string; is_primary: boolean }[];
}

interface CourtsIndexProps {
    courts?: {
        data: Court[];
        links?: any;
        meta?: {
            last_page?: number;
            current_page?: number;
            total?: number;
        };
    };
}

export default function CourtsIndex({ courts = { data: [] } }: CourtsIndexProps) {
    const [selectedDate, setSelectedDate] = useState<string>('');

    const courtsData = courts?.data || [];
    const meta = courts?.meta || {};

    return (
        <div className="min-h-screen bg-gray-50">
            <TopbarNavigation />
            
            {/* Header */}
            <div className="bg-white shadow mt-16">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900">Daftar Lapangan Futsal</h1>
                    <p className="text-gray-600 mt-2">Pilih lapangan dan booking sekarang</p>
                </div>
            </div>

            {/* Courts Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {courtsData.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Belum ada lapangan yang tersedia</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courtsData.map((court) => (
                                <div key={court.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                                    {/* Court Image */}
                                    {court.photos.length > 0 && (
                                        <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                                            <img
                                                src={`/storage/${court.photos[0].path}`}
                                                alt={court.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Court Details */}
                                    <div className="p-4">
                                        <h3 className="text-xl font-bold text-gray-900">{court.name}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{court.description}</p>

                                        {/* Facilities */}
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {court.facilities?.slice(0, 3).map((facility, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                                >
                                                    {facility}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Operating Hours */}
                                        <div className="mt-3 text-sm text-gray-600">
                                            <span>⏰ {court.open_time} - {court.close_time}</span>
                                        </div>

                                        {/* CTA */}
                                        <Link
                                            href={`/courts/${court.slug}`}
                                            className="mt-4 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded font-medium"
                                        >
                                            Lihat Detail & Booking
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {meta.last_page && meta.last_page > 1 && (
                            <div className="mt-12 flex justify-center gap-2">
                                {/* TODO: Add pagination links */}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
