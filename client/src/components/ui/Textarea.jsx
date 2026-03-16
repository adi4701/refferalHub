import React from 'react';
import { cn } from '../../lib/cn';

export const Textarea = React.forwardRef(({
    className, label, error, hint, rows = 4, resize = 'vertical', ...props
}, ref) => {
    const resizeClasses = {
        none: 'resize-none',
        vertical: 'resize-y'
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                rows={rows}
                className={cn(
                    "w-full border rounded bg-white px-3 py-2 text-sm trans-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed",
                    resizeClasses[resize] || 'resize-y',
                    error
                        ? "border-red-400 focus:ring-red-400 placeholder:text-red-300"
                        : "border-gray-200 focus:ring-black placeholder:text-gray-400",
                    className
                )}
                {...props}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
    );
});

Textarea.displayName = 'Textarea';
