import React from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface FloatingSideTabsProps {
  onBookConsultation?: () => void;
  onViewPricing?: () => void;
  onNavigate?: (path: string) => void;
}

export const FloatingSideTabs: React.FC<FloatingSideTabsProps> = ({
  onBookConsultation,
  onViewPricing,
  onNavigate,
}) => {
  const { language } = useLanguage();

  const handleBookConsultation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBookConsultation) {
      onBookConsultation();
      return;
    }
    if (onNavigate) {
      onNavigate("/contact");
      return;
    }
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/contact");
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleViewPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onViewPricing) {
      onViewPricing();
      return;
    }
    if (onNavigate) {
      onNavigate("/pricing");
      return;
    }
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/pricing");
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className="hidden md:flex fixed top-1/2 -translate-y-1/2 left-0 z-40 flex-col gap-2.5 pointer-events-auto transition-all duration-300"
      aria-label="Quick Actions Navigation"
    >
      {/* 1. Book Free Consultation Tab (Luxury Navy & Gold) */}
      <button
        type="button"
        id="btn-floating-book-consultation"
        onClick={handleBookConsultation}
        className="group relative flex items-center justify-center bg-gradient-to-b from-[#070d19] via-[#0d1b2a] to-[#1a3050] hover:from-[#0d1b2a] hover:to-[#1e293b] text-gold-400 py-4 px-2 sm:py-5 sm:px-2.5 shadow-[0_4px_20px_rgba(7,13,25,0.6)] hover:shadow-[0_6px_24px_rgba(197,160,89,0.35)] transition-all duration-200 cursor-pointer border border-gold-500/40 border-l-0 rounded-r-xl hover:translate-x-1.5 active:scale-95"
        title={language === "ar" ? "الانتقال إلى صفحة حجز الاستشارة المجانية" : "Go to Book Free Consultation Landing Page"}
        aria-label={language === "ar" ? "الانتقال إلى صفحة حجز الاستشارة المجانية" : "Go to Book Free Consultation Landing Page"}
      >
        <span
          className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-gold-300 group-hover:text-gold-200 select-none whitespace-nowrap drop-shadow-sm flex items-center gap-1.5"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          {language === "ar" ? "احجز استشارة مجانية" : "BOOK FREE CONSULTATION"}
        </span>

        {/* Floating Tooltip Indicator */}
        <span className="hidden md:group-hover:flex absolute left-full ml-2 z-50 items-center gap-1.5 px-3 py-1.5 bg-navy-950 text-gold-300 text-xs font-semibold rounded-lg shadow-xl border border-gold-500/30 whitespace-nowrap pointer-events-none transition-opacity">
          <span>{language === "ar" ? "فتح صفحة الاستشارة" : "Open Consultation Page"}</span>
          <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
        </span>
      </button>

      {/* 2. View Pricing Tab (Prestigious Gold Accent - Zero Sticker Shock Reassurance) */}
      <button
        type="button"
        id="btn-floating-view-pricing"
        onClick={handleViewPricing}
        className="group relative flex items-center justify-center bg-gradient-to-b from-[#dec18c] via-[#c5a059] to-[#a7833f] hover:from-[#f6f0e2] hover:to-[#c5a059] text-navy-950 py-3.5 px-2 sm:py-4 sm:px-2.5 shadow-[0_4px_20px_rgba(197,160,89,0.4)] hover:shadow-[0_6px_24px_rgba(197,160,89,0.6)] transition-all duration-200 cursor-pointer border border-gold-300/80 border-l-0 rounded-r-xl hover:translate-x-1.5 active:scale-95"
        title={language === "ar" ? "الانتقال إلى صفحة باقات الأسعار (من 500 د.إ)" : "Go to Pricing Packages Landing Page (From AED 500)"}
        aria-label={language === "ar" ? "الانتقال إلى صفحة باقات الأسعار (من 500 د.إ)" : "Go to Pricing Packages Landing Page (From AED 500)"}
      >
        <span
          className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-navy-950 select-none whitespace-nowrap flex items-center gap-1.5"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          {language === "ar" ? "الأسعار (من 500 د.إ)" : "PRICING (FROM AED 500)"}
        </span>

        {/* Floating Tooltip Indicator */}
        <span className="hidden md:group-hover:flex absolute left-full ml-2 z-50 items-center gap-1.5 px-3 py-1.5 bg-navy-950 text-gold-300 text-xs font-semibold rounded-lg shadow-xl border border-gold-500/30 whitespace-nowrap pointer-events-none transition-opacity">
          <span>{language === "ar" ? "فتح صفحة باقات الأسعار" : "Open Pricing Packages Page"}</span>
          <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
        </span>
      </button>
    </div>
  );
};

export default FloatingSideTabs;
