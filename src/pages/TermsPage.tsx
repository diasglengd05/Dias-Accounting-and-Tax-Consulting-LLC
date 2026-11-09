import React, { useEffect } from "react";
import { ShieldCheck, ChevronRight, Lock, FileText, Mail, MapPin } from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";

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
    document.title = "Terms of Service & Engagement | Dias Accounting UAE";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <PageNavigation
        currentPath="/terms"
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
              <span className="text-white">Terms of Engagement</span>
            </div>

            <div className="max-w-3xl space-y-4">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Terms of Service &amp; Engagement
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Standard terms governing professional accounting, bookkeeping, and tax advisory services rendered by Dias Accounting &amp; Tax Consulting LLC.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-sm text-slate-600 leading-relaxed">
            
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              <p><strong>Disclaimer:</strong> Content on diasuae.ae, including calculators, estimators, and blog posts, is provided for general informational purposes only and does not constitute formal tax, legal, or financial advice. Consult a qualified professional before acting on any information.</p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-navy-950">1. Scope of Professional Engagement</h2>
              <p>
                Dias Accounting &amp; Tax Consulting LLC (&quot;the Firm&quot;) provides accounting, bookkeeping, VAT compliance, and corporate tax advisory services subject to individual client Engagement Letters. The Firm is registered in Sharjah Media City (SHAMS) under Trade Licence No. <strong>SHAMS 2646813.01</strong> and operates as an FTA Registered Tax Agency in the United Arab Emirates.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-navy-950">2. Client Responsibilities &amp; Document Accuracy</h2>
              <p>
                Clients are solely responsible for the authenticity, completeness, and accuracy of all underlying financial records, bank statements, sales receipts, and tax invoices provided to the Firm. The Firm relies on client-provided records to prepare returns submitted via the FTA EmaraTax portal.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-navy-950">3. Fee Schedules &amp; Payment Terms</h2>
              <p>
                Professional services are billed according to agreed fixed-fee packages or project milestones. Invoices are payable upon receipt. Final pricing is subject to business transaction volume, multi-currency complexity, and statutory deadlines as detailed in each signed Client Engagement Agreement.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-navy-950">4. Confidentiality &amp; UAE Data Protection</h2>
              <p>
                Both parties agree to treat all business, corporate tax, and financial information as strictly confidential under UAE Federal Decree-Law No. 45/2021 (PDPL) and UAE Tax Procedures Law. Records are securely retained for the statutory 7-year retention period.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-navy-950">5. Limitation of Liability</h2>
              <p>
                While the Firm exercises all due professional care in accordance with UAE tax laws and IFRS, the Firm shall not be liable for penalties arising from incomplete, delayed, or misleading information provided by the client, or retrospective administrative rulings by regulatory authorities.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-navy-950">6. Governing Law &amp; Jurisdiction</h2>
              <p>
                These terms are governed by the federal laws of the United Arab Emirates and the commercial regulations applicable in the Emirate of Sharjah / Dubai.
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

export default TermsPage;
