import React from "react";
import { X, Shield, Lock, FileText, Globe, Key, Mail, MapPin } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm transition-opacity">
      {/* Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] animate-scaleUp">
        
        {/* Header bar */}
        <div className="border-b border-slate-100 p-6 md:px-8 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg md:text-xl font-bold text-navy-950 tracking-tight">
                Privacy Policy
              </h3>
              <p className="text-slate-400 text-xs font-medium">Last Updated: June 2026</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-400 bg-white hover:bg-slate-100 hover:text-slate-800 border border-slate-150 rounded-full transition-colors shadow-sm"
            aria-label="Close privacy policy"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Region */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 text-slate-600 text-sm leading-relaxed">
          
          {/* Introduction block */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 text-xs text-slate-500 italic">
            At Dias Accounting and Tax consulting LLC, we are committed to protecting the privacy and security of our clients' and website visitors' data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or submit an inquiry for our accounting and tax consulting services in Dubai, UAE.
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-navy-950 text-sm tracking-wide uppercase flex items-center gap-2">
              <span className="text-gold-500 font-mono">01.</span> Information We Collect
            </h4>
            <p>
              We only collect personal information that you voluntarily provide to us through our website contact forms, email, or direct communications, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong className="text-slate-800">Contact Data:</strong> Name, business email address, phone/WhatsApp number.
              </li>
              <li>
                <strong className="text-slate-800">Business Data:</strong> Company name, industry type, and specific details regarding your corporate tax or VAT inquiry.
              </li>
              <li>
                <strong className="text-slate-800">Technical Data:</strong> Anonymized IP addresses, browser types, and page behavior collected via Google Analytics to help us optimize our website performance.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-navy-950 text-sm tracking-wide uppercase flex items-center gap-2">
              <span className="text-gold-500 font-mono">02.</span> How We Use Your Information
            </h4>
            <p>
              We use the collected information strictly for professional purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>To respond to your requests for tax consultations or service quotes.</li>
              <li>To provide corporate tax advisory, VAT compliance, and bookkeeping services.</li>
              <li>To analyze ad campaign performance and optimize our Google Ads marketing.</li>
            </ul>
            <p className="bg-amber-50 border border-amber-100/70 text-amber-800/90 rounded-xl p-3.5 text-xs font-medium flex gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Important Note:</strong> We strictly do not sell, rent, or lease your personal or corporate financial data to any third parties for marketing purposes.
              </span>
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-navy-950 text-sm tracking-wide uppercase flex items-center gap-2">
              <span className="text-gold-500 font-mono">03.</span> Data Storage and Retention
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong className="text-slate-800">Inquiry Data:</strong> General inquiries submitted via our web forms are kept for up to 24 months unless deletion is requested sooner.
              </li>
              <li>
                <strong className="text-slate-800">Client Financial Records:</strong> For engaged clients, all financial data, VAT filings, and corporate tax records are maintained securely for a minimum of 5 to 7 years in strict compliance with UAE Federal Tax Authority (FTA) regulations.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-navy-950 text-sm tracking-wide uppercase flex items-center gap-2">
              <span className="text-gold-500 font-mono">04.</span> Cookies and Ad Tracking
            </h4>
            <p>
              Our website uses essential and analytical cookies (such as Google Analytics and Google Ads conversion pixels). These cookies track user interaction data anonymously to measure the performance of our digital advertisements and improve user experience. You can choose to disable cookies through your personal browser settings at any time.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-navy-950 text-sm tracking-wide uppercase flex items-center gap-2">
              <span className="text-gold-500 font-mono">05.</span> Your Data Rights
            </h4>
            <p>
              Under applicable data protection frameworks, you hold the right to access the personal data we store, request corrections to inaccurate information, or request complete deletion of your records (provided it does not conflict with statutory UAE financial record-keeping laws).
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-navy-950 text-sm tracking-wide uppercase flex items-center gap-2">
              <span className="text-gold-500 font-mono">06.</span> Contact Us
            </h4>
            <p>
              For any privacy-related questions or data requests, please contact us at:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Email Inquiry</p>
                  <a href="mailto:info@diasuae.ae" className="text-xs font-semibold text-navy-950 hover:text-gold-600 transition-colors truncate block">
                    info@diasuae.ae
                  </a>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Jurisdiction</p>
                  <p className="text-xs font-semibold text-navy-950">
                    United Arab Emirates
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
            className="px-5 py-2 text-xs font-bold text-white bg-navy-950 hover:bg-gold-500 hover:text-navy-950 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            I Acknowledge
          </button>
        </div>

      </div>
    </div>
  );
}
