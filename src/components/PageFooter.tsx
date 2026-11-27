import React from "react";
import DiasLogo from "./DiasLogo";
import { GOOGLE_BUSINESS_URL } from "../data/staticData";
import {
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
  Award,
  ShieldCheck,
} from "lucide-react";
import {
  ClutchRatingWidget,
  ClutchAwardBadge,
  CLUTCH_AWARD_CAPTION,
} from "./ClutchBadges";

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
    <footer className="bg-gradient-to-b from-[#F8FAFC] via-[#FFFFFF] to-[#F8FAFC] text-[#475569] border-t border-[#E2E8F0] mt-auto pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[#E2E8F0]">
          {/* Column 1: Brand + FTA Badge */}
          <div className="lg:col-span-4 space-y-5">
            <a
              href="/"
              onClick={(e) => handleLink(e, "/")}
              className="inline-flex items-center"
              aria-label="DiasUAE — Dias Accounting and Tax Consulting LLC Home"
            >
              <DiasLogo
                className="h-9 md:h-10 w-auto"
                showText={true}
                showSubLabel={true}
                textSize="text-lg"
                textColor="text-[#0D1B2A]"
                subLabelColor="text-[#64748B]"
              />
            </a>

            <p className="text-sm text-[#475569] leading-relaxed max-w-xs">
              Dias Accounting and Tax Consulting LLC delivers fixed-fee IFRS bookkeeping, 5% VAT filings, and 9% Corporate Tax advisory across Dubai, Sharjah, and the UAE.
            </p>

            <div className="space-y-1.5 text-xs text-[#475569]">
              <div className="flex items-center gap-2 text-[#1B4332] font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>FTA Registered Tax Agency (UAE)</span>
              </div>
              <p className="tabular-nums">SHAMS Trade Licence: 2646813.01</p>
              <a
                href={GOOGLE_BUSINESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#475569] hover:text-[#1B4332] transition-colors pt-1 tabular-nums"
              >
                <span className="font-semibold text-[#0D1B2A]">
                  5.0 <span className="text-[#C5A059]">★</span> Google Rating
                </span>
                <span className="text-slate-400">·</span>
                <span>48 Verified Reviews</span>
              </a>

              {/* Live Clutch Rating Widget (40px pill) */}
              <div className="pt-3 space-y-1.5">
                <div className="inline-flex items-center rounded-lg bg-white border border-[#E2E8F0] px-2 py-1 shadow-xs">
                  <ClutchRatingWidget />
                </div>
                <p className="text-xs text-[#475569] leading-snug">
                  Verified UAE Accounting &amp; Corporate Tax Partner on Clutch
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href="https://www.instagram.com/diasuae.ae/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:border-[#1B4332]/50 text-[#0D1B2A] hover:text-[#1B4332] text-xs font-medium transition-colors shadow-xs"
                aria-label="DiasUAE on Instagram (@diasuae.ae)"
              >
                <Instagram className="w-3.5 h-3.5 text-[#856422] shrink-0" />
                <span>@diasuae.ae</span>
              </a>
              <a
                href="https://www.youtube.com/@diasuae"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:border-[#1B4332]/50 text-[#0D1B2A] hover:text-[#1B4332] text-xs font-medium transition-colors shadow-xs"
                aria-label="DiasUAE on YouTube (@diasuae)"
              >
                <Youtube className="w-3.5 h-3.5 text-[#856422] shrink-0" />
                <span>@diasuae</span>
              </a>
              <a
                href="https://ae.linkedin.com/company/diasaccounting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:border-[#1B4332]/50 text-[#0D1B2A] hover:text-[#1B4332] text-xs font-medium transition-colors shadow-xs"
                aria-label="DiasUAE on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#856422] shrink-0" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://www.facebook.com/diasuae"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:border-[#1B4332]/50 text-[#0D1B2A] hover:text-[#1B4332] text-xs font-medium transition-colors shadow-xs"
                aria-label="DiasUAE on Facebook"
              >
                <Facebook className="w-3.5 h-3.5 text-[#856422] shrink-0" />
                <span>Facebook</span>
              </a>
              <a
                href="https://clutch.co/profile/dias-accounting-tax-consulting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:border-[#1B4332]/50 text-[#0D1B2A] hover:text-[#1B4332] text-xs font-medium transition-colors shadow-xs"
                aria-label="DiasUAE Verified Clutch Profile"
              >
                <Award className="w-3.5 h-3.5 text-[#856422] shrink-0" />
                <span>Clutch</span>
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-[#0D1B2A]">Services</h3>
            <ul className="space-y-2.5 text-sm text-[#475569]">
              <li>
                <a
                  href="/services/corporate-tax-advisory"
                  onClick={(e) => handleLink(e, "/services/corporate-tax-advisory")}
                  className="hover:text-[#1B4332] transition-colors"
                >
                  Corporate Tax (9%)
                </a>
              </li>
              <li>
                <a
                  href="/services/vat-compliance"
                  onClick={(e) => handleLink(e, "/services/vat-compliance")}
                  className="hover:text-[#1B4332] transition-colors"
                >
                  VAT Compliance
                </a>
              </li>
              <li>
                <a
                  href="/services/accounting-bookkeeping"
                  onClick={(e) => handleLink(e, "/services/accounting-bookkeeping")}
                  className="hover:text-[#1B4332] transition-colors"
                >
                  IFRS Bookkeeping
                </a>
              </li>
              <li>
                <a
                  href="/tax-planning-difc"
                  onClick={(e) => handleLink(e, "/tax-planning-difc")}
                  className="hover:text-[#1B4332] transition-colors"
                >
                  DIFC &amp; DTEC Tax
                </a>
              </li>
              <li>
                <a
                  href="/dividends-audit"
                  onClick={(e) => handleLink(e, "/dividends-audit")}
                  className="hover:text-[#1B4332] transition-colors"
                >
                  Dividend Audits
                </a>
              </li>
              <li>
                <a
                  href="/company-setup"
                  onClick={(e) => handleLink(e, "/company-setup")}
                  className="hover:text-[#1B4332] transition-colors"
                >
                  Company Setup
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Tax Tools & Resources */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-semibold text-[#0D1B2A]">Tax Tools &amp; Resources</h3>
            <ul className="space-y-2.5 text-sm text-[#475569]">
              <li>
                <a
                  href="/uae-tax-planner"
                  onClick={(e) => handleLink(e, "/uae-tax-planner")}
                  className="hover:text-[#1B4332] transition-colors"
                >
                  2026 UAE Corporate Tax Calculator
                </a>
              </li>
              <li>
                <a
                  href="/uae-vat-calculator"
                  onClick={(e) => handleLink(e, "/uae-vat-calculator")}
                  className="hover:text-[#1B4332] transition-colors"
                >
                  UAE VAT Hub &amp; Calculator
                </a>
              </li>
              <li>
                <a
                  href="/small-business-tax-relief"
                  onClick={(e) => handleLink(e, "/small-business-tax-relief")}
                  className="hover:text-[#1B4332] transition-colors"
                >
                  0% Small Business Relief (SBR)
                </a>
              </li>
              <li>
                <a
                  href="/fta-deadlines"
                  onClick={(e) => handleLink(e, "/fta-deadlines")}
                  className="hover:text-[#1B4332] transition-colors"
                >
                  FTA Deadlines Calendar
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  onClick={(e) => handleLink(e, "/pricing")}
                  className="hover:text-[#1B4332] transition-colors"
                >
                  Pricing &amp; Packages
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={(e) => handleLink(e, "/blog")}
                  className="hover:text-[#1B4332] transition-colors"
                >
                  Tax Blog &amp; Insights
                </a>
              </li>
              <li>
                <a
                  href="/partners"
                  onClick={(e) => handleLink(e, "/partners")}
                  className="hover:text-[#1B4332] transition-colors"
                >
                  UAE Business Ecosystem &amp; Partners
                </a>
              </li>
              <li>
                <a
                  href="/faqs"
                  onClick={(e) => handleLink(e, "/faqs")}
                  className="hover:text-[#1B4332] transition-colors"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-semibold text-[#0D1B2A]">Contact</h3>
            <div className="space-y-3.5 text-sm text-[#475569]">
              <p className="leading-relaxed">
                Sharjah Media City (SHAMS), Al Messaned, Sharjah, UAE
                <span className="block text-xs text-[#64748B] mt-1 tabular-nums">
                  P.O. Box 515000 · Serving Dubai &amp; UAE
                </span>
              </p>

              <div className="space-y-1.5">
                <a
                  href="tel:+971529226958"
                  className="block font-medium text-[#0D1B2A] hover:text-[#1B4332] transition-colors tabular-nums"
                >
                  +971 52 922 6958
                </a>
                <a
                  href="mailto:info@diasuae.ae"
                  className="block font-medium text-[#0D1B2A] hover:text-[#1B4332] transition-colors"
                >
                  info@diasuae.ae
                </a>
              </div>

              <div className="text-xs text-[#64748B] leading-relaxed pt-1 tabular-nums">
                <p>Mon – Fri: 9:00 AM – 6:00 PM GST</p>
                <p>Sat: 10:00 AM – 2:00 PM GST</p>
              </div>

              {/* Visually Separated 2026 Clutch Award Accreditations */}
              <div className="pt-4 mt-4 border-t border-[#E2E8F0]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#856422] mb-3">
                  2026 Industry Recognition
                </p>
                <div className="space-y-3">
                  <ClutchAwardBadge />
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {CLUTCH_AWARD_CAPTION}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p className="tabular-nums">© {new Date().getFullYear()} Dias Accounting and Tax Consulting LLC (DiasUAE). All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="/about"
              onClick={(e) => handleLink(e, "/about")}
              className="hover:text-[#0D1B2A] transition-colors"
            >
              About Us
            </a>
            <a
              href="/testimonials"
              onClick={(e) => handleLink(e, "/testimonials")}
              className="hover:text-[#0D1B2A] transition-colors"
            >
              Reviews
            </a>
            <a
              href="/privacy-policy"
              onClick={(e) => handleLink(e, "/privacy-policy")}
              className="hover:text-[#0D1B2A] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => handleLink(e, "/terms")}
              className="hover:text-[#0D1B2A] transition-colors"
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
