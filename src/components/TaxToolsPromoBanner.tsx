import React from "react";
import { ArrowRight, Calculator, ShieldCheck } from "lucide-react";

interface TaxToolsPromoBannerProps {
  onNavigate?: (path: string) => void;
}

export const TaxToolsPromoBanner: React.FC<TaxToolsPromoBannerProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <section
      aria-label="UAE Tax Calculator and Fixed-Fee Accounting Packages"
      className="bg-[#070d19] text-white py-12 sm:py-14 border-t border-[#c5a059]/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Free 2026 Tax & VAT Calculator */}
          <a
            href="/uae-tax-planner"
            onClick={(e) => handleNav(e, "/uae-tax-planner")}
            className="group bg-[#0d1b2a] rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-5 transition-all hover:bg-[#112236] shadow-xl"
            style={{ border: "1px solid #c5a059" }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#dec18c]">
                  FREE INTERACTIVE 2026 UAE TOOL
                </span>
                <span className="w-9 h-9 rounded-xl bg-[#070d19] border border-[#c5a059]/45 flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4 text-[#c5a059]" />
                </span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#ffffff] leading-snug group-hover:text-[#dec18c] transition-colors">
                Free 2026 UAE Corporate Tax &amp; 5% VAT Calculator
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                Calculate Mainland 9% tax, 0% Small Business Relief (up to AED 3M), Free Zone 0% QFZP De Minimis, and
                Form 201 Input VAT recovery in 30 seconds.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-display font-bold text-[#c5a059] group-hover:text-[#dec18c]">
              <span>Calculate Your Tax in 30 Seconds</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </a>

          {/* Column 2: Fixed-Fee Accounting & Tax Packages */}
          <a
            href="/pricing"
            onClick={(e) => handleNav(e, "/pricing")}
            className="group bg-[#0d1b2a] rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-5 transition-all hover:bg-[#112236] shadow-xl"
            style={{ border: "1px solid #c5a059" }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#dec18c]">
                  TRANSPARENT FIXED FEES · FROM AED 400/MONTH
                </span>
                <span className="w-9 h-9 rounded-xl bg-[#070d19] border border-[#c5a059]/45 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                </span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#ffffff] leading-snug group-hover:text-[#dec18c] transition-colors">
                Fixed-Fee Accounting, VAT &amp; Corporate Tax Retainers
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                Dedicated chartered accountant, IFRS books, quarterly 5% VAT 201 &amp; annual EmaraTax Corporate Tax
                filing. From AED 400/month with zero hidden hourly fees.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-display font-bold text-[#c5a059] group-hover:text-[#dec18c]">
              <span>Explore Packages (From AED 400/month)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TaxToolsPromoBanner;
