import React, { useEffect } from "react";
import {
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  Briefcase,
  Building,
  Target,
  Sparkles,
  Phone,
  Mail,
  Lock,
  MessageCircle,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { useLanguage } from "../i18n/LanguageContext";

interface AboutPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const { language } = useLanguage();

  useEffect(() => {
    document.title = "About Us | Dias Accounting & Tax Consulting LLC Dubai";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <PageNavigation
        currentPath="/about"
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
              <span className="text-white">About Us</span>
            </div>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                <span>Firm Overview &amp; Leadership</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                About Dias Accounting &amp; Tax Consulting LLC
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Dedicated accounting, IFRS bookkeeping, VAT compliance, and corporate tax advisory firm helping UAE mainland LLCs and Free Zone enterprises stay completely compliant without operational stress.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("/contact");
                  }}
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-gold-500/20 cursor-pointer flex items-center gap-2"
                >
                  <span>Book a Free Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Firm Story & Mission */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-600 block">
                  Firm Story &amp; Purpose
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950">
                  Our Journey, Mission &amp; Values
                </h2>
              </div>

              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  <strong>Dias Accounting &amp; Tax Consulting LLC</strong> was founded to provide transparent, fixed-fee financial stewardship for the UAE&apos;s dynamic small and medium business community. With the rollout of Federal Decree-Law No. 8 of 2017 (VAT) and Federal Decree-Law No. 47 of 2022 (Corporate Tax), business owners faced unprecedented compliance responsibilities and heavy non-filing penalties.
                </p>
                <p className="bg-slate-50 border-l-4 border-gold-500 p-4 rounded-r-xl italic text-slate-700">
                  <strong>Mission Statement:</strong> To empower UAE startups, SMEs, and international founders with audit-ready bookkeeping, proactive tax optimization, and bulletproof FTA compliance so they can scale profitably with complete peace of mind.
                </p>
                <p>
                  <strong>Firm Background:</strong> Headquartered in Sharjah Media City (SHAMS), Dias Accounting provides dedicated bilingual advisory desks, senior chartered accountants, and accredited FTA tax agents across all 7 Emirates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <span className="block font-display text-xl font-bold text-navy-950">15+</span>
                  <span className="text-xs text-slate-500">Years of UAE Practice</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <span className="block font-display text-xl font-bold text-navy-950">50+</span>
                  <span className="text-xs text-slate-500">UAE Businesses Advised</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <span className="block font-display text-xl font-bold text-navy-950">40+</span>
                  <span className="text-xs text-slate-500">Free Zones Covered</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-navy-950 rounded-3xl p-8 text-white border border-gold-500/30 shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">Our Core Commitments</h3>
                    <p className="text-xs text-slate-400">Zero hourly surprises, 100% compliance</p>
                  </div>
                </div>

                <ul className="space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Transparent Flat Fees:</strong> No surprise invoices or meter-running consultations.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>FTA Defensible:</strong> Every return and filing position is substantiated by UAE tax decree.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>IFRS Standard:</strong> Audit-ready financial statements from day one.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Proactive Planning:</strong> Identifying 0% SBR and QFZP exemptions before deadlines close.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Team Section */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-600 block">
                Leadership &amp; Advisory Team
              </span>
              <h2 className="font-display text-3xl font-extrabold text-navy-950">
                Meet the Professionals Guiding Your Business
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                Our qualified team combines statutory accounting knowledge, EmaraTax expertise, and regional business acumen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Member 1: Glen Dias */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:border-gold-400 transition-colors">
                <div className="space-y-4">
                  <div className="w-24 h-24 rounded-2xl bg-gold-500/20 border-2 border-gold-400/40 flex items-center justify-center text-gold-600 font-display text-2xl font-bold">
                    GD
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy-950">Glen Gilbert Dias</h3>
                    <p className="text-xs font-mono font-bold text-gold-600">Managing Partner &amp; Senior Tax Advisor</p>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                    <p><strong>Qualifications:</strong> FTA Registered Tax Agent, Chartered Accountant (CA), B.Com</p>
                    <p><strong>Experience:</strong> 15+ Years in UAE Corporate Finance, Taxation &amp; Advisory</p>
                    <p>Directs firm engagements across mainland Corporate Tax structuring, 0% QFZP Free Zone compliance, Transfer Pricing documentation, and FTA audit representations.</p>
                  </div>
                </div>
              </div>

              {/* Member 2: Senior IFRS Accountant */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:border-gold-400 transition-colors">
                <div className="space-y-4">
                  <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-gold-400/40 flex items-center justify-center text-gold-400 font-display text-xl font-bold">
                    TX
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy-950">Senior Tax &amp; Compliance Lead</h3>
                    <p className="text-xs font-mono font-bold text-gold-600">Senior IFRS Accountant &amp; VAT Specialist</p>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                    <p><strong>Qualifications:</strong> ACCA / CA, Certified VAT Practitioner</p>
                    <p><strong>Experience:</strong> 8+ Years UAE Tax &amp; Audit Practice</p>
                    <p>Oversees monthly double-entry reconciliations, quarterly Form 201 VAT filings, year-end trial balance preparation, and audit defense dossiers.</p>
                  </div>
                </div>
              </div>

              {/* Member 3: Free Zone Corporate Services Manager */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:border-gold-400 transition-colors">
                <div className="space-y-4">
                  <div className="w-24 h-24 rounded-2xl bg-navy-900 border-2 border-gold-400/40 flex items-center justify-center text-gold-400 font-display text-xl font-bold">
                    CS
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy-950">Corporate Services Desk</h3>
                    <p className="text-xs font-mono font-bold text-gold-600">Free Zone &amp; Mainland Setup Specialist</p>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                    <p><strong>Qualifications:</strong> Corporate Governance &amp; Commercial Law Liaison</p>
                    <p><strong>Experience:</strong> 7+ Years UAE Licensing &amp; Banking</p>
                    <p>Manages company incorporation, commercial trade licensing across SHAMS, IFZA, DMCC, and Dubai Mainland (DET), and tier-1 corporate bank account setups.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Credentials & Affiliations Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-600 block">
              Accreditations &amp; Registrations
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950">
              Verified Credentials &amp; Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-navy-950">Federal Tax Authority (FTA)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                FTA Registered Tax Agency status. Fully licensed and certified to represent taxpayers before the Federal Tax Authority for returns, reconsiderations, voluntary disclosures, and audit resolutions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-navy-950">UAE Licensing Jurisdiction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trade Licence: <span className="font-mono font-bold text-gold-600">SHAMS 2646813.01</span>. Registered in Sharjah Media City (SHAMS) and authorized to render professional accounting, auditing, and tax advisory services across all 7 Emirates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-navy-950">Software Partnerships</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zoho Books Certified Partner, Xero Certified Advisor, QuickBooks Online ProAdvisor, and Wafeq FTA-Accredited Accounting Partner.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Why Choose Us: 4 Key Points */}
        <section className="py-16 bg-slate-100 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-600 block">
                The Dias Differentiation
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950">
                4 Reasons UAE Businesses Partner With Us
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <span className="font-mono text-xs font-bold text-gold-600 block">01.</span>
                <h3 className="font-display text-base font-bold text-navy-950">Fixed-Fee Transparency</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clear upfront monthly packages starting from AED 400/month (billed annually) or AED 500/month with zero hourly billing surprises or hidden transaction penalties.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <span className="font-mono text-xs font-bold text-gold-600 block">02.</span>
                <h3 className="font-display text-base font-bold text-navy-950">FTA Compliance First</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every filing, tax group election, and deduction is prepared in strict accordance with UAE tax laws to eliminate late penalties.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <span className="font-mono text-xs font-bold text-gold-600 block">03.</span>
                <h3 className="font-display text-base font-bold text-navy-950">Dedicated Senior Team</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You work directly with experienced accountants and tax professionals, not junior offshore call centres.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <span className="font-mono text-xs font-bold text-gold-600 block">04.</span>
                <h3 className="font-display text-base font-bold text-navy-950">Rapid WhatsApp Response</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time communication for time-sensitive tax questions, invoice issuance checks, and urgent deadlines.
                </p>
              </div>
            </div>

            {/* Bottom CTA Banner */}
            <div className="p-8 rounded-3xl bg-navy-950 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-xl font-bold">Have questions about your business tax standing?</h3>
                <p className="text-xs text-slate-300 mt-1">Book a 30-minute discovery consultation with Glen Dias and our senior advisory team.</p>
              </div>
              <a
                href={`https://wa.me/971529226958?text=${encodeURIComponent(
                  "Hello Glen Dias, I would like to schedule a free consultation with your senior tax advisory team regarding my UAE company."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-6 py-3 rounded-xl text-xs whitespace-nowrap transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-navy-950" />
                <span>Schedule Free Consultation</span>
              </a>
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

export default AboutPage;
