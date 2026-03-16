import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Quote, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { useAuthStore } from '../../store/auth.store';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required')
});

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();

    const { login } = useAuthStore();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        setApiError(null);
        try {
            await login(data);
            navigate('/dashboard');
        } catch (err) {
            setApiError(err.response?.data?.message || err.message || 'An error occurred during login');
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* LEFT PANEL - Branding */}
            <div className="hidden md:flex flex-col w-5/12 bg-gray-950 text-white p-12 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)`,
                        backgroundSize: `40px 40px`
                    }}
                />

                <div className="relative z-10 flex-shrink-0">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-mono font-bold text-sm rounded transition-transform hover:scale-105">
                            R
                        </div>
                        <span className="font-mono font-bold text-xl tracking-tight text-white flex items-center">
                            Referral<span className="text-gray-400">Hub</span>
                        </span>
                    </Link>
                </div>

                <div className="relative z-10 mt-auto mb-auto">
                    <h2 className="text-4xl font-bold tracking-tight leading-tight mb-8 max-w-sm">
                        Unlock the hidden <br />job market
                    </h2>

                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-300 text-sm leading-relaxed">Top candidates get referred. Stop throwing resumes into deep space.</p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-300 text-sm leading-relaxed">Direct lines to engineers and hiring managers at elite companies.</p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-300 text-sm leading-relaxed">Earn reputation offering guidance and internal referrals for talent.</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex-shrink-0 border-t border-gray-800 pt-8 mt-12">
                    <Quote className="w-6 h-6 text-gray-600 mb-4" />
                    <p className="text-sm text-gray-400 italic font-medium leading-relaxed">
                        "I applied to 50 places and heard nothing. One accepted request on ReferralHub got me a Stripe interview in 3 days."
                    </p>
                </div>
            </div>

            {/* RIGHT PANEL - Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24">
                {/* Mobile Header */}
                <div className="md:hidden flex justify-center mb-12">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono font-bold text-sm rounded">R</div>
                        <span className="font-mono font-bold text-xl tracking-tight text-black">ReferralHub</span>
                    </Link>
                </div>

                <div className="w-full max-w-sm mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Welcome back</h1>
                        <p className="text-sm text-gray-500">Log in to your account to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {apiError && (
                            <div className="bg-red-50 border border-red-100 p-3 rounded-md flex items-start gap-2 text-sm text-red-600 mb-4">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <p>{apiError}</p>
                            </div>
                        )}
                        <Input
                            label="Email address"
                            type="email"
                            placeholder="name@example.com"
                            autoComplete="email"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <div className="relative">
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <Link to="/forgot-password" className="text-xs font-medium text-gray-600 hover:text-black">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    error={errors.password?.message}
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center mt-auto mb-auto h-10"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 trans-all" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 trans-all" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" size="lg" className="w-full mt-2" isLoading={isSubmitting}>
                            Login
                        </Button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-black hover:underline">
                                Register now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
