import React, { useState } from "react";
import {
  Menu,
  X,
  Phone,
  ArrowRight,
  ChevronRight,
  MessageCircle,
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

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  // Exactly requested nav order: Home, Services, Tax Planner, Pricing, About, Testimonials, Blog, FAQs, Contact
  const navItems = [
    { path: "/", label: t.nav.home || "Home" },
    { path: "/services", label: t.nav.services || "Services" },
    { path: "/uae-tax-planner", label: language === "ar" ? "حاسبة الضرائب" : "Tax Planner" },
    { path: "/pricing", label: t.nav.pricing || "Pricing" },
    { path: "/about", label: language === "ar" ? "من نحن" : "About" },
    { path: "/testimonials", label: t.nav.reviews || "Testimonials" },
    { path: "/blogs", label: language === "ar" ? "المدونة" : "Blog" },
    { path: "/faqs", label: t.nav.faq || "FAQs" },
    { path: "/contact", label: language === "ar" ? "تواصل معنا" : "Contact" },
  ];

  return (
    <>
      {/* 0. Top FTA Compliance Alert Banner */}
      <ComplianceAlertBanner onOpenAudit={onOpenAudit} />

      {/* 1. Header / Navigation - Sticky on Desktop & Mobile */}
      <header
        role="banner"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-6">
          
          {/* Zone 1: Brand Logo */}
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
          <nav aria-label="Main Navigation" className="hidden xl:flex items-center gap-4 xl:gap-5">
            {navItems.map((item) => {
              const isActive =
                currentPath === item.path ||
                (item.path === "/services" && currentPath.startsWith("/service")) ||
                (item.path === "/blogs" && currentPath.startsWith("/blog")) ||
                (item.path === "/about" && currentPath === "/why-choose-us");

              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleLinkClick(e, item.path)}
                  className={`relative py-2 text-xs font-semibold tracking-tight whitespace-nowrap shrink-0 transition-colors duration-150 border-b-2 ${
                    isActive
                      ? "text-navy-950 border-gold-500 font-bold"
                      : "text-slate-600 border-transparent hover:text-navy-950 hover:border-gold-400/60"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Sticky "Book a Free Consultation" CTA + Controls (Desktop >= xl) */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <LanguageToggle variant="desktop" />

            {/* Tap-to-call link */}
            <a
              href="tel:+971529226958"
              className="p-2 text-slate-700 hover:text-gold-600 transition-colors"
              title="Call Dias Accounting: +971 52 922 6958"
              aria-label="Direct Phone Line"
            >
              <Phone className="w-4 h-4 text-gold-600" />
            </a>

            {/* Sticky "Book a Free Consultation" Button on Desktop */}
            <a
              href="/contact"
              onClick={(e) => handleLinkClick(e, "/contact")}
              className="font-display font-bold py-2.5 px-5 rounded-xl text-xs tracking-tight bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 hover:from-gold-400 hover:to-gold-500 text-navy-950 border border-gold-400/80 shadow-sm hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
            >
              <span>{language === "ar" ? "احجز استشارة مجانية" : "Book a Free Consultation"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-navy-950 rtl:rotate-180" />
            </a>
          </div>

          {/* Mobile & Tablet Controls (< xl) */}
          <div className="flex xl:hidden items-center gap-2 sm:gap-2.5">
            {/* Tablet Quick Language Toggle */}
            <div className="hidden sm:inline-flex">
              <LanguageToggle variant="compact" />
            </div>

            {/* Mobile Sticky Book a Free Consultation Button */}
            <a
              href="/contact"
              onClick={(e) => handleLinkClick(e, "/contact")}
              className="text-[11px] sm:text-xs font-bold py-2 px-3 sm:px-3.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap active:scale-95 transition-transform"
            >
              <span>{language === "ar" ? "استشارة مجانية" : "Free Consultation"}</span>
            </a>

            {/* Mobile Tap-to-Call */}
            <a
              href="tel:+971529226958"
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-navy-950 hover:border-gold-400 hover:text-gold-600 transition-colors"
              aria-label="Direct Phone Call"
              title="Call Dias Accounting: +971 52 922 6958"
            >
              <Phone className="w-4 h-4 text-gold-600" />
            </a>

            {/* Hamburger Button */}
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
          className={`xl:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 overflow-hidden flex flex-col transition-all duration-200 ease-out origin-top ${
            mobileMenuOpen
              ? "opacity-100 max-h-[calc(100vh-5rem)] pointer-events-auto visible"
              : "opacity-0 max-h-0 pointer-events-none invisible"
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="px-4 sm:px-6 pt-4 pb-6 space-y-4 overflow-y-auto flex-1">
            
            {/* Top Bar with Language Toggle */}
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {language === "ar" ? "اللغة / Language" : "Language"}
              </span>
              <LanguageToggle variant="mobile" />
            </div>

            {/* Primary Mobile CTA */}
            <a
              href="/contact"
              onClick={(e) => handleLinkClick(e, "/contact")}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-amber-400 text-navy-950 font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer text-center"
            >
              <span>{language === "ar" ? "احجز استشارة مجانية" : "Book a Free Consultation"}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>

            {/* Main Navigation Links */}
            <div className="divide-y divide-slate-100">
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={(e) => handleLinkClick(e, item.path)}
                    className={`flex items-center justify-between py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-gold-600 font-bold bg-gold-50/50 px-2 rounded-lg"
                        : "text-navy-950 hover:text-gold-600"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
                  </a>
                );
              })}
            </div>

            {/* Tap-to-call link on Mobile */}
            <div className="pt-2">
              <a
                href="tel:+971529226958"
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-gold-600" />
                <span>Call Advisory Desk: +971 52 922 6958</span>
              </a>
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default PageNavigation;
