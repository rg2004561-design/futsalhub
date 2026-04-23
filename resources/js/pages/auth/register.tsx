import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterForm {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Daftar - FutsalHub" />
            
            <div className="min-h-screen flex">
                {/* Left Side - Register Form */}
                <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Back Button */}
                        <Link
                            href={route('login')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 text-sm transition"
                        >
                            <ArrowLeft size={16} />
                            Kembali ke Login
                        </Link>

                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/logo.png" alt="FutsalHub" className="h-10 w-auto" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Daftar Sekarang</h2>
                            <p className="text-gray-600 text-sm">Bergabunglah dengan jutaan pemain futsal kami.</p>
                        </div>

                        {/* Form */}
                        <form className="flex flex-col gap-4" onSubmit={submit}>
                            {/* Nama Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="font-medium text-gray-900 text-sm">
                                    Nama Lengkap
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Nama Anda"
                                    className="h-11 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Email Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-medium text-gray-900 text-sm">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="email@example.com"
                                    className="h-11 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Telepon Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="font-medium text-gray-900 text-sm">
                                    Nomor Telepon
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    required
                                    tabIndex={3}
                                    autoComplete="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    disabled={processing}
                                    placeholder="081234567890"
                                    className="h-11 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            {/* Alamat Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="address" className="font-medium text-gray-900 text-sm">
                                    Alamat
                                </Label>
                                <Input
                                    id="address"
                                    type="text"
                                    tabIndex={4}
                                    autoComplete="street-address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    disabled={processing}
                                    placeholder="Jl. Contoh No. 123"
                                    className="h-11 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                                />
                                <InputError message={errors.address} />
                            </div>

                            {/* Password Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="font-medium text-gray-900 text-sm">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="••••••••"
                                    className="h-11 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Konfirmasi Password Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="font-medium text-gray-900 text-sm">
                                    Konfirmasi Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="••••••••"
                                    className="h-11 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="mt-2 h-11 bg-black hover:bg-gray-900 text-white font-semibold text-base rounded-lg w-full"
                                tabIndex={7}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                {processing ? 'Sedang daftar...' : 'Daftar Sekarang'}
                            </Button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                            <p className="text-gray-600 text-sm">
                                Sudah punya akun?{' '}
                                <TextLink
                                    href={route('login')}
                                    className="text-gray-900 hover:text-gray-700 font-semibold"
                                    tabIndex={8}
                                >
                                    Masuk di sini
                                </TextLink>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Image Background */}
                <div 
                    className="hidden lg:flex w-1/2 bg-cover bg-center flex-col items-center justify-center p-12 relative overflow-hidden"
                    style={{
                        backgroundImage: 'url(/auth.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* Welcome Content */}
                    <div className="relative z-10 text-center max-w-md">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Bergabunglah Sekarang
                        </h2>
                        <p className="text-gray-200 text-lg">
                            Temukan lapangan terbaik, pesan dengan mudah, dan mainkan futsal bersama komunitas kami.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
