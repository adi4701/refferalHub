import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    Files,
    Settings,
    Search,
    Menu,
    X,
    LogOut
} from 'lucide-react';
import { Avatar } from '../ui';
import { cn } from '../../lib/cn';
import { APP_NAME } from '../../constants';
import { useAuthStore } from '../../store/auth.store';

export const DashboardLayout = ({ children }) => {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Use real auth store
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);

    const referrerNav = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Listings', href: '/dashboard/listings', icon: Briefcase },
        { name: 'Requests', href: '/dashboard/requests', icon: Files },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    const applicantNav = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Applications', href: '/dashboard/applications', icon: Files },
        { name: 'Browse Listings', href: '/browse', icon: Search },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    const navigation = user?.role === 'referrer' ? referrerNav : applicantNav;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };


    const SidebarContent = () => (
        <div className="flex h-full flex-col bg-gray-950 text-white">
            <div className="flex h-16 shrink-0 items-center px-6">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-6 h-6 bg-white text-black flex items-center justify-center font-mono font-bold text-xs rounded-sm">
                        R
                    </div>
                    <span className="font-mono font-bold text-lg tracking-tight">
                        Referral<span className="text-gray-400">Hub</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setMobileDrawerOpen(false)}
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                    isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="flex shrink-0 border-t border-gray-800 p-4">
                <div className="group block w-full flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <Link to="/profile" className="flex items-center overflow-hidden">
                            <Avatar name={user?.name || 'User'} size="sm" className="bg-gray-800 text-white" />
                            <div className="ml-3 overflow-hidden">
                                <p className="truncate text-sm font-medium text-white">{user?.name || 'User'}</p>
                                <p className="truncate text-xs font-medium text-gray-400 capitalize">{user?.role || 'guest'}</p>
                            </div>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-900 rounded-md transition-colors focus:outline-none"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">

            {/* Mobile Sidebar Backdrop */}
            <AnimatePresence>
                {mobileDrawerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileDrawerOpen(false)}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileDrawerOpen && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col lg:hidden"
                    >
                        <SidebarContent />
                        <button
                            className="absolute top-4 -right-12 p-2 text-white/70 hover:text-white"
                            onClick={() => setMobileDrawerOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:inset-y-0 relative z-10 border-r border-gray-200 shadow-xl shadow-gray-200/20">
                <SidebarContent />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">

                {/* Mobile Header Toggle */}
                <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 hover:text-black"
                        onClick={() => setMobileDrawerOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
                        {APP_NAME} Dashboard
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
