import React from "react";
import DiasLogo from "./DiasLogo";
import { GoogleLogo } from "./GoogleLogo";
import AddToPreferredSources from "./AddToPreferredSources";
import { GOOGLE_BUSINESS_URL } from "../data/staticData";
import { Linkedin, Instagram, Facebook, ShieldCheck } from "lucide-react";

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

  return (
    <footer className="bg-navy-950 text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto md:mx-0">
              FTA-registered tax consulting and accounting firm in Dubai &amp; Sharjah. Providing certified Corporate Tax advisory (9% &amp; 0% QFZP), VAT compliance, IFRS accounting, and business incorporation across the UAE.
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
                <span className="font-mono font-bold text-gold-400">5.0 ★</span>
                <span className="text-[11px] text-slate-400">Google Reviews</span>
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

            {/* Add to Preferred Sources Badge */}
            {onOpenGooglePreferred && (
              <div className="pt-2 flex justify-center md:justify-start">
                <AddToPreferredSources onClick={onOpenGooglePreferred} />
              </div>
            )}
          </div>

          {/* Navigation Pages Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-mono font-bold text-[11px] uppercase tracking-[0.16em] text-slate-300">
              Site Pages
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <a href="/" onClick={(e) => handleLink(e, "/")} className="hover:text-gold-400 transition-colors">
                  Home Overview
                </a>
              </li>
              <li>
                <a href="/services" onClick={(e) => handleLink(e, "/services")} className="hover:text-gold-400 transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="/company-setup" onClick={(e) => handleLink(e, "/company-setup")} className="hover:text-gold-400 transition-colors">
                  Free Zone &amp; Mainland Setup
                </a>
              </li>
              <li>
                <a href="/pricing" onClick={(e) => handleLink(e, "/pricing")} className="hover:text-gold-400 transition-colors">
                  Transparent Pricing
                </a>
              </li>
              <li>
                <a href="/uae-tax-planner" onClick={(e) => handleLink(e, "/uae-tax-planner")} className="hover:text-gold-400 transition-colors text-gold-300 font-medium">
                  UAE Tax Planner 2026
                </a>
              </li>
              <li>
                <a href="/why-choose-us" onClick={(e) => handleLink(e, "/why-choose-us")} className="hover:text-gold-400 transition-colors">
                  Why Choose Dias
                </a>
              </li>
              <li>
                <a href="/blogs" onClick={(e) => handleLink(e, "/blogs")} className="hover:text-gold-400 transition-colors">
                  Tax Insights &amp; Articles
                </a>
              </li>
              <li>
                <a href="/testimonials" onClick={(e) => handleLink(e, "/testimonials")} className="hover:text-gold-400 transition-colors">
                  Client Reviews (5.0★)
                </a>
              </li>
              <li>
                <a href="/faqs" onClick={(e) => handleLink(e, "/faqs")} className="hover:text-gold-400 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => handleLink(e, "/contact")} className="hover:text-gold-400 transition-colors font-semibold text-gold-400">
                  Book Free Consultation
                </a>
              </li>
            </ul>
          </div>

          {/* Specialized Practice Hubs Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono font-bold text-[11px] uppercase tracking-[0.16em] text-slate-300">
              Specialized Hubs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="/small-business-tax-relief"
                  onClick={(e) => handleLink(e, "/small-business-tax-relief")}
                  className="hover:text-gold-300 transition-colors block text-gold-400 font-semibold"
                >
                  Small Business Tax Relief (AED 3M SBR)
                </a>
              </li>
              <li>
                <a
                  href="/difc-dtec-accounting"
                  onClick={(e) => handleLink(e, "/difc-dtec-accounting")}
                  className="hover:text-gold-300 transition-colors block text-gold-400 font-semibold"
                >
                  DIFC &amp; DTEC Accounting &amp; Audit
                </a>
              </li>
              <li>
                <a
                  href="/dividends-audit"
                  onClick={(e) => handleLink(e, "/dividends-audit")}
                  className="hover:text-gold-300 transition-colors block text-gold-400 font-semibold"
                >
                  Dividend Audit &amp; Distribution Advisory
                </a>
              </li>
              <li>
                <a href="/services" onClick={(e) => handleLink(e, "/services")} className="hover:text-gold-400 transition-colors block">
                  Corporate Tax Registration &amp; Filing (9%)
                </a>
              </li>
              <li>
                <a href="/services" onClick={(e) => handleLink(e, "/services")} className="hover:text-gold-400 transition-colors block">
                  FTA VAT Return Preparation (5%)
                </a>
              </li>
              <li>
                <a href="/services" onClick={(e) => handleLink(e, "/services")} className="hover:text-gold-400 transition-colors block">
                  IFRS Double-Entry Bookkeeping
                </a>
              </li>
            </ul>
          </div>

          {/* Corporate Desk Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono font-bold text-[11px] uppercase tracking-[0.16em] text-slate-300">
              Corporate Desk
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="leading-relaxed">
                Sharjah Media City (SHAMS),<br />
                Al Messaned, Sharjah &amp; Dubai,<br />
                United Arab Emirates
              </p>
              <div className="pt-2 space-y-1 font-mono text-xs text-slate-300">
                <a href="tel:+971529226958" className="block hover:text-gold-400 transition-colors">
                  +971 52 922 6958
                </a>
                <a href="mailto:info@diasuae.ae" className="block hover:text-gold-400 transition-colors">
                  info@diasuae.ae
                </a>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Mon - Sat: 9:00 AM – 6:00 PM (GST)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Dias Accounting and Tax Consulting LLC. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {onOpenPrivacy && (
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="hover:text-slate-300 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
            )}
            <a href="/contact" onClick={(e) => handleLink(e, "/contact")} className="hover:text-slate-300 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
