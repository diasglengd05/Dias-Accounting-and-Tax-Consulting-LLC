import React, { useEffect, useState } from "react";
import {
  Building2,
  ChevronRight,
  Shield,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  CreditCard,
  UserCheck,
  Compass,
  ChevronDown,
  HelpCircle,
  Calculator,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import CompanySetupHub from "../components/CompanySetupHub";

interface CompanySetupPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const CompanySetupPage: React.FC<CompanySetupPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  useEffect(() => {
    const title = "UAE Company Setup & Corporate Tax Structuring Dubai | Dias UAE";
    const desc = "Turnkey Dubai company setup and Corporate Tax structuring across SHAMS, DMCC, IFZA, DTEC, and Mainland (DET). 100% foreign ownership with 0% QFZP tax optimization.";
    document.title = title;

    const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    upsertMeta("name", "title", title);
    upsertMeta("name", "description", desc);
    upsertMeta("name", "keywords", "UAE Company Setup, Corporate Tax, company setup dubai, free zone license uae, shams incorporation, dmcc company formation, ifza visa setup, 0% QFZP corporate tax uae, difc tax compliance");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", desc);

    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const steps = [
    {
      step: "01",
      title: "Jurisdiction & Activity Structuring",
      desc: "Select the optimal Free Zone (SHAMS, DMCC, IFZA, DTEC, Meydan) or Dubai Mainland (DET) based on 0% QFZP tax rules and commercial requirements.",
      icon: <Compass className="w-6 h-6 text-gold-500" />,
    },
    {
      step: "02",
      title: "Trade Name & Initial Approval",
      desc: "Submit your legal trade name reservation and receive preliminary authority approval within 24 to 48 hours.",
      icon: <FileCheck2 className="w-6 h-6 text-gold-500" />,
    },
    {
      step: "03",
      title: "MoA & Trade License Issuance",
      desc: "Drafting of Memorandum of Association (MoA), lease agreement, and issuance of the official UAE Trade License.",
      icon: <Building2 className="w-6 h-6 text-gold-500" />,
    },
    {
      step: "04",
      title: "UAE Residence Visa & Emirates ID",
      desc: "Seamless VIP medical testing, biometric scanning, and issuance of multi-year investor or employee residence visas.",
      icon: <UserCheck className="w-6 h-6 text-gold-500" />,
    },
    {
      step: "05",
      title: "Corporate Bank Account & Tax Registration",
      desc: "Direct introduction to leading UAE banks (Emirates NBD, Wio, Mashreq, FAB) and mandatory FTA Corporate Tax registration (TRN).",
      icon: <CreditCard className="w-6 h-6 text-gold-500" />,
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const setupFaqs = [
    {
      q: "How does UAE company setup impact our Corporate Tax liability?",
      a: "Under UAE Federal Decree-Law No. 47 of 2022, every newly incorporated UAE entity—whether in a Free Zone or Mainland—must register with the FTA for Corporate Tax. Free Zone entities can benefit from a 0% Qualifying Free Zone Person (QFZP) rate on qualifying income, provided they maintain adequate substance, audited financials, and do not elect into the standard 9% regime. Mainland entities pay 0% on taxable profits up to AED 375,000 and 9% on profits exceeding that threshold.",
    },
    {
      q: "Can a Free Zone company qualify for 0% Corporate Tax (QFZP)?",
      a: "Yes. To qualify for 0% Corporate Tax under Cabinet Decision No. 55 of 2023 and Ministerial Decision No. 139 of 2023, the Free Zone entity must: (1) derive Qualifying Income from transactions with other Free Zone persons or qualifying foreign activities, (2) maintain adequate economic substance and staff in the Free Zone, (3) comply with arm's-length transfer pricing rules, and (4) prepare audited financial statements under IFRS. Dias UAE structures your licensing and corporate governance from Day 1 to safeguard your 0% QFZP status.",
    },
    {
      q: "What is the difference between Mainland and Free Zone company setup in Dubai?",
      a: "Free Zone companies enjoy 100% foreign ownership, 0% import/export customs exemptions, and potential 0% QFZP Corporate Tax, but generally cannot supply goods or services directly to mainland UAE consumers without an agent or dual-license. Dubai Mainland (DET) licenses allow unconstrained trading across the entire UAE and direct participation in government tenders, but are subject to the standard 9% Corporate Tax above AED 375,000.",
    },
    {
      q: "What are the all-inclusive costs of company formation in UAE?",
      a: "Formation costs comprise the authority trade license fee (ranging from AED 11,500 to AED 25,000+ depending on jurisdiction such as SHAMS, IFZA, or DMCC), office/desk lease (flexi-desk vs physical office), establishment card, residence visa quotas, and mandatory FTA Corporate Tax registration. Dias UAE provides fully itemized transparent pricing with zero surprise add-ons.",
    },
    {
      q: "How fast can we open a corporate bank account for a new UAE entity?",
      a: "With complete statutory documentation, verifiable business models, and proper shareholder profiles, digital corporate accounts (e.g., Wio Bank) can be opened in 48 to 72 hours. Traditional tier-1 banks (Emirates NBD, Mashreq, FAB) typically take 2 to 3 weeks. Dias UAE pre-screens your compliance files to fast-track account approval.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <PageNavigation
        currentPath="/company-setup"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-24 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-4">
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:underline cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">Company Setup &amp; Free Zones</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Shield className="w-3.5 h-3.5 text-gold-400" />
                <span>Turnkey Corporate Formation &amp; Structuring</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                UAE Company Setup, Free Zone Incorporation &amp; Corporate Tax Structuring
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                Form your business in Dubai or Sharjah with full regulatory compliance from Day 1. Benefit from 100% foreign ownership, 0% Qualifying Free Zone Person (QFZP) tax structuring, and fast-track corporate bank account opening.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate("/contact")}
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-gold-500/20 cursor-pointer flex items-center gap-2"
                >
                  <span>Request Free Formation Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="tel:+971529226958"
                  className="bg-white/10 hover:bg-white/20 text-white font-display font-semibold px-6 py-3.5 rounded-xl text-sm border border-white/20 transition-all"
                >
                  Call +971 52 922 6958
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 5-Step Formation Roadmap */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950 mb-3">
              How Does UAE Company Setup Work in 5 Fast-Track Steps?
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We handle all administrative, legal, and banking paperwork so your company is legally trading in as few as 3 to 5 business days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((st) => (
              <div
                key={st.step}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-gold-400 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xl font-black text-gold-500">
                      {st.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                      {st.icon}
                    </div>
                  </div>
                  <h3 className="font-display text-base font-bold text-navy-950 mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Full Interactive Free Zone & Mainland Hub Component */}
        <section className="py-12">
          <CompanySetupHub
            onBookCall={() => {
              onNavigate("/contact");
            }}
          />
        </section>

        {/* Mainland vs Free Zone Comparison Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950 mb-3">
              Free Zone vs. Mainland: Which UAE Jurisdiction Minimizes Corporate Tax?
            </h2>
            <p className="text-slate-600 text-sm">
              Choosing the right legal structure determines your Corporate Tax liability and commercial freedom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
              <div className="inline-block px-3 py-1 rounded-full bg-gold-500/10 text-gold-600 font-mono text-xs font-bold uppercase mb-4">
                UAE Free Zones (SHAMS, DMCC, IFZA, DTEC)
              </div>
              <h3 className="font-display text-xl font-bold text-navy-950 mb-4">
                Ideal for International Trade &amp; 0% QFZP Tax
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Eligible for 0% Corporate Tax on Qualifying Income (QFZP)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>100% foreign ownership with zero requirement for local sponsor</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>100% repatriation of capital and business profits</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Cost-effective flexi-desk and virtual office licenses</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
              <div className="inline-block px-3 py-1 rounded-full bg-navy-950/10 text-navy-950 font-mono text-xs font-bold uppercase mb-4">
                Dubai Mainland (DET LLC)
              </div>
              <h3 className="font-display text-xl font-bold text-navy-950 mb-4">
                Ideal for Local UAE Market &amp; Government Tenders
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Trade freely across all 7 Emirates with no territory limits</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Eligible to bid directly on UAE government &amp; semi-government tenders</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>100% foreign ownership for over 1,000 commercial and industrial activities</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Subject to standard 9% Corporate Tax above AED 375,000</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-600 text-xs font-semibold mb-3">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Search Console High-Intent FAQs</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-950 mb-3">
                UAE Company Setup &amp; Corporate Tax FAQs
              </h2>
              <p className="text-slate-600 text-sm max-w-2xl mx-auto">
                Direct answers to essential queries from founders and investors incorporating businesses in Dubai and the UAE.
              </p>
            </div>

            <div className="space-y-3">
              {setupFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 font-display font-semibold text-navy-950 hover:text-gold-600 transition-colors"
                    >
                      <span className="text-sm sm:text-base">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180 text-gold-500" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contextual Internal Linking */}
            <div className="mt-12 p-6 rounded-2xl bg-navy-950 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-lg font-bold text-white mb-1">
                  Looking for DIFC Tax Compliance or Fixed-Fee Accounting?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Explore our specialized DIFC advisory, all-inclusive monthly packages, and interactive tax tools.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate("/tax-planning-difc")}
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-semibold px-4 py-2 rounded-lg text-xs transition-colors"
                >
                  DIFC Tax Compliance
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("/pricing")}
                  className="bg-white/10 hover:bg-white/20 text-white font-display font-semibold px-4 py-2 rounded-lg text-xs border border-white/20 transition-colors"
                >
                  View Accounting Packages
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("/uae-tax-planner")}
                  className="bg-white/10 hover:bg-white/20 text-white font-display font-semibold px-4 py-2 rounded-lg text-xs border border-white/20 transition-colors flex items-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5 text-gold-400" />
                  <span>Tax Planner</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-navy-950 text-white py-14 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Ready to Launch Your UAE Entity?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Get an itemized quotation covering government license fees, visa allocations, and statutory tax registration.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate("/contact")}
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-7 py-3.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg"
              >
                Schedule Free Incorporation Strategy Call
              </button>
            </div>
          </div>
        </section>
      </main>

      <PageFooter
        onNavigate={onNavigate}
        onOpenPrivacy={onOpenPrivacy}
        onOpenGooglePreferred={onOpenGooglePreferred}
      />
    </div>
  );
};

export default CompanySetupPage;
