import React, { useEffect } from "react";
import {
  ShieldCheck,
  ChevronRight,
  Shield,
  ArrowRight,
  CheckCircle2,
  Award,
  Users,
  Clock,
  Zap,
  BarChart3,
  Building,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import WhyChooseUsGrid from "../components/WhyChooseUsGrid";
import OurAffiliations from "../components/OurAffiliations";
import ClientCaseStudies from "../components/ClientCaseStudies";

interface WhyChooseUsPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const WhyChooseUsPage: React.FC<WhyChooseUsPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  useEffect(() => {
    document.title = "Why Dias Accounting | FTA Certified Tax Agency Dubai";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <PageNavigation
        currentPath="/why-choose-us"
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
              <span className="text-white">Why Choose Dias</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Award className="w-3.5 h-3.5 text-gold-400" />
                <span>The Dias Advantage · Dubai &amp; Sharjah</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                Why Industry Leaders Choose Dias Accounting
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                We combine the rigorous regulatory compliance of an FTA Registered Tax Agency with the responsiveness and modern cloud tech stack that high-growth UAE businesses demand.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate("/contact")}
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-gold-500/20 cursor-pointer flex items-center gap-2"
                >
                  <span>Consult Glen Dias, FTA Tax Agent</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6 Foundational Pillars Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WhyChooseUsGrid onBookCall={() => onNavigate("/contact")} />
        </section>

        {/* Glen Dias Leadership Bio Block */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-navy-950 to-navy-900 rounded-3xl p-8 sm:p-12 text-white border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-center gap-8 lg:gap-12">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gold-500/20 border-2 border-gold-400/50 flex items-center justify-center shrink-0 text-gold-400 font-display text-4xl sm:text-5xl font-extrabold">
                GD
              </div>
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-block px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 font-mono text-xs font-bold uppercase tracking-wider">
                  Founder &amp; Senior Tax Advisor
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Glen Gilbert Dias
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  FTA Registered Tax Agent and Managing Partner at Dias Accounting &amp; Tax Consulting LLC. With over a decade of specialized corporate finance, UAE tax jurisprudence, and IFRS advisory experience, Glen has structured hundreds of mainland and free zone corporate tax entities to achieve complete compliance while eliminating penalty exposure.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-gold-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    FTA Registered Tax Agent
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Zoho Books Implementation Specialist
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    IFRS Chartered Accounting Professional
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Firm Comparison Matrix */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950 mb-3">
              Dias Accounting vs. Traditional Alternatives
            </h2>
            <p className="text-slate-600 text-sm">
              Why fast-growing businesses transition from Big 4 bureaucracy or freelance bookkeepers to Dias.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6 font-bold text-navy-950">Feature / Standard</th>
                  <th className="py-4 px-6 font-bold text-slate-400">Traditional Big 4</th>
                  <th className="py-4 px-6 font-bold text-slate-400">Budget Freelancers</th>
                  <th className="py-4 px-6 font-bold text-navy-950 bg-gold-500/10 border-l border-gold-300 text-gold-700">
                    Dias Accounting
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-slate-800">FTA Certified Tax Agent Lead</td>
                  <td className="py-3.5 px-6 text-slate-500">Delegated to juniors</td>
                  <td className="py-3.5 px-6 text-rose-500">Rarely registered</td>
                  <td className="py-3.5 px-6 bg-gold-500/5 border-l border-gold-300 text-emerald-600 font-bold">✓ Direct Agent Oversight</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-slate-800">Monthly Transaction Surcharges</td>
                  <td className="py-3.5 px-6 text-rose-500">Very High (AED 5,000+)</td>
                  <td className="py-3.5 px-6 text-slate-500">Unpredictable billing</td>
                  <td className="py-3.5 px-6 bg-gold-500/5 border-l border-gold-300 text-emerald-600 font-bold">✓ 100% UNLIMITED</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-slate-800">Response Time &amp; WhatsApp Group</td>
                  <td className="py-3.5 px-6 text-slate-500">Days (Email ticket only)</td>
                  <td className="py-3.5 px-6 text-slate-500">Inconsistent</td>
                  <td className="py-3.5 px-6 bg-gold-500/5 border-l border-gold-300 text-emerald-600 font-bold">✓ Dedicated Client WhatsApp</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-slate-800">E-Invoicing Phase 1 ASP Setup</td>
                  <td className="py-3.5 px-6 text-rose-500">High separate advisory fee</td>
                  <td className="py-3.5 px-6 text-rose-500">No software support</td>
                  <td className="py-3.5 px-6 bg-gold-500/5 border-l border-gold-300 text-emerald-600 font-bold">✓ Built into all plans</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-slate-800">Statutory Audit Readiness</td>
                  <td className="py-3.5 px-6 text-slate-700">Yes</td>
                  <td className="py-3.5 px-6 text-rose-500">No working papers</td>
                  <td className="py-3.5 px-6 bg-gold-500/5 border-l border-gold-300 text-emerald-600 font-bold">✓ IFRS Audit File Prepared</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Real Client Case Studies */}
        <section className="py-12">
          <ClientCaseStudies />
        </section>

        {/* Affiliations & Tech Partners */}
        <section className="py-12 bg-slate-100/70 border-t border-slate-200">
          <OurAffiliations />
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

export default WhyChooseUsPage;
