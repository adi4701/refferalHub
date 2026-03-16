import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

export const Select = React.forwardRef(({
    className, label, error, hint, options = [], placeholder, ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    ref={ref}
                    className={cn(
                        "w-full border rounded bg-white px-3 py-2 text-sm trans-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer",
                        error
                            ? "border-red-400 focus:ring-red-400"
                            : "border-gray-200 focus:ring-black",
                        className
                    )}
                    {...props}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options.map((option, idx) => (
                        <option key={idx} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
    );
});

Select.displayName = 'Select';
