import React from "react";
import { MessageSquare, Phone, ShieldCheck, Sparkles } from "lucide-react";

interface StickyMobileLeadBarProps {
  onOpenAudit: () => void;
}

export default function StickyMobileLeadBar({ onOpenAudit }: StickyMobileLeadBarProps) {
  const handleWhatsApp = () => {
    const text = encodeURIComponent("Hi Glen! I am looking for UAE Corporate Tax and Bookkeeping support for my business. Can we talk?");
    window.open(`https://wa.me/971529226958?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-lg border-t border-slate-800/80 px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        
        {/* WhatsApp Button (Green) */}
        <button
          onClick={handleWhatsApp}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
          <span>WhatsApp Glen</span>
        </button>

        {/* Free Audit Button (Gold) */}
        <button
          onClick={onOpenAudit}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-gold-400 to-gold-500 active:from-gold-500 active:to-gold-600 text-navy-950 font-display font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          aria-label="Free Tax Audit"
        >
          <ShieldCheck className="w-4 h-4 text-navy-950" />
          <span>Free Tax Audit</span>
        </button>

        {/* Quick Phone Call Button */}
        <a
          href="tel:+971529226958"
          className="w-10 h-10 shrink-0 bg-white/10 active:bg-white/20 border border-white/15 text-white rounded-xl flex items-center justify-center transition-transform active:scale-95"
          aria-label="Call Dias Accounting directly"
        >
          <Phone className="w-4 h-4 text-gold-400" />
        </a>

      </div>
    </div>
  );
}
