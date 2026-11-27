import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

interface MonthlyPackageConversionStripProps {
  onNavigate: (path: string) => void;
  /** Compact variant blends cleanly inside narrower editorial containers like blog posts */
  compact?: boolean;
}

export const MonthlyPackageConversionStrip: React.FC<MonthlyPackageConversionStripProps> = ({
  onNavigate,
  compact = false,
}) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <section
      aria-label="Monthly UAE Accounting, VAT and Corporate Tax Packages"
      className={
        compact
          ? "mt-10 rounded-2xl bg-[#070d19] border border-[#c5a059]/35 p-6 sm:p-8 text-white shadow-sm"
          : "bg-[#070d19] border-t border-[#c5a059]/25 py-12 lg:py-16 text-white"
      }
    >
      <div className={compact ? "space-y-6" : "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"}>
        <div
          className={
            compact
              ? "space-y-5"
              : "rounded-2xl bg-[#0d1b2a] border border-[#c5a059]/35 p-7 sm:p-9 lg:p-10 shadow-sm"
          }
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#c5a059]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>DiasUAE Fixed-Fee Monthly Retainers · FTA-Registered Tax Agents</span>
              </div>

              <h2 className="font-display text-2xl sm:text-[26px] font-bold text-white tracking-tight leading-snug">
                Need Monthly Accounting, 5% VAT &amp; Corporate Tax Handled for One Fixed Fee?
              </h2>

              <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed">
                Bundle monthly IFRS bookkeeping,{" "}
                <a
                  href="/services/vat-compliance"
                  onClick={(e) => handleLinkClick(e, "/services/vat-compliance")}
                  className="text-[#c5a059] hover:text-[#e6c884] font-semibold underline underline-offset-4 decoration-[#c5a059]/60 transition-colors"
                >
                  UAE 5% VAT Filing &amp; Compliance
                </a>
                , and{" "}
                <a
                  href="/services/corporate-tax-advisory"
                  onClick={(e) => handleLinkClick(e, "/services/corporate-tax-advisory")}
                  className="text-[#c5a059] hover:text-[#e6c884] font-semibold underline underline-offset-4 decoration-[#c5a059]/60 transition-colors"
                >
                  UAE Corporate Tax Advisory &amp; Registration
                </a>{" "}
                into a single predictable monthly plan—starting from{" "}
                <strong className="text-white font-semibold tabular-nums">AED 400/month</strong>{" "}
                for Business Starter or scaling seamlessly with Corporate Growth.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-stretch gap-3 shrink-0">
              <a
                href="/pricing"
                onClick={(e) => handleLinkClick(e, "/pricing")}
                className="min-h-[46px] px-6 py-3 rounded-xl bg-[#c5a059] hover:bg-[#b58f47] text-[#070d19] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-xs"
              >
                <span>View Monthly Packages</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm">
            <a
              href="/pricing"
              onClick={(e) => handleLinkClick(e, "/pricing")}
              className="inline-flex items-center gap-1.5 text-white hover:text-[#c5a059] font-semibold transition-colors"
            >
              <span>Business Starter &amp; Corporate Growth Pricing</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
            </a>
            <span className="hidden sm:inline text-white/25" aria-hidden="true">
              |
            </span>
            <a
              href="/services/vat-compliance"
              onClick={(e) => handleLinkClick(e, "/services/vat-compliance")}
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-[#c5a059] font-medium transition-colors"
            >
              <span>UAE 5% VAT Filing &amp; Compliance</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
            </a>
            <span className="hidden sm:inline text-white/25" aria-hidden="true">
              |
            </span>
            <a
              href="/services/corporate-tax-advisory"
              onClick={(e) => handleLinkClick(e, "/services/corporate-tax-advisory")}
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-[#c5a059] font-medium transition-colors"
            >
              <span>UAE Corporate Tax Advisory &amp; Registration</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyPackageConversionStrip;
