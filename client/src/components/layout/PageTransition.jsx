import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const PageTransition = ({ children }) => {
    const location = useLocation();

    return (
        <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full flex-1 flex flex-col min-h-screen relative"
        >
            {children}
        </motion.div>
    );
};
