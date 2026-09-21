import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState<string>(t.contact.serviceOptions[0]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });

  // Sync default selected service when language changes if not custom picked
  useEffect(() => {
    setSelectedService(t.contact.serviceOptions[0]);
  }, [t.contact.serviceOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        fullName: '',
        company: '',
        email: '',
        phone: '',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <section id="contact" className="relative py-32 px-6 overflow-hidden z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-[#FF5500] text-xs font-mono tracking-widest uppercase mb-3 font-semibold">
                {t.contact.tag}
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
                {t.contact.title}{' '}
                <span className="font-serif italic text-[#FF5500] font-normal">
                  {t.contact.titleHighlight}
                </span>
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-10 font-normal">
                {t.contact.desc}
              </p>

              {/* Direct Info List */}
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white/40 text-xs font-mono uppercase">{t.contact.emailLabel}</div>
                    <div className="text-white font-medium text-sm">contact@vnbgroup.vn</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white/40 text-xs font-mono uppercase">{t.contact.hotlineLabel}</div>
                    <div className="text-white font-medium text-sm">+84 (0) 24 8888 9999</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white/40 text-xs font-mono uppercase">{t.contact.hqLabel}</div>
                    <div className="text-white font-medium text-sm">{t.contact.hqValue}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Badge */}
            <div className="liquid-glass rounded-2xl p-5 border border-white/10 mt-10 flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#F59E0B] shrink-0" />
              <div className="text-xs text-neutral-300">
                <span className="text-white font-semibold block">{t.contact.slaTitle}</span>
                {t.contact.slaDesc}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="liquid-glass rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl relative">
              <h3 className="text-2xl font-bold text-white mb-2">{t.contact.formTitle}</h3>
              <p className="text-neutral-400 text-xs sm:text-sm mb-8">
                {t.contact.formDesc}
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-6">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">{t.contact.successTitle}</h4>
                  <p className="text-neutral-300 text-sm max-w-md">
                    {t.contact.successDesc}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Service Chips */}
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-white/60 block mb-3">
                      {t.contact.serviceLabel}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {t.contact.serviceOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedService(opt)}
                          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer border whitespace-nowrap shrink-0 ${
                            selectedService === opt
                              ? 'bg-[#FF5500] text-black border-[#FF5500] font-bold shadow-[0_2px_15px_rgba(255,85,0,0.35)]'
                              : 'bg-white/5 text-white/70 border-white/10 hover:border-[#FF5500]/40'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/60 block mb-2">{t.contact.nameLabel}</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder={t.contact.namePlaceholder}
                        className="w-full bg-[#050505]/70 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#FF5500] outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/60 block mb-2">{t.contact.companyLabel}</label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder={t.contact.companyPlaceholder}
                        className="w-full bg-[#050505]/70 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#FF5500] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/60 block mb-2">{t.contact.emailLabelInput}</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t.contact.emailPlaceholder}
                        className="w-full bg-[#050505]/70 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#FF5500] outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/60 block mb-2">{t.contact.phoneLabelInput}</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={t.contact.phonePlaceholder}
                        className="w-full bg-[#050505]/70 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#FF5500] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/60 block mb-2">{t.contact.messageLabel}</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.contact.messagePlaceholder}
                      className="w-full bg-[#050505]/70 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#FF5500] outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button (Solid luxury orange) */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FF5500] hover:bg-[#FF6611] text-black font-bold py-4 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(255,85,0,0.35)] hover:shadow-[0_4px_35px_rgba(255,85,0,0.5)] transition-all cursor-pointer active:scale-[0.99] whitespace-nowrap"
                  >
                    {loading ? (
                      <span className="animate-pulse whitespace-nowrap">{t.contact.submittingBtn}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black shrink-0" />
                        <span className="whitespace-nowrap">{t.contact.submitBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
