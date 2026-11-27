import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  Calculator,
  Check,
  ChevronRight,
  Code2,
  Copy,
  FileCheck2,
  Handshake,
  MessageCircle,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import PageMainTransition from "../components/PageMainTransition";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";

interface PartnersPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

const EMBED_SNIPPET =
  '<a href="https://diasuae.ae/uae-tax-planner" target="_blank" rel="noopener">Free 2026 UAE Corporate Tax &amp; 5% VAT Calculator by Dias Accounting (FTA-Registered Tax Agents)</a>';

const PARTNER_WHATSAPP_URL =
  "https://wa.me/971529226958?text=Hi%20Dias%20Accounting%2C%20we%20would%20like%20to%20partner%20and%20feature%20your%202026%20UAE%20Tax%20Calculator%20on%20our%20website.";

const ECOSYSTEM_PILLARS = [
  {
    title: "Company Formation Consultants",
    description:
      "Give newly licensed Mainland DET, SHAMS, IFZA, DMCC, and DTEC founders Day-1 EmaraTax Corporate Tax registration before the 3-month AED 10,000 penalty deadline.",
    icon: Building2,
  },
  {
    title: "PRO & Corporate Services Agencies",
    description:
      "Pair annual license renewals with fixed-fee IFRS bookkeeping from AED 400/month, quarterly 5% VAT Form 201 returns, and backlog ledger catch-up.",
    icon: FileCheck2,
  },
  {
    title: "Legal Advisors & Corporate Counsel",
    description:
      "Collaborate directly with FTA-Registered Tax Agents on 0% QFZP structuring, statutory interim and final dividend audits, and Transfer Pricing disclosures.",
    icon: Scale,
  },
  {
    title: "Co-Working Hubs & Venture Incubators",
    description:
      "Equip founders across Dubai, DIFC, DTEC, and Sharjah with our free 2026 Corporate Tax & 5% VAT Calculator and 0% Small Business Relief eligibility checks.",
    icon: Users,
  },
];

export const PartnersPage: React.FC<PartnersPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const canonicalPath = "/partners";
    applyPageSEO({
      title: "UAE Business Setup Partners & Free Tax Calculator Widget | Dias Accounting",
      description:
        "Partner with DiasUAE across Dubai, DIFC, DTEC & SHAMS for company setup, PRO referrals, and our free embeddable 2026 UAE Corporate Tax & VAT Calculator.",
      canonicalPath,
      keywords:
        "UAE company formation partners, Dubai business setup referral partners, embed UAE corporate tax calculator, PRO agency accounting partner UAE, DIFC DTEC SHAMS tax partner",
    });

    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "UAE Business Ecosystem & Partners", path: canonicalPath },
        ],
        `https://diasuae.ae${canonicalPath}#breadcrumb`
      )
    );

    window.scrollTo({ top: 0, behavior: "instant" });

    return () => {
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, []);

  const handleCopyEmbed = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(EMBED_SNIPPET);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = EMBED_SNIPPET;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#0D1B2A] antialiased flex flex-col">
      <PageNavigation
        currentPath="/partners"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <PageMainTransition id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#FFFFFF] border-b border-[#E2E8F0] pt-14 pb-16 lg:pt-20 lg:pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#64748B] mb-7"
            >
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/");
                }}
                className="hover:text-[#0D1B2A] transition-colors"
              >
                Home
              </a>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span className="text-[#856422] font-semibold">
                UAE Business Ecosystem &amp; Partners
              </span>
            </nav>

            <div className="max-w-3xl space-y-5">
              <div className="w-12 h-[2px] bg-[#C5A059]" aria-hidden="true" />
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0D1B2A] tracking-tight leading-[1.14]">
                UAE Business Setup Partners &amp; Free Tax Calculator Widget
              </h1>
              <p className="text-[#475569] text-base sm:text-lg leading-[1.65] max-w-[64ch]">
                Resources for UAE company formation consultants, PRO agencies, legal advisors, and co-working hubs across Dubai, DIFC, DTEC, and SHAMS.
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-[#475569]">
                <span className="inline-flex items-center gap-2 font-medium text-[#0D1B2A]">
                  <ShieldCheck className="w-4 h-4 text-[#1B4332] shrink-0" />
                  <span>FTA-Registered Tax Agency</span>
                </span>
                <span className="text-[#CBD5E1] hidden sm:inline" aria-hidden="true">
                  ·
                </span>
                <span>Led by Glen Dias</span>
                <span className="text-[#CBD5E1] hidden sm:inline" aria-hidden="true">
                  ·
                </span>
                <span>Fixed Retainers From AED 400/mo</span>
              </div>
            </div>
          </div>
        </section>

        {/* Copy-Paste HTML Embed Box Section */}
        <section className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-16 lg:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-7 sm:p-10 shadow-[0_12px_36px_-20px_rgba(13,27,42,0.08)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#856422]">
                    <Code2 className="w-4 h-4 text-[#1B4332] shrink-0" />
                    <span>Free Partner Embed Snippet</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-[28px] font-bold text-[#0D1B2A] tracking-tight leading-snug">
                    Add Our Free 2026 UAE Corporate Tax &amp; 5% VAT Calculator to Your Website
                  </h2>
                  <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                    Paste this lightweight HTML link into your UAE company setup checklists, client portals, or compliance guides so founders can estimate 9% Corporate Tax, 0% Small Business Relief (up to AED 3M), 0% QFZP De Minimis, and 5% VAT recovery.
                  </p>
                </div>
              </div>

              {/* Code Box + One-Click Copy Button */}
              <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF]">
                  <span className="text-xs font-mono text-[#64748B]">HTML Embed Code</span>
                  <button
                    type="button"
                    onClick={handleCopyEmbed}
                    className="min-h-[40px] px-4 py-2 rounded-lg bg-[#1B4332] hover:bg-[#143326] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                        <span>Copied Embed Code</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 shrink-0" />
                        <span>Copy Embed Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] leading-relaxed font-mono text-[#0D1B2A] whitespace-pre-wrap break-all select-all">
                  <code>{EMBED_SNIPPET}</code>
                </pre>
              </div>

              {/* Live Preview Strip */}
              <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Live Link Preview
                  </span>
                  <a
                    href="https://diasuae.ae/uae-tax-planner"
                    target="_blank"
                    rel="noopener"
                    className="text-sm font-semibold text-[#1B4332] hover:text-[#143326] underline underline-offset-2 transition-colors"
                  >
                    Free 2026 UAE Corporate Tax &amp; 5% VAT Calculator by Dias Accounting (FTA-Registered Tax Agents)
                  </a>
                </div>
                <a
                  href="/uae-tax-planner"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("/uae-tax-planner");
                  }}
                  className="shrink-0 min-h-[42px] px-4 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#1B4332] text-xs sm:text-sm font-semibold text-[#0D1B2A] hover:text-[#1B4332] transition-colors inline-flex items-center justify-center gap-2 no-underline"
                >
                  <Calculator className="w-4 h-4 text-[#1B4332] shrink-0" />
                  <span>Open Calculator</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Ecosystem Value Grid */}
        <section className="bg-[#FFFFFF] border-b border-[#E2E8F0] py-16 lg:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-2xl space-y-2.5">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                Ecosystem Collaboration
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
                How We Support UAE Advisory &amp; Formation Partners
              </h2>
              <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
                Your clients receive immediate FTA compliance coverage from day one—while you remain their primary formation or legal advisor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ECOSYSTEM_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <article
                    key={pillar.title}
                    className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-6 sm:p-7 space-y-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center text-[#1B4332]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#0D1B2A] tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      {pillar.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Become a Recommended UAE Formation Partner CTA Card */}
        <section className="bg-[#F8FAFC] py-16 lg:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-8 sm:p-12 shadow-[0_14px_38px_-20px_rgba(13,27,42,0.1)]">
              <div
                className="absolute top-0 inset-x-0 h-[3px] bg-[#C5A059]"
                aria-hidden="true"
              />
              <div className="max-w-2xl space-y-5">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#856422]">
                  <Handshake className="w-4 h-4 text-[#1B4332] shrink-0" />
                  <span>Direct Partner Desk</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight leading-snug">
                  Become a Recommended UAE Formation Partner
                </h2>
                <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
                  Are you a UAE company formation consultancy, PRO agency, corporate legal firm, or co-working hub in Dubai, DIFC, DTEC, or SHAMS? Connect directly with our partner desk to feature our 2026 UAE Tax Calculator on your site and streamline EmaraTax, IFRS bookkeeping, and statutory dividend audit referrals for your clients.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                  <a
                    href={PARTNER_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] px-6 py-3 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2.5 no-underline shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Partner With Us on WhatsApp</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                  <a
                    href="/pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("/pricing");
                    }}
                    className="min-h-[46px] px-5 py-3 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#1B4332] text-[#0D1B2A] hover:text-[#1B4332] text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 no-underline"
                  >
                    <span>View Fixed-Fee Packages</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
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

export default PartnersPage;
