import React, { useEffect } from "react";
import { Lock, ChevronRight } from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import PageMainTransition from "../components/PageMainTransition";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";

interface PrivacyPolicyPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  useEffect(() => {
    applyPageSEO({
      title: "Privacy Policy & UAE PDPL Compliance | Dias Accounting",
      description:
        "Privacy Policy and UAE Federal Decree-Law No. 45 Personal Data Protection (PDPL) commitments for Dias Accounting & Tax Consulting LLC in Sharjah & Dubai.",
      canonicalPath: "/privacy-policy",
      keywords:
        "Dias Accounting privacy policy, UAE PDPL compliance, client confidentiality tax advisory",
    });
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Privacy Policy", path: "/privacy-policy" },
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
        currentPath="/privacy-policy"
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
              <span className="text-[#0D1B2A] font-medium">Privacy Policy</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                Client Confidentiality &amp; UAE PDPL
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-[1.12]">
                Privacy Policy &amp; Data Protection
              </h1>
              <p className="text-[#475569] text-base sm:text-lg leading-[1.65] max-w-[65ch]">
                Full transparency regarding how Dias Accounting &amp; Tax Consulting LLC protects, stores, and handles client financial data in compliance with UAE Federal Decree-Law No. 45/2021 (PDPL).
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] py-14 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#FFFFFF] rounded-2xl p-7 sm:p-12 border border-[#E2E8F0] shadow-[0_6px_24px_-16px_rgba(13,27,42,0.06)] space-y-8 text-[15px] text-[#475569] leading-[1.7]">
              <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] border-l-[3px] border-l-[#1B4332] text-sm text-[#0D1B2A] flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#1B4332] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <strong>256-Bit SSL Encrypted &amp; Strict Non-Disclosure:</strong> All data transmitted through diasuae.ae is protected by bank-grade encryption. We strictly do not sell, rent, or trade your corporate records or contact information to any third parties.
                </div>
              </div>

              <div className="space-y-2.5 max-w-[68ch]">
                <h2 className="font-display text-lg font-bold text-[#0D1B2A]">1. Data Controller Identification</h2>
                <p>
                  The data controller is <strong className="text-[#0D1B2A]">Dias Accounting &amp; Tax Consulting LLC</strong>, registered in Sharjah Media City (SHAMS), UAE. Address: Business Center, Sharjah Media City (SHAMS), Al Messaned, Sharjah (P.O. Box 515000). Trade Licence: <strong className="text-[#0D1B2A] tabular-nums">SHAMS 2646813.01</strong>. Email:{" "}
                  <a href="mailto:info@diasuae.ae" className="text-[#1B4332] font-medium underline underline-offset-2 hover:text-[#143326]">
                    info@diasuae.ae
                  </a>
                  .
                </p>
              </div>

              <div className="space-y-2.5 max-w-[68ch]">
                <h2 className="font-display text-lg font-bold text-[#0D1B2A]">2. Categories of Information Collected</h2>
                <ul className="list-disc pl-5 space-y-1.5 text-[#475569]">
                  <li><strong className="text-[#0D1B2A]">Inquiry &amp; Contact Details:</strong> Name, business email, telephone/WhatsApp number, company name, and jurisdiction.</li>
                  <li><strong className="text-[#0D1B2A]">Accounting &amp; Tax Records:</strong> Trial balances, bank statements, sales ledgers, and TRN numbers supplied for filing.</li>
                  <li><strong className="text-[#0D1B2A]">Technical Cookies:</strong> Essential session cookies used to calculate tax estimates and maintain site security.</li>
                </ul>
              </div>

              <div className="space-y-2.5 max-w-[68ch]">
                <h2 className="font-display text-lg font-bold text-[#0D1B2A]">3. Purpose of Processing</h2>
                <p>
                  We process your personal and business data strictly to provide corporate tax assessments, VAT filings, bookkeeping, advisory reports, and client support.
                </p>
              </div>

              <div className="space-y-2.5 max-w-[68ch]">
                <h2 className="font-display text-lg font-bold text-[#0D1B2A]">4. Retention Period (UAE Statutory 7 Years)</h2>
                <p>
                  Under Federal Decree-Law No. 28 of 2022 on Tax Procedures, accounting and tax documentation must be retained securely for a statutory minimum of <strong className="text-[#0D1B2A]">7 years</strong>. General inquiry data is retained for up to 24 months.
                </p>
              </div>

              <div className="space-y-2.5 max-w-[68ch]">
                <h2 className="font-display text-lg font-bold text-[#0D1B2A]">5. Your Legal Rights</h2>
                <p>
                  Under the UAE Personal Data Protection Law, you hold the right to request access, rectification, or deletion of your personal records (provided it does not contravene mandatory financial record-keeping laws).
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

export default PrivacyPolicyPage;
