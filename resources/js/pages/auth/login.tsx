import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk - FutsalHub" />
            
            <div className="min-h-screen flex">
                {/* Left Side - Login Form */}
                <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Logo & Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <img src="/logo.png" alt="FutsalHub" className="h-10 w-auto" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
                            <p className="text-gray-600 text-sm">Welcome back! Please enter your details.</p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-800">
                                {status}
                            </div>
                        )}

                        {/* Login Form */}
                        <form className="flex flex-col gap-5" onSubmit={submit}>
                            {/* Email Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-medium text-gray-900 text-sm">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="john@example.com"
                                    className="h-11 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Field */}
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="font-medium text-gray-900 text-sm">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={route('password.request')}
                                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                                            tabIndex={5}
                                        >
                                            Forgot Password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="h-11 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="remember" 
                                    name="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                    tabIndex={3} 
                                />
                                <Label htmlFor="remember" className="text-sm text-gray-700 font-normal cursor-pointer">
                                    Remember me
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="mt-2 h-11 bg-black hover:bg-gray-900 text-white font-semibold text-base rounded-lg w-full"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                {processing ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Don't have an account?{' '}
                                <TextLink
                                    href={route('register')}
                                    className="text-gray-900 hover:text-gray-700 font-semibold"
                                    tabIndex={6}
                                >
                                    Sign up
                                </TextLink>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Welcome Section with Image */}
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
                            Welcome to the Arena
                        </h2>
                        <p className="text-gray-200 text-lg mb-8">
                            The ultimate platform for futsal enthusiasts. Book courts, manage your matches, and connect with players.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
