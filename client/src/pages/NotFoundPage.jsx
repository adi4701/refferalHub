import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Button } from '../components/ui';

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <AppLayout>
            <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
                <h1 className="text-7xl md:text-9xl font-mono font-bold text-gray-900 tracking-tighter mb-4">404</h1>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Page not found</h2>
                <p className="text-gray-500 max-w-md mb-8">
                    The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
                </p>
                <Button onClick={() => navigate('/')} size="lg" icon={Home} className="shadow-sm">
                    Back to Home
                </Button>
            </div>
        </AppLayout>
    );
};
