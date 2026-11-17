import React from "react";
import { ArrowRight, Calculator, CheckCircle2, ShieldCheck } from "lucide-react";

interface QuickAnswersPricingTableProps {
  onNavigate?: (path: string) => void;
  variant?: "homepage" | "pricing";
}

export const QuickAnswersPricingTable: React.FC<QuickAnswersPricingTableProps> = ({
  onNavigate,
  variant = "homepage",
}) => {
  const handleNav = (e: React.MouseEvent, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <section
      aria-labelledby="quick-answers-pricing-heading"
      className="bg-[#070d19] text-white py-14 sm:py-16 border-t border-[#c5a059]/25"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0d1b2a] border border-[#c5a059]/45 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-[#c5a059]">
                <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                <span>FTA-REGISTERED TAX AGENCY · SHAMS HQ · SERVING DUBAI &amp; ALL UAE EMIRATES</span>
              </div>
              <h2
                id="quick-answers-pricing-heading"
                className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
              >
                Quick Answers &amp; Transparent UAE Pricing
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                Fixed-fee accounting, 5% VAT Form 201, and 9% Corporate Tax compliance by{" "}
                <strong className="text-[#dec18c]">Dias Accounting and Tax Consulting LLC</strong> (led by FTA-Registered
                Tax Agent Glen Dias). Zero hidden hourly fees.
              </p>
            </div>

            {variant === "homepage" ? (
              <a
                href="/pricing"
                onClick={(e) => handleNav(e, "/pricing")}
                className="inline-flex items-center gap-2 self-start lg:self-auto px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
              >
                <span>View All Packages</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <a
                href="/uae-tax-planner"
                onClick={(e) => handleNav(e, "/uae-tax-planner")}
                className="inline-flex items-center gap-2 self-start lg:self-auto px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
              >
                <Calculator className="w-4 h-4" />
                <span>Open 2026 Tax Calculator</span>
              </a>
            )}
          </div>

          {/* Semantic HTML Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#070d19]">
            <table className="w-full text-left border-collapse">
              <caption className="sr-only">
                Quick Answers and Transparent UAE Fixed-Fee Accounting, VAT, and Corporate Tax Pricing from Dias
                Accounting and Tax Consulting LLC
              </caption>
              <thead>
                <tr className="border-b border-[#c5a059]/30 bg-[#0d1b2a]/80">
                  <th
                    scope="col"
                    className="py-3.5 px-5 text-xs font-mono font-bold uppercase tracking-wider text-[#dec18c]"
                  >
                    UAE Accounting, Tax &amp; Compliance Service
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-5 text-xs font-mono font-bold uppercase tracking-wider text-[#dec18c]"
                  >
                    Transparent Fee / Access
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-5 text-xs font-mono font-bold uppercase tracking-wider text-[#dec18c] hidden md:table-cell"
                  >
                    Scope &amp; Jurisdiction Coverage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                <tr className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 px-5 font-semibold text-white">
                    Monthly IFRS Bookkeeping + 5% VAT + 9% Corporate Tax
                  </td>
                  <td className="py-4 px-5 font-mono font-bold text-[#c5a059] whitespace-nowrap">
                    From AED 400/month
                  </td>
                  <td className="py-4 px-5 text-xs text-[#cbd5e1] hidden md:table-cell">
                    Fixed-fee monthly retainers for Dubai Mainland, SHAMS, IFZA, DMCC, DTEC &amp; DIFC (zero hidden
                    hourly fees).
                  </td>
                </tr>

                <tr className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 px-5 font-semibold text-white">
                    UAE Corporate Tax Registration &amp; 0% Small Business Relief (up to AED 3M)
                  </td>
                  <td className="py-4 px-5 font-mono font-bold text-[#c5a059] whitespace-nowrap">
                    Fixed-fee filing
                  </td>
                  <td className="py-4 px-5 text-xs text-[#cbd5e1] hidden md:table-cell">
                    EmaraTax CT TRN registration, AED 10,000 penalty protection review, and 0% SBR election through 31
                    December 2029.
                  </td>
                </tr>

                <tr className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 px-5 font-semibold text-white">
                    <a
                      href="/tax-planning-difc"
                      onClick={(e) => handleNav(e, "/tax-planning-difc")}
                      className="hover:text-[#dec18c] transition-colors"
                    >
                      DIFC &amp; DTEC 0% QFZP Compliance &amp; Dividend Distribution Audits
                    </a>
                  </td>
                  <td className="py-4 px-5 font-mono font-bold text-[#c5a059] whitespace-nowrap">
                    Specialized advisory
                  </td>
                  <td className="py-4 px-5 text-xs text-[#cbd5e1] hidden md:table-cell">
                    0% Qualifying Free Zone Person substance &amp; De Minimis testing, transfer pricing, and statutory
                    dividend audits.
                  </td>
                </tr>

                <tr className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 px-5 font-semibold text-white">
                    Free 2026 UAE Tax &amp; VAT Calculator
                  </td>
                  <td className="py-4 px-5 font-mono font-bold text-[#c5a059]">
                    <a
                      href="/uae-tax-planner"
                      onClick={(e) => handleNav(e, "/uae-tax-planner")}
                      className="underline decoration-[#c5a059]/60 hover:text-[#dec18c] transition-colors"
                    >
                      Available free at /uae-tax-planner
                    </a>
                  </td>
                  <td className="py-4 px-5 text-xs text-[#cbd5e1] hidden md:table-cell">
                    Instant Mainland 9% / 0% SBR, Free Zone QFZP De Minimis, and 5% UAE VAT input recovery calculator.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Summary Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-[#cbd5e1]">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Headquartered in Sharjah Media City (SHAMS)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>WhatsApp: +971 52 922 6958 · info@diasuae.ae</span>
              </span>
            </div>
            <a
              href="/#contact"
              onClick={(e) => handleNav(e, "/#contact")}
              className="text-[#dec18c] hover:text-[#c5a059] font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>Book Free 15-Min Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickAnswersPricingTable;
