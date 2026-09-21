import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  brandName?: string;
  brandHighlight?: string;
  brandSub?: string;
  brandSubClassName?: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  withText = true,
  brandName = 'VNB',
  brandHighlight = 'GROUP',
  brandSub = 'HOLDINGS & TECHNOLOGY',
  brandSubClassName = '',
  className = '',
}) => {
  // Dimensions for the icon container
  const iconDimensions = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-11 h-11 sm:w-12 sm:h-12',
    xl: 'w-14 h-14 sm:w-16 sm:h-16',
  };

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const subSizes = {
    sm: 'text-[7px]',
    md: 'text-[8px] sm:text-[9px]',
    lg: 'text-[9px] sm:text-[10px]',
    xl: 'text-[11px] sm:text-[12px]',
  };

  return (
    <div className={`flex items-center gap-3 sm:gap-3.5 group shrink-0 ${className}`}>
      {/* Luxury Corporate Emblem Badge */}
      <div
        className={`relative ${iconDimensions[size]} rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#181820] via-[#0E0E14] to-[#08080C] border border-white/15 group-hover:border-[#E5A823]/60 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.6)] group-hover:shadow-[0_4px_24px_rgba(229,168,35,0.25)] overflow-hidden shrink-0 flex items-center justify-center`}
      >
        {/* Subtle obsidian reflective sheen with champagne gold tone */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] via-transparent to-[#F5C042]/[0.10] opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5 relative z-10 transition-transform duration-300 group-hover:scale-[1.03]"
        >
          <defs>
            {/* Left Primary Facet - Pure Crisp Platinum White */}
            <linearGradient id="facetPlatinumWhite" x1="10" y1="12" x2="24" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>

            {/* Left Lower Bevel - Solid Sculpted Platinum Silver */}
            <linearGradient id="facetPlatinumBevel" x1="17" y1="26" x2="24" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Right Primary Facet - Luxury 24K Royal Gold Gradient */}
            <linearGradient id="facetRoyalGold" x1="24" y1="24" x2="38" y2="12" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFE68C" />
              <stop offset="35%" stopColor="#F5C042" />
              <stop offset="75%" stopColor="#E5A823" />
              <stop offset="100%" stopColor="#C68712" />
            </linearGradient>

            {/* Right Lower Bevel - Deep Solid Amber Gold Bronze */}
            <linearGradient id="facetGoldBevel" x1="24" y1="26" x2="30" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D99414" />
              <stop offset="100%" stopColor="#8C5807" />
            </linearGradient>

            {/* Crest Diamond - Pure Brilliant Diamond Light */}
            <linearGradient id="crestDiamond" x1="24" y1="6" x2="24" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            {/* Subtle drop shadow filter for architectural depth */}
            <filter id="monolithShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* FACET 1: Left Wing Main (Crisp Platinum White) */}
          <path
            d="M 10 13 L 19 13 L 24 25 L 16 28 Z"
            fill="url(#facetPlatinumWhite)"
            filter="url(#monolithShadow)"
          />

          {/* FACET 2: Left Wing Lower Anchor (Solid Sculpted Platinum Silver) */}
          <path
            d="M 16 28 L 24 25 L 24 38 L 19 38 Z"
            fill="url(#facetPlatinumBevel)"
          />

          {/* FACET 3: Right Wing Main (Luxury 24K Royal Gold) */}
          <path
            d="M 38 13 L 29 13 L 24 25 L 32 28 Z"
            fill="url(#facetRoyalGold)"
            filter="url(#monolithShadow)"
          />

          {/* FACET 4: Right Wing Lower Anchor (Deep Amber Gold Bronze) */}
          <path
            d="M 32 28 L 24 25 L 24 38 L 29 38 Z"
            fill="url(#facetGoldBevel)"
          />

          {/* CENTER CREST: Architectural Floating Diamond (Precision Apex) */}
          <path
            d="M 24 8 L 28 14 L 24 20 L 20 14 Z"
            fill="url(#crestDiamond)"
            filter="url(#monolithShadow)"
          />

          {/* DIAMOND REFLECTION LINE */}
          <line
            x1="24"
            y1="8"
            x2="24"
            y2="20"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            strokeOpacity="0.9"
          />

          {/* Subtle central precision separator line */}
          <line
            x1="24"
            y1="25"
            x2="24"
            y2="38"
            stroke="#0A0A0E"
            strokeWidth="0.75"
          />
        </svg>
      </div>

      {/* Luxury Corporate Typography */}
      {withText && (
        <div className="flex flex-col shrink-0 select-none">
          <div className="flex items-baseline tracking-tight whitespace-nowrap leading-none">
            <span
              className={`text-white font-black ${textSizes[size]} tracking-[0.06em] uppercase`}
            >
              {brandName}
            </span>
            <span
              className={`text-[#E5A823] font-light ${textSizes[size]} tracking-[0.20em] uppercase ml-1.5 transition-colors group-hover:text-[#F5C042]`}
            >
              {brandHighlight}
            </span>
          </div>
          {brandSub && (
            <span
              className={`${subSizes[size]} uppercase tracking-[0.24em] text-white/50 group-hover:text-white/70 transition-colors font-mono font-medium mt-1 whitespace-nowrap ${brandSubClassName}`}
            >
              {brandSub}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
