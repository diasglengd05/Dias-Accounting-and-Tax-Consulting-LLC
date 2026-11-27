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
import PageMainTransition from "../components/PageMainTransition";
import WhyChooseUsGrid from "../components/WhyChooseUsGrid";
import OurAffiliations from "../components/OurAffiliations";
import ClientCaseStudies from "../components/ClientCaseStudies";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";

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
    applyPageSEO({
      title: "Why Choose Dias Accounting | FTA Tax Agency Dubai & UAE",
      description:
        "Discover why UAE founders choose Dias Accounting: FTA-registered agents, fixed-fee IFRS accounting, EmaraTax compliance, and direct senior advisory.",
      canonicalPath: "/why-choose-us",
      keywords:
        "why dias accounting, fta registered tax agency, certified tax agent glen dias, corporate tax advisory firm dubai",
    });
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Why Choose Dias", path: "/why-choose-us" },
      ])
    );
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <PageNavigation
        currentPath="/why-choose-us"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <PageMainTransition id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#FFFFFF] text-[#0D1B2A] py-16 lg:py-24 border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#856422] mb-4">
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:text-[#0D1B2A] hover:underline cursor-pointer transition-colors"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              <button
                type="button"
                onClick={() => onNavigate("/about")}
                className="hover:text-[#0D1B2A] hover:underline cursor-pointer transition-colors"
              >
                About Us
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span className="text-[#0D1B2A] font-semibold">Why Choose Dias</span>
            </nav>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#856422] text-xs font-semibold uppercase tracking-wider mb-4">
                <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>The Dias Advantage · Dubai &amp; Sharjah</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1B2A] leading-tight mb-6">
                Why Industry Leaders Choose Dias Accounting
              </h1>
              <p className="text-[#475569] text-base sm:text-lg leading-relaxed mb-8">
                We combine the rigorous regulatory compliance of an FTA Registered Tax Agency with the responsiveness and modern cloud tech stack that high-growth UAE businesses demand.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate("/contact")}
                  className="bg-[#1B4332] hover:bg-[#143326] text-white font-display font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors shadow-xs cursor-pointer flex items-center gap-2"
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
            <div className="bg-gradient-to-br from-[#F8FAFC] via-[#FFFFFF] to-[#F8FAFC] rounded-3xl p-8 sm:p-12 text-[#0D1B2A] border border-[#E2E8F0] shadow-[0_12px_36px_-18px_rgba(13,27,42,0.08)] flex flex-col md:flex-row items-center gap-8 lg:gap-12">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-[#FFFFFF] border-2 border-[#C5A059]/60 flex items-center justify-center shrink-0 text-[#0D1B2A] font-display text-4xl sm:text-5xl font-extrabold shadow-xs">
                GD
              </div>
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-block px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] text-[#856422] font-mono text-xs font-bold uppercase tracking-wider">
                  Founder &amp; Senior Tax Advisor
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A]">
                  Glen Gilbert Dias
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-2xl">
                  FTA Registered Tax Agent and Managing Partner at Dias Accounting &amp; Tax Consulting LLC. With over a decade of specialized corporate finance, UAE tax jurisprudence, and IFRS advisory experience, Glen has structured hundreds of mainland and free zone corporate tax entities to achieve complete compliance while eliminating penalty exposure.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-[#0D1B2A] font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
                    FTA Registered Tax Agent
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
                    Zoho Books Implementation Specialist
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
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
      </PageMainTransition>

      <PageFooter
        onNavigate={onNavigate}
        onOpenPrivacy={onOpenPrivacy}
        onOpenGooglePreferred={onOpenGooglePreferred}
      />
    </div>
  );
};

export default WhyChooseUsPage;
