import React, { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import PageMainTransition from "../components/PageMainTransition";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";

interface TermsPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  useEffect(() => {
    applyPageSEO({
      title: "Terms of Service & Engagement | Dias Accounting UAE",
      description:
        "Standard Terms of Service, professional engagement scope, confidentiality, and UAE tax compliance policies for Dias Accounting & Tax Consulting LLC.",
      canonicalPath: "/terms",
      keywords:
        "Dias Accounting terms of service, UAE tax engagement terms, FTA agency compliance",
    });
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Terms of Engagement", path: "/terms" },
      ])
    );
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] font-sans text-[#0D1B2A] antialiased">
      <PageNavigation
        currentPath="/terms"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <PageMainTransition id="main-content" className="flex-1">
        <section className="bg-[#FFFFFF] border-b border-[#E2E8F0] pt-12 pb-14 lg:pt-16 lg:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-[#64748B] mb-8"
            >
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:text-[#0D1B2A] transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#0D1B2A] font-medium">Terms of Engagement</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                Advisory Scope &amp; Governance
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-[1.12]">
                Terms of Service &amp; Engagement
              </h1>
              <p className="text-[#475569] text-base sm:text-lg leading-[1.65] max-w-[65ch]">
                Standard terms governing professional accounting, bookkeeping, and tax advisory services rendered by Dias Accounting &amp; Tax Consulting LLC.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] py-14 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#FFFFFF] rounded-2xl p-7 sm:p-12 border border-[#E2E8F0] shadow-[0_6px_24px_-16px_rgba(13,27,42,0.06)] space-y-8 text-[15px] text-[#475569] leading-[1.7]">
              <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] border-l-[3px] border-l-[#C5A059] text-sm text-[#475569]">
                <p>
                  <strong className="text-[#0D1B2A]">Disclaimer:</strong> Content on diasuae.ae, including calculators, estimators, and blog posts, is provided for general informational purposes only and does not constitute formal tax, legal, or financial advice. Consult a qualified professional before acting on any information.
                </p>
              </div>

              <div className="space-y-2.5 max-w-[68ch]">
                <h2 className="font-display text-lg font-bold text-[#0D1B2A]">1. Scope of Professional Engagement</h2>
                <p>
                  Dias Accounting &amp; Tax Consulting LLC (&quot;the Firm&quot;) provides accounting, bookkeeping, VAT compliance, and corporate tax advisory services subject to individual client Engagement Letters. The Firm is registered in Sharjah Media City (SHAMS) under Trade Licence No. <strong className="text-[#0D1B2A] tabular-nums">SHAMS 2646813.01</strong> and operates as an FTA Registered Tax Agency in the United Arab Emirates.
                </p>
              </div>

              <div className="space-y-2.5 max-w-[68ch]">
                <h2 className="font-display text-lg font-bold text-[#0D1B2A]">2. Client Responsibilities &amp; Document Accuracy</h2>
                <p>
                  Clients are solely responsible for the authenticity, completeness, and accuracy of all underlying financial records, bank statements, sales receipts, and tax invoices provided to the Firm. The Firm relies on client-provided records to prepare returns submitted via the FTA EmaraTax portal.
                </p>
              </div>

              <div className="space-y-2.5 max-w-[68ch]">
                <h2 className="font-display text-lg font-bold text-[#0D1B2A]">3. Fee Schedules &amp; Payment Terms</h2>
                <p>
                  Professional services are billed according to agreed fixed-fee packages or project milestones. Invoices are payable upon receipt. Final pricing is subject to business transaction volume, multi-currency complexity, and statutory deadlines as detailed in each signed Client Engagement Agreement.
                </p>
              </div>

              <div className="space-y-2.5 max-w-[68ch]">
                <h2 className="font-display text-lg font-bold text-[#0D1B2A]">4. Confidentiality &amp; UAE Data Protection</h2>
                <p>
                  Both parties agree to treat all business, corporate tax, and financial information as strictly confidential under UAE Federal Decree-Law No. 45/2021 (PDPL) and UAE Tax Procedures Law. Records are securely retained for the statutory 7-year retention period.
                </p>
              </div>

              <div className="space-y-2.5 max-w-[68ch]">
                <h2 className="font-display text-lg font-bold text-[#0D1B2A]">5. Limitation of Liability</h2>
                <p>
                  While the Firm exercises all due professional care in accordance with UAE tax laws and IFRS, the Firm shall not be liable for penalties arising from incomplete, delayed, or misleading information provided by the client, or retrospective administrative rulings by regulatory authorities.
                </p>
              </div>

              <div className="space-y-2.5 max-w-[68ch]">
                <h2 className="font-display text-lg font-bold text-[#0D1B2A]">6. Governing Law &amp; Jurisdiction</h2>
                <p>
                  These terms are governed by the federal laws of the United Arab Emirates and the commercial regulations applicable in the Emirate of Sharjah / Dubai.
                </p>
              </div>

              <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4 text-xs text-[#64748B]">
                <span>Last updated: November 2026</span>
                <a href="mailto:info@diasuae.ae" className="text-[#1B4332] font-semibold hover:underline">
                  info@diasuae.ae
                </a>
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

export default TermsPage;
