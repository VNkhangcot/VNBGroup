import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Terminal, Cpu, Workflow, GitBranch } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const categoryIcons: Record<string, React.ElementType> = {
  backend: Terminal,
  'ai-data': Cpu,
  'cloud-sre': Workflow,
  frontend: GitBranch,
};

export const TechMatrixSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('backend');
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const activeCategory =
    t.techMatrix.categories.find((c) => c.id === activeTab) || t.techMatrix.categories[0];

  return (
    <section
      id="tech-matrix"
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden z-10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-[#FF5500] text-xs font-mono tracking-widest uppercase mb-3 font-semibold"
          >
            {t.techMatrix.tag}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6"
          >
            {t.techMatrix.title}{' '}
            <span className="font-serif italic text-[#FF5500] font-normal">
              {t.techMatrix.titleHighlight}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-neutral-400 text-sm md:text-base leading-relaxed"
          >
            {t.techMatrix.desc}
          </motion.p>
        </div>

        {/* Category Tabs (Solid luxury orange active state, no gradients) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {t.techMatrix.categories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Terminal;
            const isActive = cat.id === activeTab;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs md:text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer border whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#FF5500] text-black border-[#FF5500] shadow-[0_4px_20px_rgba(255,85,0,0.35)]'
                    : 'liquid-glass border-white/10 text-white/70 hover:text-white hover:border-[#FF5500]/40'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-[#FF5500]'}`} />
                <span className="whitespace-nowrap">{cat.name}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content Cards */}
        <motion.div
          key={activeCategory.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="liquid-glass rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              {activeCategory.name}
            </h3>
            <p className="text-neutral-400 text-sm">{activeCategory.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCategory.skills.map((skill) => (
              <div
                key={skill.name}
                className="liquid-glass rounded-2xl p-5 border border-white/5 hover:border-[#FF5500]/50 transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-white text-base group-hover:text-[#FF5500] transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                    {skill.level}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">{skill.tag}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechMatrixSection;
