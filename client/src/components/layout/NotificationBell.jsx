import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

// Mock notifications for UI dev
const MOCK_NOTIFICATIONS = [
    { id: '1', title: 'New Request', body: 'Sarah applied to Frontend Eng.', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 5) },
    { id: '2', title: 'Referral Accepted', body: 'Google SWE accepted', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: '3', title: 'Listing Expiring', body: 'Stripe PM expires in 2d', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
];

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // In real app, consume from zustand/react-query
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = () => {
        // Store previous state for rollback
        const previousState = [...notifications];

        // Optimistically update UI first
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));

        // Mock API Mutation Call (Simulates Server Response and possible rollback)
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 800)),
            {
                loading: 'Updating...',
                success: 'All notifications marked as read',
                error: () => {
                    // Rollback on hypothetical error
                    setNotifications(previousState);
                    return 'Failed to mark as read';
                }
            }
        );
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full trans-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
                <motion.div
                    key={unreadCount}
                    animate={unreadCount > 0 ? { rotate: [0, -15, 15, -15, 15, 0] } : {}}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <Bell className="w-5 h-5" />
                </motion.div>
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-black text-white text-[8px] font-bold items-center justify-center"></span>
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 origin-top-right"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-gray-500 hover:text-black hover:underline flex items-center"
                                >
                                    <Check className="w-3 h-3 mr-1" /> Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-sm text-gray-500">
                                    No notifications yet.
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer trans-all",
                                            !notification.isRead ? "bg-gray-50/80" : ""
                                        )}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <p className={cn(
                                                    "text-sm font-medium truncate",
                                                    !notification.isRead ? "text-black" : "text-gray-700"
                                                )}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                    {notification.body}
                                                </p>
                                                <span className="text-[10px] text-gray-400 mt-1 block">
                                                    {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                                </span>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="w-2 h-2 rounded-full bg-black flex-shrink-0 mt-1.5" />
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                            <Link
                                to="/notifications"
                                className="block text-center text-xs font-medium text-black hover:underline py-1"
                                onClick={() => setIsOpen(false)}
                            >
                                View all <ArrowRight className="inline w-3 h-3 ml-0.5" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
