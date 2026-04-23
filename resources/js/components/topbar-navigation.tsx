import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export function TopbarNavigation() {
    const { auth } = usePage<SharedData>().props;

    return (
        <nav className="fixed top-0 w-full bg-white shadow-sm z-40">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href={route('home')} className="flex items-center gap-3 hover:opacity-80 transition">
                    <img src="/logo.png" alt="FutsalHub" className="h-10 w-auto" />
                </Link>
                <div className="flex gap-6 items-center">
                    {auth.user ? (
                        <>
                            <Link
                                href={route('home')}
                                className="text-gray-700 hover:text-blue-600 font-medium transition"
                            >
                                Home
                            </Link>
                            <Link
                                href={route('courts.index')}
                                className="text-gray-700 hover:text-blue-600 font-medium transition"
                            >
                                Courts
                            </Link>
                            <Link
                                href={route('bookings.history')}
                                className="text-gray-700 hover:text-blue-600 font-medium transition"
                            >
                                Riwayat Booking
                            </Link>
                            <Link
                                href={route('profile.edit')}
                                className="text-gray-700 hover:text-blue-600 font-medium transition"
                            >
                                Profil
                            </Link>
                            <Link
                                href={route('logout')}
                                className="text-gray-700 hover:text-red-600 font-medium transition"
                            >
                                Logout
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="text-gray-700 hover:text-blue-600 font-medium transition"
                            >
                                Masuk
                            </Link>
                            <Link
                                href={route('register')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
