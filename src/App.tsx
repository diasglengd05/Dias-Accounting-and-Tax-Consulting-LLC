import React, { useState, useEffect, Suspense } from "react";
import {
  Calculator,
  TrendingUp,
  Percent,
  Building2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  FileSpreadsheet,
  ShieldCheck,
  FileCheck,
  Clock,
  Star,
  ChevronDown,
  MessageCircle,
} from "lucide-react";

// Imports from our modular files
import { Service, BlogPost } from "./types";
import { faqsData, GOOGLE_BUSINESS_URL } from "./data/staticData";
import { blogsData } from "./data/blogsData";
import PageNavigation from "./components/PageNavigation";
import PageFooter from "./components/PageFooter";
import useDynamicSEO from "./hooks/useDynamicSEO";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import LazyMount from "./components/LazyMount";

// Lazy-loaded components for fast mobile JS execution & small initial bundle size
const GoogleOfficeMap = React.lazy(() => import("./components/GoogleOfficeMap"));
const GooglePreferredSourceModal = React.lazy(() => import("./components/GooglePreferredSourceModal"));
const BlogModal = React.lazy(() => import("./components/BlogModal"));
const ServiceModal = React.lazy(() => import("./components/ServiceModal"));
const Scheduler = React.lazy(() => import("./components/Scheduler"));
const PrivacyPolicyModal = React.lazy(() => import("./components/PrivacyPolicyModal"));
const TaxHealthCheckModal = React.lazy(() => import("./components/TaxHealthCheckModal"));
const LeadMagnetDownloadModal = React.lazy(() => import("./components/LeadMagnetDownloadModal"));
const TaxAiAdvisorModal = React.lazy<React.ComponentType<any>>(() => import("./components/TaxAiAdvisorModal"));
const SeoEngineDashboardModal = React.lazy(() => import("./components/SeoEngineDashboardModal"));
const SmallBusinessTaxReliefPage = React.lazy(() => import("./pages/SmallBusinessTaxReliefPage").then(m => ({ default: m.SmallBusinessTaxReliefPage })));
import { DifcDtecAccountingPage } from "./pages/DifcDtecAccountingPage";
const DividendsAuditPage = React.lazy(() => import("./pages/DividendsAuditPage").then(m => ({ default: m.DividendsAuditPage })));
const ServicesPage = React.lazy(() => import("./pages/ServicesPage"));
import CompanySetupPage from "./pages/CompanySetupPage";
import PricingPage from "./pages/PricingPage";
const WhyChooseUsPage = React.lazy(() => import("./pages/WhyChooseUsPage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const TermsPage = React.lazy(() => import("./pages/TermsPage"));
const PrivacyPolicyPage = React.lazy(() => import("./pages/PrivacyPolicyPage"));
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import TestimonialsPage from "./pages/TestimonialsPage";
const HomepageInsightsSection = React.lazy(() => import("./components/HomepageInsightsSection"));
import FaqsPage from "./pages/FaqsPage";
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
import TaxPlannerPage from "./pages/TaxPlannerPage";
const ServiceDetailPage = React.lazy(() => import("./pages/ServiceDetailPage"));
const VatPlannerPage = React.lazy(() => import("./pages/VatPlannerPage"));
const FtaDeadlinesPage = React.lazy(() => import("./pages/FtaDeadlinesPage"));
import CookieConsentBanner from "./components/CookieConsentBanner";
import HomepagePricingSection from "./components/HomepagePricingSection";
import ScopeInstantQuoteBuilder from "./components/ScopeInstantQuoteBuilder";

const normalizeAppPath = (rawPath: string): string => {
  const pathOnly = (rawPath || "/").split("?")[0];
  const lower = pathOnly.toLowerCase().replace(/\/+$/, "") || "/";
  if (lower === "/home" || lower === "/home.html" || lower === "/index.html") {
    return "/";
  }
  if (
    lower === "/corporate-tax-calculator" ||
    lower === "/tax-savings" ||
    lower === "/tax-savings-assessment"
  ) {
    return "/uae-tax-planner";
  }
  return pathOnly || "/";
};

const HOMEPAGE_SERVICES = [
  {
    id: "corporate-tax-advisory",
    title: "Corporate Tax Advisory",
    desc: "EmaraTax registration, 0% Small Business Relief elections up to AED 3M, and annual 9% returns.",
    link: "/services/corporate-tax-advisory",
    icon: TrendingUp,
  },
  {
    id: "vat-compliance",
    title: "VAT Compliance",
    desc: "5% TRN registration, quarterly Form 201 filings, input VAT recovery, and FTA audit support.",
    link: "/services/vat-compliance",
    icon: Percent,
  },
  {
    id: "accounting-bookkeeping",
    title: "IFRS Bookkeeping",
    desc: "Dedicated monthly double-entry bookkeeping, bank reconciliations, and clean management reports.",
    link: "/services/accounting-bookkeeping",
    icon: Calculator,
  },
  {
    id: "tax-planning-difc",
    title: "DIFC & QFZP Tax",
    desc: "Common-law IFRS statements, 0% Free Zone substance verification, and de minimis testing.",
    link: "/tax-planning-difc",
    icon: ShieldCheck,
  },
  {
    id: "dividends-audit",
    title: "Dividend & Statutory Audits",
    desc: "Interim and final dividend solvency audits plus external auditor coordination for renewals.",
    link: "/dividends-audit",
    icon: FileCheck,
  },
  {
    id: "company-setup",
    title: "UAE Company Setup",
    desc: "Turnkey SHAMS, IFZA, DMCC, and Dubai Mainland licensing with Day-1 EmaraTax registration.",
    link: "/company-setup",
    icon: Building2,
  },
];

const SOFTWARE_ECOSYSTEM = [
  "Zoho Books",
  "Xero",
  "QuickBooks",
  "Wafeq",
  "EmaraTax (FTA)",
  "SHAMS",
  "DIFC",
  "Dubai DET",
];

function MainApp() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  // Navigation state
  const [activeSection, setActiveSection] = useState("home");

  // Dedicated SEO Landing Pages Path State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return normalizeAppPath(window.location.pathname);
    }
    return "/";
  });

  useEffect(() => {
    const syncAndConsolidateHome = () => {
      const raw = window.location.pathname;
      const normalized = normalizeAppPath(raw);
      if (normalized !== raw) {
        const nextHash = window.location.hash === "#home" ? "" : window.location.hash;
        window.history.replaceState(null, "", `${normalized}${window.location.search}${nextHash}`);
      }
      setCurrentPath(normalized);
    };

    syncAndConsolidateHome();
    window.addEventListener("popstate", syncAndConsolidateHome);
    return () => window.removeEventListener("popstate", syncAndConsolidateHome);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== "undefined") {
      const [rawBeforeHash, hashPart] = path.split("#");
      const [rawPathPart, queryPart] = (rawBeforeHash || "/").split("?");
      const normalized = normalizeAppPath(rawPathPart || "/");
      const searchStr = queryPart ? `?${queryPart}` : "";
      const fullUrl = `${normalized}${searchStr}${hashPart ? `#${hashPart}` : ""}`;
      window.history.pushState(null, "", fullUrl);
      window.dispatchEvent(new PopStateEvent("popstate"));
      setCurrentPath(normalized);
      if (hashPart) {
        setTimeout(() => {
          const el = document.getElementById(hashPart);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Lead generation modals
  const [taxHealthModalOpen, setTaxHealthModalOpen] = useState(false);
  const [leadMagnetModalOpen, setLeadMagnetModalOpen] = useState(false);
  const [googlePreferredModalOpen, setGooglePreferredModalOpen] = useState(false);
  const [taxAiModalOpen, setTaxAiModalOpen] = useState(false);
  const [taxAiInitialQuery, setTaxAiInitialQuery] = useState("");
  const [taxAiInitialCategory, setTaxAiInitialCategory] = useState("corporate-tax");

  const handleOpenTaxAi = (query?: string, category?: string) => {
    if (query !== undefined) setTaxAiInitialQuery(query);
    if (category !== undefined) setTaxAiInitialCategory(category);
    setTaxAiModalOpen(true);
  };

  // Pricing duration & path state
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");
  const [pricingPath, setPricingPath] = useState<"prospective" | "retrospective">("prospective");

  // Selected details for modals
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>(blogsData);
  const [seoDashboardOpen, setSeoDashboardOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Dynamically update document head title and SEO meta tags on homepage & modal states
  useDynamicSEO({
    activeSection,
    selectedService,
    selectedBlog,
    language,
    enabled: currentPath === "/" || currentPath === "",
  });

  // Target service for scheduler preselection
  const [preselectedServiceTitle, setPreselectedServiceTitle] = useState("");

  // Open on the Home page by default, or scroll to specific hash if directly targeted in URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#seo-engine" || hash === "#admin-seo" || window.location.search.includes("seo=admin")) {
      setSeoDashboardOpen(true);
    }

    const handleHash = () => {
      const currentHash = window.location.hash;
      if (currentHash === "#seo-engine" || currentHash === "#admin-seo") {
        setSeoDashboardOpen(true);
      }
    };
    window.addEventListener("hashchange", handleHash);

    if (hash && hash !== "#home" && hash !== "#seo-engine" && hash !== "#admin-seo") {
      const targetId = hash.replace("#", "");
      const scrollToTarget = () => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      };
      const timer = setTimeout(scrollToTarget, 100);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("hashchange", handleHash);
      };
    } else if (hash !== "#seo-engine" && hash !== "#admin-seo") {
      // Default: ensure viewport starts cleanly at the top on home page
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }

    return () => {
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  // Set up active section observer using a highly performant IntersectionObserver
  useEffect(() => {
    const sections = ["home", "company-setup", "services", "pricing", "why-choose-us", "testimonials", "faqs", "blogs", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // Focus on the middle band of the screen
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Set up body scroll-locking and Escape key handler for Blog Reader modal
  useEffect(() => {
    if (selectedBlog) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setSelectedBlog(null);
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalStyle;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [selectedBlog]);

  // Deep-linking support for SEO Blog articles (#blog-[id]) & SEO Engine (#seo-engine)
  useEffect(() => {
    // Fetch latest dynamic blog posts from server feed and merge with static blogs
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
          const normTitle = (t: string) =>
            (t || "")
              .toLowerCase()
              .replace(/&amp;/g, "and")
              .replace(/[^\w\s]/g, " ")
              .replace(/\s+/g, " ")
              .trim();
          const seenIds = new Set<string>();
          const seenTitles = new Set<string>();
          let hasAuditThresholds = false;
          let hasEnforcement = false;

          const deduped: BlogPost[] = [];
          for (const item of [...data.blogs, ...blogsData]) {
            if (!item || !item.id || !item.title) continue;
            const norm = normTitle(item.title);
            const isAuditThresholds =
              norm.includes("uae corporate tax return preparation") && norm.includes("audit threshold");
            const isEnforcement = norm.includes("uae corporate tax enforcement");
            if (seenIds.has(item.id) || seenTitles.has(norm)) continue;
            if (isAuditThresholds && hasAuditThresholds) continue;
            if (isEnforcement && hasEnforcement) continue;
            seenIds.add(item.id);
            seenTitles.add(norm);
            if (isAuditThresholds) hasAuditThresholds = true;
            if (isEnforcement) hasEnforcement = true;
            deduped.push(item);
          }
          deduped.sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0));
          setAllBlogs(deduped);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch dynamic blogs, using static fallback:", err);
      });

    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash && hash.startsWith("#blog-")) {
        const targetBlogId = hash.replace("#blog-", "").trim().toLowerCase();
        if (targetBlogId) {
          navigateTo(`/blog/${targetBlogId}`);
        }
      } else if (hash === "#seo-engine" || hash === "#cloud-function") {
        setSeoDashboardOpen(true);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const handlePreselectedCallBooking = (serviceTitle?: string) => {
    setPreselectedServiceTitle(serviceTitle || "Consultation Request");
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderPageFallback = (label: string) => (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center gap-3 text-[#475569] font-sans text-sm">
      <div
        className="w-6 h-6 rounded-full border-2 border-[#E2E8F0] border-t-[#1B4332] animate-spin"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );

  // Dedicated Landing Page Routes
  if (currentPath === "/small-business-tax-relief") {
    return (
      <Suspense fallback={renderPageFallback("Loading Small Business Relief Hub...")}>
        <SmallBusinessTaxReliefPage onNavigate={navigateTo} />
      </Suspense>
    );
  }

  if (
    currentPath === "/difc-dtec-accounting" ||
    currentPath === "/dtec-accounting" ||
    currentPath === "/accounting-services-in-dtec" ||
    currentPath === "/tax-planning-difc" ||
    currentPath === "/tax-planning-difc.html"
  ) {
    return <DifcDtecAccountingPage onNavigate={navigateTo} />;
  }

  if (
    currentPath === "/dividends-audit" ||
    currentPath === "/dividends-audit-dubai" ||
    currentPath === "/dividends-audit-uae"
  ) {
    return (
      <Suspense fallback={renderPageFallback("Loading Dividend Audit Hub...")}>
        <DividendsAuditPage onNavigate={navigateTo} />
      </Suspense>
    );
  }

  const normalizedCurrentPath = currentPath.toLowerCase().replace(/\/+$/, "") || "/";

  if (
    normalizedCurrentPath === "/services/business-incorporation" ||
    normalizedCurrentPath === "/services/business-incorporation-services" ||
    normalizedCurrentPath === "/business-incorporation-services" ||
    normalizedCurrentPath === "/business-incorporation"
  ) {
    return (
      <Suspense fallback={renderPageFallback("Loading Business Incorporation Services...")}>
        <ServiceDetailPage
          serviceId="business-incorporation"
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/services") {
    return (
      <Suspense fallback={renderPageFallback("Loading Services...")}>
        <ServicesPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath.startsWith("/services/") || currentPath.startsWith("/service/")) {
    const rawServiceId = currentPath.replace(/^\/(services|service)\//, "").split("/")[0].split("?")[0].split("#")[0];
    return (
      <Suspense fallback={renderPageFallback("Loading Service Details...")}>
        <ServiceDetailPage
          serviceId={rawServiceId}
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/company-setup") {
    return (
      <CompanySetupPage
        onNavigate={navigateTo}
        onOpenAudit={() => setTaxHealthModalOpen(true)}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
      />
    );
  }

  if (currentPath === "/pricing") {
    return (
      <PricingPage
        onNavigate={navigateTo}
        onOpenAudit={() => setTaxHealthModalOpen(true)}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
      />
    );
  }

  if (
    currentPath === "/uae-tax-planner" ||
    currentPath === "/tax-planner" ||
    currentPath === "/tax-calculator" ||
    currentPath === "/calculator" ||
    currentPath === "/corporate-tax-calculator" ||
    currentPath === "/tax-savings" ||
    currentPath === "/tax-savings-assessment"
  ) {
    return (
      <TaxPlannerPage
        onNavigate={navigateTo}
        onOpenAudit={() => setTaxHealthModalOpen(true)}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
      />
    );
  }

  if (currentPath === "/uae-vat-calculator" || currentPath === "/vat-calculator" || currentPath === "/vat-planner") {
    return (
      <Suspense fallback={renderPageFallback("Loading UAE VAT Calculator...")}>
        <VatPlannerPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/fta-deadlines" || currentPath === "/tax-deadlines" || currentPath === "/deadline-calculator") {
    return (
      <Suspense fallback={renderPageFallback("Loading FTA Deadlines Calendar...")}>
        <FtaDeadlinesPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/about") {
    return (
      <Suspense fallback={renderPageFallback("Loading About Dias...")}>
        <AboutPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => navigateTo("/privacy-policy")}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/why-choose-us") {
    return (
      <Suspense fallback={renderPageFallback("Loading Why Dias Hub...")}>
        <WhyChooseUsPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/privacy-policy" || currentPath === "/privacy") {
    return (
      <Suspense fallback={renderPageFallback("Loading Privacy Policy...")}>
        <PrivacyPolicyPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/terms" || currentPath === "/terms-of-service" || currentPath === "/terms-and-conditions") {
    return (
      <Suspense fallback={renderPageFallback("Loading Terms of Engagement...")}>
        <TermsPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath.startsWith("/blog/") || currentPath.startsWith("/blogs/")) {
    const blogSlug = currentPath
      .replace(/^\/blogs?\//, "")
      .replace(/\/+$/, "")
      .trim();
    return (
      <BlogDetailPage
        blogSlug={blogSlug}
        allBlogs={allBlogs}
        onNavigate={navigateTo}
        onOpenAudit={() => setTaxHealthModalOpen(true)}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
      />
    );
  }

  if (currentPath === "/blog" || currentPath === "/blogs" || currentPath === "/insights") {
    return (
      <BlogsPage
        onNavigate={navigateTo}
        onOpenAudit={() => setTaxHealthModalOpen(true)}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
      />
    );
  }

  if (currentPath === "/testimonials" || currentPath === "/reviews") {
    return (
      <TestimonialsPage
        onNavigate={navigateTo}
        onOpenAudit={() => setTaxHealthModalOpen(true)}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
      />
    );
  }

  if (currentPath === "/faqs" || currentPath === "/faq") {
    return (
      <FaqsPage
        onNavigate={navigateTo}
        onOpenAudit={() => setTaxHealthModalOpen(true)}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
      />
    );
  }

  if (currentPath === "/contact" || currentPath === "/book-consultation") {
    return (
      <Suspense fallback={renderPageFallback("Loading Contact Desk...")}>
        <ContactPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/admin" || currentPath === "/inquiry-sheet" || currentPath === "/admin/sheet" || currentPath === "/inquiries") {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-white p-6 space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center animate-pulse">
          <FileSpreadsheet className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="font-display text-2xl font-bold">Dias UAE Inquiries Spreadsheet</h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            Direct access to the live Google Sheets database for all consultation inquiries and lead submissions.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://docs.google.com/spreadsheets/d/12DjTgoDGdU05oRWFiiQFJ5fLhW4G9rctepWBuOXGDuY/edit"
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-display font-bold px-6 py-3 rounded-xl text-xs shadow-lg transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Open Google Spreadsheet</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="/api/inquiries/export-csv"
            className="inline-flex items-center justify-center gap-2 bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-400/40 font-display font-semibold px-6 py-3 rounded-xl text-xs transition-all"
          >
            <span>Download Inquiries CSV</span>
          </a>
          <button
            onClick={() => {
              navigateTo("/");
              setTimeout(() => {
                window.location.hash = "#portal";
                const el = document.getElementById("contact");
                el?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-display font-medium px-6 py-3 rounded-xl text-xs transition-all cursor-pointer"
          >
            <span>Open In-App Inquiries Hub</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] font-sans text-[#0D1B2A] antialiased selection:bg-[#1B4332]/15 selection:text-[#0D1B2A]">
      {/* Skip to Main Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#1B4332] focus:text-white focus:font-semibold focus:rounded-xl focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Clean Sticky Header */}
      <PageNavigation
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenAudit={() => setTaxHealthModalOpen(true)}
      />

      <main id="main-content" role="main">
        {/* 1. Executive Hero Section */}
        <section
          id="home"
          className="bg-white py-16 sm:py-20 lg:py-28 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left 7 Cols: Value Proposition */}
              <div className="lg:col-span-7 space-y-7 text-left rtl:text-right">
                <div className="space-y-5">
                  <h1
                    className="text-4xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-[#0D1B2A] leading-[1.1]"
                    style={{ textWrap: "balance" } as React.CSSProperties}
                  >
                    {isAr
                      ? "الضرائب والمحاسبة في الإمارات، بدقة وبدون غرامات."
                      : "UAE Tax & Accounting, Handled Without Penalties."}
                  </h1>

                  <p className="text-base sm:text-lg text-[#475569] leading-[1.6] max-w-[58ch]">
                    {isAr
                      ? "وكلاء ضرائب معتمدون لدى الهيئة الاتحادية للضرائب ومحاسبون قانونيون لشركات البر الرئيسي والمناطق الحرة في دبي والشارقة، بباقات ثابتة تبدأ من 400 درهم شهرياً."
                      : "FTA-registered tax agents and chartered accountants serving Dubai Mainland, DIFC, SHAMS, and UAE Free Zone businesses under transparent fixed fees from AED 400/month."}
                  </p>
                </div>

                {/* Max 2 Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                  <a
                    href="/#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/#contact");
                    }}
                    className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white font-semibold text-sm sm:text-base px-6 py-3.5 transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? "احجز استشارة مجانية" : "Book Free Consultation"}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </a>

                  <a
                    href="/uae-tax-planner"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/uae-tax-planner");
                    }}
                    className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#0D1B2A] border border-slate-300 font-semibold text-sm sm:text-base px-6 py-3.5 transition-colors whitespace-nowrap"
                  >
                    <Calculator className="w-4 h-4 text-[#475569]" />
                    <span>{isAr ? "جرّب حاسبة الضرائب 2026" : "Try 2026 Tax Calculator"}</span>
                  </a>
                </div>

                {/* Subtle Single-Line Trust Bar */}
                <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-[#475569]">
                  <span className="font-medium text-[#0D1B2A]">
                    {isAr ? "وكالة ضريبية مسجلة لدى الهيئة" : "FTA Registered Tax Agency"}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">•</span>
                  <a
                    href={GOOGLE_BUSINESS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0D1B2A] transition-colors tabular-nums"
                  >
                    <span className="font-medium text-[#0D1B2A]">5.0★ Google Rating</span> (48 Reviews)
                  </a>
                  <span aria-hidden="true" className="text-slate-300">•</span>
                  <span className="tabular-nums">{isAr ? "+500 شركة وإقرار في الإمارات" : "500+ UAE Businesses & Filings"}</span>
                </div>
              </div>

              {/* Right 5 Cols: Calm Executive 2026 UAE Compliance Snapshot */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-7 sm:p-8 space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-[#0D1B2A]">
                      {isAr ? "ملخص الامتثال الضريبي 2026" : "2026 UAE Compliance Snapshot"}
                    </h2>
                    <p className="text-sm text-[#475569]">
                      {isAr
                        ? "الأطر الرئيسية لضريبة الشركات والقيمة المضافة في الإمارات"
                        : "Key statutory thresholds managed for every retainer client."}
                    </p>
                  </div>

                  <dl className="divide-y divide-[#E2E8F0] text-sm">
                    <div className="py-3.5 flex items-baseline justify-between gap-4">
                      <dt className="text-[#475569]">Corporate Tax Rate</dt>
                      <dd className="font-semibold text-[#0D1B2A] text-right tabular-nums">
                        0% to AED 375k · 9% above
                      </dd>
                    </div>
                    <div className="py-3.5 flex items-baseline justify-between gap-4">
                      <dt className="text-[#475569]">Small Business Relief</dt>
                      <dd className="font-semibold text-[#1B4332] text-right tabular-nums">
                        0% up to AED 3M revenue
                      </dd>
                    </div>
                    <div className="py-3.5 flex items-baseline justify-between gap-4">
                      <dt className="text-[#475569]">VAT Registration</dt>
                      <dd className="font-semibold text-[#0D1B2A] text-right tabular-nums">
                        5% · Mandatory &gt; AED 375k
                      </dd>
                    </div>
                    <div className="py-3.5 flex items-baseline justify-between gap-4">
                      <dt className="text-[#475569]">Fixed Retainers</dt>
                      <dd className="font-semibold text-[#0D1B2A] text-right tabular-nums">
                        From AED 400 / month
                      </dd>
                    </div>
                  </dl>

                  <div className="pt-1">
                    <a
                      href="/uae-tax-planner"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo("/uae-tax-planner");
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] hover:text-[#143326] transition-colors"
                    >
                      <span>{isAr ? "احسب التزامك الضريبي" : "Estimate your 2026 tax liability"}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Clean Horizontal Stats Strip */}
        <section
          aria-label="Key Practice Metrics"
          className="bg-slate-50 border-y border-slate-200 py-12 lg:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight tabular-nums">
                  15+ Years
                </p>
                <p className="text-sm text-slate-500 mt-1.5">
                  UAE tax &amp; IFRS practice
                </p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight tabular-nums">
                  500+
                </p>
                <p className="text-sm text-slate-500 mt-1.5">
                  UAE filings &amp; entities advised
                </p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight tabular-nums">
                  5.0 ★
                </p>
                <p className="text-sm text-slate-500 mt-1.5">
                  Google rating (48 reviews)
                </p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight tabular-nums">
                  AED 400
                </p>
                <p className="text-sm text-slate-500 mt-1.5">
                  Starting fixed monthly retainer
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Core Services Grid (Clean 3-Column Layout) */}
        <section
          id="services"
          className="bg-white py-20 lg:py-28 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1B2A] tracking-tight">
                  {isAr ? "خدماتنا المحاسبية والضريبية" : "Core Accounting & Tax Services"}
                </h2>
                <p className="text-base sm:text-lg text-[#475569] leading-[1.6] max-w-[60ch]">
                  {isAr
                    ? "حلول امتثال متكاملة للشركات في دبي والشارقة وكافة المناطق الحرة بإشراف وكلاء ضرائب معتمدين."
                    : "End-to-end compliance for Dubai Mainland, DIFC, SHAMS, and UAE Free Zone companies, signed off by registered tax agents."}
                </p>
              </div>

              <a
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("/services");
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] hover:text-[#143326] transition-colors shrink-0"
              >
                <span>{isAr ? "عرض جميع الخدمات" : "View all services"}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {HOMEPAGE_SERVICES.map((service) => {
                const IconComponent = service.icon;
                return (
                  <a
                    key={service.id}
                    href={service.link}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(service.link);
                    }}
                    className="group bg-white border border-[#E2E8F0] hover:border-slate-300 rounded-2xl p-7 flex flex-col justify-between transition-all shadow-xs hover:shadow-sm"
                  >
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#1B4332]">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-[#0D1B2A] group-hover:text-[#1B4332] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm sm:text-base text-[#475569] leading-[1.6]">
                        {service.desc}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D1B2A] group-hover:text-[#1B4332] transition-colors">
                        <span>{isAr ? "اعرف المزيد" : "Learn more"}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Monochrome Software & Jurisdiction Ecosystem Strip */}
        <section
          aria-label="Supported Accounting Platforms and UAE Authorities"
          className="bg-slate-50 border-y border-slate-200 py-12 lg:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <p className="text-center text-sm font-medium text-slate-500">
              {isAr
                ? "المنصات المحاسبية والجهات التنظيمية التي نعمل معها يومياً"
                : "Cloud accounting platforms & UAE regulatory portals we manage daily"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {SOFTWARE_ECOSYSTEM.map((name) => (
                <span
                  key={name}
                  className="text-base sm:text-lg font-semibold tracking-tight text-slate-400 hover:text-slate-700 transition-colors select-none"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Pricing Section Refactor (Monthly Retainers | Backlog Catch-Up | Standalone Filings) */}
        <HomepagePricingSection
          billingPeriod={billingPeriod}
          setBillingPeriod={setBillingPeriod}
          pricingPath={pricingPath}
          setPricingPath={setPricingPath}
          onNavigate={navigateTo}
          language={language}
          onPreselectedCallBooking={handlePreselectedCallBooking}
        />

        {/* 5.5 Step-by-Step Guided Scope Selector Underneath Pricing */}
        <ScopeInstantQuoteBuilder
          id="instant-quote"
          onNavigate={navigateTo}
          onSelectScopeForBooking={(summary) => handlePreselectedCallBooking(summary)}
        />

        {/* 6. Client Reviews */}
        <section
          id="testimonials"
          className="py-20 lg:py-28 bg-white border-t border-slate-200 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1B2A] tracking-tight">
                  Trusted by UAE Founders &amp; Finance Teams
                </h2>
                <p className="text-base sm:text-lg text-[#475569] leading-[1.6] max-w-[60ch]">
                  Rated 5.0★ across 48 verified Google reviews from Mainland, SHAMS, DIFC, and Free Zone clients.
                </p>
              </div>
              <a
                href="/testimonials"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("/testimonials");
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] hover:text-[#143326] transition-colors shrink-0"
              >
                <span>Read all client reviews</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <blockquote className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#C5A059]" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-base text-[#0D1B2A] leading-[1.6] max-w-[60ch]">
                    &ldquo;Dias Accounting took over our monthly books and filed our first UAE Corporate Tax return with zero stress. Their transparent fixed fees mean no surprises at the end of the month.&rdquo;
                  </p>
                </div>
                <footer className="pt-5 border-t border-[#E2E8F0]">
                  <p className="text-sm font-semibold text-[#0D1B2A]">Tareq Al-Mansoori</p>
                  <p className="text-xs text-[#475569] mt-0.5">
                    Apex Tech Ventures LLC · Business Bay, Dubai
                  </p>
                </footer>
              </blockquote>

              <blockquote className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#C5A059]" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-base text-[#0D1B2A] leading-[1.6] max-w-[60ch]">
                    &ldquo;As a Free Zone startup founder, understanding whether we qualified for 0% SBR was confusing. Dias audited our setup, saved us substantial tax liability, and gave us total peace of mind.&rdquo;
                  </p>
                </div>
                <footer className="pt-5 border-t border-[#E2E8F0]">
                  <p className="text-sm font-semibold text-[#0D1B2A]">Elena Rostova</p>
                  <p className="text-xs text-[#475569] mt-0.5">
                    Helios Global Logistics · SHAMS &amp; Dubai
                  </p>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* 7. Insights Preview */}
        <LazyMount minHeight={360} sectionId="blogs">
          <React.Suspense
            fallback={
              <div className="py-20 text-center text-sm text-slate-400">
                Loading insights...
              </div>
            }
          >
            <HomepageInsightsSection
              onSelectBlog={(blog) => navigateTo(`/blog/${blog.id}`)}
              onNavigate={navigateTo}
            />
          </React.Suspense>
        </LazyMount>

        {/* 8. Frequently Asked Questions */}
        <section
          id="faqs"
          className="py-20 lg:py-28 bg-white border-t border-slate-200 scroll-mt-20"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-base text-slate-600 leading-[1.6] max-w-[58ch] mx-auto">
                Clear answers on UAE Corporate Tax, 5% VAT registration, IFRS bookkeeping, and fixed retainers.
              </p>
            </div>

            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {(faqsData || []).slice(0, 6).map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div key={faq.id}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="w-full min-h-[56px] py-5 text-left rtl:text-right flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:text-[#1B4332]"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base font-semibold text-[#0D1B2A]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#1B4332]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-6 pr-8 text-base text-[#475569] leading-[1.6] max-w-[65ch]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <a
                href="/faqs"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("/faqs");
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] hover:text-[#143326] transition-colors"
              >
                <span>View all FAQs</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* 9. Consultation & Contact Section */}
        <section
          id="contact"
          className="py-20 lg:py-28 bg-[#F8FAFC] border-t border-[#E2E8F0] scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1B2A] tracking-tight">
                Schedule a Free Consultation
              </h2>
              <p className="text-base sm:text-lg text-[#475569] leading-[1.6] max-w-[60ch]">
                Share your company details and tax requirements. A senior advisor will respond within 2 business hours.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Left 7 Cols: Scheduler Form */}
              <div className="lg:col-span-7">
                <LazyMount minHeight={520} sectionId="contact">
                  <React.Suspense
                    fallback={
                      <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] min-h-[520px] flex items-center justify-center text-[#475569] text-sm">
                        Loading consultation form...
                      </div>
                    }
                  >
                    <Scheduler preselectedService={preselectedServiceTitle} />
                  </React.Suspense>
                </LazyMount>
              </div>

              {/* Right 5 Cols: HQ Details + Map */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 sm:p-8 space-y-6 shadow-xs">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-[#0D1B2A]">
                      UAE Advisory Desk
                    </h3>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      Licensed in Sharjah Media City (SHAMS), serving Mainland and Free Zone businesses across Dubai, Sharjah, and all UAE Emirates.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#1B4332] shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-[#0D1B2A]">
                          Sharjah Media City (SHAMS), Al Messaned, Sharjah, UAE
                        </p>
                        <p className="text-xs text-[#475569] mt-0.5 tabular-nums">
                          Trade Licence SHAMS 2646813.01 · P.O. Box 515000
                        </p>
                      </div>
                    </div>

                    <a
                      href="tel:+971529226958"
                      className="flex items-center gap-3 text-[#0D1B2A] hover:text-[#1B4332] transition-colors font-medium tabular-nums"
                    >
                      <Phone className="w-4 h-4 text-[#1B4332] shrink-0" />
                      <span>+971 52 922 6958</span>
                    </a>

                    <a
                      href="mailto:info@diasuae.ae"
                      className="flex items-center gap-3 text-[#0D1B2A] hover:text-[#1B4332] transition-colors font-medium"
                    >
                      <Mail className="w-4 h-4 text-[#1B4332] shrink-0" />
                      <span>info@diasuae.ae</span>
                    </a>

                    <div className="flex items-start gap-3 text-[#475569]">
                      <Clock className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
                      <span className="text-xs leading-relaxed tabular-nums">
                        Mon – Fri: 9:00 AM – 6:00 PM · Sat: 10:00 AM – 2:00 PM GST
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <a
                      href="https://wa.me/971529226958?text=Hi%20Dias%20Accounting%2C%20I%20would%20like%20to%20schedule%20a%20consultation."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4332] hover:text-[#143326] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>Message us on WhatsApp</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <LazyMount minHeight={260}>
                  <React.Suspense
                    fallback={
                      <div className="h-64 bg-slate-100 rounded-2xl flex items-center justify-center text-xs text-slate-500">
                        Loading office map...
                      </div>
                    }
                  >
                    <GoogleOfficeMap language={language} />
                  </React.Suspense>
                </LazyMount>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean 4-Column Executive Footer */}
      <PageFooter
        onNavigate={navigateTo}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
      />

      {/* Lazy-Loaded Modals (Preserved for Functional Links) */}
      <React.Suspense fallback={null}>
        {selectedService && (
          <ServiceModal
            isOpen={selectedService !== null}
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onBookCall={handlePreselectedCallBooking}
          />
        )}
        {selectedBlog && (
          <BlogModal
            blog={selectedBlog}
            onNavigate={navigateTo}
            onClose={() => {
              setSelectedBlog(null);
              if (typeof window !== "undefined" && window.location.hash.startsWith("#blog-")) {
                try {
                  window.history.replaceState(null, "", window.location.pathname + window.location.search);
                } catch {
                  // Ignore
                }
              }
            }}
            onContact={() => {
              setSelectedBlog(null);
              setTimeout(() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 120);
            }}
          />
        )}
        {taxHealthModalOpen && (
          <TaxHealthCheckModal isOpen={taxHealthModalOpen} onClose={() => setTaxHealthModalOpen(false)} />
        )}
        {leadMagnetModalOpen && (
          <LeadMagnetDownloadModal isOpen={leadMagnetModalOpen} onClose={() => setLeadMagnetModalOpen(false)} />
        )}
        {privacyOpen && (
          <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
        )}
        {googlePreferredModalOpen && (
          <GooglePreferredSourceModal
            isOpen={googlePreferredModalOpen}
            onClose={() => setGooglePreferredModalOpen(false)}
            businessName="Dias Accounting & Tax Consulting LLC"
          />
        )}
        {taxAiModalOpen && (
          <TaxAiAdvisorModal
            isOpen={taxAiModalOpen}
            onClose={() => setTaxAiModalOpen(false)}
            initialQuery={taxAiInitialQuery}
            initialCategory={taxAiInitialCategory}
            onOpenScheduler={() => {
              const el = document.getElementById("contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />
        )}
        {seoDashboardOpen && (
          <SeoEngineDashboardModal
            isOpen={seoDashboardOpen}
            onClose={() => setSeoDashboardOpen(false)}
            onPostPublished={(newPost) => {
              setAllBlogs((prev) => [newPost, ...prev.filter((b) => b.id !== newPost.id)]);
            }}
          />
        )}
      </React.Suspense>

      {/* UAE PDPL & Cookie Consent Banner */}
      <CookieConsentBanner
        onNavigate={navigateTo}
        onOpenPrivacy={() => navigateTo("/privacy-policy")}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
