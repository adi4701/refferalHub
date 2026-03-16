import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { AppLayout } from '../../components/layout';
import { ListingCard, ListingFilter } from '../../components/listings';
import { Select, EmptyState, Skeleton, Button, StaggeredList } from '../../components/ui';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getListings } from '../../api/listing.api';
import { PageError } from '../../components/shared';

// PERFORMANCE NOTE: For instances where the data arrays exceed 100+ returned items 
// mapping into the DOM, `@tanstack/react-virtual` should be natively installed and hooked
// here to constrain node limits bounding infinite scrolling smoothly!

export const ListingsPage = () => {
    const [searchParams] = useSearchParams();
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('newest');

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px',
    });

    const {
        data: queryData,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: ['listings', { searchParams: searchParams.toString(), sortBy }],
        queryFn: async ({ pageParam = 1 }) => {
            const params = Object.fromEntries(searchParams.entries());
            return getListings({ ...params, sortBy, page: pageParam, limit: 12 });
        },
        getNextPageParam: (lastPage) => {
            const { page, pages } = lastPage.data;
            if (page < pages) return page + 1;
            return undefined;
        }
    });

    const listings = queryData?.pages.flatMap(page => page.data.listings) || [];
    const totalCount = queryData?.pages[0]?.data?.total || 0;

    // Infinite Scroll loading securely
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* LEFT: Sidebar Filters */}
                    <ListingFilter
                        isMobileOpen={mobileFilterOpen}
                        onCloseMobile={() => setMobileFilterOpen(false)}
                    />

                    {/* RIGHT: Main Content bounds */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Header Toolbar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                    Find Your Referral
                                    {!isLoading && !isError && (
                                        <span className="text-sm font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                                            {totalCount} total
                                        </span>
                                    )}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">Browse trusted referrals from verified insiders.</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Mobile Filter Toggle */}
                                <Button
                                    variant="secondary"
                                    className="md:hidden flex-1 shadow-sm"
                                    onClick={() => setMobileFilterOpen(true)}
                                    icon={Filter}
                                >
                                    Filters
                                </Button>

                                {/* Sort Dropdown mapped properly natively */}
                                <div className="w-48">
                                    <Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        options={[
                                            { value: 'newest', label: 'Newest listings' },
                                            { value: 'views', label: 'Most viewed' },
                                            { value: 'slots', label: 'Most slots available' }
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="border border-gray-100 rounded-lg p-6 bg-white shadow-sm space-y-4">
                                        <div className="flex gap-3">
                                            <Skeleton width={40} height={40} rounded="md" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton width="60%" height={16} />
                                                <Skeleton width="40%" height={12} />
                                            </div>
                                        </div>
                                        <Skeleton width="100%" height={24} />
                                        <Skeleton count={2} height={12} width="90%" />
                                        <div className="pt-4 mt-4 border-t border-gray-100">
                                            <Skeleton width="100%" height={36} rounded="md" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : isError ? (
                            <PageError error={error} onRetry={refetch} />
                        ) : listings.length === 0 ? (
                            <EmptyState
                                icon={SlidersHorizontal}
                                title="No listings found"
                                description="Try adjusting your search or filters to find what you're looking for."
                                action={{ label: "Clear all filters", variant: "secondary", onClick: () => window.history.pushState({}, '', window.location.pathname) }}
                            />
                        ) : (
                            <StaggeredList className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {listings.map((listing) => (
                                    <ListingCard key={listing._id} listing={listing} />
                                ))}
                            </StaggeredList>
                        )}

                        {/* Load More Trigger rendering intersection observer mapping hook correctly */}
                        {!isLoading && hasNextPage && (
                            <div ref={ref} className="py-12 flex justify-center text-gray-400">
                                <span className="animate-pulse-slow">{isFetchingNextPage ? 'Loading more...' : 'Scroll for more'}</span>
                            </div>
                        )}
                        {!isLoading && !hasNextPage && listings.length > 0 && (
                            <div className="py-12 flex justify-center">
                                <p className="text-sm text-gray-400">You've reached the end of the list.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
