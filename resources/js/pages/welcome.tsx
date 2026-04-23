import { Head, Link } from '@inertiajs/react';
import { TopbarNavigation } from '@/components/topbar-navigation';

interface CourtPhoto {
    id: number;
    path: string;
}

interface Court {
    id: number;
    name: string;
    slug: string;
    photos: CourtPhoto[];
}

interface WelcomeProps {
    topCourts: Court[];
}

export default function Welcome({ topCourts = [] }: WelcomeProps) {
    return (
        <>
            <Head title="FutsalHub - Main Futsal Lebih Mudah" />

            <TopbarNavigation />

            {/* Hero Section with Banner Image */}
            <div
                className="text-white pt-24 pb-16 relative overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/hero-banner.webp')" }}
            >
                <div className="absolute inset-0 bg-slate-900/55"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                        Main Futsal Lebih<br />
                        <span className="text-blue-300">Mudah & Cepat</span>
                    </h1>

                    <p className="text-slate-200 text-lg max-w-2xl mb-8">
                        Temukan dan pesan lapangan futsal terbaik di sekitar Anda dengan sistem reservasi terpercaya dan mudah digunakan.
                    </p>

                    <div className="flex gap-4">
                        <Link
                            href={route('courts.index')}
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                        >
                            Cari Lapangan →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recommended Courts Section */}
            <div className="bg-white text-gray-900 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold">Lapangan Terpopuler</h2>
                        <Link href={route('courts.index')} className="text-blue-600 hover:text-blue-800 font-semibold transition">
                            Lihat Semua →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {topCourts.length > 0 ? (
                            topCourts.map((court) => {
                                const primaryPhoto = court.photos?.[0]?.path;

                                return (
                                    <Link
                                        key={court.id}
                                        href={route('courts.show', { court: court.slug })}
                                        className="block"
                                    >
                                        <div className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition border border-gray-200">
                                            <div className="relative">
                                                {primaryPhoto ? (
                                                    <img
                                                        src={`/storage/${primaryPhoto}`}
                                                        alt={court.name}
                                                        className="aspect-video w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="aspect-video bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                                                        <span className="text-6xl">⚽</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4">
                                                <h3 className="text-lg font-bold mb-1 text-gray-900">{court.name}</h3>

                                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition mt-4">
                                                    Pesan Sekarang
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="col-span-3 text-center py-12">
                                <p className="text-gray-500 text-lg">Belum ada lapangan tersedia</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-gray-400 py-8 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-white mb-1">© 2026 FutsalHub</p>
                        <p className="text-sm">All rights reserved</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="text-gray-400 hover:text-white transition">🌐</button>
                        <button className="text-gray-400 hover:text-white transition">📱</button>
                    </div>
                </div>
            </footer>
        </>
    );
}
