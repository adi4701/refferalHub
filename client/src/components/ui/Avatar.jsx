import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '../../lib/cn';

export const Avatar = ({
    src,
    name,
    size = 'md',
    showRing = false,
    className,
    ...props
}) => {
    const [error, setError] = useState(false);
    const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '50px' });

    const sizes = {
        xs: 'w-6 h-6 text-2xs',
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg'
    };

    const initials = name
        ? name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : '?';

    return (
        <div
            ref={ref}
            className={cn(
                "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-100 flex-shrink-0",
                sizes[size],
                showRing && "ring-2 ring-white ring-offset-1 ring-offset-gray-50",
                className
            )}
            {...props}
        >
            {src && !error ? (
                inView ? (
                    <img
                        src={src}
                        alt={name || 'Avatar'}
                        loading="lazy"
                        className="w-full h-full object-cover transition-opacity duration-300"
                        onError={() => setError(true)}
                    />
                ) : null
            ) : (
                <span className="font-medium text-gray-600">{initials}</span>
            )}
        </div>
    );
};
