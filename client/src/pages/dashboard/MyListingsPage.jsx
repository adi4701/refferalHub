import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    Plus,
    MoreVertical,
    Users,
    Eye,
    ExternalLink,
    Filter,
    Search as SearchIcon
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout';
import { Card, Button, Badge, Skeleton, Input } from '../../components/ui';
import { getMyListings } from '../../api/listing.api';

const MyListingsPage = () => {
    const { data: response, isLoading, isError, error } = useQuery({
        queryKey: ['myListings'],
        queryFn: () => getMyListings()
    });

    const listings = response?.data?.listings || [];

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
                        <p className="text-gray-500 mt-1">Manage all the referral opportunities you've shared.</p>
                    </div>
                    <Button className="h-11 px-6 gap-2" onClick={() => window.location.href = '/dashboard/listings/new'}>
                        <Plus className="w-4 h-4" />
                        Create New Listing
                    </Button>
                </div>

                <Card className="p-4 border-none shadow-sm bg-white">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input placeholder="Search listings..." className="pl-10 h-11 bg-gray-50 border-none" />
                        </div>
                        <Button variant="outline" className="h-11 gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                    </div>
                </Card>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} height={200} rounded="xl" />
                        ))}
                    </div>
                ) : isError ? (
                    <Card className="p-12 text-center text-red-500 bg-red-50 border-red-100">
                        {error?.message || 'Failed to load listings'}
                    </Card>
                ) : listings.length === 0 ? (
                    <Card className="p-20 text-center border-dashed border-2 border-gray-200 bg-gray-50/50">
                        <div className="max-w-xs mx-auto">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Plus className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No listings yet</h3>
                            <p className="text-gray-500 mt-2 mb-6 text-sm">Create your first listing to start helping others and earn tokens.</p>
                            <Button onClick={() => window.location.href = '/dashboard/listings/new'}>
                                Start Listing
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing, i) => (
                            <motion.div
                                key={listing._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all border-none shadow-md">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge variant={listing.status === 'active' ? 'success' : 'secondary'} className="capitalize">
                                                {listing.status}
                                            </Badge>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                            {listing.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">{listing.company}</p>

                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                    <Users className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] uppercase font-bold tracking-wider">Requests</span>
                                                </div>
                                                <span className="text-lg font-bold text-gray-900">{listing.requestCount || 0}</span>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] uppercase font-bold tracking-wider">Views</span>
                                                </div>
                                                <span className="text-lg font-bold text-gray-900">{listing.views || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-xs text-gray-400">Created {new Date(listing.createdAt).toLocaleDateString()}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-indigo-600 hover:bg-indigo-50 gap-2"
                                            onClick={() => window.location.href = `/listings/${listing._id}`}
                                        >
                                            View
                                            <ExternalLink className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyListingsPage;
