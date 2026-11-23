import React from "react";
import DiasLogo from "./DiasLogo";
import { GOOGLE_BUSINESS_URL } from "../data/staticData";
import {
  Linkedin,
  Instagram,
  Facebook,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

interface PageFooterProps {
  onNavigate: (path: string) => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const PageFooter: React.FC<PageFooterProps> = ({
  onNavigate,
}) => {
  const handleLink = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="bg-[#0D1B2A] text-slate-300 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Column 1: Brand + FTA Badge */}
          <div className="lg:col-span-4 space-y-5">
            <a
              href="/"
              onClick={(e) => handleLink(e, "/")}
              className="inline-flex items-center"
              aria-label="Dias Accounting Home"
            >
              <DiasLogo
                className="w-8 h-8"
                showText={true}
                textSize="text-lg"
                textColor="text-white"
              />
            </a>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xs">
              Dias Accounting &amp; Tax Consulting LLC delivers fixed-fee IFRS bookkeeping, 5% VAT filings, and 9% Corporate Tax advisory across Dubai, Sharjah, and the UAE.
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-emerald-300 font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>FTA Registered Tax Agency (UAE)</span>
              </div>
              <p className="tabular-nums">Trade Licence: SHAMS 2646813.01</p>
              <a
                href={GOOGLE_BUSINESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors pt-1 tabular-nums"
              >
                <span className="font-semibold text-white">
                  5.0 <span className="text-[#C5A059]">★</span> Google Rating
                </span>
                <span className="text-slate-400">·</span>
                <span>48 Verified Reviews</span>
              </a>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.linkedin.com/company/diasaccounting/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-white/15 hover:border-white/35 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/diasuae.ae/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-white/15 hover:border-white/35 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/diasuae"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-white/15 hover:border-white/35 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-white">Services</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a
                  href="/services/corporate-tax-advisory"
                  onClick={(e) => handleLink(e, "/services/corporate-tax-advisory")}
                  className="hover:text-white transition-colors"
                >
                  Corporate Tax (9%)
                </a>
              </li>
              <li>
                <a
                  href="/services/vat-compliance"
                  onClick={(e) => handleLink(e, "/services/vat-compliance")}
                  className="hover:text-white transition-colors"
                >
                  VAT Compliance
                </a>
              </li>
              <li>
                <a
                  href="/services/accounting-bookkeeping"
                  onClick={(e) => handleLink(e, "/services/accounting-bookkeeping")}
                  className="hover:text-white transition-colors"
                >
                  IFRS Bookkeeping
                </a>
              </li>
              <li>
                <a
                  href="/tax-planning-difc"
                  onClick={(e) => handleLink(e, "/tax-planning-difc")}
                  className="hover:text-white transition-colors"
                >
                  DIFC &amp; DTEC Tax
                </a>
              </li>
              <li>
                <a
                  href="/dividends-audit"
                  onClick={(e) => handleLink(e, "/dividends-audit")}
                  className="hover:text-white transition-colors"
                >
                  Dividend Audits
                </a>
              </li>
              <li>
                <a
                  href="/company-setup"
                  onClick={(e) => handleLink(e, "/company-setup")}
                  className="hover:text-white transition-colors"
                >
                  Company Setup
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Tax Tools & Resources */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-semibold text-white">Tax Tools &amp; Resources</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a
                  href="/uae-tax-planner"
                  onClick={(e) => handleLink(e, "/uae-tax-planner")}
                  className="hover:text-white transition-colors"
                >
                  2026 UAE Corporate Tax Calculator
                </a>
              </li>
              <li>
                <a
                  href="/uae-vat-calculator"
                  onClick={(e) => handleLink(e, "/uae-vat-calculator")}
                  className="hover:text-white transition-colors"
                >
                  UAE VAT Hub &amp; Calculator
                </a>
              </li>
              <li>
                <a
                  href="/small-business-tax-relief"
                  onClick={(e) => handleLink(e, "/small-business-tax-relief")}
                  className="hover:text-white transition-colors"
                >
                  0% Small Business Relief (SBR)
                </a>
              </li>
              <li>
                <a
                  href="/fta-deadlines"
                  onClick={(e) => handleLink(e, "/fta-deadlines")}
                  className="hover:text-white transition-colors"
                >
                  FTA Deadlines Calendar
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  onClick={(e) => handleLink(e, "/pricing")}
                  className="hover:text-white transition-colors"
                >
                  Pricing &amp; Packages
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={(e) => handleLink(e, "/blog")}
                  className="hover:text-white transition-colors"
                >
                  Tax Blog &amp; Guides
                </a>
              </li>
              <li>
                <a
                  href="https://insights.diasuae.ae/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>Live Tax Insights</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="/partners"
                  onClick={(e) => handleLink(e, "/partners")}
                  className="hover:text-white transition-colors"
                >
                  UAE Business Ecosystem &amp; Partners
                </a>
              </li>
              <li>
                <a
                  href="/faqs"
                  onClick={(e) => handleLink(e, "/faqs")}
                  className="hover:text-white transition-colors"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <div className="space-y-3.5 text-sm text-slate-300">
              <p className="leading-relaxed">
                Sharjah Media City (SHAMS), Al Messaned, Sharjah, UAE
                <span className="block text-xs text-slate-400 mt-1 tabular-nums">
                  P.O. Box 515000 · Serving Dubai &amp; UAE
                </span>
              </p>

              <div className="space-y-1.5">
                <a
                  href="tel:+971529226958"
                  className="block text-white hover:text-slate-200 transition-colors tabular-nums"
                >
                  +971 52 922 6958
                </a>
                <a
                  href="mailto:info@diasuae.ae"
                  className="block text-white hover:text-slate-200 transition-colors"
                >
                  info@diasuae.ae
                </a>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed pt-1 tabular-nums">
                <p>Mon – Fri: 9:00 AM – 6:00 PM GST</p>
                <p>Sat: 10:00 AM – 2:00 PM GST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="tabular-nums">© {new Date().getFullYear()} Dias Accounting &amp; Tax Consulting LLC. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="/about"
              onClick={(e) => handleLink(e, "/about")}
              className="hover:text-white transition-colors"
            >
              About Us
            </a>
            <a
              href="/testimonials"
              onClick={(e) => handleLink(e, "/testimonials")}
              className="hover:text-white transition-colors"
            >
              Reviews
            </a>
            <a
              href="/privacy-policy"
              onClick={(e) => handleLink(e, "/privacy-policy")}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => handleLink(e, "/terms")}
              className="hover:text-white transition-colors"
            >
              Terms of Engagement
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
