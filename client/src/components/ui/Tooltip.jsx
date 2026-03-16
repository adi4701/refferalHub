import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/cn';

export const Tooltip = ({
    content,
    children,
    position = 'top',
    delay = 0.2,
    className
}) => {
    const [isVisible, setIsVisible] = useState(false);
    // eslint-disable-next-line
    let timeout;

    const show = () => {
        timeout = setTimeout(() => setIsVisible(true), delay * 1000);
    };

    const hide = () => {
        clearTimeout(timeout);
        setIsVisible(false);
    };

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
        >
            {children}
            <AnimatePresence>
                {isVisible && content && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded whitespace-nowrap pointer-events-none shadow-sm",
                            positionClasses[position],
                            className
                        )}
                        role="tooltip"
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
