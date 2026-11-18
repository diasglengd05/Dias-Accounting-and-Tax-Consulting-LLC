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
      className="not-prose my-5 rounded-2xl bg-[#0d1b2a] p-5 sm:p-6 shadow-xl text-left"
      style={{ border: "1px solid #c5a059" }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#dec18c]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
            <span>FTA-REGISTERED TAX AGENCY · SHAMS HQ &amp; DUBAI</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#ffffff] leading-snug m-0">
            Need an FTA-Registered Tax Agent in Dubai or Sharjah?
          </h2>
          <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed m-0">
            Fixed-fee IFRS bookkeeping, 5% VAT, 9% Corporate Tax &amp; Dividend Audits starting from AED 400/month.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <a
            href={WHATSAPP_BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-extrabold text-xs sm:text-[13px] px-4 sm:px-5 py-3 transition-colors whitespace-nowrap no-underline shadow-md shadow-[#c5a059]/15"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>WhatsApp Advisor Now</span>
          </a>

          <a
            href="/uae-tax-planner"
            onClick={handleCalculatorClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-transparent hover:bg-[#c5a059]/12 text-[#ffffff] font-display font-bold text-xs sm:text-[13px] px-4 sm:px-5 py-3 transition-colors whitespace-nowrap no-underline"
            style={{ border: "1px solid #c5a059" }}
          >
            <Calculator className="w-4 h-4 text-[#c5a059] shrink-0" />
            <span>Free 2026 Tax Calculator</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
          </a>
        </div>
      </div>
    </aside>
  );
};

export default BlogInstantAdvisorStrip;
