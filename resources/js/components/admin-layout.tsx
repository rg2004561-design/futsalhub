import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Menu, X, BarChart3, Grid3x3, BookOpen, DollarSign, Settings, Users, LogOut } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navigationItems = [
        { label: 'Dashboard', href: route('admin.dashboard'), icon: BarChart3 },
        { label: 'Lapangan', href: route('admin.courts.index'), icon: Grid3x3 },
        { label: 'Booking', href: route('admin.bookings.index'), icon: BookOpen },
        { label: 'Transaksi', href: route('admin.transactions.index'), icon: DollarSign },
        { label: 'User', href: route('admin.users.index'), icon: Users },
        { label: 'Pengaturan', href: route('admin.settings.index'), icon: Settings },
    ];

    const handleLogout = () => {
        router.get(route('logout'));
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                    {sidebarOpen && <h1 className="font-bold text-lg">Arena Admin</h1>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1 hover:bg-gray-800 rounded transition"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition"
                            >
                                <Icon size={20} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="border-t border-gray-800 p-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition text-left"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm">
                    <div className="flex-1">
                        <p className="text-sm text-gray-600">Selamat datang Admin</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
