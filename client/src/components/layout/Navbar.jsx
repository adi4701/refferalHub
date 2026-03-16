import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { Button, Avatar } from '../ui';
import { NotificationBell } from './NotificationBell';
import { APP_NAME } from '../../constants';
import { cn } from '../../lib/cn';

export const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    const navigate = useNavigate();

    // MOCK AUTH STATE for UI development
    const isAuthed = false;
    const user = { name: 'John Doe', role: 'referrer' };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Implement real logout logic here
        console.log('Logging out');
        setProfileDropdownOpen(false);
    };

    const NavLinks = () => (
        <>
            <Link to="/browse" className="text-sm font-medium text-gray-600 hover:text-black trans-all">Browse Listings</Link>
            <Link to="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-black trans-all">How It Works</Link>
        </>
    );

    return (
        <>
            <header className="fixed top-0 inset-x-0 h-14 bg-white/90 backdrop-blur-md border-b border-gray-200 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                    {/* LEFT: Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-6 h-6 bg-black text-white flex items-center justify-center font-mono font-bold text-xs rounded-sm group-hover:scale-105 trans-all">
                                R
                            </div>
                            <span className="font-mono font-bold text-lg tracking-tight text-black flex items-center">
                                Referral<span className="text-gray-400">Hub</span>
                            </span>
                        </Link>
                    </div>

                    {/* CENTER: Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <NavLinks />
                    </div>

                    {/* RIGHT: Auth/Profile */}
                    <div className="hidden md:flex items-center gap-4">
                        {!isAuthed ? (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
                                <Button size="sm" onClick={() => navigate('/register')}>Get Started</Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <NotificationBell />

                                <div className="relative" ref={profileDropdownRef}>
                                    <button
                                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                        className="flex items-center focus:outline-none"
                                    >
                                        <Avatar name={user.name} size="sm" hover="true" className="cursor-pointer ring-2 ring-transparent hover:ring-gray-200 transition-all" />
                                    </button>

                                    <AnimatePresence>
                                        {profileDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 origin-top-right"
                                            >
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <p className="text-sm text-black font-medium">{user.name}</p>
                                                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                                </div>

                                                <div className="py-1">
                                                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black">
                                                        <User className="w-4 h-4 mr-2" /> Profile
                                                    </Link>
                                                    <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black">
                                                        <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                                                    </Link>
                                                    <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black">
                                                        <Settings className="w-4 h-4 mr-2" /> Settings
                                                    </Link>
                                                </div>

                                                <div className="border-t border-gray-100 py-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        <LogOut className="w-4 h-4 mr-2" /> Logout
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        {isAuthed && <NotificationBell />}
                        <button
                            className="text-gray-600 hover:text-black focus:outline-none"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-xl z-50 md:hidden flex flex-col"
                        >
                            <div className="flex h-14 items-center justify-between px-6 border-b border-gray-100">
                                <span className="font-mono font-bold text-lg text-black">Menu</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-black">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
                                {isAuthed ? (
                                    <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                                        <Avatar name={user.name} size="md" />
                                        <div>
                                            <p className="font-medium text-black">{user.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                ) : null}

                                <div className="flex flex-col gap-4">
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Discover</h4>
                                    <Link to="/browse" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-gray-900">Browse Listings</Link>
                                    <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-gray-900">How It Works</Link>
                                </div>

                                {isAuthed && (
                                    <div className="flex flex-col gap-4 pt-6 border-t border-gray-100">
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</h4>
                                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-base font-medium text-gray-900"><LayoutDashboard className="w-5 h-5 mr-3 text-gray-400" /> Dashboard</Link>
                                        <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-base font-medium text-gray-900"><User className="w-5 h-5 mr-3 text-gray-400" /> Profile</Link>
                                        <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-base font-medium text-gray-900"><Settings className="w-5 h-5 mr-3 text-gray-400" /> Settings</Link>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-100 space-y-3">
                                {!isAuthed ? (
                                    <>
                                        <Button className="w-full" onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}>Get Started</Button>
                                        <Button variant="secondary" className="w-full" onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>Login</Button>
                                    </>
                                ) : (
                                    <Button variant="danger" className="w-full" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                                        <LogOut className="w-4 h-4 mr-2" /> Logout
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
