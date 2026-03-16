import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export const PageError = ({ error, onRetry, title = "Failed to load data" }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-md mb-6">
                {error?.response?.data?.message || error?.message || "We encountered an issue fetching this data. Please try again."}
            </p>
            {onRetry && (
                <Button onClick={onRetry} variant="secondary" size="sm" icon={RefreshCw}>
                    Retry Request
                </Button>
            )}
        </div>
    );
};
