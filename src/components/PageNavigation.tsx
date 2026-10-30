import React, { useState } from "react";
import {
  Menu,
  X,
  Phone,
  ArrowRight,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import DiasLogo from "./DiasLogo";
import ComplianceAlertBanner from "./ComplianceAlertBanner";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "../i18n/LanguageContext";

interface PageNavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  currentPath,
  onNavigate,
  onOpenAudit,
}) => {
  const { t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/services", label: t.nav.services },
    { path: "/company-setup", label: language === "ar" ? "تأسيس الشركات" : "Company Setup" },
    { path: "/pricing", label: t.nav.pricing },
    { path: "/uae-tax-planner", label: language === "ar" ? "حاسبة الضرائب" : "Tax Planner" },
    { path: "/why-choose-us", label: language === "ar" ? "لماذا دياس؟" : "Why Dias" },
    { path: "/blogs", label: language === "ar" ? "الرؤى والمدونة" : "Insights" },
    { path: "/testimonials", label: t.nav.reviews },
    { path: "/faqs", label: t.nav.faq },
  ];

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <>
      {/* 0. Top FTA Compliance Alert Banner */}
      <ComplianceAlertBanner onOpenAudit={onOpenAudit} />

      {/* 1. Header / Navigation - Architectural Top Bar */}
      <header
        role="banner"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          
          {/* Zone 1: Brand Wordmark & Logo */}
          <div className="flex items-center shrink-0">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, "/")}
              className="group flex items-center gap-3 cursor-pointer select-none transition-opacity duration-150 hover:opacity-90"
              aria-label="Dias Accounting Home"
            >
              <DiasLogo
                className="w-10 h-10"
                showText={true}
                textSize="text-xl sm:text-2xl"
                textColor="text-navy-950"
              />
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-5 xl:gap-6">
            {navLinks.map((link) => {
              const isActive =
                currentPath === link.path ||
                (link.path === "/services" && currentPath.startsWith("/service")) ||
                (link.path === "/blogs" && currentPath.startsWith("/blog")) ||
                (link.path === "/testimonials" && currentPath === "/reviews");

              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className={`relative py-2 text-xs font-semibold tracking-tight whitespace-nowrap shrink-0 transition-colors duration-150 border-b-2 ${
                    isActive
                      ? "text-navy-950 border-gold-500 font-bold"
                      : "text-slate-600 border-transparent hover:text-navy-950 hover:border-gold-400/60"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}

            {/* Dedicated SEO Advisory Hubs Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="py-2 text-xs font-semibold tracking-tight whitespace-nowrap shrink-0 flex items-center gap-1 text-slate-600 hover:text-navy-950 border-b-2 border-transparent hover:border-gold-400/60 transition-colors duration-150 cursor-pointer"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span>{language === "ar" ? "المراكز المتخصصة" : "Practice Hubs"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gold-600 transition-transform duration-150 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full right-0 pt-2 w-64 hidden group-hover:block z-50">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200/90 p-2 space-y-1">
                  <a
                    href="/uae-tax-planner"
                    onClick={(e) => handleLinkClick(e, "/uae-tax-planner")}
                    className="flex flex-col p-2.5 rounded-lg hover:bg-slate-50 transition-colors group/item"
                  >
                    <span className="text-xs font-bold text-navy-950 group-hover/item:text-gold-600 transition-colors">
                      {language === "ar" ? "حاسبة وخطط الضرائب 2026" : "UAE Tax Planner 2026"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      {language === "ar" ? "حساب ضريبة الشركات والـ VAT والمواعيد" : "Corporate Tax, VAT & SBR Estimator"}
                    </span>
                  </a>
                  <a
                    href="/corporate-tax-calculator"
                    onClick={(e) => handleLinkClick(e, "/corporate-tax-calculator")}
                    className="flex flex-col p-2.5 rounded-lg hover:bg-slate-50 transition-colors group/item"
                  >
                    <span className="text-xs font-bold text-navy-950 group-hover/item:text-gold-600 transition-colors">
                      {language === "ar" ? "حاسبة ضريبة الشركات وتوفير 0%" : "Corporate Tax Calculator (9%)"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      {language === "ar" ? "وفر حتى 270,000 درهم قانونياً" : "Claim up to AED 270K in tax relief"}
                    </span>
                  </a>
                  <a
                    href="/uae-vat-calculator"
                    onClick={(e) => handleLinkClick(e, "/uae-vat-calculator")}
                    className="flex flex-col p-2.5 rounded-lg hover:bg-slate-50 transition-colors group/item"
                  >
                    <span className="text-xs font-bold text-navy-950 group-hover/item:text-emerald-600 transition-colors">
                      {language === "ar" ? "حاسبة ضريبة القيمة المضافة 5%" : "UAE VAT Calculator & 5% Hub"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      {language === "ar" ? "إقرار 201 واسترداد الضريبة" : "Form 201 & Input Tax Recovery"}
                    </span>
                  </a>
                  <a
                    href="/fta-deadlines"
                    onClick={(e) => handleLinkClick(e, "/fta-deadlines")}
                    className="flex flex-col p-2.5 rounded-lg hover:bg-slate-50 transition-colors group/item"
                  >
                    <span className="text-xs font-bold text-navy-950 group-hover/item:text-gold-600 transition-colors">
                      {language === "ar" ? "تقويم مواعيد ومهل الضرائب FTA" : "FTA Deadlines & Penalty Calendar"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      {language === "ar" ? "حماية من غرامة 10,000 درهم" : "AED 10,000 Penalty Shield (9 Months)"}
                    </span>
                  </a>
                  <a
                    href="/small-business-tax-relief"
                    onClick={(e) => handleLinkClick(e, "/small-business-tax-relief")}
                    className="flex flex-col p-2.5 rounded-lg hover:bg-slate-50 transition-colors group/item"
                  >
                    <span className="text-xs font-bold text-navy-950 group-hover/item:text-gold-600 transition-colors">
                      {language === "ar" ? "تسهيلات الأعمال الصغيرة (0%)" : "Small Business Tax Relief"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      {language === "ar" ? "إعفاء حتى 2029 (3 ملايين درهم)" : "AED 3M SBR extended to 2029"}
                    </span>
                  </a>
                  <a
                    href="/difc-dtec-accounting"
                    onClick={(e) => handleLinkClick(e, "/difc-dtec-accounting")}
                    className="flex flex-col p-2.5 rounded-lg hover:bg-slate-50 transition-colors group/item"
                  >
                    <span className="text-xs font-bold text-navy-950 group-hover/item:text-gold-600 transition-colors">
                      {language === "ar" ? "محاسبة وتدقيق DIFC و DTEC" : "DIFC & DTEC Accounting"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      {language === "ar" ? "امتثال 0% QFZP وتدقيق DFSA" : "0% QFZP & DFSA audit readiness"}
                    </span>
                  </a>
                  <a
                    href="/dividends-audit"
                    onClick={(e) => handleLinkClick(e, "/dividends-audit")}
                    className="flex flex-col p-2.5 rounded-lg hover:bg-slate-50 transition-colors group/item"
                  >
                    <span className="text-xs font-bold text-navy-950 group-hover/item:text-gold-600 transition-colors">
                      {language === "ar" ? "تدقيق وتوزيع الأرباح" : "Dividend Audit & Distribution"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      {language === "ar" ? "شهادة الأرباح وقانون الشركات" : "IFRS & Commercial Companies Law"}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </nav>

          {/* Zone 3: Language Switcher & Consultation CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <LanguageToggle variant="desktop" />

            <a
              href="/contact"
              onClick={(e) => handleLinkClick(e, "/contact")}
              className={`font-display font-semibold py-2.5 px-5 rounded-xl text-xs tracking-tight transition-all duration-150 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-xs ${
                currentPath === "/contact"
                  ? "bg-gold-500 text-navy-950 hover:bg-gold-400 font-bold border border-gold-400"
                  : "bg-navy-950 hover:bg-navy-900 text-white border border-gold-500/40 hover:border-gold-400"
              }`}
            >
              <span>{t.nav.bookConsultation}</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold-400 rtl:rotate-180" />
            </a>
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="tel:+971529226958"
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-navy-950 hover:border-gold-400 transition-colors"
              aria-label="Direct Phone Advisory Call"
            >
              <Phone className="w-4 h-4 text-gold-600" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-navy-950 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer transition-colors"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          id="mobile-nav-menu"
          className={`lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 overflow-hidden flex flex-col transition-all duration-200 ease-out origin-top ${
            mobileMenuOpen
              ? "opacity-100 max-h-[calc(100vh-5rem)] pointer-events-auto visible"
              : "opacity-0 max-h-0 pointer-events-none invisible"
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="px-4 sm:px-6 pt-4 pb-5 space-y-3 overflow-y-auto flex-1">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {language === "ar" ? "اللغة" : "Language"}
              </span>
              <LanguageToggle variant="mobile" />
            </div>

            <div className="divide-y divide-slate-100">
              {[
                { path: "/", label: t.nav.home },
                { path: "/services", label: t.nav.services },
                { path: "/company-setup", label: language === "ar" ? "تأسيس الشركات في دبي والإمارات" : "Company Setup (Mainland & Free Zone)" },
                { path: "/pricing", label: t.nav.pricing },
                { path: "/uae-tax-planner", label: language === "ar" ? "حاسبة وخطط الضرائب 2026" : "UAE Tax Planner & 2026 Calculator" },
                { path: "/why-choose-us", label: language === "ar" ? "لماذا تختار دياس؟" : "Why Choose Dias" },
                { path: "/blogs", label: language === "ar" ? "الرؤى والمدونة" : "Insights & Regulatory Guides" },
                { path: "/testimonials", label: t.nav.reviews },
                { path: "/faqs", label: t.nav.faq },
                { path: "/contact", label: t.nav.bookConsultation },
              ].map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={(e) => handleLinkClick(e, link.path)}
                    className={`flex items-center justify-between py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-gold-600 font-bold bg-gold-50/50 px-2 rounded-lg"
                        : "text-navy-950 hover:text-gold-600"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
                  </a>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 block">
                {language === "ar" ? "مراكز استشارية متخصصة" : "Specialized Practice Hubs"}
              </span>
              {[
                { path: "/corporate-tax-calculator", label: language === "ar" ? "حاسبة ضريبة الشركات 9% (صفحة مخصصة)" : "Corporate Tax Calculator (9% Landing Page)" },
                { path: "/uae-vat-calculator", label: language === "ar" ? "حاسبة ضريبة القيمة المضافة 5% (صفحة مخصصة)" : "UAE VAT 5% Calculator (Landing Page)" },
                { path: "/fta-deadlines", label: language === "ar" ? "تقويم مواعيد ومهل الضرائب FTA (صفحة مخصصة)" : "FTA Deadlines & Penalties (Landing Page)" },
                { path: "/small-business-tax-relief", label: language === "ar" ? "تسهيلات الأعمال الصغيرة (0% حتى 2029)" : "Small Business Tax Relief (AED 3M SBR)" },
                { path: "/difc-dtec-accounting", label: language === "ar" ? "محاسبة وتدقيق DIFC و DTEC" : "DIFC & DTEC Accounting & Audit" },
                { path: "/dividends-audit", label: language === "ar" ? "تدقيق وتوزيع الأرباح" : "Dividend Audit & Distribution" },
              ].map((hub) => (
                <a
                  key={hub.path}
                  href={hub.path}
                  onClick={(e) => handleLinkClick(e, hub.path)}
                  className="flex items-center justify-between py-2 text-xs font-semibold text-slate-600 hover:text-navy-950 transition-colors"
                >
                  <span>{hub.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl:rotate-180" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default PageNavigation;
