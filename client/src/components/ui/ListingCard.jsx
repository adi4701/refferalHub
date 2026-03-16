import React from 'react';
import { Building, MapPin, Briefcase, Clock, Eye } from 'lucide-react';
import { Card, Badge, Button } from './index';

export const ListingCard = ({ listing }) => {
    if (!listing) return null;

    return (
        <Card hover padding="md" className="flex flex-col h-full justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center font-mono font-bold text-gray-400">
                            {listing.company ? listing.company.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 border-b border-transparent hover:border-black inline-block cursor-pointer trans-all">
                                {listing.company || 'Company'}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                <Briefcase className="w-3 h-3" /> {listing.department || 'Engineering'}
                            </p>
                        </div>
                    </div>
                    <Badge variant={listing.slotsAvailable > 0 ? "success" : "danger"} size="sm">
                        {listing.slotsAvailable || 0} left
                    </Badge>
                </div>

                <h4 className="text-lg font-bold text-black mb-2 line-clamp-1">{listing.jobTitle || 'Software Engineer'}</h4>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {listing.location || 'Remote'}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 capitalize">
                        <Building className="w-3.5 h-3.5" /> {listing.workMode || 'Hybrid'}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'Recently'}
                    </p>
                </div>

                {listing.tags && listing.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {listing.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="default" size="sm" className="font-normal text-2xs px-1.5 border border-gray-200">
                                {tag}
                            </Badge>
                        ))}
                        {listing.tags.length > 3 && (
                            <span className="text-gray-400 text-xs self-center">+{listing.tags.length - 3}</span>
                        )}
                    </div>
                )}
            </div>

            <div className="pt-4 mt-auto border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">Referred by {listing.referrer?.name ? listing.referrer.name.split(' ')[0] : 'Insider'}</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {listing.views || 0}
                </div>
            </div>
        </Card>
    );
};
