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
  ShieldCheck,
  Scale,
  Award,
  DollarSign,
  PieChart,
} from "lucide-react";
import DiasLogo from "../components/DiasLogo";

interface PageProps {
  onNavigate?: (path: string) => void;
}

export const DividendsAuditPage: React.FC<PageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = "Dividend Audit & Distribution Advisory Dubai | Dias UAE";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Expert dividend audit and distribution advisory in Dubai. Ensure commercial companies law compliance, distributable profits certification, and withholding tax optimization across the UAE."
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
              href="mailto:info@diasuae.ae?subject=Inquiry%20regarding%20Dividend%20Audit%20and%20Distribution%20Advisory"
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
            Audit & Assurance
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-navy-950 font-semibold">Dividend Audit & Distribution Advisory</span>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>UAE Commercial Companies Law & Corporate Tax Compliance</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-4xl leading-tight">
            Dividend Audit & Distribution Advisory Dubai: <span className="text-gold-400">Lawful Profit Extraction</span> & Tax Optimization
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
            Ensure your shareholder profit distributions comply strictly with <strong>Federal Decree-Law No. 32 of 2021 (Commercial Companies Law)</strong> and the <strong>UAE Corporate Tax Law (Article 23 Participation Exemption)</strong>. We certify distributable reserves, draft board resolutions, and prevent costly tax reclassifications.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="mailto:info@diasuae.ae?subject=Dividend%20Audit%20and%20Certification%20Request"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-6 py-3.5 rounded-xl text-sm shadow-xl hover:shadow-gold-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Request Dividend Audit (info@diasuae.ae)</span>
            </a>
            <a
              href="tel:+971529226958"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl text-sm border border-white/15 transition-all"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              <span>Senior Partner Direct (+971 52 922 6958)</span>
            </a>
          </div>

          {/* Core Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display block">0% WHT</span>
              <span className="text-xs text-slate-300">UAE Withholding Tax on Dividends</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-gold-400 font-display block">10% Reserve</span>
              <span className="text-xs text-slate-300">Mandatory Statutory Legal Reserve</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-display block">Article 23</span>
              <span className="text-xs text-slate-300">Participation Exemption Rules</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-gold-400 font-display block">100% Legal</span>
              <span className="text-xs text-slate-300">Bank Remittance Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Content: Distributable Profits & Legal Framework */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 flex-1">
        
        {/* Core Warning Box */}
        <div className="bg-amber-50 border-l-4 border-gold-500 rounded-r-2xl p-6 shadow-sm flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-gold-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-navy-950 font-display">
              Why Uncertified Dividend Withdrawals Trigger Severe FTA & Legal Sanctions
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Distributing capital without audited distributable profits violates UAE Commercial Companies Law, rendering directors personally liable for company debts. Under the Corporate Tax Law (Article 36), the FTA actively audits shareholder withdrawals: if structured improperly, distributions may be treated as disguised salaries, disallowing corporate deductions or triggering penalties.
            </p>
          </div>
        </div>

        {/* Section 1: Statutory Framework */}
        <section className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Legal Compliance Foundation</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              The Legal Mechanics of Distributing Dividends in the UAE
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Distributing company profits to owners, founders, or foreign holding companies requires strict adherence to corporate governance protocols:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-navy-950 font-display">1. Distributable Profits Test</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dividends must only be paid from realized net profits and accumulated retained earnings confirmed by audited financial statements. Capital reduction cannot masquerade as dividend yields without formal regulatory gazetting.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-navy-950 font-display">2. Statutory Legal Reserve</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Under Article 103 of Federal Decree-Law No. 32 of 2021, UAE commercial entities must deduct <strong>10% of annual net profits</strong> into a non-distributable statutory reserve until it reaches at least <strong>50% of paid-up share capital</strong>.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-700">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-navy-950 font-display">3. Corporate Governance Dossier</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every distribution requires a formal Board of Directors recommendation, shareholder Annual General Meeting (AGM) resolution, and solvency confirmation prior to wire transfer execution.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Corporate Tax Implications */}
        <section className="bg-slate-100/70 border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Corporate Tax Law Integration</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              UAE Corporate Tax Treatment of Dividends (Decree-Law No. 47)
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Dividends represent one of the most tax-advantaged income streams in the UAE, provided statutory participation criteria are respected:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">Article 23</span>
                <h3 className="font-bold text-navy-950 text-sm sm:text-base">The Participation Exemption Regime</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dividends and capital gains derived from participating interests are <strong>100% exempt from UAE Corporate Tax</strong>. To qualify for foreign holdings:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>The UAE holding company must own at least <strong>5% ownership interest</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>The participation must be held continuously for at least <strong>12 consecutive months</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>The foreign subsidiary must be subject to corporate tax of at least <strong>9%</strong> in its home country (Subject-to-Tax Test)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-gold-100 text-gold-800 px-2.5 py-0.5 rounded-full">Article 36 & 45</span>
                <h3 className="font-bold text-navy-950 text-sm sm:text-base">Withholding Tax & Connected Persons Rules</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Outbound dividend distributions to overseas shareholders or resident founders are subject to <strong>0% UAE Withholding Tax</strong> under Article 45. However, FTA audit guidelines strictly regulate:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                  <span><strong>Owner Remuneration vs. Dividends:</strong> Owner salaries must reflect Fair Market Value (arm's length) to be deductible against corporate tax.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                  <span><strong>Excess Compensation Disallowance:</strong> Inflated salaries paid to connected persons are disallowed and reclassified as profit distributions upon audit.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Engagement Roadmap */}
        <section className="bg-navy-950 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Chartered Audit Engagement</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Dias Accounting Dividend Certification Workflow
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              We provide independent auditor reports and legal distribution documentation required by UAE corporate banks and tax authorities:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-gold-400 font-bold text-lg font-display">01. Balance Audit</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Verifying balance sheet net profits, validating retained earnings, and confirming liquidity to ensure ongoing solvency.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-gold-400 font-bold text-lg font-display">02. Statutory Reserve</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calculating and locking the mandatory 10% legal reserve allocation in compliance with Federal Decree-Law No. 32.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-gold-400 font-bold text-lg font-display">03. Board Resolutions</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Drafting bilingual shareholder resolutions, board minutes, and dividend distribution vouchers for company records.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-gold-400 font-bold text-lg font-display">04. Bank Clearance</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Providing signed auditor certificates accepted by major UAE banks (Emirates NBD, FAB, ADCB, Mashreq) for smooth wire execution.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              href="mailto:info@diasuae.ae?subject=Book%20Dividend%20Audit%20and%20Certification%20Service"
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
              <span>Speak to Chartered Accountant: +971 52 922 6958</span>
            </a>
          </div>
        </section>

        {/* Section 4: FAQ */}
        <section className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Common Questions</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              Frequently Asked Questions: UAE Dividend Distributions
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
              <h3 className="font-bold text-base text-navy-950 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Can a UAE company distribute interim dividends mid-year?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                Yes, provided the company's Memorandum of Association (MOA) authorizes interim distributions, management prepares interim quarterly financial statements showing sufficient realized profit, and an auditor verifies that the company maintains adequate working capital.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
              <h3 className="font-bold text-base text-navy-950 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Are dividends paid by a UAE company subject to personal income tax?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                No. The United Arab Emirates levies zero personal income tax on individuals. Dividends received by UAE resident natural persons are completely tax-free. Non-resident recipients should verify their domestic country's foreign tax credit rules and double tax treaties.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
              <h3 className="font-bold text-base text-navy-950 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gold-500 shrink-0" />
                <span>What documents do UAE banks require to release dividend wire transfers?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                Most UAE Tier-1 corporate banks require an audited financial statement, official AGM / Board Dividend Resolution, bank solvency certificate, and a signed letter from a certified audit firm validating the distributable reserve. Dias Accounting prepares this complete compliance pack.
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
              <a href="/small-business-tax-relief" className="hover:text-gold-400 transition-colors">Small Business Tax Relief</a>
              <a href="/difc-dtec-accounting" className="hover:text-gold-400 transition-colors">DIFC & DTEC Accounting</a>
              <a href="/dividends-audit" className="text-gold-400 font-semibold">Dividends Audit</a>
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

export default DividendsAuditPage;
