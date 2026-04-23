import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/components/admin-layout';
import { DollarSign } from 'lucide-react';

interface Transaction {
    id: string;
    booking: {
        user: { name: string };
        court: { name: string };
    };
    amount: number;
    status: string;
    payment_method: string;
    created_at: string;
}

interface TransactionsIndexProps {
    transactions: {
        data: Transaction[];
        meta: {
            current_page: number;
            last_page: number;
            total: number;
        };
    };
    filters: {
        status?: string;
        date_from?: string;
        date_to?: string;
    };
}

const statusColor = (status: string) => {
    switch (status) {
        case 'settlement':
            return 'bg-green-100 text-green-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'expire':
            return 'bg-red-100 text-red-800';
        case 'failed':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function TransactionsIndex({ transactions = { data: [], meta: { current_page: 1, last_page: 1, total: 0 } }, filters = {} }: TransactionsIndexProps) {
    const [filterValues, setFilterValues] = useState({
        status: filters.status || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const totalRevenue = (transactions?.data || []).reduce((sum, t) => 
        t.status === 'settlement' ? sum + t.amount : sum, 0
    );

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilterValues(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const applyFilters = () => {
        router.get(route('admin.transactions.index'), filterValues, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setFilterValues({
            status: '',
            date_from: '',
            date_to: '',
        });
        router.get(route('admin.transactions.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manajemen Transaksi</h1>
                    <p className="text-gray-600 mt-1">Total Revenue: {formatCurrency(totalRevenue)}</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dari tanggal</label>
                            <input
                                type="date"
                                name="date_from"
                                value={filterValues.date_from}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sampai tanggal</label>
                            <input
                                type="date"
                                name="date_to"
                                value={filterValues.date_to}
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
                                <option value="settlement">Settlement</option>
                                <option value="pending">Pending</option>
                                <option value="expire">Expired</option>
                                <option value="failed">Failed</option>
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

                {/* Transactions Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">User / Lapangan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Jumlah</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Metode</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {transactions.data.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{String(transaction.id).slice(0, 8)}</td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{transaction.booking.user.name}</p>
                                                <p className="text-xs text-gray-600">{transaction.booking.court.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 flex items-center gap-2">
                                            <DollarSign size={16} />
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{transaction.payment_method}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(transaction.created_at).toLocaleDateString('id-ID')}
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
