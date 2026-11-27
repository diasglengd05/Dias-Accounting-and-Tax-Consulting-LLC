import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, ChevronRight, ArrowUpRight } from "lucide-react";
import DiasLogo from "./DiasLogo";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "../i18n/LanguageContext";
import { useRouteTransition } from "./PageMainTransition";

interface PageNavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
}

interface DropdownLink {
  label: string;
  description: string;
  path: string;
  external?: boolean;
}

const SERVICES_MENU: DropdownLink[] = [
  {
    label: "Corporate Tax & 0% SBR",
    description: "EmaraTax registration, 9% returns & AED 3M relief",
    path: "/services/corporate-tax-advisory",
  },
  {
    label: "DIFC & DTEC Tax Planning",
    description: "0% QFZP compliance & common-law IFRS",
    path: "/tax-planning-difc",
  },
  {
    label: "VAT Compliance & Form 201",
    description: "5% TRN setup, quarterly returns & recovery",
    path: "/services/vat-compliance",
  },
  {
    label: "Monthly IFRS Bookkeeping",
    description: "Dedicated chartered accountants from AED 400/mo",
    path: "/services/accounting-bookkeeping",
  },
  {
    label: "Dividend & Statutory Audits",
    description: "Interim/final dividend audits & audit readiness",
    path: "/dividends-audit",
  },
  {
    label: "View All Services",
    description: "Full UAE tax, accounting & advisory practice",
    path: "/services",
  },
];

const TAX_TOOLS_MENU: DropdownLink[] = [
  {
    label: "2026 UAE Corporate Tax Calculator",
    description: "Estimate 9% CT, 0% SBR & Mainland vs. Free Zone",
    path: "/uae-tax-planner",
  },
  {
    label: "UAE VAT Hub & Calculator",
    description: "5% VAT extraction, input recovery & Form 201",
    path: "/uae-vat-calculator",
  },
  {
    label: "FTA Deadlines Calendar",
    description: "2026 registration, VAT & Corporate Tax dates",
    path: "/fta-deadlines",
  },
];

const RESOURCES_MENU: DropdownLink[] = [
  {
    label: "Tax & IFRS Insights",
    description: "Practical UAE compliance guides & playbooks",
    path: "/blog",
  },
  {
    label: "0% Small Business Relief",
    description: "AED 3M threshold rules & EmaraTax election",
    path: "/small-business-tax-relief",
  },
  {
    label: "Live FTA Briefings",
    description: "Daily regulatory alerts on insights.diasuae.ae",
    path: "https://insights.diasuae.ae/",
    external: true,
  },
  {
    label: "Client Reviews",
    description: "5.0★ Google rating from UAE founders",
    path: "/testimonials",
  },
  {
    label: "FAQs",
    description: "Clear answers on UAE Corporate Tax & VAT",
    path: "/faqs",
  },
  {
    label: "About DiasUAE",
    description: "Dias Accounting & Tax Consulting LLC (SHAMS)",
    path: "/about",
  },
];

type DropdownKey = "services" | "tools" | "resources";

export const PageNavigation: React.FC<PageNavigationProps> = ({
  currentPath,
  onNavigate,
}) => {
  const { language } = useLanguage();
  const { isPageLoading } = useRouteTransition();
  const isAr = language === "ar";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [mobileAccordions, setMobileAccordions] = useState<Record<DropdownKey, boolean>>({
    services: false,
    tools: false,
    resources: false,
  });

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleNav = (e: React.MouseEvent, path: string, external?: boolean) => {
    if (external) {
      setOpenDropdown(null);
      setMobileMenuOpen(false);
      return;
    }
    e.preventDefault();
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  const toggleMobileSection = (key: DropdownKey) => {
    setMobileAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isServicesActive =
    currentPath.startsWith("/service") ||
    currentPath === "/tax-planning-difc" ||
    currentPath === "/difc-dtec-accounting" ||
    currentPath === "/dividends-audit";

  const isSetupActive = currentPath === "/company-setup";
  const isPricingActive = currentPath === "/pricing";

  const isToolsActive =
    currentPath === "/uae-tax-planner" ||
    currentPath === "/uae-vat-calculator" ||
    currentPath === "/fta-deadlines";

  const isResourcesActive =
    currentPath === "/blog" ||
    currentPath === "/blogs" ||
    currentPath.startsWith("/blog/") ||
    currentPath === "/small-business-tax-relief" ||
    currentPath === "/testimonials" ||
    currentPath === "/faqs" ||
    currentPath === "/about";

  const renderDesktopMenu = (items: DropdownLink[], alignRight = false, wide = false) => (
    <div
      className={`absolute top-full pt-2 z-50 ${alignRight ? "right-0" : "left-0"} ${
        wide ? "w-[480px]" : "w-[320px]"
      }`}
    >
      <div
        role="menu"
        className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-900/5 p-2 overflow-hidden"
      >
        <div className={wide ? "grid grid-cols-2 gap-1" : "space-y-0.5"}>
          {items.map((item) => (
            <a
              key={item.path}
              href={item.path}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              role="menuitem"
              onClick={(e) => handleNav(e, item.path, item.external)}
              className="group block px-3.5 py-2.5 rounded-xl hover:bg-[#F8FAFC] transition-colors whitespace-normal"
            >
              <span className="flex items-center gap-1 text-sm font-semibold text-[#0D1B2A] group-hover:text-[#1B4332] transition-colors">
                <span>{item.label}</span>
                {item.external && <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />}
              </span>
              <span className="block text-xs text-[#475569] mt-0.5 leading-snug">
                {item.description}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <header
      ref={headerRef}
      role="banner"
      className="sticky top-0 z-40 h-[72px] bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-6 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => handleNav(e, "/")}
          className="inline-flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-lg"
          aria-label="DiasUAE — Dias Accounting and Tax Consulting LLC Home"
        >
          <DiasLogo
            className="h-9 md:h-10 w-auto"
            showText={true}
            showSubLabel={true}
            textSize="text-base sm:text-lg"
            textColor="text-[#0D1B2A]"
            subLabelColor="text-slate-500"
            isLoading={isPageLoading}
          />
        </a>

        {/* Zone 2: Max 5 Top-Level Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-7 whitespace-nowrap"
        >
          {/* 1. Services (Dropdown) */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("services")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown((prev) => (prev === "services" ? null : "services"))}
              aria-expanded={openDropdown === "services"}
              aria-haspopup="true"
              className={`inline-flex items-center gap-1 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isServicesActive || openDropdown === "services"
                  ? "text-[#1B4332] font-semibold"
                  : "text-[#475569] hover:text-[#0D1B2A]"
              }`}
            >
              <span>{isAr ? "الخدمات" : "Services"}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  openDropdown === "services" ? "rotate-180 text-[#1B4332]" : "text-slate-400"
                }`}
              />
            </button>
            {openDropdown === "services" && renderDesktopMenu(SERVICES_MENU, false, true)}
          </div>

          {/* 2. Company Setup */}
          <a
            href="/company-setup"
            onClick={(e) => handleNav(e, "/company-setup")}
            className={`py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              isSetupActive ? "text-[#1B4332] font-semibold" : "text-[#475569] hover:text-[#0D1B2A]"
            }`}
          >
            {isAr ? "تأسيس الشركات" : "Company Setup"}
          </a>

          {/* 3. Pricing */}
          <a
            href="/pricing"
            onClick={(e) => handleNav(e, "/pricing")}
            className={`py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              isPricingActive ? "text-[#1B4332] font-semibold" : "text-[#475569] hover:text-[#0D1B2A]"
            }`}
          >
            {isAr ? "الباقات والأسعار" : "Pricing"}
          </a>

          {/* 4. Tax Tools (Dropdown) */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("tools")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown((prev) => (prev === "tools" ? null : "tools"))}
              aria-expanded={openDropdown === "tools"}
              aria-haspopup="true"
              className={`inline-flex items-center gap-1 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isToolsActive || openDropdown === "tools"
                  ? "text-[#1B4332] font-semibold"
                  : "text-[#475569] hover:text-[#0D1B2A]"
              }`}
            >
              <span>{isAr ? "الأدوات الضريبية" : "Tax Tools"}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  openDropdown === "tools" ? "rotate-180 text-[#1B4332]" : "text-slate-400"
                }`}
              />
            </button>
            {openDropdown === "tools" && renderDesktopMenu(TAX_TOOLS_MENU)}
          </div>

          {/* 5. Resources (Dropdown) */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("resources")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              onClick={() =>
                setOpenDropdown((prev) => (prev === "resources" ? null : "resources"))
              }
              aria-expanded={openDropdown === "resources"}
              aria-haspopup="true"
              className={`inline-flex items-center gap-1 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isResourcesActive || openDropdown === "resources"
                  ? "text-[#1B4332] font-semibold"
                  : "text-[#475569] hover:text-[#0D1B2A]"
              }`}
            >
              <span>{isAr ? "المصادر" : "Resources"}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  openDropdown === "resources" ? "rotate-180 text-[#1B4332]" : "text-slate-400"
                }`}
              />
            </button>
            {openDropdown === "resources" && renderDesktopMenu(RESOURCES_MENU, true)}
          </div>
        </nav>

        {/* Zone 3: Compact Language Switcher + Single Primary CTA */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <LanguageToggle variant="compact" />
          <a
            href="/#contact"
            onClick={(e) => handleNav(e, "/#contact")}
            className="inline-flex items-center justify-center min-h-[42px] rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white font-semibold text-sm px-4 py-2.5 whitespace-nowrap shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] focus-visible:ring-offset-2"
          >
            {isAr ? "احجز استشارة" : "Book Consultation"}
          </a>
        </div>

        {/* Mobile Controls (< 1024px) */}
        <div className="flex lg:hidden items-center gap-2.5 shrink-0">
          <LanguageToggle variant="compact" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="w-11 h-11 inline-flex items-center justify-center rounded-xl border border-[#E2E8F0] text-[#0D1B2A] hover:bg-[#F8FAFC] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-nav-drawer"
        className={`lg:hidden absolute top-[72px] left-0 w-full bg-white border-b border-slate-200 shadow-lg z-50 overflow-hidden transition-all duration-200 ${
          mobileMenuOpen
            ? "opacity-100 max-h-[calc(100dvh-72px)] pointer-events-auto visible"
            : "opacity-0 max-h-0 pointer-events-none invisible"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="px-4 sm:px-6 py-5 space-y-4 overflow-y-auto max-h-[calc(100dvh-72px)]">
          <div className="divide-y divide-slate-100">
            {/* Services Accordion */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => toggleMobileSection("services")}
                aria-expanded={mobileAccordions.services}
                className="w-full min-h-[44px] flex items-center justify-between py-2.5 text-sm font-semibold text-[#0D1B2A] cursor-pointer"
              >
                <span>{isAr ? "الخدمات" : "Services"}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    mobileAccordions.services ? "rotate-180 text-[#1B4332]" : ""
                  }`}
                />
              </button>
              {mobileAccordions.services && (
                <div className="pl-3 pb-2 space-y-0.5">
                  {SERVICES_MENU.map((item) => (
                    <a
                      key={item.path}
                      href={item.path}
                      onClick={(e) => handleNav(e, item.path)}
                      className="min-h-[44px] flex items-center py-2 text-sm text-[#475569] hover:text-[#1B4332]"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Company Setup */}
            <a
              href="/company-setup"
              onClick={(e) => handleNav(e, "/company-setup")}
              className="min-h-[44px] flex items-center justify-between py-2.5 text-sm font-semibold text-[#0D1B2A] hover:text-[#1B4332]"
            >
              <span>{isAr ? "تأسيس الشركات" : "Company Setup"}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>

            {/* Pricing */}
            <a
              href="/pricing"
              onClick={(e) => handleNav(e, "/pricing")}
              className="min-h-[44px] flex items-center justify-between py-2.5 text-sm font-semibold text-[#0D1B2A] hover:text-[#1B4332]"
            >
              <span>{isAr ? "الباقات والأسعار" : "Pricing"}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>

            {/* Tax Tools Accordion */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => toggleMobileSection("tools")}
                aria-expanded={mobileAccordions.tools}
                className="w-full min-h-[44px] flex items-center justify-between py-2.5 text-sm font-semibold text-[#0D1B2A] cursor-pointer"
              >
                <span>{isAr ? "الأدوات الضريبية" : "Tax Tools"}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    mobileAccordions.tools ? "rotate-180 text-[#1B4332]" : ""
                  }`}
                />
              </button>
              {mobileAccordions.tools && (
                <div className="pl-3 pb-2 space-y-0.5">
                  {TAX_TOOLS_MENU.map((item) => (
                    <a
                      key={item.path}
                      href={item.path}
                      onClick={(e) => handleNav(e, item.path)}
                      className="min-h-[44px] flex items-center py-2 text-sm text-[#475569] hover:text-[#1B4332]"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Accordion */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => toggleMobileSection("resources")}
                aria-expanded={mobileAccordions.resources}
                className="w-full min-h-[44px] flex items-center justify-between py-2.5 text-sm font-semibold text-[#0D1B2A] cursor-pointer"
              >
                <span>{isAr ? "المصادر" : "Resources"}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    mobileAccordions.resources ? "rotate-180 text-[#1B4332]" : ""
                  }`}
                />
              </button>
              {mobileAccordions.resources && (
                <div className="pl-3 pb-2 space-y-0.5">
                  {RESOURCES_MENU.map((item) => (
                    <a
                      key={item.path}
                      href={item.path}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      onClick={(e) => handleNav(e, item.path, item.external)}
                      className="min-h-[44px] flex items-center gap-1.5 py-2 text-sm text-[#475569] hover:text-[#1B4332]"
                    >
                      <span>{item.label}</span>
                      {item.external && <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <a
              href="/#contact"
              onClick={(e) => handleNav(e, "/#contact")}
              className="w-full min-h-[46px] inline-flex items-center justify-center rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white font-semibold text-sm px-5 py-3 transition-colors"
            >
              {isAr ? "احجز استشارة مجانية" : "Book Consultation"}
            </a>
            <div className="flex items-center justify-between text-xs text-[#475569] pt-1">
              <a href="tel:+971529226958" className="min-h-[44px] inline-flex items-center hover:text-[#0D1B2A] tabular-nums">
                +971 52 922 6958
              </a>
              <a href="mailto:info@diasuae.ae" className="min-h-[44px] inline-flex items-center hover:text-[#0D1B2A]">
                info@diasuae.ae
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageNavigation;
