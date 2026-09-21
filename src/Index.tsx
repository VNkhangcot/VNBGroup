import React, { useState, useEffect } from 'react';
import { useScroll, motion } from 'framer-motion';
import Scene3D from './components/3d/Scene3D';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Services3DSection from './components/Services3DSection';
import TechMatrixSection from './components/TechMatrixSection';
import StatsSection from './components/StatsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

import { useLanguage } from './context/LanguageContext';

export const Index: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [activeSection, setActiveSection] = useState('hero');
  const { t } = useLanguage();

  const navDots = [
    { id: 'hero', label: t.hud.hero },
    { id: 'services', label: t.hud.services },
    { id: 'tech-matrix', label: t.hud.techMatrix },
    { id: 'about', label: t.hud.about },
    { id: 'contact', label: t.hud.contact },
  ];

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      let current = 'hero';
      if (latest < 0.18) current = 'hero';
      else if (latest < 0.45) current = 'services';
      else if (latest < 0.70) current = 'tech-matrix';
      else if (latest < 0.88) current = 'about';
      else current = 'contact';

      setActiveSection((prev) => (prev !== current ? current : prev));
    });
  }, [scrollYProgress]);

  const scrollToSection = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#FF5500]/30 selection:text-white font-sans overflow-x-hidden">
      {/* Three.js Luxury 3D Kinetic Sculpture Background Scene */}
      <Scene3D scrollYProgress={scrollYProgress} />

      {/* Global High-Tech Navigation */}
      <Navbar />

      {/* Vertical 3D Section Navigator HUD (Desktop) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3 pointer-events-auto">
        {navDots.map((dot) => {
          const isActive = activeSection === dot.id;
          return (
            <button
              key={dot.id}
              onClick={() => scrollToSection(dot.id)}
              className="flex items-center gap-3 group cursor-pointer"
              aria-label={dot.label}
            >
              <span
                className={`text-[11px] font-mono tracking-wider transition-all duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap shrink-0 ${
                  isActive ? 'opacity-100 text-[#FF5500] font-bold' : 'text-neutral-500'
                }`}
              >
                {dot.label}
              </span>
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-3 h-3 bg-[#FF5500] shadow-[0_0_12px_#FF5500]'
                    : 'bg-white/20 group-hover:bg-white/60'
                }`}
              />
            </button>
          );
        })}
        {/* Solid Luxury Orange Progress line (No multi-color gradient) */}
        <div className="w-[2px] h-20 bg-white/10 rounded-full mt-2 relative overflow-hidden self-center mr-1">
          <motion.div
            className="w-full bg-[#FF5500] origin-top h-full"
            style={{ scaleY: scrollYProgress }}
          />
        </div>
      </div>

      {/* Main Content Sections */}
      <main className="relative z-10">
        <HeroSection />
        <Services3DSection />
        <TechMatrixSection />
        <StatsSection />
        <ContactSection />
      </main>

      {/* Corporate Footer */}
      <Footer />
    </div>
  );
};

export default Index;
