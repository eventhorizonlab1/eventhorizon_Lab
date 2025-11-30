import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
    const [isHovering, setIsHovering] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Ressort pour un suivi fluide (Lag effect)
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16); // Centrer (32px / 2)
            cursorY.set(e.clientY - 16);
        };

        const handleMouseOver = (e: MouseEvent) => {
            // Détecte si l'élément survolé est interactif
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.closest('.cursor-pointer')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    // Masquer sur mobile/touch
    if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        return null;
    }

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
            }}
        >
            {/* Cercle principal */}
            <motion.div
                className="w-full h-full border border-white rounded-full flex items-center justify-center"
                animate={{
                    scale: isHovering ? 2.5 : 1,
                    backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    borderColor: isHovering ? 'transparent' : 'white'
                }}
                transition={{ duration: 0.2 }}
            >
                {/* Point central (viseur) */}
                <motion.div
                    className="w-1 h-1 bg-white rounded-full"
                    animate={{ scale: isHovering ? 0 : 1 }}
                />
            </motion.div>

            {/* Label contextuel (Optionnel) */}
            <motion.span
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[10px] font-mono text-white uppercase tracking-widest whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 1 : 0 }}
            >
                OPEN
            </motion.span>
        </motion.div>
    );
};

export default CustomCursor;
