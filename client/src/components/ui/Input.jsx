import React from 'react';
import { cn } from '../../lib/cn';

/**
 * @typedef {Object} InputProps
 * @property {string} [label] - Input label text
 * @property {string} [error] - Error message
 * @property {string} [hint] - Hint text
 * @property {React.ElementType} [icon] - Left icon component
 * @property {'sm'|'md'|'lg'} [size='md'] - Input size
 * @property {string} [className] - Additional classes
 */

/** @type {React.ForwardRefRenderFunction<HTMLInputElement, InputProps & React.InputHTMLAttributes<HTMLInputElement>>} */
export const Input = React.forwardRef(({
    className, label, error, hint, icon: Icon, ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-4 w-4 text-gray-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full border rounded bg-white px-3 py-2 text-sm trans-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed",
                        Icon ? "pl-9" : "",
                        error
                            ? "border-red-400 focus:ring-red-400 placeholder:text-red-300"
                            : "border-gray-200 focus:ring-black placeholder:text-gray-400",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
    );
});

Input.displayName = 'Input';
