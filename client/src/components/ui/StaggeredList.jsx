import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export const StaggeredList = ({ children, className }) => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={className}
        >
            {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child)) return child;
                return (
                    <motion.div key={index} variants={itemVariants}>
                        {child}
                    </motion.div>
                );
            })}
        </motion.div>
    );
};
