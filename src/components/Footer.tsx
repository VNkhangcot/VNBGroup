import React from 'react';
import { Shield, Award, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-white/10 bg-[#050505] pt-16 pb-12 px-6 overflow-hidden z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <BrandLogo
                size="lg"
                brandName="VNB"
                brandHighlight="Group"
                brandSub={t.nav.brandSub}
              />
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm mb-4 font-normal">
              {t.footer.desc}
            </p>

            <div className="flex flex-col gap-1 text-xs text-neutral-400 mb-5 font-mono">
              <a href="mailto:phamkhang1234549@gmail.com" className="hover:text-[#FF5500] transition-colors">
                ✉ phamkhang1234549@gmail.com
              </a>
              <a href="tel:0345603279" className="hover:text-emerald-400 transition-colors">
                ☎ Hotline: 0345 603 279
              </a>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-white/50">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 whitespace-nowrap shrink-0">
                <Shield className="w-3 h-3 text-emerald-400" /> {t.footer.isoBadge}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 whitespace-nowrap shrink-0">
                <Award className="w-3 h-3 text-[#FF5500]" /> {t.footer.socBadge}
              </span>
            </div>
          </div>

          {/* Col 1 */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 font-mono whitespace-nowrap">
              {t.footer.colEcosystemTitle}
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-neutral-400">
              <li>
                <a href="#services" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.enterpriseSoftware}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.aiLlm}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.cloudSre}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.cybersecurity}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.fintech}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.bigData}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 font-mono whitespace-nowrap">
              {t.footer.colCoreTechTitle}
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-neutral-400">
              <li>
                <a href="#tech-matrix" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.microservices}
                </a>
              </li>
              <li>
                <a href="#tech-matrix" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.ragAgentic}
                </a>
              </li>
              <li>
                <a href="#tech-matrix" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.k8s}
                </a>
              </li>
              <li>
                <a href="#tech-matrix" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.zeroTrust}
                </a>
              </li>
              <li>
                <a href="#tech-matrix" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.tddCleanCode}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 font-mono whitespace-nowrap">
              {t.footer.colCorporateTitle}
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-neutral-400">
              <li>
                <a href="#about" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.aboutUs}
                </a>
              </li>
              <li>
                <a href="#stats" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.milestones}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.contactSchedule}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.privacyPolicy}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
                  {t.footer.links.termsOfService}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p className="whitespace-nowrap">© {new Date().getFullYear()} VNBGroup Corporation. {t.footer.rights}</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-400 whitespace-nowrap shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t.footer.operational}
            </span>
            <span className="whitespace-nowrap shrink-0">{t.footer.locations}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
