import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../constants';

export const Footer = () => {
    return (
        <footer className="bg-gray-950 text-white pt-12 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

                    {/* Brand Col */}
                    <div className="flex flex-col">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-white text-black flex items-center justify-center font-mono font-bold text-xs rounded-sm">
                                R
                            </div>
                            <span className="font-mono font-bold text-lg tracking-tight text-white flex items-center">
                                Referral<span className="text-gray-400">Hub</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                            The premier platform connecting ambitious talent with industry insiders for quality referrals.
                        </p>
                    </div>

                    {/* Links Col */}
                    <div className="flex flex-col">
                        <h4 className="font-semibold text-white mb-4 tracking-wide text-sm">Platform</h4>
                        <ul className="space-y-3">
                            <li><Link to="/browse" className="text-sm text-gray-400 hover:text-white transition-colors">Browse Listings</Link></li>
                            <li><Link to="/how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
                            <li><Link to="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Social / Contact Col */}
                    <div className="flex flex-col">
                        <h4 className="font-semibold text-white mb-4 tracking-wide text-sm">Connect</h4>
                        <ul className="space-y-3">
                            <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Twitter / X</a></li>
                            <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">LinkedIn</a></li>
                            <li><a href="mailto:support@referralhub.com" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Support</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} {APP_NAME} Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
