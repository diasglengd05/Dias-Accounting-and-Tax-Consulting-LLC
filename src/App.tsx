import React, { useState, useEffect, useRef, useTransition, Suspense } from "react";
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
import { ClutchRatingWidget } from "./components/ClutchBadges";
import OfficialRecognitionSection from "./components/OfficialRecognitionSection";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import QuickSummaryBox from "./components/QuickSummaryBox";
import TaxAgentReviewStrip from "./components/TaxAgentReviewStrip";
import MonthlyPackageConversionStrip from "./components/MonthlyPackageConversionStrip";
import PageMainTransition, { RouteTransitionProvider } from "./components/PageMainTransition";

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
// Route pages imported directly so build-time SSG renderToString outputs full HTML & <h1> with zero Suspense fallback
import { SmallBusinessTaxReliefPage } from "./pages/SmallBusinessTaxReliefPage";
import { DifcDtecAccountingPage } from "./pages/DifcDtecAccountingPage";
import { DividendsAuditPage } from "./pages/DividendsAuditPage";
import ServicesPage from "./pages/ServicesPage";
import CompanySetupPage from "./pages/CompanySetupPage";
import PricingPage from "./pages/PricingPage";
import WhyChooseUsPage from "./pages/WhyChooseUsPage";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import TestimonialsPage from "./pages/TestimonialsPage";
const HomepageInsightsSection = React.lazy(() => import("./components/HomepageInsightsSection"));
import FaqsPage from "./pages/FaqsPage";
import ContactPage from "./pages/ContactPage";
import TaxPlannerPage from "./pages/TaxPlannerPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import VatPlannerPage from "./pages/VatPlannerPage";
import FtaDeadlinesPage from "./pages/FtaDeadlinesPage";
import PartnersPage from "./pages/PartnersPage";
import CookieConsentBanner from "./components/CookieConsentBanner";
import HomepagePricingSection from "./components/HomepagePricingSection";
import ScopeInstantQuoteBuilder from "./components/ScopeInstantQuoteBuilder";
import SameDayQuoteBox from "./components/SameDayQuoteBox";

const normalizeAppPath = (rawPath: string): string => {
  const pathOnly = (rawPath || "/").split("?")[0];
  const lower = pathOnly.toLowerCase().replace(/\/+$/, "") || "/";
  if (lower === "/home" || lower === "/home.html" || lower === "/index.html") {
    return "/";
  }
  if (lower === "/blogs") {
    return "/blog";
  }
  if (
    lower === "/blog/draft-top-tax-mistakes-uae-companies-make" ||
    lower === "/blogs/draft-top-tax-mistakes-uae-companies-make"
  ) {
    return "/blog/top-tax-mistakes-uae-companies-make";
  }
  if (
    lower === "/blog/draft-free-zone-qualifying-income" ||
    lower === "/blogs/draft-free-zone-qualifying-income"
  ) {
    return "/blog/free-zone-qualifying-income";
  }
  if (
    lower === "/blog/draft-claim-small-business-relief" ||
    lower === "/blogs/draft-claim-small-business-relief"
  ) {
    return "/blog/claim-small-business-relief";
  }
  if (
    lower === "/blog/draft-vat-registration-checklist" ||
    lower === "/blogs/draft-vat-registration-checklist"
  ) {
    return "/blog/vat-compliance-checklist";
  }
  if (
    lower === "/blog/draft-backlog-bookkeeping-penalty-shield" ||
    lower === "/blogs/draft-backlog-bookkeeping-penalty-shield"
  ) {
    return "/services/backlog-accounting";
  }
  if (/^\/blogs?\/draft-.+$/.test(lower)) {
    return "/blog";
  }
  if (lower.startsWith("/blogs/")) {
    const slug = pathOnly.replace(/^\/blogs\//i, "").replace(/\/+$/, "");
    return slug ? `/blog/${slug}` : "/blog";
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

function MainApp({ initialPath }: { initialPath?: string }) {
  const { language } = useLanguage();
  const isAr = language === "ar";

  // Navigation state
  const [activeSection, setActiveSection] = useState("home");

  // Dedicated SEO Landing Pages Path State & Seamless View Transitions
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (initialPath) {
      return normalizeAppPath(initialPath);
    }
    if (typeof window !== "undefined") {
      return normalizeAppPath(window.location.pathname);
    }
    return "/";
  });
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isRoutePending, startRouteTransition] = useTransition();
  const [isPageLoadingPulse, setIsPageLoadingPulse] = useState(false);
  const normalizedRouteKey = currentPath.toLowerCase().replace(/\/+$/, "") || "/";
  const currentRouteKeyRef = useRef(normalizedRouteKey);
  const pendingHashRef = useRef<string | null>(null);

  useEffect(() => {
    currentRouteKeyRef.current = normalizedRouteKey;
  }, [normalizedRouteKey]);

  // Subtle single-turn loading animation for the header emblem on initial page load and route changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsPageLoadingPulse(true);
    let settled = false;
    const stopTimer = window.setTimeout(() => {
      if (!settled) setIsPageLoadingPulse(false);
    }, 1150);

    return () => {
      settled = true;
      window.clearTimeout(stopTimer);
    };
  }, [normalizedRouteKey]);

  useEffect(() => {
    const syncAndConsolidateHome = () => {
      const raw = window.location.pathname;
      const normalized = normalizeAppPath(raw);
      if (normalized !== raw) {
        const nextHash = window.location.hash === "#home" ? "" : window.location.hash;
        window.history.replaceState(null, "", `${normalized}${window.location.search}${nextHash}`);
      }
      const nextKey = normalized.toLowerCase().replace(/\/+$/, "") || "/";
      if (nextKey !== currentRouteKeyRef.current) {
        setHasNavigated(true);
        startRouteTransition(() => {
          setCurrentPath(normalized);
        });
      }
    };

    syncAndConsolidateHome();
    window.addEventListener("popstate", syncAndConsolidateHome);
    return () => window.removeEventListener("popstate", syncAndConsolidateHome);
  }, []);

  // Reset scroll cleanly right after the outgoing route finishes its exit animation
  const handleRouteExitComplete = () => {
    if (typeof window === "undefined") return;

    const targetHash =
      pendingHashRef.current ||
      (window.location.hash &&
      window.location.hash !== "#home" &&
      window.location.hash !== "#seo-engine" &&
      window.location.hash !== "#admin-seo"
        ? window.location.hash.replace(/^#/, "")
        : null);
    pendingHashRef.current = null;

    if (targetHash) {
      window.setTimeout(() => {
        const el = document.getElementById(targetHash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 80);
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  };

  const navigateTo = (path: string) => {
    if (typeof window !== "undefined") {
      const [rawBeforeHash, hashPart] = path.split("#");
      const [rawPathPart, queryPart] = (rawBeforeHash || "/").split("?");
      const normalized = normalizeAppPath(rawPathPart || "/");
      const nextKey = normalized.toLowerCase().replace(/\/+$/, "") || "/";
      const isSameRoute = nextKey === currentRouteKeyRef.current;
      const searchStr = queryPart ? `?${queryPart}` : "";
      const fullUrl = `${normalized}${searchStr}${hashPart ? `#${hashPart}` : ""}`;

      window.history.pushState(null, "", fullUrl);

      if (isSameRoute) {
        if (hashPart) {
          window.setTimeout(() => {
            const el = document.getElementById(hashPart);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }, 40);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      pendingHashRef.current = hashPart || null;
      setHasNavigated(true);
      startRouteTransition(() => {
        setCurrentPath(normalized);
      });
      window.dispatchEvent(new PopStateEvent("popstate"));
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
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] font-sans text-[#0D1B2A] antialiased">
      <PageNavigation
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenAudit={() => setTaxHealthModalOpen(true)}
      />
      <div
        data-page-transition="content"
        className="flex-1 flex flex-col items-center justify-center gap-3 text-[#475569] text-sm px-4"
      >
        <div
          className="w-6 h-6 rounded-full border-2 border-[#E2E8F0] border-t-[#C5A059] animate-spin"
          aria-hidden="true"
        />
        <span>{label}</span>
      </div>
    </div>
  );

  const renderRouteView = (): React.ReactNode => {
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

  if (currentPath === "/partners") {
    return (
      <Suspense fallback={renderPageFallback("Loading UAE Business Ecosystem & Partners...")}>
        <PartnersPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
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
      <div
        data-page-transition="content"
        className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-white p-6 space-y-6 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center animate-pulse">
          <FileSpreadsheet className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="font-display text-2xl font-bold">DiasUAE Inquiries Spreadsheet</h1>
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

      <PageMainTransition id="main-content" role="main">
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
                      ? "باقات المحاسبة وضريبة القيمة المضافة 5% وضريبة الشركات 9% في الإمارات — تبدأ من 400 درهم شهرياً"
                      : "UAE Accounting, 5% VAT & 9% Corporate Tax Packages — From AED 400/Month"}
                  </h1>

                  <QuickSummaryBox variant="light" label="Quick Summary">
                    <strong className="text-[#0D1B2A] font-semibold">
                      DiasUAE (Dias Accounting and Tax Consulting LLC)
                    </strong>
                    , led by FTA-Registered Tax Agent{" "}
                    <strong className="text-[#0D1B2A] font-semibold">Glen Dias</strong> (SHAMS Licence{" "}
                    <span className="tabular-nums font-medium text-[#0D1B2A]">2646813.01</span>) and recognized as a{" "}
                    <span className="font-medium text-[#856422]">2x Clutch 2026 UAE Leader</span>, delivers fixed-fee IFRS bookkeeping, 5% UAE VAT, 9% Corporate Tax, and statutory dividend audits. We serve Dubai Mainland, DIFC, DTEC, DMCC, IFZA, and SHAMS with 5th-business-day monthly closes, 5-working-day dividend audits, and retainers starting{" "}
                    <strong className="text-[#1B4332] font-semibold">from AED 400/month</strong>.
                  </QuickSummaryBox>

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
                <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-2.5 text-sm text-[#475569]">
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
                  <span className="inline-flex items-center">
                    <ClutchRatingWidget />
                  </span>
                  <span aria-hidden="true" className="text-slate-300 hidden sm:inline">•</span>
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

            {/* Compact Above-the-Fold Same-Day Fixed Fee Quote Card */}
            <div className="mt-10 lg:mt-12">
              <SameDayQuoteBox
                idPrefix="home-quote"
                defaultJurisdiction="Dubai Mainland"
                defaultService="Monthly Accounting from AED 400/mo"
              />
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

            {/* Statutory Accreditation Strip */}
            <div className="mt-10 pt-8 border-t border-slate-200">
              <div className="flex items-start gap-4 rounded-2xl bg-white border border-[#E2E8F0] p-5 sm:p-6">
                <div className="w-11 h-11 rounded-xl bg-[#1B4332]/10 border border-[#1B4332]/20 flex items-center justify-center text-[#1B4332] shrink-0">
                  <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#1B4332]">
                    Statutory Accreditation
                  </p>
                  <p className="text-sm sm:text-base font-bold text-[#0D1B2A]">
                    FTA Registered Tax Agency · United Arab Emirates
                  </p>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    Licensed in Sharjah Media City (Trade Licence SHAMS 2646813.01) and led by FTA-Registered Tax Agent Glen Dias.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Official 2026 Recognition (Clutch UAE Awards) */}
        <OfficialRecognitionSection id="homepage-official-2026-recognition" />

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

            {/* Priority 2026 UAE Tax & Audit Quick-Access Links */}
            <div className="rounded-2xl bg-[#070d19] border border-[#c5a059]/30 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-white">
              <div className="space-y-1">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c5a059]">
                  2026 FTA Priority Guides &amp; Execution Desks
                </span>
                <p className="text-sm text-slate-300">
                  Jump directly to our 2026 VAT compliance checklist, 4–5 day statutory dividends audit timeline, or DIFC &amp; DTEC 0% QFZP hub.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <a
                  href="/services/vat-compliance"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("/services/vat-compliance");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0d1b2a] border border-[#c5a059]/40 hover:border-[#c5a059] px-3.5 py-2 text-xs sm:text-sm font-semibold text-white hover:text-[#c5a059] transition-colors"
                >
                  <span>UAE VAT Compliance &amp; Form 201</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
                </a>
                <a
                  href="/dividends-audit"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("/dividends-audit");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0d1b2a] border border-[#c5a059]/40 hover:border-[#c5a059] px-3.5 py-2 text-xs sm:text-sm font-semibold text-white hover:text-[#c5a059] transition-colors"
                >
                  <span>Statutory Dividends Audit</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
                </a>
                <a
                  href="/tax-planning-difc"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("/tax-planning-difc");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0d1b2a] border border-[#c5a059]/40 hover:border-[#c5a059] px-3.5 py-2 text-xs sm:text-sm font-semibold text-white hover:text-[#c5a059] transition-colors"
                >
                  <span>DIFC &amp; DTEC 0% QFZP</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
                </a>
              </div>
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

        {/* 5.25 AI Mode Cost & Governance Comparison: In-House vs. DiasUAE */}
        <section
          aria-label="In-House UAE Accountant vs. DiasUAE Outsourced Tax Agency"
          className="bg-[#070d19] border-y border-[#c5a059]/25 py-16 lg:py-22 text-white"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="max-w-3xl space-y-2.5">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[#c5a059]">
                2026 UAE Cost &amp; Governance Comparison
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                In-House UAE Accountant vs. DiasUAE Outsourced Tax Agency
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-[65ch]">
                Compare total employer overhead, FTA Tax Agent representation, and year-round continuity when scaling a UAE Mainland, DIFC, DTEC, or Free Zone company.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#c5a059]/30 bg-[#0d1b2a] shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#c5a059]/25 bg-[#070d19]/85 text-xs uppercase tracking-wider">
                    <th scope="col" className="px-5 py-4 font-semibold text-slate-300">
                      Comparison Factor
                    </th>
                    <th scope="col" className="px-5 py-4 font-semibold text-slate-300">
                      In-House UAE Accountant
                    </th>
                    <th scope="col" className="px-5 py-4 font-semibold text-[#c5a059]">
                      DiasUAE Outsourced Tax Agency
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-semibold text-white whitespace-nowrap">
                      Monthly Cost
                    </td>
                    <td className="px-5 py-4 text-slate-300 tabular-nums">
                      AED 8,000–15,000+ / month (base salary + software licenses)
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#c5a059] tabular-nums">
                      From AED 400/month (fixed all-inclusive IFRS &amp; tax retainer)
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-semibold text-white whitespace-nowrap">
                      FTA Tax Agent Sign-Off
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      Not included — requires paying an external FTA-registered tax agency separately
                    </td>
                    <td className="px-5 py-4 font-semibold text-white">
                      Included — direct sign-off &amp; FTA representation by Glen Dias, FTA-Registered Tax Agent
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-semibold text-white whitespace-nowrap">
                      Visa, Medical &amp; Gratuity Overhead
                    </td>
                    <td className="px-5 py-4 text-slate-300 tabular-nums">
                      AED 15,000–25,000+ / year (UAE employment visa, health insurance, EOSB gratuity &amp; leave airfare)
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#c5a059]">
                      AED 0 employer overhead — zero visa, HR, insurance, or gratuity liability
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-semibold text-white whitespace-nowrap">
                      Continuity &amp; Penalty Protection
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      Single point of failure during annual leave, illness, or unexpected staff resignation
                    </td>
                    <td className="px-5 py-4 font-semibold text-white">
                      Uninterrupted chartered accounting &amp; tax team with 5th-day closes and zero missed FTA deadlines
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-semibold text-white whitespace-nowrap">
                      Specialist Scope (QFZP &amp; Audits)
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      Routine bookkeeping only; external consultants needed for 0% QFZP, VAT audits &amp; dividend audits
                    </td>
                    <td className="px-5 py-4 font-semibold text-white">
                      2x Clutch 2026 UAE Leader covering 0% QFZP, 5% VAT Form 201, forecasting &amp; 5-day dividend audits
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

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

                <LazyMount minHeight={510}>
                  <React.Suspense
                    fallback={
                      <div className="h-[450px] bg-[#070d19] border border-[#c5a059]/40 rounded-2xl flex items-center justify-center text-xs text-slate-300">
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

        {/* Monthly Package Internal-Link Conversion Strip */}
        <MonthlyPackageConversionStrip onNavigate={navigateTo} />

        {/* E-E-A-T Tax Agent Verification Strip */}
        <TaxAgentReviewStrip />
      </PageMainTransition>

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
  };

  return (
    <RouteTransitionProvider
      routeKey={normalizedRouteKey}
      hasNavigated={hasNavigated}
      isPageLoading={isRoutePending || isPageLoadingPulse}
    >
      {isRoutePending && (
        <div
          className="fixed top-0 inset-x-0 z-[100] h-[2.5px] bg-[#0D1B2A]/10 overflow-hidden pointer-events-none"
          role="progressbar"
          aria-label="Loading page"
        >
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent route-progress-bar" />
        </div>
      )}
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={handleRouteExitComplete}
      >
        <motion.div
          key={normalizedRouteKey}
          className={
            hasNavigated
              ? "page-view-enter flex-1 flex flex-col"
              : "flex-1 flex flex-col"
          }
        >
          {renderRouteView()}
        </motion.div>
      </AnimatePresence>
    </RouteTransitionProvider>
  );
}

export interface AppProps {
  initialPath?: string;
}

export default function App({ initialPath }: AppProps = {}) {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <MainApp initialPath={initialPath} />
      </LanguageProvider>
    </MotionConfig>
  );
}
