import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  ChevronRight,
  Calculator,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import DiasLogo from "./DiasLogo";
import ComplianceAlertBanner from "./ComplianceAlertBanner";
import LanguageToggle from "./LanguageToggle";
import FloatingConversionPill from "./FloatingConversionPill";
import { useLanguage } from "../i18n/LanguageContext";

interface PageNavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
}

interface MegaDropdownItem {
  label: string;
  description?: string;
  path: string;
}

const SERVICES_DROPDOWN: MegaDropdownItem[] = [
  {
    label: "9% Corporate Tax & 0% SBR",
    description: "EmaraTax filings & AED 3M relief",
    path: "/services/corporate-tax-advisory",
  },
  {
    label: "DIFC & DTEC Tax Planning",
    description: "0% QFZP & common-law IFRS",
    path: "/tax-planning-difc",
  },
  {
    label: "5% UAE VAT & Form 201",
    description: "TRN setup & quarterly returns",
    path: "/services/vat-compliance",
  },
  {
    label: "Monthly IFRS Bookkeeping",
    description: "Zoho, Xero & QuickBooks ledgers",
    path: "/services/accounting-bookkeeping",
  },
  {
    label: "Dividend Distribution Audits",
    description: "Interim & final solvency audits",
    path: "/dividends-audit",
  },
  {
    label: "UAE E-Invoicing Setup",
    description: "2026 ASP & Peppol readiness",
    path: "/blog/uae-e-invoicing-mandate-asp-integration-guide-2026",
  },
];

const COMPANY_SETUP_DROPDOWN: MegaDropdownItem[] = [
  {
    label: "All UAE Company Setup Packages",
    description: "Turnkey licensing & EmaraTax setup",
    path: "/company-setup",
  },
  {
    label: "SHAMS Free Zone (Sharjah)",
    description: "Fast licensing & 0% SBR/QFZP guide",
    path: "/blog/opening-company-shams-free-zone-sharjah-setup-tax-guide-2026",
  },
  {
    label: "Dubai Mainland LLC",
    description: "100% foreign ownership DET setup",
    path: "/services/business-incorporation",
  },
  {
    label: "DIFC & DTEC Entities",
    description: "Financial center compliance hub",
    path: "/tax-planning-difc",
  },
  {
    label: "IFZA & DMCC Free Zones",
    description: "Free Zone vs. Mainland comparison",
    path: "/blog/choosing-uae-jurisdiction",
  },
];

const RESOURCES_DROPDOWN: MegaDropdownItem[] = [
  {
    label: "2026 UAE Corporate Tax Calculator",
    description: "Mainland 9% / SBR & Free Zone QFZP",
    path: "/uae-tax-planner",
  },
  {
    label: "5% UAE VAT Recovery Calculator",
    description: "Add/extract 5% & Form 201 rules",
    path: "/uae-tax-planner?tab=vat",
  },
  {
    label: "Interactive Scope & Quote Selector",
    description: "Match your fixed-fee retainer in 30s",
    path: "/#instant-quote",
  },
  {
    label: "Tax & IFRS Guides",
    description: "Expert UAE regulatory briefings",
    path: "/blogs",
  },
];

const ABOUT_DROPDOWN: MegaDropdownItem[] = [
  { label: "About Dias Accounting", path: "/about" },
  { label: "Client Testimonials", path: "/testimonials" },
  { label: "FAQs", path: "/faqs" },
  { label: "Contact & Consultation", path: "/#contact" },
];

type DropdownKey = "services" | "company-setup" | "resources" | "about";

export const PageNavigation: React.FC<PageNavigationProps> = ({
  currentPath,
  onNavigate,
  onOpenAudit,
}) => {
  const { language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<DropdownKey | null>(null);
  const [openMobileAccordions, setOpenMobileAccordions] = useState<Record<DropdownKey, boolean>>({
    services: false,
    "company-setup": false,
    resources: false,
    about: false,
  });

  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setOpenDesktopDropdown(null);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDesktopDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setOpenDesktopDropdown(null);
    setMobileMenuOpen(false);
    // If already on /pricing and user clicks Instant Quote, scroll smoothly to #instant-quote on /pricing
    if (path === "/#instant-quote" && currentPath === "/pricing") {
      const localQuoteEl = document.getElementById("instant-quote");
      if (localQuoteEl) {
        localQuoteEl.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    onNavigate(path);
  };

  const toggleMobileAccordion = (key: DropdownKey) => {
    setOpenMobileAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isServicesActive =
    currentPath.startsWith("/service") ||
    currentPath === "/tax-planning-difc" ||
    currentPath === "/difc-dtec-accounting" ||
    currentPath === "/dividends-audit";

  const isSetupActive =
    currentPath === "/company-setup" ||
    currentPath === "/blog/choosing-uae-jurisdiction" ||
    currentPath === "/blog/opening-company-shams-free-zone-sharjah-setup-tax-guide-2026";

  const isResourcesActive =
    currentPath === "/uae-tax-planner" ||
    currentPath === "/tax-planner" ||
    currentPath === "/corporate-tax-calculator" ||
    currentPath === "/uae-vat-calculator" ||
    currentPath === "/blogs" ||
    currentPath === "/insights" ||
    (currentPath.startsWith("/blog/") && !isSetupActive);

  const isAboutActive =
    currentPath === "/about" ||
    currentPath === "/testimonials" ||
    currentPath === "/reviews" ||
    currentPath === "/faqs" ||
    currentPath === "/why-choose-us" ||
    currentPath === "/contact";

  return (
    <>
      {/* 0. Slim Top 2026 UAE Tax Calculator Announcement Bar */}
      <ComplianceAlertBanner onOpenAudit={onOpenAudit} onNavigate={onNavigate} />

      {/* 1. Unified Dark-Navy & Brushed-Gold Executive Sticky Header */}
      <header
        ref={navContainerRef}
        role="banner"
        className="sticky top-0 z-40 bg-[#070d19]/95 backdrop-blur-md border-b border-[#c5a059]/30 shadow-lg transition-all duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 lg:gap-4">
          {/* Left: Brand Logo linking to / */}
          <div className="flex items-center shrink-0">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, "/")}
              className="group flex items-center gap-3 cursor-pointer select-none transition-opacity duration-150 hover:opacity-90"
              aria-label="Dias Accounting Home"
            >
              <DiasLogo
                className="w-9 h-9 sm:w-10 sm:h-10"
                showText={true}
                textSize="text-base sm:text-xl"
                textColor="text-white"
              />
            </a>
          </div>

          {/* Center: Single-Row Desktop Horizontal Menu (min-width: 1024px) */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center flex-nowrap whitespace-nowrap gap-3 xl:gap-5"
          >
            {/* Mega-Dropdown 1: SERVICES */}
            <div
              className="relative shrink-0"
              onMouseEnter={() => setOpenDesktopDropdown("services")}
              onMouseLeave={() => setOpenDesktopDropdown(null)}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenDesktopDropdown((prev) => (prev === "services" ? null : "services"))
                }
                aria-expanded={openDesktopDropdown === "services"}
                aria-haspopup="true"
                className={`inline-flex items-center gap-1 py-2 text-[11.5px] xl:text-[12.5px] font-semibold uppercase tracking-wide xl:tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  isServicesActive || openDesktopDropdown === "services"
                    ? "text-[#c5a059]"
                    : "text-white hover:text-[#c5a059]"
                }`}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    openDesktopDropdown === "services" ? "rotate-180 text-[#c5a059]" : ""
                  }`}
                />
              </button>

              {openDesktopDropdown === "services" && (
                <div className="absolute left-0 top-full pt-2 w-[480px] z-50">
                  <div
                    role="menu"
                    className="bg-[#0d1b2a] border border-[#c5a059]/35 border-t-2 border-t-[#c5a059] rounded-2xl shadow-2xl p-3 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-1.5">
                      {SERVICES_DROPDOWN.map((sub) => (
                        <a
                          key={sub.path}
                          href={sub.path}
                          role="menuitem"
                          onClick={(e) => handleLinkClick(e, sub.path)}
                          className="group block px-3.5 py-2.5 rounded-xl hover:bg-white/5 transition-colors whitespace-normal"
                        >
                          <span className="block text-[13px] font-semibold text-white group-hover:text-[#c5a059] transition-colors">
                            {sub.label}
                          </span>
                          {sub.description && (
                            <span className="block text-[11px] text-[#cbd5e1]/75 mt-0.5">
                              {sub.description}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/10 px-2 flex items-center justify-between">
                      <span className="text-[11px] text-[#cbd5e1]/70">
                        FTA-Registered Practice · All 7 Emirates
                      </span>
                      <a
                        href="/services"
                        onClick={(e) => handleLinkClick(e, "/services")}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#dec18c] hover:text-[#c5a059]"
                      >
                        <span>All Services</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mega-Dropdown 2: COMPANY SETUP */}
            <div
              className="relative shrink-0"
              onMouseEnter={() => setOpenDesktopDropdown("company-setup")}
              onMouseLeave={() => setOpenDesktopDropdown(null)}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenDesktopDropdown((prev) =>
                    prev === "company-setup" ? null : "company-setup"
                  )
                }
                aria-expanded={openDesktopDropdown === "company-setup"}
                aria-haspopup="true"
                className={`inline-flex items-center gap-1 py-2 text-[11.5px] xl:text-[12.5px] font-semibold uppercase tracking-wide xl:tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  isSetupActive || openDesktopDropdown === "company-setup"
                    ? "text-[#c5a059]"
                    : "text-white hover:text-[#c5a059]"
                }`}
              >
                <span>Company Setup</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    openDesktopDropdown === "company-setup" ? "rotate-180 text-[#c5a059]" : ""
                  }`}
                />
              </button>

              {openDesktopDropdown === "company-setup" && (
                <div className="absolute left-0 top-full pt-2 w-[340px] z-50">
                  <div
                    role="menu"
                    className="bg-[#0d1b2a] border border-[#c5a059]/35 border-t-2 border-t-[#c5a059] rounded-2xl shadow-2xl p-2.5 overflow-hidden space-y-0.5"
                  >
                    {COMPANY_SETUP_DROPDOWN.map((sub) => (
                      <a
                        key={sub.path}
                        href={sub.path}
                        role="menuitem"
                        onClick={(e) => handleLinkClick(e, sub.path)}
                        className="group block px-3.5 py-2.5 rounded-xl hover:bg-white/5 transition-colors whitespace-normal"
                      >
                        <span className="block text-[13px] font-semibold text-white group-hover:text-[#c5a059] transition-colors">
                          {sub.label}
                        </span>
                        {sub.description && (
                          <span className="block text-[11px] text-[#cbd5e1]/75 mt-0.5">
                            {sub.description}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Link: PRICING */}
            <a
              href="/pricing"
              onClick={(e) => handleLinkClick(e, "/pricing")}
              className={`py-2 text-[11.5px] xl:text-[12.5px] font-semibold uppercase tracking-wide xl:tracking-wider whitespace-nowrap shrink-0 transition-colors ${
                currentPath === "/pricing"
                  ? "text-[#c5a059]"
                  : "text-white hover:text-[#c5a059]"
              }`}
            >
              Pricing
            </a>

            {/* Mega-Dropdown 3: CALCULATORS & RESOURCES */}
            <div
              className="relative shrink-0"
              onMouseEnter={() => setOpenDesktopDropdown("resources")}
              onMouseLeave={() => setOpenDesktopDropdown(null)}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenDesktopDropdown((prev) => (prev === "resources" ? null : "resources"))
                }
                aria-expanded={openDesktopDropdown === "resources"}
                aria-haspopup="true"
                className={`inline-flex items-center gap-1 py-2 text-[11.5px] xl:text-[12.5px] font-semibold uppercase tracking-wide xl:tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  isResourcesActive || openDesktopDropdown === "resources"
                    ? "text-[#c5a059]"
                    : "text-white hover:text-[#c5a059]"
                }`}
              >
                <span>Calculators &amp; Resources</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    openDesktopDropdown === "resources" ? "rotate-180 text-[#c5a059]" : ""
                  }`}
                />
              </button>

              {openDesktopDropdown === "resources" && (
                <div className="absolute left-0 top-full pt-2 w-[350px] z-50">
                  <div
                    role="menu"
                    className="bg-[#0d1b2a] border border-[#c5a059]/35 border-t-2 border-t-[#c5a059] rounded-2xl shadow-2xl p-2.5 overflow-hidden space-y-0.5"
                  >
                    {RESOURCES_DROPDOWN.map((sub) => (
                      <a
                        key={sub.path}
                        href={sub.path}
                        role="menuitem"
                        onClick={(e) => handleLinkClick(e, sub.path)}
                        className="group block px-3.5 py-2.5 rounded-xl hover:bg-white/5 transition-colors whitespace-normal"
                      >
                        <span className="block text-[13px] font-semibold text-white group-hover:text-[#c5a059] transition-colors">
                          {sub.label}
                        </span>
                        {sub.description && (
                          <span className="block text-[11px] text-[#cbd5e1]/75 mt-0.5">
                            {sub.description}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mega-Dropdown 4: ABOUT */}
            <div
              className="relative shrink-0"
              onMouseEnter={() => setOpenDesktopDropdown("about")}
              onMouseLeave={() => setOpenDesktopDropdown(null)}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenDesktopDropdown((prev) => (prev === "about" ? null : "about"))
                }
                aria-expanded={openDesktopDropdown === "about"}
                aria-haspopup="true"
                className={`inline-flex items-center gap-1 py-2 text-[11.5px] xl:text-[12.5px] font-semibold uppercase tracking-wide xl:tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  isAboutActive || openDesktopDropdown === "about"
                    ? "text-[#c5a059]"
                    : "text-white hover:text-[#c5a059]"
                }`}
              >
                <span>About</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    openDesktopDropdown === "about" ? "rotate-180 text-[#c5a059]" : ""
                  }`}
                />
              </button>

              {openDesktopDropdown === "about" && (
                <div className="absolute right-0 top-full pt-2 w-60 z-50">
                  <div
                    role="menu"
                    className="bg-[#0d1b2a] border border-[#c5a059]/35 border-t-2 border-t-[#c5a059] rounded-2xl shadow-2xl py-2 overflow-hidden"
                  >
                    {ABOUT_DROPDOWN.map((sub) => (
                      <a
                        key={sub.path}
                        href={sub.path}
                        role="menuitem"
                        onClick={(e) => handleLinkClick(e, sub.path)}
                        className="block px-4 py-2.5 text-[13px] font-medium text-white hover:text-[#c5a059] hover:bg-white/5 transition-colors"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Dual Conversion CTAs (Desktop >= 1024px) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <a
              href="/#instant-quote"
              onClick={(e) => handleLinkClick(e, "/#instant-quote")}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#c5a059] text-[#dec18c] hover:bg-[#c5a059]/15 hover:text-white font-display font-bold text-xs px-3.5 xl:px-4 py-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
              <span>Instant Quote</span>
            </a>

            <a
              href="/#contact"
              onClick={(e) => handleLinkClick(e, "/#contact")}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-extrabold text-xs px-4 xl:px-5 py-2 whitespace-nowrap shrink-0 shadow-md shadow-[#c5a059]/20 transition-all cursor-pointer active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Consult Now</span>
            </a>
          </div>

          {/* Mobile & Tablet Controls (< 1024px) */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <a
              href="/#instant-quote"
              onClick={(e) => handleLinkClick(e, "/#instant-quote")}
              className="hidden sm:inline-flex items-center justify-center rounded-full border border-[#c5a059] text-[#dec18c] hover:bg-[#c5a059]/15 font-display font-bold text-xs px-3 py-1.5 whitespace-nowrap cursor-pointer transition-colors"
            >
              Instant Quote
            </a>

            <a
              href="/#contact"
              onClick={(e) => handleLinkClick(e, "/#contact")}
              className="inline-flex items-center justify-center rounded-full bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-extrabold text-[11px] sm:text-xs px-3.5 py-2 whitespace-nowrap shadow-xs cursor-pointer transition-colors"
            >
              Consult Now
            </a>

            <a
              href="tel:+971529226958"
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-[#0d1b2a] border border-[#c5a059]/40 flex items-center justify-center text-[#dec18c] hover:border-[#c5a059] transition-colors"
              aria-label="Direct Phone Call"
              title="Call Dias Accounting: +971 52 922 6958"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-white bg-[#0d1b2a] hover:bg-[#0d1b2a]/80 border border-[#c5a059]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c5a059] cursor-pointer transition-colors"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#c5a059]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Navigation Drawer (< 1024px) */}
        <div
          id="mobile-nav-menu"
          className={`lg:hidden absolute top-20 left-0 w-full bg-[#070d19] border-b border-[#c5a059]/50 shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-200 ease-out origin-top ${
            mobileMenuOpen
              ? "opacity-100 max-h-[calc(100vh-5rem)] pointer-events-auto visible"
              : "opacity-0 max-h-0 pointer-events-none invisible"
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="px-4 sm:px-6 pt-4 pb-6 space-y-3 overflow-y-auto flex-1">
            {/* Dual Mobile CTAs */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="/#instant-quote"
                onClick={(e) => handleLinkClick(e, "/#instant-quote")}
                className="py-2.5 px-3 rounded-full border border-[#c5a059] text-[#dec18c] font-display font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <Calculator className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Instant Quote</span>
              </a>
              <a
                href="/#contact"
                onClick={(e) => handleLinkClick(e, "/#contact")}
                className="py-2.5 px-3 rounded-full bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer text-center"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Consult Now</span>
              </a>
            </div>

            {/* Accordions & Direct Links */}
            <div className="divide-y divide-white/10">
              {/* Mobile Accordion: SERVICES */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion("services")}
                  aria-expanded={openMobileAccordions.services}
                  className="w-full flex items-center justify-between py-3 text-xs font-bold uppercase tracking-wider text-white hover:text-[#c5a059] cursor-pointer"
                >
                  <span>Services</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#c5a059] transition-transform duration-150 ${
                      openMobileAccordions.services ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileAccordions.services && (
                  <div className="pl-3 pb-2 space-y-1 border-l border-[#c5a059]/40 ml-1">
                    {SERVICES_DROPDOWN.map((sub) => (
                      <a
                        key={sub.path}
                        href={sub.path}
                        onClick={(e) => handleLinkClick(e, sub.path)}
                        className="block py-2 px-2 text-sm text-[#cbd5e1] hover:text-[#c5a059] transition-colors"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Accordion: COMPANY SETUP */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion("company-setup")}
                  aria-expanded={openMobileAccordions["company-setup"]}
                  className="w-full flex items-center justify-between py-3 text-xs font-bold uppercase tracking-wider text-white hover:text-[#c5a059] cursor-pointer"
                >
                  <span>Company Setup</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#c5a059] transition-transform duration-150 ${
                      openMobileAccordions["company-setup"] ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileAccordions["company-setup"] && (
                  <div className="pl-3 pb-2 space-y-1 border-l border-[#c5a059]/40 ml-1">
                    {COMPANY_SETUP_DROPDOWN.map((sub) => (
                      <a
                        key={sub.path}
                        href={sub.path}
                        onClick={(e) => handleLinkClick(e, sub.path)}
                        className="block py-2 px-2 text-sm text-[#cbd5e1] hover:text-[#c5a059] transition-colors"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Direct Link: PRICING */}
              <a
                href="/pricing"
                onClick={(e) => handleLinkClick(e, "/pricing")}
                className="flex items-center justify-between py-3 text-xs font-bold uppercase tracking-wider text-white hover:text-[#c5a059] transition-colors"
              >
                <span>Pricing</span>
                <ChevronRight className="w-4 h-4 text-[#c5a059]" />
              </a>

              {/* Mobile Accordion: CALCULATORS & RESOURCES */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion("resources")}
                  aria-expanded={openMobileAccordions.resources}
                  className="w-full flex items-center justify-between py-3 text-xs font-bold uppercase tracking-wider text-white hover:text-[#c5a059] cursor-pointer"
                >
                  <span>Calculators &amp; Resources</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#c5a059] transition-transform duration-150 ${
                      openMobileAccordions.resources ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileAccordions.resources && (
                  <div className="pl-3 pb-2 space-y-1 border-l border-[#c5a059]/40 ml-1">
                    {RESOURCES_DROPDOWN.map((sub) => (
                      <a
                        key={sub.path}
                        href={sub.path}
                        onClick={(e) => handleLinkClick(e, sub.path)}
                        className="block py-2 px-2 text-sm text-[#cbd5e1] hover:text-[#c5a059] transition-colors"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Accordion: ABOUT */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion("about")}
                  aria-expanded={openMobileAccordions.about}
                  className="w-full flex items-center justify-between py-3 text-xs font-bold uppercase tracking-wider text-white hover:text-[#c5a059] cursor-pointer"
                >
                  <span>About</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#c5a059] transition-transform duration-150 ${
                      openMobileAccordions.about ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileAccordions.about && (
                  <div className="pl-3 pb-2 space-y-1 border-l border-[#c5a059]/40 ml-1">
                    {ABOUT_DROPDOWN.map((sub) => (
                      <a
                        key={sub.path}
                        href={sub.path}
                        onClick={(e) => handleLinkClick(e, sub.path)}
                        className="block py-2 px-2 text-sm text-[#cbd5e1] hover:text-[#c5a059] transition-colors"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Utility Footer Row inside Mobile Drawer: Language & Phone */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                <span className="text-xs font-semibold text-slate-400">
                  {language === "ar" ? "اللغة" : "Language"}
                </span>
                <LanguageToggle variant="mobile" />
              </div>
              <a
                href="tel:+971529226958"
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#0d1b2a] border border-[#c5a059]/40 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors hover:border-[#c5a059]"
              >
                <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>+971 52 922 6958</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Persistent Bottom-Right Conversion Pill Across All Pages */}
      <FloatingConversionPill currentPath={currentPath} onNavigate={onNavigate} />
    </>
  );
};

export default PageNavigation;
