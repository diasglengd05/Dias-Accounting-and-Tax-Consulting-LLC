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
  Award,
  Layers,
  Cpu,
  TrendingUp,
} from "lucide-react";
import DiasLogo from "../components/DiasLogo";

interface PageProps {
  onNavigate?: (path: string) => void;
}

export const DifcDtecAccountingPage: React.FC<PageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = "Tax and Accounting Services in DIFC & DTEC | Dias UAE";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Specialized accounting, tax compliance, and audit readiness for DIFC and DTEC free zone entities. 0% Qualifying Free Zone Person (QFZP) substance advisory and DFSA audit preparation."
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
              href="mailto:info@diasuae.ae?subject=Inquiry%20regarding%20DIFC%20and%20DTEC%20Accounting%20Services"
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
            Free Zone Services
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-navy-950 font-semibold">DIFC & DTEC Accounting & Tax</span>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>DIFC Registered & DTEC Tech Hub Compliance Experts</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-4xl leading-tight">
            Tax and Accounting Services in DIFC & DTEC: <span className="text-gold-400">0% QFZP Compliance</span> & Audit Readiness
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
            Protect your Free Zone entity against disqualification. We deliver IFRS financial statement preparation, statutory audit coordination, and corporate tax compliance for regulated financial firms in <strong>DIFC</strong> and venture-backed tech startups in <strong>DTEC (Dubai Silicon Oasis)</strong>.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="mailto:info@diasuae.ae?subject=DIFC%2FDTEC%20Accounting%20and%20Audit%20Consultation%20Request"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-6 py-3.5 rounded-xl text-sm shadow-xl hover:shadow-gold-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Book DIFC / DTEC Advisory (info@diasuae.ae)</span>
            </a>
            <a
              href="tel:+971529226958"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl text-sm border border-white/15 transition-all"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              <span>Speak to Free Zone Tax Specialist (+971 52 922 6958)</span>
            </a>
          </div>

          {/* Core Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display block">0% QFZP</span>
              <span className="text-xs text-slate-300">Qualifying Free Zone Rate</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-gold-400 font-display block">IFRS Full</span>
              <span className="text-xs text-slate-300">Audited Financial Standards</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-display block">5% / AED 5M</span>
              <span className="text-xs text-slate-300">De Minimis Threshold</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-gold-400 font-display block">DFSA & DSO</span>
              <span className="text-xs text-slate-300">Regulatory Frameworks</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Content: DIFC & DTEC Specific Requirements */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 flex-1">
        
        {/* Hub Comparison Grid */}
        <section className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Free Zone Specializations</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              Tailored Accounting for Dubai's Premier Innovation Hubs
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Each jurisdiction has distinct regulatory, economic substance, and auditing expectations. Dias Accounting bridges the gap with dedicated solutions for both zones:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* DIFC Column */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-900">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-navy-800 bg-navy-100/80 px-3 py-1 rounded-full">
                    Financial & Professional Hub
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display text-navy-950">
                  DIFC (Dubai International Financial Centre)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  DIFC entities operate under common law frameworks and often fall under DFSA oversight. Maintaining rigorous IFRS accounting, managing capital adequacy, and documenting arm’s length cross-border management fees are critical for compliance.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Annual statutory audit preparation in accordance with DIFC Companies Law</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>QFZP Qualifying Income analysis for treasury, holding, and advisory operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Economic substance compliance (adequate physical office & qualified staff)</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href="mailto:info@diasuae.ae?subject=Inquiry%20regarding%20DIFC%20Accounting%20Services"
                  className="inline-flex items-center gap-2 text-xs font-bold text-navy-950 hover:text-gold-600 transition-colors"
                >
                  <span>Request DIFC Audit Readiness Review</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* DTEC Column */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                    Technology & Startup Campus
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display text-navy-950">
                  DTEC (Dubai Technology Entrepreneur Campus - DSO)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Located within Dubai Silicon Oasis (DSO), DTEC is the epicenter for software companies, SaaS ventures, e-commerce, and venture-backed innovators. We manage lean bookkeeping, investor cap table reporting, and R&D capitalization accounting.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Cloud ERP setup (Zoho Books, QuickBooks Online, Xero) tailored for tech</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Evaluation between 0% QFZP status vs. Small Business Relief (SBR)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Monthly burn rate, gross margin, and investor financial packet preparation</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href="mailto:info@diasuae.ae?subject=Inquiry%20regarding%20DTEC%20Accounting%20Services"
                  className="inline-flex items-center gap-2 text-xs font-bold text-navy-950 hover:text-gold-600 transition-colors"
                >
                  <span>Request DTEC Tech Accounting Proposal</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: QFZP 0% Compliance Safeguards */}
        <section className="bg-slate-100/70 border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Corporate Tax Law Deep Dive</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-navy-950">
              The 5 Cumulative Conditions for 0% Free Zone Corporate Tax
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Under <strong>Cabinet Decision No. 55 of 2023</strong> and <strong>Ministerial Decision No. 139 of 2023</strong>, an entity in DIFC or DTEC qualifies for 0% Corporate Tax only if it satisfies all 5 statutory conditions. Failing any single condition disqualifies the company for <strong>5 consecutive tax periods</strong>:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-gold-600 block">Condition 01</span>
              <h3 className="font-bold text-navy-950 text-sm">Physical Economic Substance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Maintain adequate qualified personnel, physical premises in the Free Zone, and adequate operational expenditures. Flexi-desks without resident staff risk disqualification upon FTA audit.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-gold-600 block">Condition 02</span>
              <h3 className="font-bold text-navy-950 text-sm">Derives Qualifying Income</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Income must stem from transactions with other Free Zone persons or specifically enumerated Qualifying Activities (such as fund management, treasury services, headquarters operations).
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-gold-600 block">Condition 03</span>
              <h3 className="font-bold text-navy-950 text-sm">Audited Financial Statements</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mandatory annual financial statements prepared under IFRS and audited by an accredited UAE auditor. Un-audited accounts automatically void QFZP status.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-gold-600 block">Condition 04</span>
              <h3 className="font-bold text-navy-950 text-sm">De Minimis Rule Compliance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Non-qualifying revenue derived from mainland UAE or non-qualifying activities must not exceed the lower of <strong>5% of total revenue</strong> or <strong>AED 5,000,000</strong>.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-gold-600 block">Condition 05</span>
              <h3 className="font-bold text-navy-950 text-sm">Arm's Length Transfer Pricing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All connected person and related party dealings must satisfy Article 34 OECD transfer pricing guidelines, supported by written intercompany agreements.
              </p>
            </div>

            <div className="bg-navy-900 text-white rounded-2xl p-6 border border-navy-800 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gold-400 block">Need a QFZP Audit?</span>
                <h3 className="font-bold text-white text-sm">Our Team Evaluates Your Exposure</h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  We calculate your de minimis ratio and verify qualifying income before you submit your return on EmaraTax.
                </p>
              </div>
              <a
                href="mailto:info@diasuae.ae?subject=QFZP%20Substance%20and%20De%20Minimis%20Audit%20Request"
                className="inline-flex items-center gap-1.5 text-xs text-gold-400 font-bold hover:text-gold-300 pt-3"
              >
                <span>Contact info@diasuae.ae</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Section 3: Engagement Workflow */}
        <section className="bg-navy-950 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Enterprise Support Suite</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              End-to-End Accounting & Tax Management
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Serving hundreds of companies across Dubai's specialized zones, our chartered team delivers full-lifecycle financial oversight:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-emerald-400 font-bold text-lg font-display">01. Bookkeeping</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Monthly double-entry general ledger maintenance, cloud invoice processing, and continuous bank reconciliation.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-emerald-400 font-bold text-lg font-display">02. VAT Filing</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Quarterly Form VAT201 preparation, reverse charge accounting on foreign software purchases, and input VAT recoveries.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-emerald-400 font-bold text-lg font-display">03. Audit Dossier</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Drafting balance sheet working papers, trial balances, and management representations for independent auditor sign-off.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-emerald-400 font-bold text-lg font-display">04. EmaraTax Submission</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Finalizing the annual Corporate Tax return with proper QFZP or SBR elections, guaranteeing zero administrative fines.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              href="mailto:info@diasuae.ae?subject=Schedule%20DIFC%2FDTEC%20Accounting%20Onboarding"
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
              <span>Direct Advisory Desk: +971 52 922 6958</span>
            </a>
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
              <a href="/difc-dtec-accounting" className="text-gold-400 font-semibold">DIFC & DTEC Accounting</a>
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

export default DifcDtecAccountingPage;
