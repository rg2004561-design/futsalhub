import React from 'react';
import AdminLayout from '@/components/admin-layout';
import { Shield } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    created_at: string;
}

interface UsersIndexProps {
    users: {
        data: User[];
        meta: {
            current_page: number;
            last_page: number;
            total: number;
        };
    };
}

const roleColor = (role: string) => {
    switch (role) {
        case 'admin':
            return 'bg-red-100 text-red-800';
        case 'user':
            return 'bg-blue-100 text-blue-800';
        case 'approver':
            return 'bg-purple-100 text-purple-800';
        case 'tools_keeper':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function UsersIndex({ users = { data: [], meta: { current_page: 1, last_page: 1, total: 0 } } }: UsersIndexProps) {
    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manajemen User</h1>
                    <p className="text-gray-600 mt-1">Total: {users?.meta?.total || 0} pengguna</p>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">No. Telp</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Terdaftar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Shield size={16} className="text-gray-400" />
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColor(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(user.created_at).toLocaleDateString('id-ID')}
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
