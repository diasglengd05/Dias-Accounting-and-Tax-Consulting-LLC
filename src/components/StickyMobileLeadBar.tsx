import React from "react";
import { MessageSquare, Phone, ShieldCheck } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface StickyMobileLeadBarProps {
  onOpenAudit: () => void;
}

export default function StickyMobileLeadBar({ onOpenAudit }: StickyMobileLeadBarProps) {
  const { t, language } = useLanguage();

  const handleWhatsApp = () => {
    const defaultMsg = language === "ar"
      ? "مرحباً أستاذ غلين، أود الحصول على استشارة بخصوص ضريبة الشركات ومسك الدفاتر لشركتي في الإمارات."
      : "Hi Glen! I am looking for UAE Corporate Tax and Bookkeeping support for my business. Can we talk?";
    const text = encodeURIComponent(defaultMsg);
    window.open(`https://wa.me/971529226958?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-lg border-t border-slate-800/80 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        
        {/* WhatsApp Button (Green) - 44px touch target */}
        <button
          onClick={handleWhatsApp}
          className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          aria-label={t.mobileBar.whatsapp}
        >
          <MessageSquare className="w-4 h-4 fill-white text-emerald-600 shrink-0" />
          <span className="truncate">{t.mobileBar.whatsapp}</span>
        </button>

        {/* Free Audit Button (Gold) - 44px touch target */}
        <button
          onClick={onOpenAudit}
          className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-gold-400 to-gold-500 active:from-gold-500 active:to-gold-600 text-navy-950 font-display font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          aria-label={t.mobileBar.taxAudit}
        >
          <ShieldCheck className="w-4 h-4 text-navy-950 shrink-0" />
          <span className="truncate">{t.mobileBar.taxAudit}</span>
        </button>

        {/* Quick Phone Call Button - 44px x 44px touch target */}
        <a
          href="tel:+971529226958"
          className="w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 bg-white/10 active:bg-white/20 border border-white/15 text-white rounded-xl flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
          aria-label={t.mobileBar.callDirectly}
        >
          <Phone className="w-4 h-4 text-gold-400 shrink-0" />
        </a>

      </div>
    </div>
  );
}
