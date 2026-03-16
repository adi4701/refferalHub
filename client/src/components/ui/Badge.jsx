import React from 'react';
import { cn } from '../../lib/cn';

export const Badge = ({
    className,
    variant = 'default',
    size = 'md',
    children,
    ...props
}) => {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        success: 'bg-gray-900 text-white',
        warning: 'bg-gray-200 text-gray-800',
        danger: 'bg-gray-100 text-gray-600 border border-gray-300',
        info: 'bg-gray-50 text-gray-600 border border-gray-200'
    };

    const sizes = {
        sm: 'text-2xs px-2 py-0.5',
        md: 'text-xs px-2.5 py-1'
    };

    return (
        <span
            className={cn(
                "inline-flex items-center font-medium rounded-full",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};
