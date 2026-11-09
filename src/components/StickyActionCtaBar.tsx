import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Phone,
  Calendar,
  Lock,
  X,
  ChevronUp,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface StickyActionCtaBarProps {
  onOpenAudit: () => void;
  onNavigate?: (path: string) => void;
}

export default function StickyActionCtaBar({
  onOpenAudit,
  onNavigate,
}: StickyActionCtaBarProps) {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal floating bar once user has scrolled past 180px
      if (window.scrollY > 180) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsApp = () => {
    // Exactly requested pre-filled message: "Hi, I'd like to know more about your tax services."
    const defaultMsg =
      language === "ar"
        ? "مرحباً، أود معرفة المزيد عن خدماتكم الضريبية والمحاسبية."
        : "Hi, I'd like to know more about your tax services.";
    const text = encodeURIComponent(defaultMsg);
    window.open(`https://wa.me/971529226958?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleConsultation = () => {
    if (onNavigate) {
      onNavigate("/contact");
    } else {
      window.location.href = "/contact";
    }
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. Mobile Bottom Sticky Touch Bar with Pre-filled WhatsApp */}
      {/* ======================================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-lg border-t border-slate-800/80 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_25px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          {/* Sticky WhatsApp Button (Green) with pre-filled message */}
          <button
            onClick={handleWhatsApp}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            aria-label="WhatsApp live advisory desk with pre-filled message"
          >
            <MessageSquare className="w-4 h-4 fill-white text-emerald-600 shrink-0" />
            <span className="truncate">{language === "ar" ? "واتساب مباشر" : "WhatsApp"}</span>
          </button>

          {/* Sticky Book a Free Consultation Button (Gold) */}
          <button
            onClick={handleConsultation}
            className="flex-[1.2] min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 active:from-gold-500 active:to-gold-600 text-navy-950 font-display font-extrabold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer border border-gold-300"
            aria-label="Book a Free Consultation"
          >
            <Calendar className="w-4 h-4 text-navy-950 shrink-0" />
            <span className="truncate">{language === "ar" ? "استشارة مجانية" : "Free Consultation"}</span>
          </button>

          {/* Direct Tap-to-Call Phone Button */}
          <a
            href="tel:+971529226958"
            className="w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 bg-white/10 active:bg-white/20 border border-white/15 text-white rounded-xl flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
            aria-label="Call +971 52 922 6958"
            title="Call +971 52 922 6958"
          >
            <Phone className="w-4 h-4 text-gold-400 shrink-0" />
          </a>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. Desktop & Tablet Floating Sticky Action Dock */}
      {/* ======================================================== */}
      {isVisible && !isDismissed && (
        <aside
          role="complementary"
          aria-label="Quick Action Floating Bar"
          className="hidden md:flex fixed bottom-5 left-1/2 -translate-x-1/2 z-40 items-center gap-3 bg-navy-950/95 backdrop-blur-xl border border-gold-500/40 text-white px-5 py-2.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.45)] transition-all duration-300 animate-slideUp"
        >
          {/* Trust & Security Badge */}
          <div className="flex items-center gap-2 border-r border-white/15 pr-4 text-[11px] font-mono text-slate-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white">256-Bit SSL</span>
            <span className="text-slate-500">·</span>
            <span className="text-gold-400">FTA Registered Agency</span>
          </div>

          {/* Action 1: Book a Free Consultation */}
          <button
            type="button"
            onClick={handleConsultation}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-display font-extrabold text-xs tracking-tight transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer border border-gold-300"
          >
            <Calendar className="w-3.5 h-3.5 text-navy-950 shrink-0" />
            <span>{language === "ar" ? "احجز استشارة مجانية" : "Book a Free Consultation"}</span>
          </button>

          {/* Action 2: WhatsApp with pre-filled message */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-tight transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white text-emerald-600 shrink-0" />
            <span>{language === "ar" ? "واتساب مباشر" : "WhatsApp"}</span>
          </button>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="ml-1 text-slate-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            aria-label="Dismiss quick action dock"
            title="Minimize"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Minimized Dock Trigger if dismissed */}
      {isVisible && isDismissed && (
        <button
          type="button"
          onClick={() => setIsDismissed(false)}
          className="hidden md:flex fixed bottom-5 right-24 z-40 items-center gap-1.5 bg-navy-950 border border-gold-500/50 text-gold-400 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg hover:bg-navy-900 transition-all cursor-pointer"
          title="Restore Quick Actions"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{language === "ar" ? "استشارة مجانية" : "Book Consultation"}</span>
          <ChevronUp className="w-3 h-3 text-gold-400" />
        </button>
      )}
    </>
  );
}
