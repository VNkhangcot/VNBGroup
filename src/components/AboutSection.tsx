import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const AboutSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={ref}
      className="bg-black pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden relative bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-start">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-white/40 text-sm tracking-widest uppercase mb-8 md:mb-10 font-medium"
        >
          About Us
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight max-w-5xl"
        >
          Pioneering <span className="font-serif italic text-white/60">ideas</span> for{' '}
          <br className="hidden md:inline" />
          <span className="font-serif italic text-white/60">
            minds that create, build, and inspire.
          </span>
        </motion.h2>
      </div>
    </section>
  );
};

export default AboutSection;
