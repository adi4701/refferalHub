import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock } from 'lucide-react';
import { Card, Badge, Avatar, Button } from '../ui';
import { cn } from '../../lib/cn';

export const ListingCard = memo(({ listing, compact = false }) => {
    if (!listing) return null;

    const usedSlots = listing.slotsTotal ? listing.slotsTotal - listing.slotsAvailable : 0;
    const slotPercentage = listing.slotsTotal ? Math.round((usedSlots / listing.slotsTotal) * 100) : 0;
    const isExpired = listing.expiresAt && new Date(listing.expiresAt) < new Date();

    return (
        <Card hover className="flex flex-col h-full overflow-hidden">
            <div className={cn("flex flex-col h-full", compact ? "p-4" : "p-6")}>
                {/* Top: Company + WorkMode */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className={cn("bg-gray-100 rounded-md flex items-center justify-center font-mono font-bold text-gray-400", compact ? "w-8 h-8 text-xs" : "w-10 h-10")}>
                            {listing.company ? listing.company.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 leading-none mb-1">
                                {listing.company || 'Company Name'}
                            </h3>
                            <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'Recently'}
                            </p>
                        </div>
                    </div>
                    <Badge variant={listing.workMode === 'remote' ? 'info' : 'default'} size="sm" className="capitalize">
                        {listing.workMode || 'Remote'}
                    </Badge>
                </div>

                {/* Middle: Job Title + Referrer Info */}
                <div className="mb-4">
                    <Link to={`/listings/${listing._id || 'new'}`} className="block border-b border-transparent hover:border-black transition-colors w-fit">
                        <h4 className={cn("font-bold text-gray-950 pb-0.5 line-clamp-2", compact ? "text-base leading-snug" : "text-xl leading-tight")}>
                            {listing.jobTitle || 'Job Title goes here'}
                        </h4>
                    </Link>

                    {!compact && (
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                            <Avatar src={listing.referrer?.avatar?.url} name={listing.referrer?.name || 'User'} size="sm" />
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{listing.referrer?.name || 'Referrer Name'}</p>
                                <p className="text-xs text-gray-500 truncate">{listing.referrer?.headline || 'Insider'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tags Row */}
                {!compact && listing.tags && listing.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {listing.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="default" size="sm" className="font-normal text-2xs px-2 py-0.5 border border-gray-200">
                                {tag}
                            </Badge>
                        ))}
                        {listing.tags.length > 3 && (
                            <span className="text-gray-400 text-xs self-center">+{listing.tags.length - 3}</span>
                        )}
                    </div>
                )}

                {/* Bottom Panel */}
                <div className={cn("mt-auto pt-4 border-t border-gray-100", compact ? "" : "flex flex-col gap-4")}>
                    <div className="flex justify-between flex-wrap gap-2 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-2 flex-1">
                            <span className="font-medium text-gray-800">{listing.slotsAvailable || 0}</span>
                            <span>of {listing.slotsTotal || 0} slots left</span>
                        </div>
                        {!compact && (
                            <div className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" /> {listing.views || 0}
                            </div>
                        )}
                    </div>

                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                        <div
                            className={cn("h-full rounded-full transition-all", isExpired || listing.slotsAvailable === 0 ? "bg-red-400" : "bg-black")}
                            style={{ width: `${slotPercentage}%` }}
                        />
                    </div>

                    <Button
                        variant={listing.slotsAvailable > 0 && !isExpired ? "secondary" : "ghost"}
                        size={compact ? "sm" : "md"}
                        className="w-full font-semibold border-gray-300 shadow-sm"
                        disabled={listing.slotsAvailable === 0 || isExpired}
                        onClick={() => window.location.href = `/listings/${listing._id}`}
                    >
                        {isExpired ? 'Expired' : listing.slotsAvailable === 0 ? 'Filled' : 'Apply for Referral'}
                    </Button>
                </div>
            </div>
        </Card>
    );
});

ListingCard.displayName = 'ListingCard';
