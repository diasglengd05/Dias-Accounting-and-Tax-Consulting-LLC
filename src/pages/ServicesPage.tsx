import React, { useEffect, useState } from "react";
import {
  Calculator,
  TrendingUp,
  Percent,
  Building,
  Clock,
  FileCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Shield,
  PhoneCall,
  MessageCircle,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { servicesData } from "../data/staticData";
import { Service } from "../types";
import ServiceModal from "../components/ServiceModal";
import { applyPageSEO } from "../lib/seo";

interface ServicesPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    applyPageSEO({
      title: "Corporate Tax, VAT & Accounting Services in Dubai | Dias UAE",
      description:
        "Certified Corporate Tax, VAT filing, backlog bookkeeping, and DIFC tax compliance across Dubai and all 7 UAE Emirates. Schedule a free consultation today.",
      canonicalPath: "/services",
      keywords:
        "Corporate Tax, Tax Services in Dubai, DIFC Tax Compliance, tax consulting services in uae, tax advisory services in dubai, corporate tax registration, vat returns dubai, ifrs bookkeeping uae",
      ogImage: "/api/og?title=Corporate+Tax%2C+VAT+%26+Accounting+Services+in+Dubai&author=Glen+Dias&tag=8+Practice+Areas",
    });

    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Calculator":
        return <Calculator className="w-6 h-6 text-gold-500" />;
      case "TrendingUp":
        return <TrendingUp className="w-6 h-6 text-gold-500" />;
      case "Percent":
        return <Percent className="w-6 h-6 text-gold-500" />;
      case "Building":
        return <Building className="w-6 h-6 text-gold-500" />;
      case "Clock":
        return <Clock className="w-6 h-6 text-gold-500" />;
      case "FileCheck":
        return <FileCheck className="w-6 h-6 text-gold-500" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-gold-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-gold-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <PageNavigation
        currentPath="/services"
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
              <span className="text-white">Services &amp; Practice Areas</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Shield className="w-3.5 h-3.5 text-gold-400" />
                <span>FTA-Certified Tax Agency · Dubai &amp; Sharjah</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                Comprehensive Tax, VAT &amp; Accounting Services in the UAE
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                From monthly IFRS bookkeeping on Zoho Books to 9% Corporate Tax returns, 0% Qualifying Free Zone Person (QFZP) structuring, and mandatory E-Invoicing Phase 1 ASP onboarding, Dias delivers senior-led financial clarity.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`https://wa.me/971529226958?text=${encodeURIComponent(
                    "Hi, I'd like to consult with a Dias Accounting advisor regarding your UAE tax and accounting services."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-gold-500/20 cursor-pointer flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>WhatsApp Advisor</span>
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate("/pricing")}
                  className="bg-white/10 hover:bg-white/20 text-white font-display font-semibold px-6 py-3.5 rounded-xl text-sm border border-white/20 transition-all cursor-pointer"
                >
                  View Fixed-Fee Packages
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Services & Practice Areas Grid */}
        <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* 1. Core Practice Areas (Matching Homepage) */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-mono text-gold-600 font-bold uppercase tracking-wider block mb-2">
                CORE PRACTICE AREAS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950 mb-3">
                Services at a Glance
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Our four core disciplines tailored to keep UAE Mainland and Free Zone companies fully compliant, penalty-free, and audit-ready under the leadership of Senior Tax Advisor Glen Dias.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicesData.slice(0, 4).map((service, idx) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-7 shadow-xs hover:shadow-xl hover:border-gold-400 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-gold-600 transition-colors">
                        0{idx + 1}.
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate(`/services/${service.id}`)}
                        className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center group-hover:bg-navy-950 group-hover:border-navy-950 transition-colors cursor-pointer text-left"
                      >
                        {getIcon(service.iconName)}
                      </button>
                    </div>
                    <h3
                      onClick={() => onNavigate(`/services/${service.id}`)}
                      className="font-display text-lg font-bold text-navy-950 mb-2.5 hover:text-gold-600 transition-colors cursor-pointer"
                    >
                      {service.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-6">
                      {service.shortDesc}
                    </p>

                    <div className="space-y-2 mb-6">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Core Inclusions:
                      </span>
                      {service.inclusions.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/services/${service.id}`)}
                      className="text-xs font-bold text-navy-950 hover:text-gold-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`https://wa.me/971529226958?text=${encodeURIComponent(
                        `Hi, I'd like to consult with Dias Accounting regarding ${service.title}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy-950 text-white hover:bg-gold-500 hover:text-navy-950 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Consult</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Specialized & Corporate Solutions */}
          <div className="pt-12 border-t border-slate-200 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-mono text-gold-600 font-bold uppercase tracking-wider block mb-2">
                SPECIALIZED PRACTICE AREAS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950 mb-3">
                Corporate Setup, Transfer Pricing &amp; CFO Advisory
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Advanced structural compliance, trade licensing, historical backlog cleanups, and regulatory frameworks for expanding enterprises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesData.slice(4).map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-7 shadow-xs hover:shadow-xl hover:border-gold-400/60 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => onNavigate(`/services/${service.id}`)}
                      className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform cursor-pointer text-left"
                    >
                      {getIcon(service.iconName)}
                    </button>
                    <h3
                      onClick={() => onNavigate(`/services/${service.id}`)}
                      className="font-display text-lg font-bold text-navy-950 mb-2.5 hover:text-gold-600 transition-colors cursor-pointer"
                    >
                      {service.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                      {service.shortDesc}
                    </p>

                    <div className="space-y-2 mb-6">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Key Deliverables:
                      </span>
                      {service.inclusions.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/services/${service.id}`)}
                      className="text-xs font-bold text-navy-950 hover:text-gold-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>View Service Page</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`https://wa.me/971529226958?text=${encodeURIComponent(
                        `Hi, I'd like to consult with Dias Accounting regarding ${service.title}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy-950 text-white hover:bg-gold-500 hover:text-navy-950 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Consult</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>


        {/* CTA Banner */}
        <section className="bg-navy-950 text-white py-14 border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Ready to Secure Your UAE Tax &amp; Accounting Position?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Schedule a 30-minute confidential consultation with Glen Dias, FTA Registered Tax Agent. We analyze your corporate structure and provide an immediate compliance roadmap.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <a
                href={`https://wa.me/971529226958?text=${encodeURIComponent(
                  "Hello Glen Dias, I would like to schedule a 30-minute confidential consultation regarding UAE tax and accounting compliance for my business."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-7 py-3.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-navy-950" />
                <span>Schedule Consultation Now</span>
              </a>
              <a
                href="https://wa.me/971529226958"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-semibold px-6 py-3.5 rounded-xl text-sm transition-all inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>WhatsApp Advisor</span>
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

      {selectedService && (
        <ServiceModal
          service={selectedService}
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          onBookCall={() => {
            setSelectedService(null);
            onNavigate("/contact");
          }}
        />
      )}
    </div>
  );
};

export default ServicesPage;
