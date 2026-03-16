import React from 'react';
import { cn } from '../../lib/cn';

export const Skeleton = ({
    width,
    height,
    rounded = 'md',
    count = 1,
    className,
    ...props
}) => {
    const skeletons = Array(count).fill(0);

    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded',
        lg: 'rounded-lg',
        full: 'rounded-full'
    };

    return (
        <>
            {skeletons.map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "animate-pulse bg-gray-100",
                        roundedClasses[rounded] || 'rounded',
                        className,
                        count > 1 ? 'mb-2 last:mb-0' : ''
                    )}
                    style={{
                        width: typeof width === 'number' ? `${width}px` : width,
                        height: typeof height === 'number' ? `${height}px` : height,
                        animationDelay: `${i * 150}ms`
                    }}
                    {...props}
                />
            ))}
        </>
    );
};
