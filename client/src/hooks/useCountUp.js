import { useState, useEffect } from 'react';

export const useCountUp = (end, durationMs = 1500) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        let animationFrame;
        const targetNumber = parseInt(end, 10);

        if (isNaN(targetNumber)) {
            setCount(end);
            return;
        }

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            // easeOutQuart 
            const easeOut = 1 - Math.pow(1 - progress / durationMs, 4);
            const currentCount = Math.min(Math.floor(easeOut * targetNumber), targetNumber);

            setCount(currentCount);

            if (progress < durationMs) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(targetNumber);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, durationMs]);

    return count;
};
