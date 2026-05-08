import React from 'react';
import { motion } from 'motion/react';

export default function SectionDivider() {
  return (
    <div className="w-full flex justify-center py-12 md:py-20 bg-transparent overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="flex items-center space-x-4 w-full max-w-7xl px-6 md:px-12"
      >
        <div className="h-[1px] bg-black/10 flex-grow"></div>
        <div className="w-2 h-2 rotate-45 border border-black/30"></div>
        <div className="h-[1px] bg-black/10 flex-grow"></div>
      </motion.div>
    </div>
  );
}
