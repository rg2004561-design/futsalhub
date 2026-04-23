import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Lupa Password - FutsalHub" />
            
            <div className="min-h-screen flex">
                {/* Left Side - Form */}
                <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Back Button */}
                        <Link
                            href={route('login')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-8 text-sm transition"
                        >
                            <ArrowLeft size={16} />
                            Kembali ke Login
                        </Link>

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lupa Password?</h1>
                            <p className="text-gray-600 text-sm">
                                Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-800">
                                {status}
                            </div>
                        )}

                        {/* Form */}
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            {/* Email Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-medium text-gray-900 text-sm">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="john@example.com"
                                    className="h-11 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                                    disabled={processing}
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="h-11 bg-black hover:bg-gray-900 text-white font-semibold text-base rounded-lg w-full"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                {processing ? 'Mengirim...' : 'Kirim Link Reset'}
                            </Button>
                        </form>

                        {/* Additional Links */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Belum punya akun?{' '}
                                <TextLink
                                    href={route('register')}
                                    className="text-gray-900 hover:text-gray-700 font-semibold"
                                >
                                    Daftar di sini
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
                            Kembali ke Arena
                        </h2>
                        <p className="text-gray-200 text-lg">
                            Kami siap membantu Anda mengakses kembali akun dan lanjutkan bermain futsal.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
