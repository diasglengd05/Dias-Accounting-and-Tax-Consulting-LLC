import React from "react";
import { ArrowRight, Calculator, MessageCircle, ShieldCheck } from "lucide-react";

interface BlogInstantAdvisorStripProps {
  onNavigate?: (path: string) => void;
  onBeforeNavigate?: () => void;
}

const WHATSAPP_BLOG_URL =
  "https://wa.me/971529226958?text=Hi%20Dias%20Accounting%2C%20I%20read%20your%20guide%20on%20diasuae.ae%20and%20would%20like%20a%20consultation.";

export const BlogInstantAdvisorStrip: React.FC<BlogInstantAdvisorStripProps> = ({
  onNavigate,
  onBeforeNavigate,
}) => {
  const handleCalculatorClick = (e: React.MouseEvent) => {
    if (onBeforeNavigate) onBeforeNavigate();
    if (onNavigate) {
      e.preventDefault();
      onNavigate("/uae-tax-planner");
    }
  };

  return (
    <aside
      aria-label="Instant Advisor and UAE Tax Calculator"
      className="not-prose my-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] border-l-[3px] border-l-[#C5A059] p-5 sm:p-6 shadow-sm text-left"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#856422]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1B4332] shrink-0" />
            <span>FTA-REGISTERED TAX AGENCY · SHAMS HQ &amp; DUBAI</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#0D1B2A] leading-snug m-0">
            Need an FTA-Registered Tax Agent in Dubai or Sharjah?
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed m-0">
            Fixed-fee IFRS bookkeeping, 5% VAT, 9% Corporate Tax &amp; Dividend Audits starting from AED 400/month.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <a
            href={WHATSAPP_BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white font-display font-bold text-xs sm:text-[13px] px-4 sm:px-5 py-3 transition-colors whitespace-nowrap no-underline shadow-xs"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>WhatsApp Advisor Now</span>
          </a>

          <a
            href="/uae-tax-planner"
            onClick={handleCalculatorClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#1B4332] text-[#0D1B2A] hover:text-[#1B4332] font-display font-bold text-xs sm:text-[13px] px-4 sm:px-5 py-3 transition-colors whitespace-nowrap no-underline"
          >
            <Calculator className="w-4 h-4 text-[#1B4332] shrink-0" />
            <span>Free 2026 Tax Calculator</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#1B4332] shrink-0" />
          </a>
        </div>
      </div>
    </aside>
  );
};

export default BlogInstantAdvisorStrip;
