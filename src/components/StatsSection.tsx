import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Users, Server, Globe2, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const metricIcons = [Users, Server, Globe2, Trophy];

export const StatsSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden z-10"
    >
      <div className="max-w-6xl mx-auto">
        {/* About Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-[#FF5500] text-xs font-mono uppercase tracking-widest mb-4 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.stats.tag}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6"
            >
              {t.stats.title}{' '}
              <span className="font-serif italic text-[#FF5500] font-normal">
                {t.stats.titleHighlight}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-neutral-300 text-base leading-relaxed mb-6 font-normal"
            >
              {t.stats.p1}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-neutral-400 text-sm leading-relaxed"
            >
              {t.stats.p2}
            </motion.p>
          </div>

          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="liquid-glass rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="text-white/40 text-xs font-mono uppercase tracking-widest mb-6">
                {t.stats.quoteTag}
              </div>
              <blockquote className="text-xl md:text-2xl font-light text-white leading-relaxed mb-6">
                {t.stats.quote}
              </blockquote>
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="w-11 h-11 rounded-full bg-[#FF5500] flex items-center justify-center font-bold text-black text-sm shadow-md">
                  VNB
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.stats.boardTitle}</div>
                  <div className="text-white/50 text-xs">{t.stats.boardDesc}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div id="stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.stats.metrics.map((m, index) => {
            const Icon = metricIcons[index] || Users;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="liquid-glass rounded-3xl p-8 border border-white/10 hover:border-[#FF5500]/50 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center mb-6 text-[#FF5500] group-hover:bg-[#FF5500]/20 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-4xl md:text-5xl font-extrabold text-white font-mono tracking-tight mb-2 group-hover:text-[#FF5500] transition-colors">
                    {m.value}
                  </div>
                  <div className="text-white font-semibold text-base mb-2">{m.label}</div>
                </div>
                <p className="text-neutral-400 text-xs leading-relaxed mt-4 pt-4 border-t border-white/5">
                  {m.sublabel}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
