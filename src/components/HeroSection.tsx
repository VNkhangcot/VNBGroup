import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Activity, Layers, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-32 pb-20 text-center overflow-hidden z-10">
      {/* Subtle dark backdrop to ensure 100% text legibility against cosmic black hole */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.65)_0%,_rgba(0,0,0,0.25)_50%,_transparent_80%)] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Top Telemetry Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="liquid-glass rounded-full px-5 py-1.5 flex items-center gap-2 mb-8 border border-[#FF5500]/30 shadow-sm whitespace-nowrap"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping shrink-0" />
          <span className="w-2 h-2 rounded-full bg-[#FF5500] -ml-4 shrink-0" />
          <span className="text-xs uppercase tracking-widest text-white/80 font-mono font-medium whitespace-nowrap">
            {t.hero.badge}
          </span>
          <Star className="w-3 h-3 text-[#FF5500] fill-[#FF5500] ml-1 shrink-0" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[1.08] mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
        >
          {t.hero.title1}{' '}
          <span className="font-serif italic font-normal text-[#FF5500]">
            {t.hero.titleHighlight}
          </span>{' '}
          {t.hero.title2}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl leading-relaxed mb-10 font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          {t.hero.descPart1}{' '}
          <span className="text-white font-semibold">{t.hero.highlightSoftware}</span>,{' '}
          <span className="text-[#FF5500] font-semibold">{t.hero.highlightAI}</span>,{' '}
          <span className="text-white font-semibold">{t.hero.highlightCloud}</span> {t.hero.descPart1 ? 'và ' : ''}
          <span className="text-[#FF5500] font-semibold">{t.hero.highlightSecurity}</span>{' '}
          {t.hero.descPart2}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16"
        >
          <a
            href="#services"
            className="w-full sm:w-auto bg-[#FF5500] hover:bg-[#FF6611] text-black font-bold text-sm px-8 py-4 rounded-full shadow-[0_4px_25px_rgba(255,85,0,0.4)] hover:shadow-[0_4px_35px_rgba(255,85,0,0.6)] transition-all flex items-center justify-center gap-2 group cursor-pointer whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">{t.hero.exploreBtn}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-black shrink-0" />
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto liquid-glass border border-white/15 text-white font-medium text-sm px-8 py-4 rounded-full hover:bg-white/10 hover:border-[#FF5500]/50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg whitespace-nowrap shrink-0"
          >
            <Layers className="w-4 h-4 text-[#FF5500] shrink-0" />
            <span className="whitespace-nowrap">{t.hero.consultBtn}</span>
          </a>
        </motion.div>

        {/* Live Telemetry HUD Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-left"
        >
          <div className="liquid-glass rounded-2xl p-4 border border-white/10 bg-black/40">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono mb-1 whitespace-nowrap">
              <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="whitespace-nowrap">{t.hero.telemetry.slaLabel}</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-white font-mono whitespace-nowrap">{t.hero.telemetry.slaValue}</div>
            <div className="text-[11px] text-white/50">{t.hero.telemetry.slaDesc}</div>
          </div>

          <div className="liquid-glass rounded-2xl p-4 border border-white/10 bg-black/40">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono mb-1 whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
              <span className="whitespace-nowrap">{t.hero.telemetry.isoLabel}</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-white font-mono whitespace-nowrap">{t.hero.telemetry.isoValue}</div>
            <div className="text-[11px] text-white/50">{t.hero.telemetry.isoDesc}</div>
          </div>

          <div className="liquid-glass rounded-2xl p-4 border border-white/10 bg-black/40">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono mb-1 whitespace-nowrap">
              <Star className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
              <span className="whitespace-nowrap">{t.hero.telemetry.aiLabel}</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-white font-mono whitespace-nowrap">{t.hero.telemetry.aiValue}</div>
            <div className="text-[11px] text-white/50">{t.hero.telemetry.aiDesc}</div>
          </div>

          <div className="liquid-glass rounded-2xl p-4 border border-white/10 bg-black/40">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono mb-1 whitespace-nowrap">
              <Layers className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
              <span className="whitespace-nowrap">{t.hero.telemetry.projectLabel}</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-white font-mono whitespace-nowrap">{t.hero.telemetry.projectValue}</div>
            <div className="text-[11px] text-white/50">{t.hero.telemetry.projectDesc}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
