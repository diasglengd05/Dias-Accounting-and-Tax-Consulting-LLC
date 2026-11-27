import React from "react";
import { Calculator, MessageCircle } from "lucide-react";

interface MobileConversionBarProps {
  onNavigate: (path: string) => void;
}

const MOBILE_WHATSAPP_URL =
  "https://wa.me/971529226958?text=Hi%20Dias%20Accounting%2C%20I%20visited%20diasuae.ae%20and%20would%20like%20a%20free%2015-minute%20tax%20%26%20accounting%20quote.";

export const MobileConversionBar: React.FC<MobileConversionBarProps> = ({
  onNavigate,
}) => {
  return (
    <div
      role="region"
      aria-label="Quick mobile actions"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-[0_-8px_24px_rgba(13,27,42,0.08)] px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
        <a
          href="/uae-tax-planner"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("/uae-tax-planner");
          }}
          className="h-11 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0D1B2A] font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
        >
          <Calculator className="w-4 h-4 text-[#1B4332] shrink-0" />
          <span>Free Tax Calc</span>
        </a>
        <a
          href={MOBILE_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-xs"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>WhatsApp Advisor</span>
        </a>
      </div>
    </div>
  );
};

export default MobileConversionBar;
