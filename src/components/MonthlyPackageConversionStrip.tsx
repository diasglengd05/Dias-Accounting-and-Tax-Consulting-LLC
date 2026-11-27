import React from "react";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";

interface MonthlyPackageConversionStripProps {
  onNavigate: (path: string) => void;
  /** Compact variant blends cleanly inside narrower editorial containers like blog posts */
  compact?: boolean;
}

const WHATSAPP_PACKAGES_URL =
  "https://wa.me/971529226958?text=Hi%20DiasUAE%2C%20I%20would%20like%20to%20discuss%20your%20Business%20Starter%20%28AED%20400%2Fmo%29%20and%20Corporate%20Growth%20%28VAT%20%2B%20CT%29%20packages.";

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
          ? "mt-10 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-6 sm:p-8 text-[#0D1B2A] shadow-xs"
          : "bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#FFFFFF] border-t border-[#E2E8F0] py-12 lg:py-16 text-[#0D1B2A]"
      }
    >
      <div className={compact ? "space-y-6" : "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"}>
        <div
          className={
            compact
              ? "space-y-5"
              : "rounded-2xl bg-white border border-[#E2E8F0] p-7 sm:p-9 lg:p-10 shadow-[0_8px_28px_-12px_rgba(13,27,42,0.08)]"
          }
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#856422]">
                <ShieldCheck className="w-4 h-4 text-[#1B4332] shrink-0" />
                <span>DiasUAE Fixed-Fee Monthly Retainers · FTA-Registered Tax Agents</span>
              </div>

              <h2 className="font-display text-2xl sm:text-[26px] font-bold text-[#0D1B2A] tracking-tight leading-snug">
                Need Monthly Accounting, 5% VAT &amp; Corporate Tax Handled for One Fixed Fee?
              </h2>

              <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                Choose{" "}
                <strong className="text-[#0D1B2A] font-semibold tabular-nums">
                  Business Starter (AED 400/mo)
                </strong>{" "}
                or scale seamlessly with{" "}
                <strong className="text-[#0D1B2A] font-semibold">
                  Corporate Growth (VAT + CT)
                </strong>
                —combining monthly IFRS bookkeeping,{" "}
                <a
                  href="/services/vat-compliance"
                  onClick={(e) => handleLinkClick(e, "/services/vat-compliance")}
                  className="text-[#1B4332] hover:text-[#143326] font-semibold underline underline-offset-4 decoration-[#1B4332]/40 transition-colors"
                >
                  UAE 5% VAT Filing &amp; Compliance
                </a>
                , and{" "}
                <a
                  href="/services/corporate-tax-advisory"
                  onClick={(e) => handleLinkClick(e, "/services/corporate-tax-advisory")}
                  className="text-[#1B4332] hover:text-[#143326] font-semibold underline underline-offset-4 decoration-[#1B4332]/40 transition-colors"
                >
                  UAE Corporate Tax Advisory &amp; Registration
                </a>{" "}
                under one transparent fixed monthly plan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-stretch gap-2.5 shrink-0">
              <a
                href="/pricing"
                onClick={(e) => handleLinkClick(e, "/pricing")}
                className="min-h-[46px] px-6 py-3 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-xs no-underline"
              >
                <span>View Monthly Packages</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
              <a
                href={WHATSAPP_PACKAGES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#1B4332] text-[#0D1B2A] hover:text-[#1B4332] font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap no-underline"
              >
                <MessageCircle className="w-4 h-4 text-[#1B4332] shrink-0" />
                <span className="tabular-nums">WhatsApp +971 52 922 6958</span>
              </a>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#E2E8F0] flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm">
            <a
              href="/pricing"
              onClick={(e) => handleLinkClick(e, "/pricing")}
              className="inline-flex items-center gap-1.5 text-[#0D1B2A] hover:text-[#1B4332] font-semibold transition-colors no-underline"
            >
              <span>Business Starter (AED 400/mo) &amp; Corporate Growth (VAT + CT)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#1B4332]" />
            </a>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">
              |
            </span>
            <a
              href="/services/vat-compliance"
              onClick={(e) => handleLinkClick(e, "/services/vat-compliance")}
              className="inline-flex items-center gap-1.5 text-[#475569] hover:text-[#1B4332] font-medium transition-colors no-underline"
            >
              <span>UAE 5% VAT Filing &amp; Compliance</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#1B4332]" />
            </a>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">
              |
            </span>
            <a
              href="/services/corporate-tax-advisory"
              onClick={(e) => handleLinkClick(e, "/services/corporate-tax-advisory")}
              className="inline-flex items-center gap-1.5 text-[#475569] hover:text-[#1B4332] font-medium transition-colors no-underline"
            >
              <span>UAE Corporate Tax Advisory &amp; Registration</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#1B4332]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyPackageConversionStrip;
