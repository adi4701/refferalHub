import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Briefcase, User, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { cn } from '../../lib/cn';
import { useAuthStore } from '../../store/auth.store';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('applicant'); // Default state
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();

    const { register: registerUser } = useAuthStore();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
    });

    const onSubmit = async (data) => {
        setApiError(null);
        try {
            const payload = { ...data, role };
            await registerUser(payload);
            navigate('/dashboard');
        } catch (err) {
            setApiError(err.response?.data?.message || err.message || 'Failed to register account');
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* LEFT PANEL - Branding (Reused styling pattern) */}
            <div className="hidden md:flex flex-col w-5/12 bg-gray-950 text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)`, backgroundSize: `40px 40px` }} />

                <div className="relative z-10 flex-shrink-0">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-mono font-bold text-sm rounded">R</div>
                        <span className="font-mono font-bold text-xl tracking-tight text-white flex items-center">
                            Referral<span className="text-gray-400">Hub</span>
                        </span>
                    </Link>
                </div>

                <div className="relative z-10 mt-auto mb-auto">
                    <h2 className="text-4xl font-bold tracking-tight leading-tight mb-8">Join the network</h2>
                    <p className="text-gray-400 text-lg max-w-sm mb-12">Whether you're hunting for a role, or recruiting internal talent, your journey starts here.</p>

                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm max-w-sm">
                        <div className="flex gap-4 mb-4">
                            <div className="flex flex-col items-center gap-1 min-w-[36px]">
                                <div className="w-2 h-2 rounded-full bg-white mt-2" />
                                <div className="w-px h-full bg-gray-800" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Create Account</h4>
                                <p className="text-sm text-gray-500 mt-1">Takes 30 seconds.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-4">
                            <div className="flex flex-col items-center gap-1 min-w-[36px]">
                                <div className="w-2 h-2 rounded-full bg-gray-800 mt-2" />
                                <div className="w-px h-full bg-gray-800" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-400">Verify Email</h4>
                                <p className="text-sm text-gray-600 mt-1">Secure your identity.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-1 min-w-[36px]">
                                <div className="w-2 h-2 rounded-full bg-gray-800 mt-2" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-400">Get Access</h4>
                                <p className="text-sm text-gray-600 mt-1">Enter the hub.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL - Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 h-screen overflow-y-auto">
                <div className="w-full max-w-md mx-auto pt-8 pb-12">

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Create an account</h1>
                        <p className="text-sm text-gray-500">Choose how you want to use ReferralHub.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {apiError && (
                            <div className="bg-red-50 border border-red-100 p-3 rounded-md flex items-start gap-2 text-sm text-red-600 mb-4 mt-0">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <p>{apiError}</p>
                            </div>
                        )}
                        {/* ROLE SELECTOR */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-900">I want to...</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('applicant')}
                                    className={cn(
                                        "flex flex-col items-start p-4 border rounded-xl text-left trans-all focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black relative",
                                        role === 'applicant'
                                            ? "border-black bg-gray-50 ring-1 ring-black"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                    )}
                                >
                                    <User className={cn("w-5 h-5 mb-3", role === 'applicant' ? "text-black" : "text-gray-500")} />
                                    <span className={cn("font-semibold text-sm mb-1", role === 'applicant' ? "text-black" : "text-gray-900")}>Find a job</span>
                                    <span className="text-xs text-gray-500 leading-relaxed">I'm looking for a referral to top companies.</span>
                                    {role === 'applicant' && <CheckCircle2 className="absolute top-4 right-4 w-4 h-4 text-black" />}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setRole('referrer')}
                                    className={cn(
                                        "flex flex-col items-start p-4 border rounded-xl text-left trans-all focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black relative",
                                        role === 'referrer'
                                            ? "border-black bg-gray-950 ring-1 ring-black"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                    )}
                                >
                                    <Briefcase className={cn("w-5 h-5 mb-3", role === 'referrer' ? "text-white" : "text-gray-500")} />
                                    <span className={cn("font-semibold text-sm mb-1", role === 'referrer' ? "text-white" : "text-gray-900")}>Offer referrals</span>
                                    <span className={cn("text-xs leading-relaxed", role === 'referrer' ? "text-gray-400" : "text-gray-500")}>I work at a company and want to refer candidates.</span>
                                    {role === 'referrer' && <CheckCircle2 className="absolute top-4 right-4 w-4 h-4 text-white" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <Input
                                label="Full name"
                                type="text"
                                placeholder="Jane Doe"
                                autoComplete="name"
                                error={errors.name?.message}
                                {...register('name')}
                            />

                            <Input
                                label="Email address"
                                type="email"
                                placeholder="name@example.com"
                                autoComplete="email"
                                error={errors.email?.message}
                                {...register('email')}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative">
                                    <Input
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        error={errors.password?.message}
                                        {...register('password')}
                                    />
                                </div>

                                <div className="relative">
                                    <Input
                                        label="Confirm Password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        error={errors.confirmPassword?.message}
                                        {...register('confirmPassword')}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-1">
                                <button
                                    type="button"
                                    className="text-xs font-medium text-gray-500 hover:text-black flex items-center gap-1"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <><EyeOff className="w-3 h-3" /> Hide passwords</> : <><Eye className="w-3 h-3" /> Show passwords</>}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" size="lg" className="w-full mt-4" isLoading={isSubmitting}>
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-black hover:underline">
                                Log in instead
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
