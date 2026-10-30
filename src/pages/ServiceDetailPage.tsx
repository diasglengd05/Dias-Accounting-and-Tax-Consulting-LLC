import React, { useEffect, useState, useMemo } from "react";
import {
  Calculator,
  TrendingUp,
  Percent,
  Building,
  Clock,
  FileCheck,
  ShieldCheck,
  Briefcase,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Shield,
  PhoneCall,
  Scale,
  FileText,
  Users,
  Check,
  Award,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { servicesData } from "../data/staticData";
import { Service } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface ServiceDetailPageProps {
  serviceId?: string;
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  serviceId,
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Match the current service or fallback to first
  const currentService: Service = useMemo(() => {
    if (!serviceId) return servicesData[0];
    const normalized = serviceId.toLowerCase();
    if (normalized === "business-incorporation-services" || normalized.includes("incorporation")) {
      const inc = servicesData.find((s) => s.id === "business-incorporation");
      if (inc) return inc;
    }
    const found = servicesData.find(
      (s) => s.id === serviceId || s.id.toLowerCase() === normalized
    );
    return found || servicesData[0];
  }, [serviceId]);

  useEffect(() => {
    let title = `${currentService.title} in Dubai & UAE | Dias Accounting & Tax`;
    let desc = currentService.shortDesc;
    if (currentService.id === "business-incorporation" || serviceId?.includes("incorporation")) {
      title = "Business Incorporation Services UAE | Company Setup Dubai & Free Zones | Dias UAE";
      desc = "Premier business incorporation services in UAE. 100% foreign ownership company setup in Dubai Mainland (DET) and top Free Zones (SHAMS, DMCC, IFZA, DTEC). Fast-track licensing & bank accounts.";
    }
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
    if (currentService.id === "business-incorporation") {
      upsertMeta("name", "keywords", "business incorporation services uae, business incorporation services in uae, company setup dubai, business setup uae, commercial license dubai, professional license uae, free zone company formation, mainland DET incorporation");
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentService, serviceId]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Calculator":
        return <Calculator className="w-8 h-8 text-gold-400" />;
      case "TrendingUp":
        return <TrendingUp className="w-8 h-8 text-gold-400" />;
      case "Percent":
        return <Percent className="w-8 h-8 text-gold-400" />;
      case "Building":
        return <Building className="w-8 h-8 text-gold-400" />;
      case "Clock":
        return <Clock className="w-8 h-8 text-gold-400" />;
      case "FileCheck":
        return <FileCheck className="w-8 h-8 text-gold-400" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-8 h-8 text-gold-400" />;
      case "Briefcase":
        return <Briefcase className="w-8 h-8 text-gold-400" />;
      default:
        return <Sparkles className="w-8 h-8 text-gold-400" />;
    }
  };

  // Specific service regulatory background information
  const serviceMeta = useMemo(() => {
    switch (currentService.id) {
      case "accounting-bookkeeping":
        return {
          law: "UAE Federal Decree-Law No. 32 of 2021 (Commercial Companies Law) & IFRS",
          authority: "Ministry of Economy & Federal Tax Authority",
          timeline: "Monthly 5th day closing & real-time software feeds",
          pricingTier: "Included FREE in all Dias Monthly retainers (starting AED 400/mo)",
        };
      case "corporate-tax-advisory":
        return {
          law: "Federal Decree-Law No. 47 of 2022 on the Taxation of Corporations and Businesses",
          authority: "Federal Tax Authority (FTA EmaraTax)",
          timeline: "Return & payment due within 9 months of tax period end",
          pricingTier: "Included in Business Starter (AED 400/mo) and Corporate Growth (AED 600/mo)",
        };
      case "vat-compliance":
        return {
          law: "Federal Decree-Law No. 8 of 2017 on Value Added Tax",
          authority: "Federal Tax Authority (FTA Form VAT 201)",
          timeline: "Quarterly or monthly filing due on the 28th following period close",
          pricingTier: "Included in Corporate Growth Plan (AED 600/mo)",
        };
      case "auditing-assurance":
        return {
          law: "International Standards on Auditing (ISA) & Commercial Companies Law",
          authority: "Mainland DET & UAE Free Zone Authorities (DMCC, Meydan, SHAMS, IFZA)",
          timeline: "Annual statutory audit submission upon license renewal",
          pricingTier: "Available as standalone statutory package or audit readiness",
        };
      case "aml-goaml-compliance":
        return {
          law: "Federal Decree-Law No. 20 of 2018 on Anti-Money Laundering & Cabinet Decision 10/2019",
          authority: "UAE Financial Intelligence Unit (FIU) & Ministry of Economy",
          timeline: "Mandatory goAML registration & ongoing transaction screening",
          pricingTier: "Custom DNFBP compliance retainer",
        };
      case "backlog-accounting":
        return {
          law: "Article 26 of Commercial Companies Law & Corporate Tax Audit Mandates",
          authority: "Federal Tax Authority & External Statutory Auditors",
          timeline: "7 to 14 business days fast-track financial reconstruction",
          pricingTier: "Single FY Backlog (AED 2,500) | Multi-Year (AED 4,800)",
        };
      case "transfer-pricing":
        return {
          law: "Ministerial Decision No. 97 of 2023 & OECD Transfer Pricing Guidelines",
          authority: "Federal Tax Authority (EmaraTax TP Disclosure)",
          timeline: "Disclosure submitted with CT return; Master/Local file within 30 days of request",
          pricingTier: "Custom Transfer Pricing Local/Master File engagement",
        };
      case "business-incorporation":
        return {
          law: "Federal Decree-Law No. 32 of 2021 on Commercial Companies & Free Zone Regulations",
          authority: "Department of Economy and Tourism (DET Dubai) & Shams / Free Zones",
          timeline: "24 to 48 hours licensing issuance",
          pricingTier: "Setup packages starting AED 5,750 (100% foreign ownership)",
        };
      case "cfo-advisory":
        return {
          law: "Strategic Financial Management, Basel Accords & Corporate Governance",
          authority: "Board of Directors, Commercial Banks & Private Equity",
          timeline: "Bi-weekly strategy sessions & monthly board briefing",
          pricingTier: "Included in Enterprise Premium Plan (AED 1,000/mo)",
        };
      default:
        return {
          law: "UAE Federal Tax & Corporate Regulations",
          authority: "Federal Tax Authority & Ministry of Economy",
          timeline: "Per statutory schedule",
          pricingTier: "Fixed-fee monthly retainer",
        };
    }
  }, [currentService.id]);

  // Specific FAQs for each service
  const serviceFaqs = useMemo(() => {
    switch (currentService.id) {
      case "accounting-bookkeeping":
        return [
          {
            q: "What cloud accounting software does Dias support for bookkeeping?",
            a: "We are certified advisors for Zoho Books, QuickBooks Online, Xero Cloud, and Wafeq. We set up automated bank statement feeds, custom chart of accounts, and compliant bilingual invoice templates.",
          },
          {
            q: "Is bookkeeping really included FREE in all Dias packages?",
            a: "Yes! Unlike traditional firms that charge extra for bookkeeping and invoice entries, all Dias core monthly packages include full bookkeeping with unlimited monthly transactions and zero hidden surcharges.",
          },
          {
            q: "Do Free Zone companies need to maintain IFRS accounting books?",
            a: "Yes. UAE Commercial Companies Law and Corporate Tax Law require all UAE entities (both Free Zone and Mainland) to keep proper books of account for a minimum of 5 years.",
          },
        ];
      case "corporate-tax-advisory":
        return [
          {
            q: "Can my company claim 0% Small Business Relief (SBR)?",
            a: "Yes, if your company's gross revenue is AED 3,000,000 or less in the relevant tax period under Ministerial Decision No. 73 of 2023 (extended through 2029). When elected, your taxable profit is treated as zero.",
          },
          {
            q: "When must the UAE Corporate Tax return be filed?",
            a: "The annual Corporate Tax return and payment must be submitted via the EmaraTax portal within 9 months following the end of your financial tax period.",
          },
          {
            q: "How can Free Zone entities qualify for 0% Corporate Tax?",
            a: "A Qualifying Free Zone Person (QFZP) must maintain adequate economic substance, derive Qualifying Income, prepare audited financial statements, and satisfy arm's length transfer pricing rules.",
          },
        ];
      case "vat-compliance":
        return [
          {
            q: "What is the threshold for mandatory UAE VAT registration?",
            a: "VAT registration is mandatory when your taxable supplies and imports exceed AED 375,000 in the previous 12 months or are expected to exceed that threshold in the next 30 days.",
          },
          {
            q: "Can I reclaim VAT paid on commercial expenses and supplier invoices?",
            a: "Yes. Input VAT paid on legitimate business purchases, commercial rent, utilities, and professional fees is 100% recoverable on your quarterly VAT 201 return.",
          },
          {
            q: "What are the penalties for late VAT filing?",
            a: "The FTA imposes an initial AED 1,000 administrative penalty for the first late return, increasing to AED 2,000 for repeated offenses, plus monthly interest penalties.",
          },
        ];
      case "backlog-accounting":
        return [
          {
            q: "How fast can Dias complete multi-year backlog accounting?",
            a: "Our specialized backlog reconstruction team typically completes 1 full financial year within 5 to 7 business days, and 2 to 3 years within 10 to 14 business days.",
          },
          {
            q: "What documents are required to begin historical ledger reconstruction?",
            a: "We only require your commercial trade license copy, PDF or Excel bank statements for the relevant years, and available sales and supplier invoices.",
          },
          {
            q: "Will the reconstructed books be accepted for Corporate Tax filing?",
            a: "Yes. All backlog statements are prepared strictly in accordance with IFRS standards and are fully audit-defensible for FTA EmaraTax submission.",
          },
        ];
      default:
        return [
          {
            q: `How do I get started with ${currentService.title}?`,
            a: "Simply book a consultation or message our senior team on WhatsApp (+971 52 922 6958). We conduct an initial discovery review and provide a structured scope of work within 2 hours.",
          },
          {
            q: "Is an initial consultation confidential?",
            a: "Yes, 100% confidential. All discussions are protected under standard NDA protocols and led directly by Glen Dias, Managing Partner & Certified Tax Advisor.",
          },
        ];
    }
  }, [currentService]);

  const openWhatsApp = () => {
    const msg = `Hello Dias Accounting,\nI am inquiring about your "${currentService.title}" service.\nPlease advise on scope, timeline, and booking an assessment with Glen Dias.`;
    window.open(`https://wa.me/971529226958?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950">
      <PageNavigation
        currentPath={`/services/${currentService.id}`}
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* 1. Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-24 border-b border-gold-500/20 overflow-hidden">
          {/* Ambient Lighting */}
          <div className="absolute -top-32 right-0 w-[520px] h-[520px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[460px] h-[460px] bg-navy-800/40 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-6">
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:underline cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <button
                type="button"
                onClick={() => onNavigate("/services")}
                className="hover:underline cursor-pointer"
              >
                Services
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">{currentService.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading & Summary */}
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>FTA-Registered Practice · Glen Dias, Chartered Accountant</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {currentService.title} <span className="text-gold-400">in Dubai &amp; UAE</span>
                </h1>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                  {currentService.longDesc}
                </p>

                {/* Primary CTA Buttons */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate("/contact")}
                    className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-gold-500/20 cursor-pointer flex items-center gap-2"
                  >
                    <span>Book Practice Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={openWhatsApp}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-semibold px-6 py-3.5 rounded-xl text-sm transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                  >
                    <span>WhatsApp Advisor (+971 52 922 6958)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate("/pricing")}
                    className="bg-white/10 hover:bg-white/15 text-white font-display font-semibold px-5 py-3.5 rounded-xl text-sm border border-white/20 transition-all cursor-pointer"
                  >
                    View Pricing
                  </button>
                </div>
              </div>

              {/* Right Column: Key Service Highlights Card */}
              <div className="lg:col-span-4 bg-navy-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gold-500/30 shadow-2xl space-y-5">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/15 border border-gold-400/30 flex items-center justify-center shrink-0 shadow-inner">
                    {getIcon(currentService.iconName)}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-gold-400 block font-bold">
                      Practice Snapshot
                    </span>
                    <h2 className="font-display font-bold text-white text-base">
                      {currentService.title}
                    </h2>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono uppercase text-[10px] tracking-wider">
                      Applicable Legislation:
                    </span>
                    <span className="text-white font-semibold block mt-0.5">
                      {serviceMeta.law}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-mono uppercase text-[10px] tracking-wider">
                      Regulatory Authority:
                    </span>
                    <span className="text-gold-300 font-semibold block mt-0.5">
                      {serviceMeta.authority}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-mono uppercase text-[10px] tracking-wider">
                      Statutory Deadlines:
                    </span>
                    <span className="text-slate-200 block mt-0.5">
                      {currentService.regulatoryDeadlines || serviceMeta.timeline}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <span className="text-slate-400 block font-mono uppercase text-[10px] tracking-wider">
                      Recommended Plan:
                    </span>
                    <span className="text-emerald-400 font-bold block mt-0.5">
                      {serviceMeta.pricingTier}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Comprehensive Scope of Work & Inclusions */}
        <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-600 block mb-2">
              Deliverables &amp; Inclusions
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-950">
              What Is Included in {currentService.title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Every deliverable is handled directly by experienced accountants and audited for full statutory compliance with UAE federal decrees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentService.inclusions.map((inclusion, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-gold-400/80 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-gold-600">
                      0{idx + 1}.
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="font-display font-bold text-base text-navy-950">
                    {inclusion}
                  </h3>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                  <span>Guaranteed Deliverable</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Core Business Benefits & Strategic Value */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-600 block">
                  Why Dias Accounting
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950 leading-tight">
                  Strategic Advantages for Your Business
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Working with Glen Dias ensures your company gains strategic financial clarity, seamless banking relationships, and complete protection from administrative tax penalties.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate("/contact")}
                    className="bg-navy-950 hover:bg-navy-900 text-white font-display font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Request Proposal</span>
                    <ArrowRight className="w-4 h-4 text-gold-400" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {currentService.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-gold-400 transition-all space-y-2.5 shadow-xs"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gold-500/10 text-gold-600 flex items-center justify-center font-bold text-xs font-mono">
                      ✓
                    </div>
                    <h3 className="font-display font-bold text-sm text-navy-950">
                      {benefit}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Delivery Methodology / Process */}
        <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-600 block mb-2">
              Our Methodology
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950">
              4-Step Engagement Process
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Discovery & Intake",
                desc: "We analyze your commercial license, transaction volume, and historical tax status under strict NDA.",
              },
              {
                step: "02",
                title: "Software & Ledger Setup",
                desc: "Setup of automated feeds on Zoho, QuickBooks, or Xero, with custom FTA tax codes and chart of accounts.",
              },
              {
                step: "03",
                title: "Review & Computation",
                desc: "Reconciliation of all ledger entries, calculation of VAT/CT positions, and optimization for legal tax relief.",
              },
              {
                step: "04",
                title: "Sign-Off & Advisory",
                desc: "Official filing on EmaraTax, issuance of IFRS financial statements, and ongoing monthly briefing with Glen Dias.",
              },
            ].map((p) => (
              <div
                key={p.step}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3"
              >
                <span className="text-2xl font-mono font-extrabold text-gold-500 block">
                  {p.step}
                </span>
                <h3 className="font-display font-bold text-base text-navy-950">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Service-Specific FAQs */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-600 block mb-2">
              Frequently Asked Questions
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-950">
              Questions About {currentService.title}
            </h2>
          </div>

          <div className="space-y-4">
            {serviceFaqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="font-display font-bold text-sm text-navy-950">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                      openFaq === idx ? "rotate-180 text-gold-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 6. Explore All Other Services Navigation Bar */}
        <section className="py-12 bg-slate-100/80 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-600 block">
                  Complete Practice Suite
                </span>
                <h3 className="font-display font-bold text-lg text-navy-950">
                  Explore Other Services
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("/services")}
                className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {servicesData
                .filter((s) => s.id !== currentService.id)
                .map((other) => (
                  <button
                    key={other.id}
                    type="button"
                    onClick={() => onNavigate(`/services/${other.id}`)}
                    className="p-3 bg-white rounded-xl border border-slate-200/90 hover:border-gold-400 hover:shadow-xs transition-all text-left cursor-pointer flex flex-col justify-between"
                  >
                    <span className="font-display font-bold text-xs text-navy-950 line-clamp-2">
                      {other.title}
                    </span>
                    <span className="text-[10px] text-gold-600 font-semibold mt-2 inline-flex items-center gap-1">
                      Learn More →
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </section>

        {/* 7. CTA Banner */}
        <section className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white py-16 border-t border-gold-500/30">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Direct Managing Partner Advisory</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              Ready to Secure Your Company&apos;s Financial Standing?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
              Schedule an executive consultation with Glen Dias to discuss your {currentService.title} requirements in full confidentiality.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate("/contact")}
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-7 py-3.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-gold-500/20"
              >
                Schedule Consultation
              </button>
              <button
                type="button"
                onClick={openWhatsApp}
                className="bg-white/10 hover:bg-white/15 text-white font-display font-semibold px-6 py-3.5 rounded-xl text-sm transition-all cursor-pointer border border-white/20"
              >
                Chat on WhatsApp (+971 52 922 6958)
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

export default ServiceDetailPage;
