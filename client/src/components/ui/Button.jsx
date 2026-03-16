import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * @typedef {Object} ButtonProps
 * @property {string} [className] - Additional classes
 * @property {'primary'|'secondary'|'ghost'|'danger'} [variant='primary'] - Visual style
 * @property {'sm'|'md'|'lg'} [size='md'] - Button size
 * @property {boolean} [isLoading] - Show loading spinner
 * @property {boolean} [disabled] - Disable interaction
 * @property {React.ElementType} [icon] - Lucide icon component
 * @property {'left'|'right'} [iconPosition='left'] - Icon position
 * @property {React.ReactNode} [children] - Button content
 */

/** @type {React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>} */
export const Button = React.forwardRef(({
    className, variant = 'primary', size = 'md', isLoading, disabled,
    icon: Icon, iconPosition = 'left', children, ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded trans-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
        primary: 'bg-black text-white hover:bg-gray-800 focus-visible:ring-black',
        secondary: 'bg-white text-black border border-gray-200 hover:bg-gray-50 focus-visible:ring-gray-300',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-black focus-visible:ring-gray-300',
        danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50 focus-visible:ring-red-500'
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base'
    };

    const iconSizes = {
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const content = (
        <>
            {isLoading ? (
                <Loader2 className={cn('animate-spin', iconSizes[size], children ? 'mr-2' : '')} />
            ) : Icon && iconPosition === 'left' ? (
                <Icon className={cn(iconSizes[size], children ? 'mr-2' : '')} />
            ) : null}
            {children}
            {!isLoading && Icon && iconPosition === 'right' && (
                <Icon className={cn(iconSizes[size], children ? 'ml-2' : '')} />
            )}
        </>
    );

    return (
        <motion.button
            ref={ref}
            disabled={disabled || isLoading}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
            {...props}
        >
            {content}
        </motion.button>
    );
});

Button.displayName = 'Button';
