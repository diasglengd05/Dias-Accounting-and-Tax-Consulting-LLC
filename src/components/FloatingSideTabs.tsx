import React from "react";
import { useLanguage } from "../i18n/LanguageContext";

interface FloatingSideTabsProps {
  onBookConsultation: () => void;
  onViewPricing: () => void;
}

export const FloatingSideTabs: React.FC<FloatingSideTabsProps> = ({
  onBookConsultation,
  onViewPricing,
}) => {
  const { language } = useLanguage();

  return (
    <div
      className="fixed top-1/2 -translate-y-1/2 left-0 z-40 flex flex-col gap-2.5 pointer-events-auto transition-all duration-300"
      aria-label="Quick Actions Navigation"
    >
      {/* 1. Book Free Consultation Tab (Luxury Navy & Gold) */}
      <button
        type="button"
        id="btn-floating-book-consultation"
        onClick={onBookConsultation}
        className="group relative flex items-center justify-center bg-gradient-to-b from-[#070d19] via-[#0d1b2a] to-[#1a3050] hover:from-[#0d1b2a] hover:to-[#1e293b] text-gold-400 py-4 px-2 sm:py-5 sm:px-2.5 shadow-[0_4px_20px_rgba(7,13,25,0.6)] hover:shadow-[0_6px_24px_rgba(197,160,89,0.35)] transition-all duration-200 cursor-pointer border border-gold-500/40 border-l-0 rounded-r-xl hover:translate-x-1 active:scale-95"
        title={language === "ar" ? "احجز استشارة مجانية" : "Book Free Consultation"}
        aria-label={language === "ar" ? "احجز استشارة مجانية" : "Book Free Consultation"}
      >
        <span
          className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-gold-300 group-hover:text-gold-200 select-none whitespace-nowrap drop-shadow-sm"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          {language === "ar" ? "احجز استشارة مجانية" : "BOOK FREE CONSULTATION"}
        </span>
      </button>

      {/* 2. View Pricing Tab (Prestigious Gold Accent) */}
      <button
        type="button"
        id="btn-floating-view-pricing"
        onClick={onViewPricing}
        className="group relative flex items-center justify-center bg-gradient-to-b from-[#dec18c] via-[#c5a059] to-[#a7833f] hover:from-[#f6f0e2] hover:to-[#c5a059] text-navy-950 py-3.5 px-2 sm:py-4 sm:px-2.5 shadow-[0_4px_20px_rgba(197,160,89,0.4)] hover:shadow-[0_6px_24px_rgba(197,160,89,0.6)] transition-all duration-200 cursor-pointer border border-gold-300/80 border-l-0 rounded-r-xl hover:translate-x-1 active:scale-95"
        title={language === "ar" ? "عرض الأسعار" : "View Pricing"}
        aria-label={language === "ar" ? "عرض الأسعار" : "View Pricing"}
      >
        <span
          className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-navy-950 select-none whitespace-nowrap"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          {language === "ar" ? "عرض الأسعار" : "VIEW PRICING"}
        </span>
      </button>
    </div>
  );
};

export default FloatingSideTabs;
