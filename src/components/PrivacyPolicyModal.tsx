import React, { useEffect } from "react";
import { X, Shield, Lock, FileText, Globe, Key, Mail, MapPin, CheckCircle2 } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  // Accessibility & Usability: Lock background scroll and listen for Escape key
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalStyle;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      {/* Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] animate-scaleUp">
        
        {/* Header bar */}
        <div className="border-b border-slate-100 p-6 md:px-8 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 id="privacy-modal-title" className="font-display text-lg md:text-xl font-bold text-navy-950 tracking-tight">
                Privacy &amp; Data Protection Policy
              </h3>
              <p className="text-slate-400 text-xs font-medium">
                Compliant with UAE Federal Decree-Law No. 45/2021 (PDPL) &amp; FTA Standards
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-400 bg-white hover:bg-slate-100 hover:text-slate-800 border border-slate-200 rounded-full transition-colors shadow-sm cursor-pointer"
            aria-label="Close privacy policy"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Region */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 text-slate-600 text-sm leading-relaxed">
          
          {/* Security & SSL Trust Badge */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 space-y-1">
              <strong className="block text-emerald-900 font-bold">256-Bit SSL Encryption &amp; Bank-Grade Security</strong>
              <p className="leading-relaxed">
                All communications and form submissions through <strong>diasuae.ae</strong> are encrypted in transit using industry-standard 256-bit Secure Sockets Layer (SSL/TLS) cryptographic protocols. We enforce strict client confidentiality under UAE Tax Procedures Law and the UAE Personal Data Protection Law (PDPL).
              </p>
            </div>
          </div>

          {/* Introduction block */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 text-xs text-slate-500 italic">
            At Dias Accounting and Tax Consulting LLC (FTA Registered Tax Agency), we are dedicated to protecting the privacy, confidentiality, and security of our clients&apos; corporate and financial data. This policy outlines our standards for collecting, processing, and safeguarding your information across Dubai, Sharjah, and all UAE jurisdictions.
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-navy-950 text-sm tracking-wide uppercase flex items-center gap-2">
              <span className="text-gold-500 font-mono">01.</span> Information We Collect
            </h4>
            <p>
              We only collect personal and business information that you voluntarily submit through our contact forms, tax planners, WhatsApp advisory, or direct consulting engagements:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong className="text-slate-800">Contact Information:</strong> Full name, authorized signatory designation, official business email, and direct WhatsApp/telephone contact.
              </li>
              <li>
                <strong className="text-slate-800">Corporate &amp; Tax Data:</strong> Legal business entity name, trade license number, Free Zone / Mainland jurisdiction, estimated gross revenue, and tax registration numbers (TRN).
              </li>
              <li>
                <strong className="text-slate-800">Technical Session Data:</strong> Anonymized browsing metrics and security telemetry used strictly to safeguard our infrastructure from cyber threats.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-navy-950 text-sm tracking-wide uppercase flex items-center gap-2">
              <span className="text-gold-500 font-mono">02.</span> How We Use Your Data
            </h4>
            <p>
              Your information is processed strictly for professional accounting and tax advisory functions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>To perform Corporate Tax calculations, Small Business Relief (SBR) assessments, and penalty risk audits.</li>
              <li>To execute FTA-compliant VAT 201 return filings and Corporate Tax submissions via EmaraTax.</li>
              <li>To provide ongoing IFRS double-entry bookkeeping and financial statement auditing coordination.</li>
            </ul>
            <p className="bg-amber-50 border border-amber-200/70 text-amber-900 rounded-xl p-3.5 text-xs font-medium flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Commercial Sale Guarantee:</strong> We never sell, rent, monetize, or disclose your corporate or personal data to any external marketing brokers or third parties.
              </span>
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-navy-950 text-sm tracking-wide uppercase flex items-center gap-2">
              <span className="text-gold-500 font-mono">03.</span> Statutory Data Retention (7 Years)
            </h4>
            <p>
              Under Federal Decree-Law No. 28 of 2022 on Tax Procedures and Federal Decree-Law No. 47 of 2022 on Corporate Taxation:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong className="text-slate-800">Client Tax Records:</strong> All invoices, trial balances, general ledgers, and tax returns must be maintained securely for a statutory minimum of <strong>7 years</strong> following the end of the applicable tax period.
              </li>
              <li>
                <strong className="text-slate-800">Inquiry Data:</strong> Non-retained initial consultation inquiries are securely purged after 24 months upon request.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-navy-950 text-sm tracking-wide uppercase flex items-center gap-2">
              <span className="text-gold-500 font-mono">04.</span> Your Rights under UAE PDPL
            </h4>
            <p>
              Under UAE Federal Decree-Law No. 45/2021 regarding Personal Data Protection, you have the right to request access to the data we hold, request corrections to any inaccuracies, or request restricted processing (provided it does not contravene mandatory UAE tax record retention laws).
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-navy-950 text-sm tracking-wide uppercase flex items-center gap-2">
              <span className="text-gold-500 font-mono">05.</span> Contact Our Compliance Officer
            </h4>
            <p>
              For data protection questions or verification requests, contact our designated desk:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Official Email</p>
                  <a href="mailto:info@diasuae.ae" className="text-xs font-semibold text-navy-950 hover:text-gold-600 transition-colors truncate block">
                    info@diasuae.ae
                  </a>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Headquarters</p>
                  <p className="text-xs font-semibold text-navy-950">
                    SHAMS &amp; Dubai, UAE
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-100 p-4 md:px-8 flex justify-end bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-white bg-navy-950 hover:bg-gold-500 hover:text-navy-950 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            I Acknowledge
          </button>
        </div>

      </div>
    </div>
  );
}
