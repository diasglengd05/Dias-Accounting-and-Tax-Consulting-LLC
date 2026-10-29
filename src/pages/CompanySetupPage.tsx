import React, { useEffect } from "react";
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
    document.title = "Company Setup in Dubai & UAE Free Zones | Dias UAE";
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
                UAE Free Zone &amp; Mainland Company Setup Hub
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
              5-Step Fast-Track Incorporation Process
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
              Free Zone vs. Mainland: Strategic Comparison
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
