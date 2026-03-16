import React from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Send,
    CheckCircle2,
    Clock,
    TrendingUp,
    Shield
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout';
import { Card, Button, Badge } from '../../components/ui';
import { useAuthStore } from '../../store/auth.store';

const ApplicantDashboard = () => {
    const user = useAuthStore(state => state.user);

    const stats = [
        { label: 'Applications Sent', value: '8', color: 'text-indigo-600', icon: Send },
        { label: 'Accepted', value: '2', color: 'text-emerald-600', icon: CheckCircle2 },
        { label: 'Pending Response', value: '5', color: 'text-amber-600', icon: Clock },
        { label: 'Profile Views', value: '124', color: 'text-blue-600', icon: TrendingUp },
    ];

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Applicant'}!</h1>
                        <p className="text-gray-500 mt-1">Ready to find your next career opportunity?</p>
                    </div>
                    <Button className="md:w-auto h-11 px-6 gap-2" onClick={() => window.location.href = '/browse'}>
                        <Search className="w-4 h-4" />
                        Browse Listings
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-6 flex flex-col items-center text-center">
                                <div className={`p-3 rounded-full bg-gray-50 mb-4 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
                                <p className="text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 overflow-hidden border-none shadow-xl shadow-gray-200/50">
                        <div className="bg-gray-950 p-6">
                            <h2 className="text-lg font-bold text-white">Application Status</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-2 shadow-sm">
                                                <img
                                                    src={`https://logo.clearbit.com/${i === 1 ? 'google.com' : i === 2 ? 'meta.com' : 'stripe.com'}`}
                                                    alt="Company"
                                                    className="max-h-full max-w-full"
                                                    onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=Company'}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Senior Software Engineer</h4>
                                                <p className="text-sm text-gray-500">{i === 1 ? 'Google' : i === 2 ? 'Meta' : 'Stripe'}</p>
                                            </div>
                                        </div>
                                        <Badge variant={i === 1 ? 'warning' : i === 2 ? 'success' : 'info'}>
                                            {i === 1 ? 'Pending Review' : i === 2 ? 'Accepted' : 'Under Review'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-6 mt-4">
                                        <div className="flex items-center text-xs text-gray-400 font-medium">
                                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                                            Applied 2 days ago
                                        </div>
                                        <div className="flex items-center text-xs text-indigo-600 font-bold hover:underline cursor-pointer">
                                            View Details
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <Card className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-none shadow-xl shadow-indigo-200">
                            <Shield className="w-8 h-8 text-indigo-200 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Improve your chances</h3>
                            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                                Complete your profile and add your professional links to gain more trust from referrers.
                            </p>
                            <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none h-11">
                                Complete Profile
                            </Button>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Recommended for you</h3>
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="flex gap-3 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                            <Search className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Frontend Dev @ Vercel</p>
                                            <p className="text-xs text-gray-500">Matching your tags: React, Tailwind</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ApplicantDashboard;
