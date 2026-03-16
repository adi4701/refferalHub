import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Clock,
    CheckCircle2,
    XCircle,
    Building,
    User,
    ArrowRight,
    MessageCircle
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout';
import { Card, Button, Badge, Skeleton } from '../../components/ui';
import { getMyRequests } from '../../api/request.api';
import { useAuthStore } from '../../store/auth.store';

const RequestsPage = () => {
    const user = useAuthStore(state => state.user);
    const { data: response, isLoading, isError, error } = useQuery({
        queryKey: ['myRequests'],
        queryFn: () => getMyRequests()
    });

    const requests = response?.data?.requests || [];

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {user?.role === 'referrer' ? 'Received Requests' : 'My Applications'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {user?.role === 'referrer'
                            ? 'Manage candidates who requested a referral from you.'
                            : 'Track the status of your referral applications.'}
                    </p>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} height={100} rounded="xl" />
                        ))}
                    </div>
                ) : isError ? (
                    <Card className="p-12 text-center text-red-500 bg-red-50 border-red-100 italic">
                        {error?.message || 'Failed to load requests'}
                    </Card>
                ) : requests.length === 0 ? (
                    <Card className="p-20 text-center border-dashed border-2 border-gray-200 bg-gray-50/50">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-gray-300">
                            <Clock className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No requests here... yet</h3>
                        <p className="text-gray-500 mt-2 mb-6 text-sm max-w-sm mx-auto">
                            {user?.role === 'referrer'
                                ? "Once someone applies to your listings, you'll see their details and cover notes here."
                                : "Go browse listings and apply to positions to see your applications appear here!"}
                        </p>
                        {user?.role !== 'referrer' && (
                            <Button onClick={() => window.location.href = '/browse'}>
                                Browse All Listings
                            </Button>
                        )}
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <Card key={req._id} className="p-6 hover:shadow-lg transition-all border-none shadow-sm group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-5 flex-1">
                                        <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-gray-50 items-center justify-center flex-shrink-0 text-indigo-600 border border-gray-100">
                                            {user?.role === 'referrer' ? <User /> : <Building />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {user?.role === 'referrer' ? req.applicant?.name : req.listing?.title}
                                                </h3>
                                                <Badge variant={
                                                    req.status === 'accepted' ? 'success' :
                                                        req.status === 'rejected' ? 'danger' : 'warning'
                                                } className="capitalize text-[10px] px-2 py-0.5">
                                                    {req.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                                {user?.role === 'referrer'
                                                    ? `${req.listing?.title} @ ${req.listing?.company}`
                                                    : req.listing?.company}
                                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                Applied on {new Date(req.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button variant="ghost" size="sm" className="hidden sm:flex h-10 px-4 gap-2 text-indigo-600 hover:bg-indigo-50">
                                            <MessageCircle className="w-4 h-4" />
                                            Chat
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-10 px-4 gap-2 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all"
                                            onClick={() => window.location.href = `/dashboard/requests/${req._id}`}
                                        >
                                            View Details
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default RequestsPage;
