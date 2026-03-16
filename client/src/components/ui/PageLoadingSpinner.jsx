import React from 'react';
import { Spinner } from './Spinner';

export const PageLoadingSpinner = () => {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <Spinner size="lg" color="dark" />
            <p className="mt-4 text-sm font-medium text-gray-500 uppercase tracking-widest animate-pulse-slow">
                Loading...
            </p>
        </div>
    );
};
