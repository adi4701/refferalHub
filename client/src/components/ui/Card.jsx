import React from 'react';
import { cn } from '../../lib/cn';

export const Card = React.forwardRef(({ className, hover = false, padding = 'md', children, ...props }, ref) => {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div
            ref={ref}
            className={cn(
                "bg-white border border-gray-200 rounded-lg",
                hover && "hover:border-gray-900 hover:shadow-md hover:scale-[1.005] transition-all duration-200 cursor-pointer",
                paddings[padding],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});
Card.displayName = 'Card';

export const CardHeader = ({ className, children, ...props }) => (
    <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
        {children}
    </div>
);

export const CardBody = ({ className, children, ...props }) => (
    <div className={cn("", className)} {...props}>
        {children}
    </div>
);

export const CardFooter = ({ className, children, ...props }) => (
    <div className={cn("flex items-center mt-6 pt-4 border-t border-gray-100", className)} {...props}>
        {children}
    </div>
);
