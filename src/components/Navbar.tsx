import React, { useState, useEffect } from 'react';
import { ChevronRight, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import type { Language } from '../i18n/translations';

const languages: { code: Language; label: string; name: string }[] = [
  { code: 'vi', label: 'VI', name: 'Tiếng Việt' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'zh', label: 'ZH', name: '中文' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 transition-all duration-300">
      <nav
        className={`liquid-glass rounded-full max-w-6xl mx-auto px-4 sm:px-6 xl:px-8 py-3 flex items-center justify-between gap-2 sm:gap-4 border border-white/10 transition-all duration-300 ${
          scrolled ? 'bg-[#050505]/85 shadow-[0_8px_32px_rgba(0,0,0,0.8)]' : 'bg-white/[0.02]'
        }`}
      >
        {/* Brand Logo */}
        <a href="#" className="shrink-0">
          <BrandLogo
            size="md"
            brandName="VNB"
            brandHighlight="Group"
            brandSub={t.nav.brandSub}
            brandSubClassName="hidden xl:block"
          />
        </a>

        {/* Desktop Nav Links - Single-line anti-wrap standard */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-6 shrink-0">
          <a
            href="#services"
            className="text-xs xl:text-sm font-medium text-white/75 hover:text-[#FF5500] transition-colors whitespace-nowrap shrink-0 px-1 py-0.5"
          >
            {t.nav.ecosystem}
          </a>
          <a
            href="#tech-matrix"
            className="text-xs xl:text-sm font-medium text-white/75 hover:text-[#FF5500] transition-colors whitespace-nowrap shrink-0 px-1 py-0.5"
          >
            {t.nav.techMatrix}
          </a>
          <a
            href="#stats"
            className="text-xs xl:text-sm font-medium text-white/75 hover:text-[#FF5500] transition-colors whitespace-nowrap shrink-0 px-1 py-0.5"
          >
            {t.nav.stats}
          </a>
          <a
            href="#about"
            className="text-xs xl:text-sm font-medium text-white/75 hover:text-[#FF5500] transition-colors whitespace-nowrap shrink-0 px-1 py-0.5"
          >
            {t.nav.about}
          </a>
        </div>

        {/* Right side controls: Language switcher + Action Button */}
        <div className="hidden md:flex items-center gap-2 xl:gap-3 shrink-0">
          {/* Language Switcher Pill */}
          <div className="flex items-center p-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono shrink-0">
            {languages.map((item) => {
              const isActive = language === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#FF5500] text-black shadow-[0_0_10px_rgba(255,85,0,0.5)]'
                      : 'text-white/60 hover:text-white'
                  }`}
                  title={item.name}
                  aria-label={`Switch to ${item.name}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <a
            href="#contact"
            className="bg-[#FF5500] hover:bg-[#FF6611] text-black rounded-full px-3.5 xl:px-5 py-2 xl:py-2.5 text-[11px] xl:text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 transition-all shadow-[0_4px_20px_rgba(255,85,0,0.25)] hover:shadow-[0_4px_25px_rgba(255,85,0,0.45)] cursor-pointer group shrink-0 whitespace-nowrap"
          >
            <span className="whitespace-nowrap">{t.nav.consultBtn}</span>
            <ChevronRight className="w-3.5 h-3.5 text-black transition-transform group-hover:translate-x-0.5 shrink-0" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white/80 hover:text-white shrink-0"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 max-w-md mx-auto liquid-glass rounded-2xl p-6 border border-white/10 flex flex-col gap-4 bg-[#050505]/95">
          {/* Mobile Language Selector */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs text-white/60 font-mono">LANGUAGE:</span>
            <div className="flex gap-2">
              {languages.map((item) => {
                const isActive = language === item.code;
                return (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#FF5500] text-black'
                        : 'bg-white/5 text-white/70 border border-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-white/90 hover:text-[#FF5500] py-2 border-b border-white/5"
          >
            {t.nav.ecosystem}
          </a>
          <a
            href="#tech-matrix"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-white/90 hover:text-[#FF5500] py-2 border-b border-white/5"
          >
            {t.nav.techMatrix}
          </a>
          <a
            href="#stats"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-white/90 hover:text-[#FF5500] py-2 border-b border-white/5"
          >
            {t.nav.stats}
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-white/90 hover:text-[#FF5500] py-2 border-b border-white/5"
          >
            {t.nav.about}
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center bg-[#FF5500] text-black font-bold rounded-xl py-3 text-xs uppercase tracking-wider shadow-md"
          >
            {t.nav.consultBtn}
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
