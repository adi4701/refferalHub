import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from './Button';

export const Modal = ({
    isOpen,
    onClose,
    title,
    size = 'md',
    children,
    className
}) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={cn(
                            "relative w-full bg-white rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]",
                            sizes[size],
                            className
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {title && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-8 h-8 p-0 rounded-full"
                                    onClick={onClose}
                                    aria-label="Close modal"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                        {!title && (
                            <div className="absolute right-4 top-4 z-10">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-8 h-8 p-0 rounded-full bg-white/80 backdrop-blur"
                                    onClick={onClose}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                        <div className="p-6 overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};
