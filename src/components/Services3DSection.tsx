import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Code2,
  Brain,
  Cloud,
  ShieldCheck,
  Coins,
  Database,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const serviceIcons: Record<string, React.ElementType> = {
  software: Code2,
  ai: Brain,
  cloud: Cloud,
  security: ShieldCheck,
  fintech: Coins,
  data: Database,
};

interface ServiceCardProps {
  service: {
    id: string;
    tag: string;
    title: string;
    desc: string;
    features: string[];
    stats: string;
  };
  impactLabel: string;
  index: number;
}

// Interactive 3D Tilt Card (Smooth RAF 3D tilt, no React state spam)
const ServiceCard: React.FC<ServiceCardProps> = ({ service, impactLabel, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const frameRef = useRef<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((y - centerY) / centerY) * -8;
      const rotY = ((x - centerX) / centerX) * 8;

      cardRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(12px)`;
      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(350px circle at ${x}px ${y}px, rgba(255, 85, 0, 0.14), transparent 70%)`;
      }
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    cancelAnimationFrame(frameRef.current);
    if (cardRef.current) {
      cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
    setIsHovered(false);
  };

  const IconComponent = serviceIcons[service.id] || Code2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="perspective-1000"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
        }}
        className={`liquid-glass rounded-3xl p-8 h-full flex flex-col justify-between border transition-all duration-300 group cursor-pointer relative overflow-hidden transform-style-3d shadow-2xl ${
          isHovered ? 'border-[#FF5500]/50' : 'border-white/10'
        }`}
      >
        {/* Subtle warm amber spotlight glare (No rainbow gradient) */}
        <div
          ref={glareRef}
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Card Header */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border bg-[#FF5500]/10 border-[#FF5500]/30 text-[#FF5500] group-hover:border-[#FF5500] group-hover:bg-[#FF5500]/20 transition-all duration-300">
              <IconComponent className="w-6 h-6 text-[#FF5500]" />
            </div>

            <div className="liquid-glass rounded-full p-2.5 text-white/50 group-hover:text-white group-hover:border-[#FF5500]/40 transition-all">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          <span className="text-[11px] font-mono tracking-widest font-semibold uppercase block mb-2 text-[#FF5500]">
            {service.tag}
          </span>

          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors">
            {service.title}
          </h3>

          <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-normal">
            {service.desc}
          </p>
        </div>

        {/* Card Footer: Features & Metric */}
        <div>
          <div className="border-t border-white/10 pt-4 mb-4 flex flex-col gap-2">
            {service.features.map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-xs text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
                <span className="leading-snug">{feat}</span>
              </div>
            ))}
          </div>

          {/* Luxury Anti-Overflow Metric Badge */}
          <div className="rounded-2xl p-3.5 bg-gradient-to-r from-[#FF5500]/12 via-[#FF5500]/[0.04] to-white/[0.02] border border-[#FF5500]/25 flex flex-col gap-1.5 transition-all duration-300 group-hover:border-[#FF5500]/50 group-hover:from-[#FF5500]/18">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-white/50 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse shrink-0" />
              <span className="truncate">{impactLabel}</span>
            </div>
            <div className="text-xs font-mono font-bold text-[#FF5500] tracking-tight leading-snug">
              {service.stats}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Services3DSection: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative py-32 px-6 overflow-hidden z-10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-[#FF5500] text-xs font-mono tracking-widest uppercase mb-3 font-semibold"
            >
              {t.services.tag}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight"
            >
              {t.services.title}{' '}
              <span className="font-serif italic text-neutral-400 font-normal">
                {t.services.titleHighlight}
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-neutral-400 text-sm md:text-base max-w-md leading-relaxed"
          >
            {t.services.desc}
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {t.services.items.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              impactLabel={t.services.businessImpact}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services3DSection;
