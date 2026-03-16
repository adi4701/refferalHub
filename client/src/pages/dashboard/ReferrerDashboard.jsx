import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Briefcase,
    MessageSquare,
    ArrowUpRight,
    TrendingUp,
    Clock,
    Settings
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout';
import { Card, Button, Badge } from '../../components/ui';
import { useAuthStore } from '../../store/auth.store';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
    <Card className="p-6">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
                {trend && (
                    <div className="flex items-center mt-2 text-xs font-medium text-emerald-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>{trendValue}% from last month</span>
                    </div>
                )}
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
                <Icon className="w-5 h-5 text-gray-700" />
            </div>
        </div>
    </Card>
);

const ReferrerDashboard = () => {
    const user = useAuthStore(state => state.user);

    const stats = [
        { title: 'Total Listings', value: '12', icon: Briefcase, trend: true, trendValue: '12' },
        { title: 'Referral Requests', value: '48', icon: Users, trend: true, trendValue: '24' },
        { title: 'Avg. Response Time', value: '4h', icon: Clock },
        { title: 'Success Rate', value: '92%', icon: ArrowUpRight },
    ];

    const recentRequests = [
        { id: '1', user: 'Alex Johnson', position: 'Senior Frontend Engineer', company: 'Google', date: '2 hours ago', status: 'pending' },
        { id: '2', user: 'Sarah Chen', position: 'Backend Lead', company: 'Meta', date: '5 hours ago', status: 'reviewing' },
        { id: '3', user: 'Michael Brown', position: 'Product Manager', company: 'Amazon', date: '1 day ago', status: 'accepted' },
    ];

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Referrer'}!</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your referral listings today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <StatCard {...stat} />
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Recent Referral Requests</h2>
                            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">View All</Button>
                        </div>
                        <div className="space-y-4">
                            {recentRequests.map((req) => (
                                <div key={req.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                                            {req.user.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 leading-none">{req.user}</h4>
                                            <p className="text-sm text-gray-500 mt-1">{req.position} @ {req.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-gray-400 font-medium">{req.date}</span>
                                        <Badge
                                            variant={req.status === 'accepted' ? 'success' : req.status === 'pending' ? 'warning' : 'info'}
                                            className="capitalize"
                                        >
                                            {req.status}
                                        </Badge>
                                        <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="space-y-3">
                            <Button className="w-full justify-start gap-3 h-12" onClick={() => window.location.href = '/dashboard/listings/new'}>
                                <Briefcase className="w-4 h-4" />
                                Create New Listing
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-3 h-12">
                                <MessageSquare className="w-4 h-4" />
                                Review Messages
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-gray-500">
                                <Settings className="w-4 h-4" />
                                Profile Settings
                            </Button>
                        </div>

                        <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                            <h4 className="text-sm font-bold text-indigo-900 mb-1">Referral Tip</h4>
                            <p className="text-xs text-indigo-700 leading-relaxed">
                                Listings with detailed requirements get 40% more qualified applicants. Keep your preferences updated!
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReferrerDashboard;
