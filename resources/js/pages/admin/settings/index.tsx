import React from 'react';
import AdminLayout from '@/components/admin-layout';
import { Clock, Save } from 'lucide-react';

interface SettingsProps {
    settings: {
        opening_time: string;
        closing_time: string;
        slot_duration: number;
        payment_timeout: number;
    };
}

export default function Settings({ settings }: SettingsProps) {
    return (
        <AdminLayout>
            <div className="space-y-6 max-w-2xl">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pengaturan Sistem</h1>
                </div>

                {/* Operating Hours */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={24} className="text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Jam Operasional</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jam Buka</label>
                            <input
                                type="time"
                                defaultValue={settings.opening_time}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jam Tutup</label>
                            <input
                                type="time"
                                defaultValue={settings.closing_time}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                            />
                        </div>
                    </div>
                </div>

                {/* Slot Configuration */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Konfigurasi Slot</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Durasi Slot (menit)</label>
                        <input
                            type="number"
                            defaultValue={settings.slot_duration}
                            min="30"
                            step="30"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        />
                        <p className="text-xs text-gray-600 mt-1">Contoh: 60 untuk 1 jam, 90 untuk 1.5 jam</p>
                    </div>
                </div>

                {/* Payment Settings */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Pengaturan Pembayaran</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timeout Pembayaran (menit)</label>
                        <input
                            type="number"
                            defaultValue={settings.payment_timeout}
                            min="5"
                            step="5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        />
                        <p className="text-xs text-gray-600 mt-1">Waktu user harus menyelesaikan pembayaran sebelum booking dibatalkan</p>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
                        <Save size={20} />
                        Simpan Pengaturan
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
