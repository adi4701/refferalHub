import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-black">
            <Navbar />
            <main className="flex-1 flex flex-col mt-14">
                {/* mt-14 offsets the 56px (h-14) fixed navbar */}
                {children}
            </main>
            <Footer />
        </div>
    );
};
