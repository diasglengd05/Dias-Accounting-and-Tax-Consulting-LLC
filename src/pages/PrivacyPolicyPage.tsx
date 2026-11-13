import React, { useEffect } from "react";
import { Shield, Lock, ChevronRight, Mail, MapPin, CheckCircle2 } from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { applyPageSEO } from "../lib/seo";

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
      title: "Privacy Policy & UAE Data Protection | Dias Accounting",
      description:
        "Privacy Policy and UAE Federal Decree-Law No. 45 Personal Data Protection commitments for Dias Accounting & Tax Consulting LLC.",
      canonicalPath: "/privacy-policy",
      keywords:
        "Dias Accounting privacy policy, UAE PDPL compliance, client confidentiality tax advisory",
      ogImage: "/api/og?title=Privacy+Policy+%26+UAE+Data+Protection&author=Dias+Accounting&tag=Client+Confidentiality",
    });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <PageNavigation
        currentPath="/privacy-policy"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-20 border-b border-white/10">
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
              <span className="text-white">Privacy Policy</span>
            </div>

            <div className="max-w-3xl space-y-4">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Privacy Policy &amp; Data Protection
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Full transparency regarding how Dias Accounting &amp; Tax Consulting LLC protects, stores, and handles client financial data in compliance with UAE Federal Decree-Law No. 45/2021 (PDPL).
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-sm text-slate-600 leading-relaxed">
            
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>256-Bit SSL Encrypted &amp; Strict Non-Disclosure:</strong> All data transmitted through diasuae.ae is protected by bank-grade encryption. We strictly do not sell, rent, or trade your corporate records or contact information to any third parties.
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-navy-950">1. Data Controller Identification</h2>
              <p>
                The data controller is <strong>Dias Accounting &amp; Tax Consulting LLC</strong>, registered in Sharjah Media City (SHAMS), UAE. Address: Business Center, Sharjah Media City (SHAMS), Al Messaned, Sharjah (P.O. Box 515000). Trade Licence: <strong>SHAMS 2646813.01</strong>. Email: <a href="mailto:info@diasuae.ae" className="text-gold-600 underline">info@diasuae.ae</a>.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-navy-950">2. Categories of Information Collected</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Inquiry &amp; Contact Details:</strong> Name, business email, telephone/WhatsApp number, company name, and jurisdiction.</li>
                <li><strong>Accounting &amp; Tax Records:</strong> Trial balances, bank statements, sales ledgers, and TRN numbers supplied for filing.</li>
                <li><strong>Technical Cookies:</strong> Essential session cookies used to calculate tax estimates and maintain site security.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-navy-950">3. Purpose of Processing</h2>
              <p>
                We process your personal and business data strictly to provide corporate tax assessments, VAT filings, bookkeeping, advisory reports, and client support.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-navy-950">4. Retention Period (UAE Statutory 7 Years)</h2>
              <p>
                Under Federal Decree-Law No. 28 of 2022 on Tax Procedures, accounting and tax documentation must be retained securely for a statutory minimum of <strong>7 years</strong>. General inquiry data is retained for up to 24 months.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-navy-950">5. Your Legal Rights</h2>
              <p>
                Under the UAE Personal Data Protection Law, you hold the right to request access, rectification, or deletion of your personal records (provided it does not contravene mandatory financial record-keeping laws).
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Last updated: November 2026</span>
              <a href="mailto:info@diasuae.ae" className="text-gold-600 hover:underline">info@diasuae.ae</a>
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

export default PrivacyPolicyPage;
