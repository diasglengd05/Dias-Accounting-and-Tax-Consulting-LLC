import React from "react";
import DiasLogo from "./DiasLogo";
import { GoogleLogo } from "./GoogleLogo";
import AddToPreferredSources from "./AddToPreferredSources";
import { GOOGLE_BUSINESS_URL } from "../data/staticData";
import {
  Linkedin,
  Instagram,
  Facebook,
  ShieldCheck,
  ExternalLink,
  Lock,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

interface PageFooterProps {
  onNavigate: (path: string) => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const PageFooter: React.FC<PageFooterProps> = ({
  onNavigate,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const handleLink = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  const handleWhatsApp = () => {
    const defaultMsg = encodeURIComponent("Hi, I'd like to know more about your tax services.");
    window.open(`https://wa.me/971529226958?text=${defaultMsg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="bg-navy-950 text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust & Security Certification Banner */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">256-Bit SSL Encrypted</span>
              <span className="text-[11px] text-slate-400">Bank-grade data security &amp; encryption</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">UAE PDPL &amp; IFRS Compliant</span>
              <span className="text-[11px] text-slate-400">Federal Decree-Law No. 45/2021 Data Protection</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Brand Info Column */}
          <div className="md:col-span-4 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <a
                href="/"
                onClick={(e) => handleLink(e, "/")}
                className="inline-flex items-center gap-3 cursor-pointer"
              >
                <DiasLogo
                  className="w-10 h-10"
                  showText={true}
                  textSize="text-xl"
                  textColor="text-white"
                />
              </a>
            </div>

            {/* Business Registration Details */}
            <div className="space-y-1 text-xs text-slate-300">
              <p className="font-bold text-white text-sm">Dias Accounting &amp; Tax Consulting LLC</p>
              <p className="text-slate-400 text-xs">
                Trade Licence No: <span className="text-gold-400 font-mono">SHAMS 2646813.01</span>
              </p>
              <p className="text-slate-400 text-xs">
                FTA Registration: <span className="text-gold-400 font-mono">FTA Registered Tax Agency (UAE)</span>
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto md:mx-0">
              Corporate tax consulting, VAT compliance, IFRS bookkeeping, and business incorporation for UAE mainland &amp; Free Zone businesses.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-gold-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Federal Tax Authority Registered Agency</span>
            </div>

            {/* Social Connections */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
              <a
                href={GOOGLE_BUSINESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-gold-400/50 hover:text-gold-400 flex items-center gap-1.5 text-xs text-slate-300 transition-colors"
                title="Dias Accounting Google Business Profile"
              >
                <GoogleLogo className="w-3.5 h-3.5" />
                <span className="font-mono font-bold text-gold-400">5.0 ★ (48 Reviews)</span>
              </a>
              <a
                href="https://www.linkedin.com/company/diasaccounting/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-gold-400/50 hover:text-gold-400 flex items-center justify-center text-slate-400 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/diasuae.ae/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-gold-400/50 hover:text-gold-400 flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/diasuae"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-gold-400/50 hover:text-gold-400 flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Facebook Profile"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>

            {onOpenGooglePreferred && (
              <div className="pt-2 flex justify-center md:justify-start">
                <AddToPreferredSources onClick={onOpenGooglePreferred} />
              </div>
            )}
          </div>

          {/* Site Navigation Links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-mono font-bold text-[11px] uppercase tracking-[0.16em] text-slate-300">
              Site Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <a href="/" onClick={(e) => handleLink(e, "/")} className="hover:text-gold-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/services" onClick={(e) => handleLink(e, "/services")} className="hover:text-gold-400 transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="/uae-tax-planner" onClick={(e) => handleLink(e, "/uae-tax-planner")} className="hover:text-gold-400 transition-colors text-gold-300 font-medium">
                  Tax Planner
                </a>
              </li>
              <li>
                <a href="/pricing" onClick={(e) => handleLink(e, "/pricing")} className="hover:text-gold-400 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/about" onClick={(e) => handleLink(e, "/about")} className="hover:text-gold-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/testimonials" onClick={(e) => handleLink(e, "/testimonials")} className="hover:text-gold-400 transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="/blogs" onClick={(e) => handleLink(e, "/blogs")} className="hover:text-gold-400 transition-colors">
                  Blog / Insights
                </a>
              </li>
              <li>
                <a
                  href="https://insights.diasuae.ae/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-300 transition-colors inline-flex items-center gap-1.5 text-emerald-400 font-semibold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Tax &amp; Regulatory Blog (insights.diasuae.ae) ↗
                </a>
              </li>
              <li>
                <a href="/faqs" onClick={(e) => handleLink(e, "/faqs")} className="hover:text-gold-400 transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => handleLink(e, "/contact")} className="hover:text-gold-400 transition-colors font-semibold text-gold-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Dedicated Services Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono font-bold text-[11px] uppercase tracking-[0.16em] text-slate-300">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="/services/corporate-tax"
                  onClick={(e) => handleLink(e, "/services/corporate-tax")}
                  className="hover:text-gold-300 transition-colors block text-gold-400 font-semibold"
                >
                  Corporate Tax Registration &amp; Filing
                </a>
              </li>
              <li>
                <a
                  href="/services/vat-compliance"
                  onClick={(e) => handleLink(e, "/services/vat-compliance")}
                  className="hover:text-gold-300 transition-colors block text-gold-400 font-semibold"
                >
                  VAT Registration &amp; Returns
                </a>
              </li>
              <li>
                <a
                  href="/services/accounting-bookkeeping"
                  onClick={(e) => handleLink(e, "/services/accounting-bookkeeping")}
                  className="hover:text-gold-300 transition-colors block text-gold-400 font-semibold"
                >
                  Monthly Bookkeeping &amp; Ledgers
                </a>
              </li>
              <li>
                <a
                  href="/services/audit-readiness"
                  onClick={(e) => handleLink(e, "/services/audit-readiness")}
                  className="hover:text-gold-300 transition-colors block text-gold-400 font-semibold"
                >
                  Audit Readiness &amp; Advisory
                </a>
              </li>
              <li>
                <a
                  href="/small-business-tax-relief"
                  onClick={(e) => handleLink(e, "/small-business-tax-relief")}
                  className="hover:text-gold-300 transition-colors block text-slate-300"
                >
                  Small Business Relief (AED 3M SBR)
                </a>
              </li>
              <li>
                <a
                  href="/corporate-tax-calculator"
                  onClick={(e) => handleLink(e, "/corporate-tax-calculator")}
                  className="hover:text-gold-300 transition-colors block text-slate-300"
                >
                  Corporate Tax Calculator (9%)
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Address Column with tap-to-call, mailto, and placeholders */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono font-bold text-[11px] uppercase tracking-[0.16em] text-slate-300">
              Office &amp; Contacts
            </h4>
            
            <div className="space-y-3 text-xs text-slate-400">
              <div>
                <span className="text-[10px] font-mono text-gold-400 uppercase tracking-wider block font-bold">
                  Registered Office Address
                </span>
                <p className="leading-relaxed mt-0.5">
                  Business Center, Sharjah Media City (SHAMS),<br />
                  Al Messaned, Sharjah (P.O. Box 515000)
                </p>
              </div>

              {/* Tap-to-call, Mailto & WhatsApp Links */}
              <div className="pt-2 space-y-2 border-t border-white/10">
                <a
                  href="tel:+971529226958"
                  className="flex items-center gap-2 hover:text-gold-400 transition-colors font-mono text-xs text-slate-200"
                >
                  <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>+971 52 922 6958 (Tap to Call)</span>
                </a>

                <a
                  href="mailto:info@diasuae.ae"
                  className="flex items-center gap-2 hover:text-gold-400 transition-colors font-mono text-xs text-slate-200"
                >
                  <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>info@diasuae.ae</span>
                </a>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors font-mono text-xs text-emerald-400 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-start gap-2 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300 block">Working Hours:</span>
                  <span>Mon – Fri: 9:00 AM – 6:00 PM | Sat: 10:00 AM – 2:00 PM (GST)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Privacy Policy & Terms Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Dias Accounting &amp; Tax Consulting LLC. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="/privacy-policy"
              onClick={(e) => handleLink(e, "/privacy-policy")}
              className="hover:text-gold-400 transition-colors underline underline-offset-2"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => handleLink(e, "/terms")}
              className="hover:text-gold-400 transition-colors underline underline-offset-2"
            >
              Terms of Engagement
            </a>
            <a
              href="/contact"
              onClick={(e) => handleLink(e, "/contact")}
              className="hover:text-slate-300 transition-colors"
            >
              Contact Desk
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
