import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ServiceCardData {
  tag: string;
  title: string;
  description: string;
  videoUrl: string;
}

const services: ServiceCardData[] = [
  {
    tag: 'Strategy',
    title: 'Research & Insight',
    description:
      'We dig deep into data, culture, and human behavior to surface the insights that drive meaningful, lasting change.',
    videoUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
  },
  {
    tag: 'Craft',
    title: 'Design & Execution',
    description:
      'From concept to launch, we obsess over every detail to deliver experiences that feel effortless and look extraordinary.',
    videoUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4',
  },
];

export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-black py-28 md:py-40 px-6 overflow-hidden relative bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl text-white tracking-tight font-normal">
            What we do
          </h2>
          <span className="text-white/40 text-sm hidden md:inline-block tracking-widest uppercase font-medium">
            Our services
          </span>
        </motion.div>

        {/* Two-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: 'easeOut' }}
              className="liquid-glass rounded-3xl overflow-hidden group flex flex-col cursor-pointer"
            >
              {/* Card video area */}
              <div className="relative aspect-video overflow-hidden bg-neutral-950">
                <video
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  src={service.videoUrl}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>

              {/* Card body */}
              <div className="p-6 md:p-8 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="uppercase tracking-widest text-white/40 text-xs font-semibold">
                      {service.tag}
                    </span>
                    <div className="liquid-glass rounded-full p-2 text-white/70 group-hover:text-white transition-colors">
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                  <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight font-medium">
                    {service.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
