import React, { useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  FileCheck2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Calculator,
  Award,
} from "lucide-react";
import DiasLogo from "../components/DiasLogo";

interface PageProps {
  onNavigate?: (path: string) => void;
}

export const SmallBusinessTaxReliefPage: React.FC<PageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = "Small Business Corporate Tax Relief Dubai | Dias UAE";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Comprehensive advisory on UAE Small Business Relief (SBR) under Ministerial Decision No. 73/2023. SBR extended through Dec 31, 2029 for businesses with gross revenue up to AED 3M, 0% corporate tax rate, and EmaraTax registration support."
    );

    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleBackHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate("/");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-gold-500 selection:text-navy-950">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={handleBackHome}
              className="group flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-navy-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gold-500 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </a>
            <span className="text-slate-300">|</span>
            <a href="/" onClick={handleBackHome} className="flex items-center">
              <DiasLogo className="w-10 h-10" showText={true} textSize="text-xl" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:+971529226958"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy-950 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-gold-500" />
              <span>+971 52 922 6958</span>
            </a>
            <a
              href="mailto:info@diasuae.ae?subject=Inquiry%20regarding%20Small%20Business%20Tax%20Relief%20Dubai"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-navy-900 to-navy-950 hover:from-navy-950 hover:to-navy-900 text-white font-bold px-4 py-2 rounded-xl text-xs tracking-wide shadow-md transition-all border border-gold-500/40 hover:border-gold-400 active:scale-95"
            >
              <Mail className="w-3.5 h-3.5 text-gold-400" />
              <span>Contact Now (info@diasuae.ae)</span>
            </a>
          </div>
        </div>
      </header>

      {/* Breadcrumb Bar */}
      <div className="bg-slate-100/80 border-b border-slate-200/60 py-2.5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <a href="/" onClick={handleBackHome} className="hover:text-navy-950 transition-colors">
            Home
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <a href="/#services" onClick={handleBackHome} className="hover:text-navy-950 transition-colors">
            Corporate Tax Services
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-navy-950 font-semibold">Small Business Tax Relief (SBR)</span>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 text-white py-20 overflow-hidden">
        {/* Ambient Gold Grid Background */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Official UAE MoF Directive: SBR Extended to December 31, 2029</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-4xl leading-tight">
            Small Business Corporate Tax Relief Dubai: <span className="text-gold-400">0% Tax</span> on Revenue up to AED 3,000,000
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
            Under <strong>Federal Decree-Law No. 47 of 2022 (Article 21)</strong> and <strong>Ministerial Decision No. 73 of 2023</strong>, qualifying UAE mainland and free zone businesses with gross revenue equal to or below AED 3 Million can legally elect for zero taxable income. Secure your statutory exemption with our FTA-registered tax agents.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="mailto:info@diasuae.ae?subject=Small%20Business%20Tax%20Relief%20Audit%20and%20Election%20Request"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-6 py-3.5 rounded-xl text-sm shadow-xl hover:shadow-gold-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Request SBR Filing Support (info@diasuae.ae)</span>
            </a>
            <a
              href="tel:+971529226958"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl text-sm border border-white/15 transition-all"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              <span>Call Senior Tax Agent (+971 52 922 6958)</span>
            </a>
          </div>

          {/* Core Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-gold-400 font-display block">AED 3.0M</span>
              <span className="text-xs text-slate-300">Gross Revenue Ceiling</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display block">0.0%</span>
              <span className="text-xs text-slate-300">Effective Corporate Tax Rate</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-gold-400 font-display block">Dec 31, 2029</span>
              <span className="text-xs text-slate-300">Statutory Extension Horizon</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-display block">Article 21</span>
              <span className="text-xs text-slate-300">EmaraTax Statutory Election</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Content: SBR Key Rules & Actionable Insights */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 flex-1">
        
        {/* Critical Advisory Notice */}
        <div className="bg-amber-50 border-l-4 border-gold-500 rounded-r-2xl p-6 shadow-sm flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-gold-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-navy-950 font-display">
              Critical Compliance Warning: Small Business Relief is NOT Automatic
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Many business owners mistakenly assume that generating under AED 3,000,000 exempts them from filing. Under FTA regulations, you <strong>must register for UAE Corporate Tax</strong>, obtain an active CT TRN, maintain compliant double-entry books, and <strong>actively tick the SBR election box on the EmaraTax portal</strong> within 9 months of your financial year-end. Failure to file incurs a statutory late return penalty of AED 500 per month (up to AED 1,000/mo) and forfeiture of the 0% rate.
            </p>
          </div>
        </div>

        {/* Section 1: Detailed Breakdown */}
        <section className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Statutory Framework</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              Understanding UAE Small Business Relief (SBR)
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              The UAE Ministry of Finance established the SBR regime to encourage entrepreneurship, reduce accounting overhead, and support SMEs throughout Dubai, Abu Dhabi, Sharjah, and Northern Emirates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-navy-950 font-display">Gross Revenue Test</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gross revenue across the current tax period and all previous tax periods starting on or after June 1, 2023 must not exceed AED 3,000,000. Once revenue exceeds this ceiling, standard corporate tax rules apply for that period and subsequent periods.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-navy-950 font-display">Transfer Pricing Simplification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Eligible businesses electing for SBR are exempt from preparing extensive Transfer Pricing Local Files and Master Files under Article 55, while still adhering to the basic arm's length principle for connected person transactions.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-700">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-navy-950 font-display">Excluded Entities</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                SBR cannot be claimed by Qualifying Free Zone Persons (QFZPs) enjoying the 0% regime on Qualifying Income, or constituent entities of Multinational Enterprise (MNE) groups with consolidated global revenues exceeding AED 3.15 Billion.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Comparison Matrix */}
        <section className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Comparative Analysis</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              Small Business Relief vs. Standard 9% Corporate Tax
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-navy-950 text-white font-display text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">Compliance Parameter</th>
                  <th className="p-4 text-gold-400">Small Business Relief (Article 21)</th>
                  <th className="p-4 text-slate-300">Standard Corporate Tax (9%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-navy-950">Tax Liability</td>
                  <td className="p-4 font-bold text-emerald-600">0% (Treated as No Taxable Income)</td>
                  <td className="p-4">9% on taxable net profit above AED 375,000</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-navy-950">Revenue Limitation</td>
                  <td className="p-4 font-bold text-navy-900">Gross revenue ≤ AED 3,000,000</td>
                  <td className="p-4">No revenue ceiling</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-navy-950">EmaraTax Filing Requirement</td>
                  <td className="p-4 text-navy-900">Mandatory (Simplified return with SBR election)</td>
                  <td className="p-4">Mandatory (Standard comprehensive return)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-navy-950">Transfer Pricing Master/Local File</td>
                  <td className="p-4 font-bold text-emerald-600">Fully Exempt</td>
                  <td className="p-4">Mandatory if revenue exceeds AED 200 Million</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-navy-950">Tax Loss Carry-Forward</td>
                  <td className="p-4 text-slate-500">Tax losses cannot be carried forward during relief years</td>
                  <td className="p-4 text-navy-900">Up to 75% taxable income offset per period</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-navy-950">General Anti-Abuse Rules (Article 50)</td>
                  <td className="p-4 font-bold text-amber-600">Applies (Artificial entity splitting prohibited)</td>
                  <td className="p-4">Applies across all connected transactions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: How Dias Accounting Secures Your Relief */}
        <section className="bg-navy-900 text-white rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <Award className="w-80 h-80 text-gold-400" />
          </div>

          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Client Protection Roadmap</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              How Dias Accounting Secures Your SBR Exemption
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Avoid penalties and accidental disqualification. Our chartered tax agents manage the complete compliance cycle:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-gold-400 font-bold text-lg font-display">01. Revenue Audit</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rigorous reconciliation of 12-month bank statements and sales ledgers to confirm gross revenue does not exceed AED 3,000,000.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-gold-400 font-bold text-lg font-display">02. Anti-Abuse Review</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Evaluating sister companies and connected persons under Article 50 to prevent FTA audit flags on artificial revenue splitting.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-gold-400 font-bold text-lg font-display">03. EmaraTax Election</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct submission of your Corporate Tax Return with the legal Article 21 Small Business Relief election through the official FTA portal.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-gold-400 font-bold text-lg font-display">04. 7-Year Archival</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Packaging your financial ledgers and trial balances into the statutory 7-year audit file required by Federal Decree-Law No. 28.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4 relative z-10">
            <a
              href="mailto:info@diasuae.ae?subject=Book%20Free%20SBR%20Eligibility%20Check"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-all active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Email Us: info@diasuae.ae</span>
            </a>
            <a
              href="tel:+971529226958"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Speak to Glen Dias directly at +971 52 922 6958</span>
            </a>
          </div>
        </section>

        {/* Section 4: FAQ */}
        <section className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Expert Guidance</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              Frequently Asked Questions: UAE Small Business Relief
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
              <h3 className="font-bold text-base text-navy-950 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Does Small Business Relief apply to UAE Free Zone companies?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                Yes, provided the Free Zone company is NOT claiming the 0% Qualifying Free Zone Person (QFZP) regime under Cabinet Decision No. 55 of 2023. If a Free Zone company has non-qualifying mainland income, electing SBR is often an optimal legal strategy to achieve 0% corporate tax without meeting complex QFZP substance audits.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
              <h3 className="font-bold text-base text-navy-950 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gold-500 shrink-0" />
                <span>What happens if my business made zero profit or an operational loss?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                Even with zero profit or a loss, you must register and file an EmaraTax return. If your gross revenue was under AED 3M, you can claim SBR. Note that while under SBR, operational losses cannot be carried forward into subsequent tax periods.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
              <h3 className="font-bold text-base text-navy-950 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Until which year is Small Business Relief extended?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                The Ministry of Finance has formally extended the Small Business Relief regime to all tax periods ending on or before <strong>December 31, 2029</strong>, giving UAE enterprises guaranteed fiscal certainty for multiple years.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* 4. Footer */}
      <footer className="bg-navy-950 text-white border-t border-white/5 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 pb-6">
            <DiasLogo className="w-10 h-10" showText={true} textSize="text-xl" textColor="text-white" />
            <div className="flex flex-wrap gap-6 text-slate-400">
              <a href="/small-business-tax-relief" className="text-gold-400 font-semibold">Small Business Tax Relief</a>
              <a href="/difc-dtec-accounting" className="hover:text-gold-400 transition-colors">DIFC & DTEC Accounting</a>
              <a href="/dividends-audit" className="hover:text-gold-400 transition-colors">Dividends Audit</a>
              <a href="/#contact" onClick={handleBackHome} className="hover:text-gold-400 transition-colors">Contact</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-slate-500 text-[11px]">
            <p>© {new Date().getFullYear()} Dias Accounting and Tax Consulting LLC. Trade Licence: 2646813.01. Shams, Sharjah, UAE.</p>
            <p>Direct Inquiries: <a href="mailto:info@diasuae.ae" className="text-gold-400 underline">info@diasuae.ae</a> | Tel: +971 52 922 6958</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SmallBusinessTaxReliefPage;
