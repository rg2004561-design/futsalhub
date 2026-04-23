import Heading from '@/components/heading';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-4 py-6">
            <div className="mb-6">
                <Link href={route('home')} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Beranda
                </Link>
            </div>
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="mt-8">
                <section className="max-w-2xl space-y-12">{children}</section>
            </div>
        </div>
    );
}
