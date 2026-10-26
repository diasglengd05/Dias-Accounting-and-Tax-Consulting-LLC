import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  Menu,
  X,
  Calculator,
  TrendingUp,
  Percent,
  Building,
  Check,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ChevronRight,
  ExternalLink,
  FileSpreadsheet,
  ShieldCheck,
  Shield,
  AlertCircle,
  FileCheck,
  Award,
  BookOpen,
  Users,
  BarChart3,
  Clock,
  Briefcase,
  HelpCircle,
  Sparkles,
  Lock,
  MessageCircle,
  Linkedin,
  Instagram,
  Facebook,
  Star,
  Quote,
  ChevronDown,
  ArrowUp,
  Globe,
  Share2,
  Copy,
  Image as ImageIcon,
} from "lucide-react";

// Imports from our modular files
import { Service, BlogPost, PricingTier, Testimonial, FAQItem } from "./types";
import { servicesData, pricingTiers, testimonialsData, faqsData, GOOGLE_BUSINESS_URL, GOOGLE_RATING_STATS } from "./data/staticData";
import { blogsData } from "./data/blogsData";
import DiasLogo from "./components/DiasLogo";
import { GoogleLogo } from "./components/GoogleLogo";
import ComplianceAlertBanner from "./components/ComplianceAlertBanner";
import StickyMobileLeadBar from "./components/StickyMobileLeadBar";
import FloatingSideTabs from "./components/FloatingSideTabs";
import AddToPreferredSources from "./components/AddToPreferredSources";
import useDynamicSEO from "./hooks/useDynamicSEO";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import LanguageToggle from "./components/LanguageToggle";
import LazyMount from "./components/LazyMount";
import AnimatedSection from "./components/AnimatedSection";
import WhyChooseUs from "./components/WhyChooseUsGrid";
const WhyChooseUsGrid = WhyChooseUs;
import { motion, type Variants } from "framer-motion";

// Lazy-loaded components for fast mobile JS execution & small initial bundle size
const GoogleOfficeMap = React.lazy(() => import("./components/GoogleOfficeMap"));
const BlogSection = React.lazy(() => import("./components/BlogSection"));
const GooglePreferredSourceModal = React.lazy(() => import("./components/GooglePreferredSourceModal"));
const BlogModal = React.lazy(() => import("./components/BlogModal"));
const TaxCalculator = React.lazy(() => import("./components/TaxCalculator"));
const ServiceModal = React.lazy(() => import("./components/ServiceModal"));
const WhatsAppWidget = React.lazy(() => import("./components/WhatsAppWidget"));
const Scheduler = React.lazy(() => import("./components/Scheduler"));
const PrivacyPolicyModal = React.lazy(() => import("./components/PrivacyPolicyModal"));
const GoogleReviewsSection = React.lazy(() => import("./components/GoogleReviewsSection"));
const TaxHealthCheckModal = React.lazy(() => import("./components/TaxHealthCheckModal"));
const LeadMagnetDownloadModal = React.lazy(() => import("./components/LeadMagnetDownloadModal"));
const StandalonePricingCards = React.lazy<React.ComponentType<any>>(() => import("./components/StandalonePricingCards").then(m => ({ default: (m as any).default || (m as any).StandalonePricingCards })));
const OurAffiliations = React.lazy<React.ComponentType<any>>(() => import("./components/OurAffiliations").then(m => ({ default: (m as any).default || (m as any).OurAffiliations })));
const UAEJurisdictionsSEO = React.lazy<React.ComponentType<any>>(() => import("./components/UAEJurisdictionsSEO").then(m => ({ default: (m as any).default || (m as any).UAEJurisdictionsSEO })));
const ClientCaseStudies = lazy(() => import("./components/ClientCaseStudies"));
const TaxAiAdvisorModal = React.lazy<React.ComponentType<any>>(() => import("./components/TaxAiAdvisorModal"));
const CompanySetupHub = React.lazy<React.ComponentType<any>>(() => import("./components/CompanySetupHub").then(m => ({ default: (m as any).default || (m as any).CompanySetupHub })));
const SeoEngineDashboardModal = React.lazy(() => import("./components/SeoEngineDashboardModal"));
const SmallBusinessTaxReliefPage = React.lazy(() => import("./pages/SmallBusinessTaxReliefPage").then(m => ({ default: m.SmallBusinessTaxReliefPage })));
const DifcDtecAccountingPage = React.lazy(() => import("./pages/DifcDtecAccountingPage").then(m => ({ default: m.DifcDtecAccountingPage })));
const DividendsAuditPage = React.lazy(() => import("./pages/DividendsAuditPage").then(m => ({ default: m.DividendsAuditPage })));

// Framer Motion variants for staggered sequential reveal in Services section
const servicesContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const serviceCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1], // Luxury smooth cubic-bezier ease
    },
  },
};

function MainApp() {
  const { t, language, isRTL } = useLanguage();

  // Navigation states
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dedicated SEO Landing Pages Path State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname;
    }
    return "/";
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Pricing duration & path state (BCL-style prospective vs retrospective backlog)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");
  const [pricingPath, setPricingPath] = useState<"prospective" | "retrospective">("prospective");

  // Selected details for modals
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>(blogsData);
  const [seoDashboardOpen, setSeoDashboardOpen] = useState(false);
  const [copiedBlogLink, setCopiedBlogLink] = useState(false);
  const [showOgPreview, setShowOgPreview] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Defer non-critical floating elements (WhatsApp widget, bottom overlays) to unblock first paint
  const [mountFloatingWidgets, setMountFloatingWidgets] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMountFloatingWidgets(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Dynamically update document head title and SEO meta tags based on active section & modal states
  useDynamicSEO({
    activeSection,
    selectedService,
    selectedBlog,
    language,
  });
  
  // Target service for scheduler preselection
  const [preselectedServiceTitle, setPreselectedServiceTitle] = useState("");

  // Scroll to Top visibility state (appears after scrolling past hero section)
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("home");
      const heroHeight = heroSection ? heroSection.offsetHeight : 500;
      // Triggers as soon as the user scrolls past 70% of the hero section
      if (window.scrollY > heroHeight * 0.7) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial scroll state in case the user arrived via anchor hash or refreshed mid-page
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
          const dynamicIds = new Set(data.blogs.map((b: BlogPost) => b.id));
          const merged = [
            ...data.blogs,
            ...blogsData.filter((b) => !dynamicIds.has(b.id)),
          ];
          merged.sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0));
          setAllBlogs(merged);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch dynamic blogs, using static fallback:", err);
      });

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#blog-")) {
        const blogId = hash.replace("#blog-", "").trim().toLowerCase();
        const found =
          blogsData.find(
            (b) =>
              b.id.toLowerCase() === blogId ||
              b.id.toLowerCase().startsWith(blogId) ||
              blogId.startsWith(b.id.toLowerCase())
          ) ||
          allBlogs.find(
            (b) =>
              b.id.toLowerCase() === blogId ||
              b.id.toLowerCase().startsWith(blogId) ||
              blogId.startsWith(b.id.toLowerCase())
          );
        if (found) {
          setSelectedBlog(found);
        }
      } else if (hash === "#seo-engine" || hash === "#cloud-function") {
        setSeoDashboardOpen(true);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Helper to resolve Service icons dynamically
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Calculator":
        return <Calculator className="w-6 h-6 text-gold-500" />;
      case "TrendingUp":
        return <TrendingUp className="w-6 h-6 text-gold-500" />;
      case "Percent":
        return <Percent className="w-6 h-6 text-gold-500" />;
      case "Building":
        return <Building className="w-6 h-6 text-gold-500" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-gold-500" />;
      case "FileCheck":
        return <FileCheck className="w-6 h-6 text-gold-500" />;
      case "Clock":
        return <Clock className="w-6 h-6 text-gold-500" />;
      case "Briefcase":
      default:
        return <Briefcase className="w-6 h-6 text-gold-500" />;
    }
  };

  // Helper to resolve specific icons for "Why Partner With Us"
  const getPartnerBenefitIcon = (idx: number) => {
    switch (idx) {
      case 0: // Optimized Performance
        return <BarChart3 className="w-5 h-5 text-emerald-500" />;
      case 1: // Regulatory Mastery
        return <Award className="w-5 h-5 text-gold-500" />;
      case 2: // Tax Efficiency
        return <Percent className="w-5 h-5 text-blue-500" />;
      case 3: // Data-Driven Decisions
        return <ShieldCheck className="w-5 h-5 text-purple-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    }
  };

  const handlePreselectedCallBooking = (serviceTitle?: string) => {
    setPreselectedServiceTitle(serviceTitle || "Consultation Request");
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Dedicated Landing Page Routes
  if (currentPath === "/small-business-tax-relief") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Small Business Relief Hub...</div>}>
        <SmallBusinessTaxReliefPage onNavigate={navigateTo} />
      </Suspense>
    );
  }

  if (currentPath === "/difc-dtec-accounting") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading DIFC &amp; DTEC Hub...</div>}>
        <DifcDtecAccountingPage onNavigate={navigateTo} />
      </Suspense>
    );
  }

  if (currentPath === "/dividends-audit") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Dividend Audit Hub...</div>}>
        <DividendsAuditPage onNavigate={navigateTo} />
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
    <div className="mobile-container min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950 pb-24 md:pb-0">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-gold-500 focus:text-navy-950 focus:font-display focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>
      
      {/* 0. Top FTA Compliance Alert Banner */}
      <ComplianceAlertBanner onOpenAudit={() => setTaxHealthModalOpen(true)} />

      {/* 1. Header / Navigation - Clean 3-Zone BCL.ae Architectural Top Bar */}
      <header role="banner" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          
          {/* Zone 1: Brand Wordmark & Logo */}
          <div className="flex items-center shrink-0">
            <a
              href="#home"
              className="group flex items-center gap-3 cursor-pointer select-none transition-opacity duration-150 hover:opacity-90"
              aria-label="Dias Accounting Home"
            >
              <DiasLogo className="w-10 h-10" showText={true} textSize="text-xl sm:text-2xl" textColor="text-navy-950" />
            </a>
          </div>

          {/* Zone 2: Clean Typographic Navigation Links (No Pill Enclosures) */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-6 xl:gap-7">
            {[
              { id: "services", label: t.nav.services },
              { id: "company-setup", label: language === "ar" ? "تأسيس الشركات" : "Company Setup" },
              { id: "pricing", label: t.nav.pricing },
              { id: "why-choose-us", label: language === "ar" ? "لماذا دياس؟" : "Why Dias" },
              { id: "blogs", label: language === "ar" ? "الرؤى والمدونة" : "Insights" },
              { id: "testimonials", label: t.nav.reviews },
              { id: "faqs", label: t.nav.faq },
            ].map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
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
                    href="/small-business-tax-relief"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/small-business-tax-relief");
                    }}
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
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/difc-dtec-accounting");
                    }}
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
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/dividends-audit");
                    }}
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

          {/* Zone 3: Language Switcher & Primary Consultation CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <LanguageToggle variant="desktop" />

            <a
              href="#contact"
              className="bg-navy-950 hover:bg-navy-900 text-white font-display font-semibold py-2.5 px-5 rounded-xl text-xs tracking-tight transition-all duration-150 border border-gold-500/40 hover:border-gold-400 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
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
                { id: "home", label: t.nav.home },
                { id: "services", label: t.nav.services },
                { id: "company-setup", label: language === "ar" ? "تأسيس الشركات في دبي والإمارات" : "Company Setup (Mainland & Free Zone)" },
                { id: "pricing", label: t.nav.pricing },
                { id: "why-choose-us", label: language === "ar" ? "لماذا تختار دياس؟" : "Why Choose Dias (6 Pillars)" },
                { id: "case-studies", label: language === "ar" ? "دراسات حالة العملاء" : "Client Case Studies" },
                { id: "blogs", label: language === "ar" ? "الرؤى والمدونة" : "Insights & Regulatory Guides" },
                { id: "testimonials", label: t.nav.reviews },
                { id: "faqs", label: t.nav.faq },
                { id: "contact", label: t.nav.contact },
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 text-sm font-semibold transition-colors ${
                    activeSection === link.id
                      ? "text-gold-600 font-bold"
                      : "text-navy-950 hover:text-gold-600"
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 block">
                {language === "ar" ? "مراكز استشارية متخصصة" : "Specialized Practice Hubs"}
              </span>
              {[
                { path: "/small-business-tax-relief", label: language === "ar" ? "تسهيلات الأعمال الصغيرة (0% حتى 2029)" : "Small Business Tax Relief (AED 3M SBR)" },
                { path: "/difc-dtec-accounting", label: language === "ar" ? "محاسبة وتدقيق DIFC و DTEC" : "DIFC & DTEC Accounting & Audit" },
                { path: "/dividends-audit", label: language === "ar" ? "تدقيق وتوزيع الأرباح" : "Dividend Audit & Distribution" },
              ].map((hub) => (
                <a
                  key={hub.path}
                  href={hub.path}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    navigateTo(hub.path);
                  }}
                  className="flex items-center justify-between py-2 text-xs font-semibold text-slate-600 hover:text-navy-950 transition-colors"
                >
                  <span>{hub.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold-600 rtl:rotate-180" />
                </a>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-navy-950 hover:bg-navy-900 text-white font-display font-bold py-3.5 px-5 rounded-xl text-center text-sm flex items-center justify-center gap-2 border border-gold-500/40"
            >
              <span>{t.nav.bookConsultation}</span>
              <ArrowRight className="w-4 h-4 text-gold-400 rtl:rotate-180" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Landmark for Accessibility & SEO */}
      <main id="main-content" role="main">
        {/* 2. Hero Section - BCL.ae-Inspired Structured Executive Split Layout */}
        <section
          id="home"
          className="relative overflow-hidden bg-navy-950 text-white border-b border-navy-800 scroll-mt-20"
        >
          {/* Architectural Grid & Ambient Brand Lighting */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div className="absolute -top-40 right-0 w-[560px] h-[560px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-navy-800/40 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-stretch">
              
              {/* Left Column (7 Cols): Value Proposition, Authority Kicker & Primary Actions */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-8 text-left rtl:text-right">
                <div className="space-y-6">
                  {/* Quiet Unboxed Institutional Metadata Kicker */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gold-400 tracking-wide">
                    <span>{t.hero.badge}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-300">
                      {language === "ar" ? "دبي والشارقة وكافة إمارات الدولة" : "Dubai, Sharjah & All UAE Jurisdictions"}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <a
                      href={GOOGLE_BUSINESS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-white hover:text-gold-300 transition-colors"
                    >
                      <GoogleLogo className="w-3.5 h-3.5" />
                      <span className="font-semibold text-gold-400">5.0 ★</span>
                      <span className="text-slate-300 underline underline-offset-4">{t.hero.googleRatingText}</span>
                    </a>
                  </div>

                  {/* Balanced Executive Display Headline */}
                  <div className="space-y-4 max-w-2xl">
                    <h1
                      className="font-display text-3xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-white leading-[1.12]"
                      style={{ textWrap: "balance" } as React.CSSProperties}
                    >
                      {t.hero.companyTitle}
                      <span className="block text-gold-400 mt-2 text-2xl sm:text-4xl lg:text-[40px] font-semibold">
                        {t.hero.subheadline1}
                      </span>
                    </h1>

                    <p className="text-base sm:text-lg font-medium text-slate-200 leading-relaxed">
                      {t.hero.subheadline2}
                    </p>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                      {t.hero.description}
                    </p>
                  </div>
                </div>

                {/* Primary & Secondary Action Bar */}
                <div className="space-y-5 pt-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-xl">
                    <a
                      href="#contact"
                      className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold py-3.5 px-6 rounded-xl transition-all duration-150 flex items-center justify-center gap-2.5 text-sm whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
                    >
                      <Calendar className="w-4 h-4 text-navy-950 shrink-0" />
                      <span>{language === "ar" ? "احجز استشارة مجانية" : "Schedule Free Consultation"}</span>
                      <ArrowRight className="w-4 h-4 shrink-0 rtl:rotate-180" />
                    </a>

                    <a
                      href="https://wa.me/971529226958?text=Hello%20Dias%20Accounting,%20I%20would%20like%20to%20consult%20about%20accounting%20and%20corporate%20tax%20for%20our%20UAE%20business."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-gold-400/60 text-white font-display font-semibold py-3.5 px-5 rounded-xl transition-all duration-150 text-sm flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                    >
                      <MessageCircle className="w-4 h-4 text-gold-400 shrink-0" />
                      <span>{language === "ar" ? "تواصل عبر واتساب (+971 52 922 6958)" : "WhatsApp Advisory Desk"}</span>
                    </a>
                  </div>

                  {/* Secondary Unboxed Quick Links */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-300">
                    <button
                      type="button"
                      onClick={() => setTaxHealthModalOpen(true)}
                      className="hover:text-gold-400 transition-colors underline underline-offset-4 cursor-pointer flex items-center gap-1.5 font-medium"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>{t.hero.ctaRiskAudit}</span>
                    </button>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <a
                      href="#pricing"
                      className="hover:text-gold-400 transition-colors underline underline-offset-4 font-medium"
                    >
                      {language === "ar" ? "استعرض باقات الأسعار الثابتة" : "View Transparent Flat-Fee Packages"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column (5 Cols): BCL.ae-Inspired Transparent Practice & Fee Schedule Card */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="bg-navy-900/90 border border-white/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-xl">
                  <div className="space-y-5">
                    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[11px] font-mono text-gold-400 uppercase tracking-wider block">
                          {language === "ar" ? "دليل الخدمات والرسوم الثابتة" : "2026 Transparent Fee Schedule"}
                        </span>
                        <h2 className="font-display text-lg sm:text-xl font-bold text-white mt-0.5">
                          {language === "ar" ? "حلول محاسبية وضريبية واضحة" : "Core Practice Benchmarks"}
                        </h2>
                      </div>
                      <span className="text-xs font-mono text-slate-400 tabular-nums shrink-0">
                        IFRS · FTA
                      </span>
                    </div>

                    {/* Structured Numbered Fee Rows */}
                    <div className="divide-y divide-white/10">
                      {[
                        {
                          num: "01",
                          title: language === "ar" ? "مسك الدفاتر الشهري وإقرارات VAT" : "Monthly IFRS Bookkeeping & VAT",
                          sub: language === "ar" ? "محاسب قانوني مخصص وتقارير شهرية" : "Dedicated CA, bank reconciliation & VAT201",
                          price: "AED 750",
                          unit: language === "ar" ? "/ شهرياً" : "/ mo",
                          href: "#pricing",
                        },
                        {
                          num: "02",
                          title: language === "ar" ? "إقرار ضريبة الشركات (إعفاء 0% SBR)" : "Corporate Tax & 0% SBR Filing",
                          sub: language === "ar" ? "للشركات بإيرادات أقل من 3 مليون درهم" : "Small Business Relief election on EmaraTax",
                          price: "AED 500",
                          unit: language === "ar" ? "رسم ثابت" : "flat fee",
                          href: "#pricing",
                        },
                        {
                          num: "03",
                          title: language === "ar" ? "هيكلة 0% للمناطق الحرة (QFZP)" : "0% Free Zone QFZP Structuring",
                          sub: language === "ar" ? "فحص الدخل المؤهل والجوهر الاقتصادي" : "Qualifying income & de minimis compliance",
                          price: "AED 1,499",
                          unit: language === "ar" ? "/ سنوياً" : "/ yr",
                          href: "#pricing",
                        },
                        {
                          num: "04",
                          title: language === "ar" ? "تأسيس الشركات (دبي ومدينة شمس)" : "UAE Company Setup (SHAMS & Dubai)",
                          sub: language === "ar" ? "رخصة فورية، تأشيرات وفتح حساب بنكي" : "100% ownership, visas & corporate banking",
                          price: "AED 5,750",
                          unit: language === "ar" ? "تبدأ من" : "starting",
                          href: "#company-setup",
                        },
                      ].map((item) => (
                        <a
                          key={item.num}
                          href={item.href}
                          className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4 group transition-colors"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <span className="text-xs font-mono text-gold-400 font-semibold mt-0.5 tabular-nums shrink-0">
                              {item.num}.
                            </span>
                            <div className="min-w-0">
                              <h3 className="font-display text-sm font-semibold text-white group-hover:text-gold-400 transition-colors truncate">
                                {item.title}
                              </h3>
                              <p className="text-xs text-slate-400 truncate mt-0.5">
                                {item.sub}
                              </p>
                            </div>
                          </div>
                          <div className="text-right rtl:text-left shrink-0">
                            <span className="block font-mono text-sm font-bold text-gold-400 tabular-nums">
                              {item.price}
                            </span>
                            <span className="block text-[11px] text-slate-400">
                              {item.unit}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-300">
                      {language === "ar" ? "معاملات غير محدودة · بدون رسوم مخفية" : "Unlimited transactions · Zero hidden fees"}
                    </span>
                    <a
                      href="#calculator"
                      className="text-xs font-display font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
                    >
                      <span>{language === "ar" ? "حاسبة الضرائب" : "Tax Calculator"}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Full-Width Institutional Metrics Bar */}
            <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <div>
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-gold-400 tabular-nums">45+</span>
                <span className="text-xs text-slate-300 mt-1 block">
                  {language === "ar" ? "شركة ومؤسسة في الإمارات" : "Active UAE Corporate Clients Retained"}
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-gold-400 tabular-nums">100%</span>
                <span className="text-xs text-slate-300 mt-1 block">
                  {language === "ar" ? "سجل امتثال خالٍ من الغرامات" : "Zero-Penalty FTA Filing Track Record"}
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-gold-400 tabular-nums">0% / 9%</span>
                <span className="text-xs text-slate-300 mt-1 block">
                  {language === "ar" ? "تطبيق إعفاءات SBR و QFZP" : "Statutory SBR & Free Zone QFZP Relief"}
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-gold-400 tabular-nums">15+ Yrs</span>
                <span className="text-xs text-slate-300 mt-1 block">
                  {language === "ar" ? "خبرة الشريك الإداري المعتمد" : "Managing Partner Chartered Tax Expertise"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2.1 BCL.ae Signature 3 Core Guarantees & Cloud Accounting Ecosystem */}
        <section className="bg-white border-b border-slate-200/80 py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* 3 Core Flat-Fee Commitments */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-gold-400/70 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-gold-600 tabular-nums">01.</span>
                  <CheckCircle2 className="w-4 h-4 text-gold-600" />
                </div>
                <h3 className="font-display font-bold text-base text-navy-950">
                  {language === "ar" ? "معاملات غير محدودة" : "Unlimited Transactions"}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  {language === "ar"
                    ? "لا رسوم إضافية مخفية ولا سقف لعدد الفواتير أو قيود اليومية الشهرية."
                    : "No hidden overage charges, per-entry surcharges, or monthly invoice volume caps."}
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-gold-400/70 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-gold-600 tabular-nums">02.</span>
                  <Shield className="w-4 h-4 text-gold-600" />
                </div>
                <h3 className="font-display font-bold text-base text-navy-950">
                  {language === "ar" ? "بدون سقف للإيرادات" : "No Revenue Cap"}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  {language === "ar"
                    ? "تسعير شفاف وثابت ينمو مع شركتك دون عقوبات عند ارتفاع مبيعاتك."
                    : "Predictable flat-fee retainers that never penalize your business as revenue scales."}
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-gold-400/70 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-gold-600 tabular-nums">03.</span>
                  <Award className="w-4 h-4 text-gold-600" />
                </div>
                <h3 className="font-display font-bold text-base text-navy-950">
                  {language === "ar" ? "ضمان الامتثال 100%" : "100% Compliance Guarantee"}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  {language === "ar"
                    ? "دفاتر محاسبية مطابقة لمعايير IFRS وجاهزة لتدقيق الهيئة الاتحادية للضرائب."
                    : "Peer-reviewed IFRS financial statements engineered for zero FTA administrative penalties."}
                </p>
              </div>
            </div>

            {/* Cloud Accounting Software Partners Bar */}
            <div className="pt-10 border-t border-slate-200/70">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-mono text-gold-600 font-semibold uppercase tracking-wider block">
                    {language === "ar" ? "شراكات التكنولوجيا المحاسبية العالمية" : "Cloud Accounting Infrastructure"}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-navy-950 mt-1">
                    {language === "ar" ? "نستخدم أفضل برمجيات المحاسبة والأتمتة في العالم" : "We Use the World's Best Accounting Software"}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                  {language === "ar"
                    ? "ربط رقمي فوري، ترحيل سلس للبيانات التاريخية، وتكامل معتمد مع نظام EmaraTax."
                    : "Automated bank feeds, historical ledger migration, and direct FTA tax code mapping."}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { code: "qb", name: "QuickBooks", role: "Intuit Cloud Partner", accent: "text-emerald-700" },
                  { code: "xero", name: "Xero Cloud", role: "Certified Advisor", accent: "text-sky-700" },
                  { code: "zoho", name: "Zoho Books", role: "FTA Accredited", accent: "text-amber-700" },
                  { code: "wafeq", name: "Wafeq", role: "UAE Tax Localization", accent: "text-teal-700" },
                  { code: "odoo", name: "Odoo ERP", role: "Enterprise Ledger", accent: "text-purple-700" },
                  { code: "FTA", name: "EmaraTax", role: "Direct Portal Filing", accent: "text-navy-900" },
                ].map((sw) => (
                  <div
                    key={sw.name}
                    className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-gold-400 transition-colors flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`font-mono text-xs font-extrabold uppercase tracking-wider ${sw.accent}`}>
                        {sw.code}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    </div>
                    <div>
                      <span className="font-display font-bold text-slate-900 text-sm block">{sw.name}</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{sw.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 3. Core Services Grid Section - Structured BCL.ae Practice Architecture */}
        <section id="services" className="py-20 sm:py-24 bg-slate-50 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Section Header */}
            <AnimatedSection direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-8">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-mono text-gold-600 font-semibold uppercase tracking-wider block">
                  {t.services.badge}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
                  {t.services.title}
                </h2>
              </div>
              <p className="text-slate-600 text-sm max-w-md leading-relaxed">
                {t.services.subtitle}
              </p>
            </AnimatedSection>

            {/* Responsive Services Grid with Numbered Editorial Discipline & Semantic <article> */}
            <motion.div
              variants={servicesContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08, margin: "-20px 0px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {(t.services.items || servicesData || []).map((service, index) => (
                <motion.article
                  key={service.id}
                  id={service.id}
                  variants={serviceCardVariants}
                  onClick={() => setSelectedService(service)}
                  className="bg-white border border-slate-200/90 hover:border-gold-500 rounded-2xl p-7 flex flex-col justify-between group transition-all duration-200 hover:shadow-md cursor-pointer scroll-mt-24"
                >
                  <div>
                    {/* Top Row: Editorial Number + Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-gold-600 transition-colors tabular-nums">
                        {String(index + 1).padStart(2, "0")}.
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center group-hover:bg-navy-950 group-hover:border-navy-950 transition-colors duration-200">
                        {getServiceIcon(service.iconName)}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-display text-lg font-bold text-navy-950 group-hover:text-gold-600 transition-colors duration-150 mb-2.5">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-6">
                      {service.shortDesc}
                    </p>
                  </div>

                  {/* Clean Bottom Action Link */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedService(service);
                    }}
                    className="w-full pt-4 border-t border-slate-100 text-navy-950 group-hover:text-gold-600 font-display font-semibold text-xs transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{t.services.readMore}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </button>
                </motion.article>
              ))}
            </motion.div>

            {/* Authoritative 4-Pillar Tax & Accounting Practice Matrix (Semantic HTML5 SEO Content) */}
            <div className="pt-8 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-mono text-gold-600 font-semibold uppercase tracking-wider block">
                    Specialized Regulatory Practice Areas
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight mt-1">
                    Tax Consulting Services in UAE &amp; Tax Advisory Services in Dubai
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <a
                    href="/small-business-tax-relief"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/small-business-tax-relief");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-navy-950 hover:border-gold-500 hover:text-gold-600 transition-colors"
                  >
                    0% Small Business Tax Relief Guide →
                  </a>
                  <a
                    href="/difc-dtec-accounting"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/difc-dtec-accounting");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-navy-950 hover:border-gold-500 hover:text-gold-600 transition-colors"
                  >
                    DIFC &amp; DTEC Free Zone Tax →
                  </a>
                  <a
                    href="/dividends-audit"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/dividends-audit");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-navy-950 hover:border-gold-500 hover:text-gold-600 transition-colors"
                  >
                    Dividend Audit &amp; Profit Extraction →
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <article className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gold-600 bg-gold-500/10 px-2.5 py-1 rounded-md">
                      Federal Decree-Law No. 47 of 2022
                    </span>
                    <span className="text-xs font-mono text-slate-400">Pillar 01</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-navy-950">
                    Corporate Tax Advisory &amp; 0% Free Zone QFZP Structuring in Dubai
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Our <strong>tax advisory services in Dubai</strong> guide mainland LLCs and Free Zone enterprises through every phase of the UAE 9% Corporate Tax regime. We manage timely EmaraTax registration to eliminate AED 10,000 late penalties, evaluate <strong>Small Business Relief (0% tax on revenue up to AED 3,000,000 through 2026)</strong>, and structure <strong>Qualifying Free Zone Person (QFZP)</strong> substance, de-minimis thresholds, and Arm&apos;s Length Transfer Pricing documentation.
                  </p>
                </article>

                <article className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gold-600 bg-gold-500/10 px-2.5 py-1 rounded-md">
                      FTA Form VAT 201 &amp; Audits
                    </span>
                    <span className="text-xs font-mono text-slate-400">Pillar 02</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-navy-950">
                    Value Added Tax (5% VAT) Compliance, Refunds &amp; Voluntary Disclosures
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Comprehensive <strong>VAT compliance in UAE</strong> covering mandatory (AED 375,000) and voluntary (AED 187,500) TRN registration, quarterly and monthly <strong>VAT 201 return filing</strong>, Reverse Charge Mechanism (RCM) verification on imports, Designated Zone cross-border supply rules, FTA Voluntary Disclosures (Form 211), and penalty reconsideration submissions.
                  </p>
                </article>

                <article className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gold-600 bg-gold-500/10 px-2.5 py-1 rounded-md">
                      IFRS Bookkeeping &amp; Cleanup
                    </span>
                    <span className="text-xs font-mono text-slate-400">Pillar 03</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-navy-950">
                    IFRS Accounting Services &amp; Forensic Backlog Accounting in UAE
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Whether your company needs ongoing monthly bookkeeping on Zoho Books, Xero, QuickBooks, or TallyPrime, or rapid <strong>backlog accounting</strong> to reconstruct 1 to 5+ years of historical ledgers, our certified accountants deliver FTA-compliant Trial Balances, Profit &amp; Loss statements, Balance Sheets, and audit-ready schedules within 7 to 14 business days.
                  </p>
                </article>

                <article className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gold-600 bg-gold-500/10 px-2.5 py-1 rounded-md">
                      Mainland &amp; Free Zone Advisory
                    </span>
                    <span className="text-xs font-mono text-slate-400">Pillar 04</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-navy-950">
                    Free Zone Business Support, Licensing &amp; Statutory Audit Readiness
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    End-to-end <strong>Free Zone business support</strong> across SHAMS, IFZA, DMCC, Meydan, JAFZA, DIFC, DTEC, ADGM, and RAKEZ, alongside Dubai DET Mainland entities. We handle trade license incorporation, corporate bank account onboarding, Golden Visa &amp; investor residency processing, and statutory financial audit coordination.
                  </p>
                </article>
              </div>
            </div>

            {/* Service detail Modal */}
            {selectedService && (
              <React.Suspense fallback={null}>
                <ServiceModal
                  isOpen={selectedService !== null}
                  service={selectedService}
                  onClose={() => setSelectedService(null)}
                  onBookCall={handlePreselectedCallBooking}
                />
              </React.Suspense>
            )}

          </div>
        </section>

        {/* 3.5 Interactive Corporate Tax & 0% Relief Calculator Section */}
        <section id="calculator" className="py-16 sm:py-20 bg-navy-950 border-y border-navy-800 text-white relative overflow-hidden scroll-mt-20">
          <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Explanatory Column */}
              <div className="lg:col-span-5 space-y-5 text-left rtl:text-right">
                <span className="text-xs font-mono text-gold-400 font-semibold uppercase tracking-wider block">
                  {language === "ar" ? "حاسبة ضريبة الشركات في الإمارات" : "UAE Corporate Tax Estimator"}
                </span>
                
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
                  {language === "ar" 
                    ? "احسب ضريبة شركتك وتحقق من إعفاء الـ 0%" 
                    : "Calculate Corporate Tax & Verify 0% Relief"}
                </h2>
                
                <p className="text-slate-300 text-sm leading-relaxed">
                  {language === "ar"
                    ? "تقدير فوري لضريبة الـ 9%، والتحقق من أهلية تسهيلات الأعمال الصغيرة (SBR حتى 3M درهم) ودخل المناطق الحرة المؤهل."
                    : "Estimate your 9% corporate tax liability and verify 0% statutory relief under Small Business Relief (revenue ≤ AED 3M) or Qualifying Free Zone Person rules."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-navy-900/90 border border-white/10 rounded-xl p-4">
                    <div className="text-xs font-bold text-gold-400">
                      {language === "ar" ? "تسهيلات حتى 3M درهم" : "Small Business Relief"}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {language === "ar" ? "0% ضريبة للإيرادات السنوية دون 3M" : "0% tax under AED 3M gross revenue"}
                    </p>
                  </div>

                  <div className="bg-navy-900/90 border border-white/10 rounded-xl p-4">
                    <div className="text-xs font-bold text-gold-400">
                      {language === "ar" ? "المناطق الحرة 0% QFZP" : "0% Free Zone QFZP"}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {language === "ar" ? "إعفاء ضريبي على الدخل المؤهل" : "0% rate on qualifying free zone income"}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTaxHealthModalOpen(true)}
                    className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold py-3 px-5 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{language === "ar" ? "افحص مخاطر الامتثال" : "Run 60s Penalty Risk Audit"}</span>
                  </button>
                  <a
                    href="#pricing"
                    className="border border-white/20 hover:border-gold-400 text-white font-display font-semibold py-3 px-5 rounded-xl text-xs transition-colors"
                  >
                    {language === "ar" ? "عرض باقات الأسعار" : "View Flat-Fee Packages"}
                  </a>
                </div>
              </div>

              {/* Right Interactive Tax Calculator */}
              <div className="lg:col-span-7 w-full max-w-xl mx-auto">
                <LazyMount minHeight={400} sectionId="calculator">
                  <React.Suspense fallback={<div className="bg-white/95 rounded-2xl border border-slate-200 shadow-xl min-h-[400px] p-6 flex flex-col justify-center items-center text-slate-400 text-xs">Loading Tax Estimator...</div>}>
                    <TaxCalculator />
                  </React.Suspense>
                </LazyMount>
              </div>

            </div>
          </AnimatedSection>
        </section>

      {/* Official UAE Free Zone & Mainland Affiliations Section */}
      <AnimatedSection>
        <LazyMount minHeight={160}>
          <React.Suspense fallback={<div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading Affiliations...</div>}>
            <OurAffiliations />
          </React.Suspense>
        </LazyMount>
      </AnimatedSection>

      {/* 4.5 Local Jurisdictions & Free Zones Authority Hub (UAE Local SEO Powerhouse) */}
      <AnimatedSection>
        <LazyMount minHeight={360}>
          <React.Suspense fallback={<div className="py-16 text-center text-xs text-slate-400 animate-pulse">Loading UAE Jurisdictions Hub...</div>}>
            <UAEJurisdictionsSEO />
          </React.Suspense>
        </LazyMount>
      </AnimatedSection>

      {/* 4.6 BCL-Style "Want to set up Company in Dubai?" Hub */}
      <AnimatedSection>
        <LazyMount minHeight={480} sectionId="company-setup">
          <React.Suspense fallback={<div className="py-16 text-center text-xs text-slate-400 animate-pulse">Loading Company Setup Hub...</div>}>
            <CompanySetupHub onBookCall={handlePreselectedCallBooking} />
          </React.Suspense>
        </LazyMount>
      </AnimatedSection>

      {/* 4.7 "Why Choose Us" (6 Pillars of Excellence) Section - Lazy Loaded with Suspense */}
      <Suspense
        fallback={
          <div
            id="why-choose-us"
            className="py-12 sm:py-16 bg-white border-t border-slate-100 scroll-mt-20 sm:scroll-mt-24 min-h-[460px] flex flex-col items-center justify-center text-center px-4"
          >
            <div className="max-w-md mx-auto space-y-3 animate-pulse">
              <div className="h-5 w-36 bg-gold-100 rounded-full mx-auto" />
              <div className="h-7 w-64 bg-slate-200 rounded-lg mx-auto" />
              <div className="h-4 w-80 bg-slate-100 rounded mx-auto" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 w-full max-w-2xl">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-28 bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-2">
                    <div className="h-6 w-6 bg-slate-200 rounded-lg" />
                    <div className="h-4 w-20 bg-slate-200 rounded" />
                    <div className="h-3 w-28 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <WhyChooseUs onBookCall={handlePreselectedCallBooking} />
      </Suspense>

      {/* 5. "Why Partner With Us" Section - BCL.ae Architectural Split */}
      <section id="about" className="py-20 sm:py-24 bg-white border-t border-slate-200/80 relative overflow-hidden scroll-mt-20 sm:scroll-mt-24">
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-gold-500" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-gold-600">
                  {t.about.badge}
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight leading-[1.15]">
                {t.about.title} <br className="hidden sm:inline" />
                {t.about.titleLine2}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t.about.description}
              </p>

              {/* Statistics Panel */}
              <div className="grid grid-cols-2 gap-6 py-6 border-y border-slate-200/80">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-navy-950">{t.about.accuracyStat}</span>
                    <span className="text-xs text-emerald-600 font-bold">▲</span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold block">{t.about.accuracyLabel}</span>
                </div>
                <div className="space-y-1 border-l border-slate-200/80 pl-6 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-navy-950">{t.about.slaStat}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold block">{t.about.slaLabel}</span>
                </div>
              </div>

              {/* Trust statement */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex gap-3.5 items-start text-xs text-slate-600 leading-relaxed">
                <Users className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <span>
                  {t.about.trustStatement}
                </span>
              </div>
            </div>

            {/* Right List Column: Architectural Methodology Blocks */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(t.about.pillars || [
                {
                  title: "Optimized Performance",
                  desc: "We stream your financials, analyze operational costs, and construct dashboards that eliminate cash leaks.",
                  bullets: ["Operational cost reviews", "Working capital analysis"],
                },
                {
                  title: "Regulatory Mastery",
                  desc: "Our team stays dynamically aligned with UAE commercial law reforms, corporate tax thresholds, and FTA audit rules.",
                  bullets: ["Certified FTA practices", "Hassle-free audits"],
                },
                {
                  title: "Tax Efficiency",
                  desc: "We identify legal tax relief structures and group corporate exemptions that save UAE businesses substantial capital.",
                  bullets: ["Relief claiming (SBR)", "Freezone treaty optimization"],
                },
                {
                  title: "Data-Driven Decisions",
                  desc: "Replace intuition with crystal-clear analytics. We offer regular, actionable financial briefings for growth scaling.",
                  bullets: ["Forecast modelling", "Real-time ledger access"],
                },
              ]).map((benefit, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/70 border border-slate-200/80 hover:border-gold-400 hover:bg-white rounded-2xl p-7 transition-all duration-200 hover:shadow-md group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs group-hover:border-gold-300 transition-colors">
                        {getPartnerBenefitIcon(idx)}
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-gold-600 transition-colors">
                        0{idx + 1}.
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base text-navy-950 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-5">
                      {benefit.description || (benefit as any).desc}
                    </p>
                  </div>
                  {(benefit.bullets && benefit.bullets.length > 0) && (
                    <div className="pt-4 border-t border-slate-200/70 space-y-1.5">
                      {benefit.bullets.map((b, bIdx) => (
                        <div
                          key={bIdx}
                          className="flex items-center gap-2 text-[11px] text-slate-700 font-semibold"
                        >
                          <Check className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </AnimatedSection>
      </section>

      {/* 5.5 Proven Client Case Studies & E-E-A-T Track Record - Lazy Loaded with Suspense */}
      <Suspense
        fallback={
          <div
            id="case-studies"
            className="py-12 sm:py-16 bg-gradient-to-b from-navy-950 via-slate-900 to-navy-950 border-b border-slate-800 text-white scroll-mt-20 min-h-[380px] flex flex-col items-center justify-center text-center px-4"
          >
            <div className="max-w-md mx-auto space-y-3 animate-pulse">
              <div className="h-5 w-32 bg-emerald-900/60 rounded-full mx-auto" />
              <div className="h-7 w-72 bg-slate-800 rounded-lg mx-auto" />
              <div className="h-4 w-64 bg-slate-800/60 rounded mx-auto" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 w-full max-w-3xl">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-navy-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-left">
                    <div className="h-6 w-24 bg-gold-400/20 rounded" />
                    <div className="h-3 w-16 bg-slate-700 rounded" />
                    <div className="h-3 w-full bg-slate-800 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <ClientCaseStudies />
      </Suspense>

      {/* 6. Pricing Plans Section - BCL.ae Dual Pathway ("Staying ahead going forward" vs "Catching up on the past") */}
      <section id="pricing" className="py-20 sm:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-20 sm:scroll-mt-24">
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-[11px] font-mono text-gold-600 font-bold uppercase tracking-[0.18em] block">
              {t.pricing.badge}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
              {language === "ar" ? "أسعار واضحة وشفافة بدون مفاجآت" : "Transparent, Flat-Fee Pricing with Zero Surprises"}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {language === "ar"
                ? "اختر المسار الأنسب لاحتياجاتك: اشتراك شهري لمواكبة المستقبل، أو حزمة إغلاق المتأخرات للسنوات السابقة."
                : "Choose your path: stay ahead with prospective ongoing compliance, or catch up on prior financial years for corporate tax."}
            </p>

            {/* BCL-Style Pathway Selector Tabs */}
            <div className="pt-4 flex justify-center">
              <div className="inline-flex p-1.5 bg-white border border-slate-200 rounded-xl shadow-xs max-w-full overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setPricingPath("prospective")}
                  className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    pricingPath === "prospective"
                      ? "bg-navy-950 text-white shadow-xs"
                      : "text-slate-600 hover:text-navy-950 hover:bg-slate-50"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${pricingPath === "prospective" ? "bg-gold-400" : "bg-slate-300"}`} />
                  <span>{language === "ar" ? "1. مواكبة المستقبل (مستمر)" : "Staying ahead going forward"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPricingPath("retrospective")}
                  className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    pricingPath === "retrospective"
                      ? "bg-navy-950 text-white shadow-xs"
                      : "text-slate-600 hover:text-navy-950 hover:bg-slate-50"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${pricingPath === "retrospective" ? "bg-gold-400" : "bg-slate-300"}`} />
                  <span>{language === "ar" ? "2. إغلاق متأخرات السنوات السابقة" : "Catching up on the past (Backlog)"}</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-bold ml-1">
                    · {language === "ar" ? "عاجل" : "Prior FYs"}
                  </span>
                </button>
              </div>
            </div>

            {/* Billing Toggle (Shown when on prospective pathway) */}
            {pricingPath === "prospective" && (
              <div className="pt-2">
                <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-xl">
                  <button
                    onClick={() => setBillingPeriod("monthly")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      billingPeriod === "monthly"
                        ? "bg-navy-900 text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t.pricing.monthly}
                  </button>
                  <button
                    onClick={() => setBillingPeriod("annual")}
                    className={`relative px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      billingPeriod === "annual"
                        ? "bg-navy-900 text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <span>{t.pricing.annual}</span>
                    <span className="text-emerald-500 font-mono text-[10px] font-bold">
                      ({t.pricing.annualSavingsBadge})
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* BCL 3 Core Guarantees Strip */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left rtl:text-right">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-gold-600 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-navy-950">
                    {language === "ar" ? "معاملات غير محدودة" : "Unlimited Transactions"}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    {language === "ar"
                      ? "لا رسوم مفاجئة على عدد الفواتير أو قيود اليومية."
                      : "No invoice penalties or sudden surprise fees for scaling transactions."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 border-t md:border-t-0 md:border-l rtl:md:border-l-0 rtl:md:border-r border-slate-200/70 pt-4 md:pt-0 md:pl-6 rtl:md:pl-0 rtl:md:pr-6">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-gold-600 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-navy-950">
                    {language === "ar" ? "بدون سقف للإيرادات" : "No Revenue Cap"}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    {language === "ar"
                      ? "تسعير شفاف وثابت لا يعاقب شركتك على نمو مبيعاتها."
                      : "Transparent fixed pricing that doesn't penalize business revenue growth."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 border-t md:border-t-0 md:border-l rtl:md:border-l-0 rtl:md:border-r border-slate-200/70 pt-4 md:pt-0 md:pl-6 rtl:md:pl-0 rtl:md:pr-6">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-gold-600 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-navy-950">
                    {language === "ar" ? "ضمان الرضا والامتثال 100%" : "100% Satisfaction Guarantee"}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    {language === "ar"
                      ? "دفاتر مطابقة لمعايير IFRS وخالية تماماً من غرامات الهيئة."
                      : "Zero FTA audit penalty guarantee with rigorous peer-reviewed compliance."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prospective Pathway: Ongoing Monthly / Annual Pricing Cards */}
          {pricingPath === "prospective" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
              {(t.pricing.tiers || pricingTiers || []).map((tier, tierIdx) => {
                const displayPrice = billingPeriod === "annual" ? tier.annualPrice : tier.price;
                const isAr = language === "ar";
                const periodLabel = billingPeriod === "annual"
                  ? (isAr ? "سنوياً (خصم 20%)" : "year (Annual Billing)")
                  : (isAr ? "شهرياً" : "month (Monthly Billing)");
                const whatsappMessage = isAr
                  ? `مرحباً دياس للمحاسبة، أود اختيار باقة "${tier.name}" بسعر ${displayPrice} درهم / ${periodLabel}. يرجى تزويدي بالخطوات والمستندات المطلوبة للبدء.`
                  : `Hello Dias Accounting, I would like to choose the "${tier.name}" plan (${displayPrice} AED / ${periodLabel}). Please assist me with getting started and onboarding.`;
                const whatsappUrl = `https://wa.me/971529226958?text=${encodeURIComponent(whatsappMessage)}`;

                return (
                  <div
                    key={tier.id}
                    className={`bg-white border rounded-2xl p-8 flex flex-col relative transition-all duration-200 ${
                      tier.popular
                        ? "border-gold-500 ring-1 ring-gold-500 shadow-lg"
                        : "border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        0{tierIdx + 1}.
                      </span>
                      {tier.popular && (
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-700 bg-gold-50 border border-gold-200 px-2.5 py-0.5 rounded-md">
                          {t.pricing.popularBadge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 mb-6">
                      <h3 className="font-display text-xl font-bold text-navy-950">
                        {tier.name}
                      </h3>
                      <p className="text-slate-500 text-xs min-h-[36px] leading-relaxed">
                        {tier.description}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-1.5 border-y border-slate-100 py-6 mb-6">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AED</span>
                      <span className="text-4xl font-extrabold font-mono tabular-nums text-navy-950 tracking-tight">
                        {displayPrice}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {billingPeriod === "annual" ? "/ year" : "/ month"}
                      </span>
                    </div>

                    <div className="space-y-3.5 flex-grow mb-8">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                        Scope of Services:
                      </span>
                      <ul className="space-y-2.5 text-xs text-slate-600">
                        {(tier.features || []).map((feat, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        try {
                          const win = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
                          if (win) {
                            e.preventDefault();
                          }
                        } catch {
                          // Fallback to standard href
                        }
                      }}
                      className={`w-full py-3.5 px-4 rounded-xl font-display font-bold text-xs text-center transition-all cursor-pointer flex items-center justify-center gap-2 group/btn shadow-xs active:scale-[0.98] ${
                        tier.popular
                          ? "bg-gold-500 hover:bg-gold-400 text-navy-950 shadow-md shadow-gold-500/10"
                          : "bg-navy-950 hover:bg-navy-900 text-white"
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-500 group-hover/btn:scale-110 transition-transform shrink-0" />
                      <span>{t.pricing.getStartedBtn}</span>
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {/* Retrospective Pathway: Backlog Bookkeeping & Historical Corporate Tax Filing */}
          {pricingPath === "retrospective" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Urgency Alert */}
              <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-navy-950">
                      {language === "ar" ? "تنبيه الموعد النهائي لضريبة الشركات في الإمارات!" : "UAE Corporate Tax Filing Deadline Alert"}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {language === "ar"
                        ? "الشركات التي لم تقدم إقرارها الضريبي معرضة لغرامات تأخير تصل إلى 10,000 درهم بالإضافة إلى غرامات الدفاتر غير المكتملة."
                        : "Late corporate tax registration & non-filing penalties reach up to AED 10,000+. We reconstruct, reconcile and file your return within 7 business days."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreselectedCallBooking("Backlog Cleanup & Tax Filing")}
                  className="shrink-0 bg-navy-950 hover:bg-gold-500 hover:text-navy-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  {language === "ar" ? "حجز استشارة فورية" : "Urgent File Consultation"}
                </button>
              </div>

              {/* 3 Backlog Packages */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                
                {/* 1. Single Year Backlog */}
                <div className="bg-white border-2 border-gold-500 rounded-2xl p-8 flex flex-col relative transition-all duration-200 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-slate-400">01.</span>
                    <span className="bg-gold-50 border border-gold-200 text-gold-800 text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md">
                      {language === "ar" ? "الأكثر طلباً" : "Most Requested"}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 mb-5">
                    <h3 className="font-display text-lg font-extrabold text-navy-950">
                      {language === "ar" ? "إغلاق سنة مالية واحدة + إقرار الضريبة" : "Single FY Backlog + Corporate Tax Return"}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {language === "ar"
                        ? "مخصص للشركات المتأخرة عن تقديم إقرار السنة المالية 2024 أو 2025"
                        : "Designed for UAE businesses needing full-year historical books and EmaraTax CT filing."}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1.5 border-y border-slate-100 py-6 mb-6">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AED</span>
                    <span className="text-4xl font-extrabold font-mono tabular-nums text-navy-950 tracking-tight">2,500</span>
                    <span className="text-xs text-slate-400 font-medium">/ {language === "ar" ? "سنة مالية (دفعة واحدة)" : "financial year"}</span>
                  </div>

                  <div className="space-y-3 flex-grow mb-8 text-xs text-slate-600">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                      {language === "ar" ? "ما يتضمنه الباكيج:" : "Package Deliverables:"}
                    </span>
                    <ul className="space-y-2.5">
                      <li className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "تسوية كامل كشوفات الحسابات البنكية لـ 12 شهراً" : "12-Month bank statement and credit card reconciliation"}</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "إعداد ميزانية عمومية وقائمة دخل مطابقة لمعايير IFRS" : "Balance sheet and P&L generation compliant with IFRS"}</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "احتساب ضريبة الشركات وتطبيق تسهيلات الأعمال الصغيرة SBR" : "Corporate tax calculation & Small Business Relief claiming"}</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "تقديم الإقرار النهائي رسمياً عبر بوابة EmaraTax" : "Official CT return submission via FTA EmaraTax portal"}</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "ضمان تجنب غرامات التأخير" : "Zero-penalty filing assurance"}</span>
                      </li>
                    </ul>
                  </div>

                  <a
                    href={`https://wa.me/971529226958?text=${encodeURIComponent(
                      language === "ar"
                        ? "مرحباً دياس للمحاسبة، أود حجز باقة متأخرات سنة مالية واحدة + إقرار ضريبة الشركات (2,500 درهم). يرجى إرشادي بالمستندات والخطوات المطلوبة."
                        : "Hello Dias Accounting, I would like to book the Single FY Backlog + Corporate Tax Return package (AED 2,500). Please guide me on required documents."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-xs text-center transition-all cursor-pointer bg-gold-500 hover:bg-gold-400 text-navy-950 shadow-md shadow-gold-500/20 flex items-center justify-center gap-2 group/btn active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-800 group-hover/btn:scale-110 transition-transform shrink-0" />
                    <span>{language === "ar" ? "احجز حزمة المتأخرات عبر واتساب" : "Book Single FY Package on WhatsApp"}</span>
                  </a>
                </div>

                {/* 2. Multi-Year Catchup */}
                <div className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-8 flex flex-col relative transition-all duration-200 shadow-xs hover:shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-slate-400">02.</span>
                  </div>
                  <div className="space-y-1.5 mb-5">
                    <h3 className="font-display text-lg font-extrabold text-navy-950">
                      {language === "ar" ? "إغلاق متأخرات متعدد السنوات (سنتين)" : "Multi-Year Full Catch-Up (2 FYs)"}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {language === "ar"
                        ? "للشركات التي لم تقم بأي قيود محاسبية منذ التأسيس وتحتاج جاهزية تدقيق كاملة"
                        : "For companies that have not maintained regular books since incorporation."}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1.5 border-y border-slate-100 py-6 mb-6">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AED</span>
                    <span className="text-4xl font-extrabold font-mono tabular-nums text-navy-950 tracking-tight">4,800</span>
                    <span className="text-xs text-slate-400 font-medium">/ {language === "ar" ? "سنتين ماليتين" : "2 fiscal years"}</span>
                  </div>

                  <div className="space-y-3 flex-grow mb-8 text-xs text-slate-600">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                      {language === "ar" ? "ما يتضمنه الباكيج:" : "Package Deliverables:"}
                    </span>
                    <ul className="space-y-2.5">
                      <li className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "تسوية متكاملة لـ 24 شهراً من المعاملات البنكية" : "24-Month full historical ledger & bank reconciliation"}</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "إعادة بناء الأستاذ العام وتصنيف المصروفات الاستثمارية" : "General ledger reconstruction & capital expense tracking"}</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "إعداد القوائم المالية المقارنة للتدقيق القانوني" : "Comparative IFRS financial statements ready for statutory audit"}</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "تقديم إقراري ضريبة الشركات للعامين معاً" : "Filing of 2 corporate tax returns on EmaraTax"}</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "فحص امتثال ضريبة القيمة المضافة التاريخي" : "Historical VAT compliance risk review"}</span>
                      </li>
                    </ul>
                  </div>

                  <a
                    href={`https://wa.me/971529226958?text=${encodeURIComponent(
                      language === "ar"
                        ? "مرحباً دياس للمحاسبة، أود حجز باكيج إغلاق متأخرات سنتين ماليتين (4,800 درهم). يرجى إرشادي بالمستندات والخطوات المطلوبة."
                        : "Hello Dias Accounting, I would like to book the Multi-Year Full Catch-Up (2 FYs) package (AED 4,800). Please guide me on required documents."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-xs text-center transition-all cursor-pointer bg-navy-950 hover:bg-navy-900 text-white flex items-center justify-center gap-2 group/btn shadow-xs active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400 group-hover/btn:scale-110 transition-transform shrink-0" />
                    <span>{language === "ar" ? "حجز باكيج السنتين عبر واتساب" : "Book 2-Year Catchup on WhatsApp"}</span>
                  </a>
                </div>

                {/* 3. High-Volume E-Commerce / Multi-Entity */}
                <div className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-8 flex flex-col relative transition-all duration-200 shadow-xs hover:shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-slate-400">03.</span>
                  </div>
                  <div className="space-y-1.5 mb-5">
                    <h3 className="font-display text-lg font-extrabold text-navy-950">
                      {language === "ar" ? "المتاجر الإلكترونية والشركات المتعددة" : "E-Commerce & High Volume Clean-up"}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {language === "ar"
                        ? "تسوية آلاف المعاملات من Stripe وShopify وبوابات الدفع والمنصات الرقمية"
                        : "High-volume gateway reconciliations (Stripe, Amazon, Tabby, Tamara) with multi-currency books."}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1.5 border-y border-slate-100 py-6 mb-6">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AED</span>
                    <span className="text-4xl font-extrabold font-mono tabular-nums text-navy-950 tracking-tight">7,500</span>
                    <span className="text-xs text-slate-400 font-medium">/ {language === "ar" ? "سنة مالية معقدة" : "complex fiscal year"}</span>
                  </div>

                  <div className="space-y-3 flex-grow mb-8 text-xs text-slate-600">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                      {language === "ar" ? "ما يتضمنه الباكيج:" : "Package Deliverables:"}
                    </span>
                    <ul className="space-y-2.5">
                      <li className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "مطابقة بوابات الدفع الإلكتروني ومبيعات نقاط البيع" : "Payment gateway & merchant payout reconciliation"}</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "معالجة المخزون والتكلفة التقديرية للبضاعة المباعة COGS" : "Inventory valuation & automated COGS tracking"}</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "تسوية العملات الأجنبية وأسعار الصرف المتعددة" : "Multi-currency FX gain/loss adjustments"}</span>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "تقديم إقرار ضريبة الشركات وتجهيز ملفات التدقيق" : "Full corporate tax filing + audit readiness dossier"}</span>
                      </li>
                    </ul>
                  </div>

                  <a
                    href={`https://wa.me/971529226958?text=${encodeURIComponent(
                      language === "ar"
                        ? "مرحباً دياس للمحاسبة، أود حجز باكيج تسوية حسابات المتاجر الإلكترونية والشركات المتعددة (7,500 درهم). يرجى إرشادي بالمستندات والخطوات المطلوبة."
                        : "Hello Dias Accounting, I would like to book the E-Commerce & High Volume Clean-up package (AED 7,500). Please guide me on required documents."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-xs text-center transition-all cursor-pointer bg-navy-950 hover:bg-navy-900 text-white flex items-center justify-center gap-2 group/btn shadow-xs active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400 group-hover/btn:scale-110 transition-transform shrink-0" />
                    <span>{language === "ar" ? "حجز باكيج التجارة الإلكترونية عبر واتساب" : "Book E-Commerce Package on WhatsApp"}</span>
                  </a>
                </div>

              </div>
            </div>
          )}

          {/* Pricing Disclaimer */}
          <p className="text-center text-xs text-slate-400 font-medium">
            *Custom enterprise solutions, statutory audit engagements, and multi-entity consolidations are quoted transparently upon discovery. Pricing excludes standard 5% UAE VAT.
          </p>

          {/* Standalone Regulatory Services: VAT Return, Corporate Tax SBR & Audit */}
          <div className="pt-8">
            <LazyMount minHeight={280}>
              <React.Suspense fallback={<div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading Standalone Services...</div>}>
                <StandalonePricingCards onSelectService={handlePreselectedCallBooking} />
              </React.Suspense>
            </LazyMount>
          </div>

        </AnimatedSection>
      </section>

      {/* 6.3 High-Value Lead Magnet: 2026 UAE Compliance Playbook Banner */}
      <section id="lead-magnet" className="bg-navy-950 text-white py-10 border-y border-white/10 relative overflow-hidden">
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-navy-900/70 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Content Left */}
            <div className="space-y-2 text-center md:text-left rtl:md:text-right flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-gold-400 font-bold">
                <span>{t.leadMagnet.badge}</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400">{language === "ar" ? "إصدار 2026" : "2026 Edition"}</span>
              </div>

              <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                {t.leadMagnet.title}
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                {t.leadMagnet.description}
              </p>

              {/* Micro points */}
              <div className="hidden sm:flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gold-400" />{t.leadMagnet.point1}</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{t.leadMagnet.point2}</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gold-400" />{t.leadMagnet.point3}</span>
              </div>
            </div>

            {/* CTAs Right */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setLeadMagnetModalOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold py-3 px-5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.leadMagnet.downloadBtn}</span>
              </button>

              <button
                onClick={() => setTaxHealthModalOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>{language === "ar" ? "فحص المخاطر (60 ثانية)" : "Penalty Risk Audit"}</span>
              </button>
            </div>

          </div>
        </AnimatedSection>
      </section>

      {/* 6.5 Customer Testimonials / Google Reviews Section */}
      <AnimatedSection>
        <LazyMount minHeight={380} sectionId="testimonials">
          <React.Suspense fallback={<div className="py-20 text-center text-slate-400 text-sm min-h-[420px] flex items-center justify-center">Loading Google Reviews...</div>}>
            <GoogleReviewsSection testimonials={testimonialsData} />
          </React.Suspense>
        </LazyMount>
      </AnimatedSection>

      {/* 6.6 FAQ Section */}
      <section id="faqs" className="py-20 sm:py-24 bg-white border-t border-slate-200/80 scroll-mt-20 sm:scroll-mt-24">
        <AnimatedSection className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] font-mono text-gold-600 font-bold uppercase tracking-[0.18em] block">
              {t.faqs.badge}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
              {t.faqs.title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.faqs.subtitle}
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-3.5 max-w-3xl mx-auto">
            {(faqsData || []).map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isOpen ? "border-gold-400 shadow-sm" : "border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full px-6 py-5 text-left rtl:text-right flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1">
                      {faq.category && (
                        <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gold-600">
                          {faq.category}
                        </span>
                      )}
                      <h3 className="font-display text-sm sm:text-base font-bold text-navy-950">
                        {faq.question}
                      </h3>
                    </div>
                    <span 
                      className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                        isOpen
                          ? "rotate-180 bg-navy-950 border-navy-950 text-gold-400"
                          : "bg-slate-50 border-slate-200/80 text-slate-500"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {/* Collapsible Answer Body */}
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100 border-t border-slate-100" : "max-h-0 opacity-0 pointer-events-none"
                    } overflow-hidden`}
                  >
                    <div className="p-6 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 bg-slate-50/50">
                      <p>{faq.answer}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-xs text-slate-400 font-medium">Need specific clarification?</span>
                        <a href="#contact" className="text-xs text-gold-600 hover:text-gold-700 font-bold flex items-center gap-1 transition-colors">
                          Speak with a Tax Partner <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </AnimatedSection>
      </section>

      {/* 7. Blogs / Insights & Updates Section */}
      <LazyMount minHeight={580} sectionId="blogs">
        <React.Suspense fallback={<div className="py-20 text-center text-xs text-slate-400 animate-pulse">Loading Insights &amp; Updates...</div>}>
          <BlogSection
            blogs={allBlogs || []}
            onSelectBlog={(blog) => {
              setSelectedBlog(blog);
              if (typeof window !== "undefined") {
                try {
                  window.history.pushState(null, "", `#blog-${blog.id}`);
                } catch (e) {}
              }
            }}
            onOpenSeoEngine={() => setSeoDashboardOpen(true)}
          />
        </React.Suspense>
      </LazyMount>

      {/* Blog Read Modal Popup (Lazy-Loaded to reduce main mobile JS bundle) */}
      <React.Suspense fallback={null}>
        {selectedBlog && (
          <BlogModal
            blog={selectedBlog}
            onClose={() => {
              setSelectedBlog(null);
              if (typeof window !== "undefined" && window.location.hash.startsWith("#blog-")) {
                try {
                  window.history.replaceState(null, "", window.location.pathname + window.location.search);
                } catch (e) {
                  // Ignore
                }
              }
            }}
            onContact={() => {
              setSelectedBlog(null);
              if (typeof window !== "undefined" && window.location.hash.startsWith("#blog-")) {
                try {
                  window.history.replaceState(null, "", window.location.pathname + window.location.search);
                } catch (e) {}
              }
              setTimeout(() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else window.location.hash = "contact";
              }, 120);
            }}
          />
        )}
      </React.Suspense>

      {/* 8. Contact Us & Consultation Scheduler */}
      <section id="contact" className="py-20 sm:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-20 sm:scroll-mt-24">
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] font-mono text-gold-600 font-bold uppercase tracking-[0.18em] block">
              Inquire or Reserve Call
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
              Schedule Your Complimentary Advisory Consultation
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Submit your corporate details directly to our senior partners, and we will respond within 2 business hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Scheduler Form */}
            <div className="lg:col-span-7">
              <LazyMount minHeight={560} sectionId="contact">
                <React.Suspense fallback={<div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/80 min-h-[560px] flex items-center justify-center text-slate-400 text-xs animate-pulse">Loading Consultation Scheduler...</div>}>
                  <Scheduler preselectedService={preselectedServiceTitle} />
                </React.Suspense>
              </LazyMount>
            </div>

            {/* Right Column: Corporate Headquarters + Map */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              
              {/* Info Blocks */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 space-y-6 shadow-xs">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-600 block mb-1">
                    Registered UAE Practice
                  </span>
                  <h4 className="font-display text-xl font-bold text-navy-950">Corporate Headquarters</h4>
                  <p className="text-slate-600 text-xs leading-relaxed mt-2">
                    Dias Accounting and Tax Consulting is licensed in Sharjah Media City (Shams), serving Mainland and Free Zone entities across Dubai, Sharjah, Abu Dhabi, and all UAE Emirates.
                  </p>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex gap-3.5 items-start">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-gold-600 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Office Address</span>
                      <p className="text-navy-950 font-semibold text-xs mt-1">
                        Sharjah Media City (Shams), Sharjah, United Arab Emirates
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-gold-600 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Direct Advisory Line</span>
                      <p className="text-navy-950 font-mono font-semibold text-xs mt-1">
                        +971 52 922 6958
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-gold-600 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Official Desk</span>
                      <p className="text-navy-950 font-mono font-semibold text-xs mt-1">
                        info@diasuae.ae
                      </p>
                    </div>
                  </div>

                  {/* Google Add to Preferred Sources Badge */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-start">
                    <AddToPreferredSources onClick={() => setGooglePreferredModalOpen(true)} />
                  </div>
                </div>
              </div>

              {/* Real Google Maps Office Locator & Coverage */}
              <LazyMount minHeight={260}>
                <React.Suspense fallback={<div className="h-64 sm:h-72 bg-slate-900 rounded-2xl animate-pulse flex items-center justify-center text-xs text-slate-500">Loading Map Location...</div>}>
                  <GoogleOfficeMap language={language} />
                </React.Suspense>
              </LazyMount>

            </div>

          </div>

        </AnimatedSection>
      </section>
      </main>

      {/* 9. Footer */}
      <footer role="contentinfo" className="bg-navy-950 text-white border-t border-white/10 pt-16 pb-10">
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Bio Column */}
            <div className="md:col-span-4 space-y-4 text-center md:text-left">
              <DiasLogo className="w-12 h-12" showText={true} textSize="text-2xl" textColor="text-white" />
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto md:mx-0">
                Dias Accounting and Tax Consulting delivers IFRS-compliant corporate bookkeeping, FTA VAT compliance, Corporate Tax registration &amp; filing, and UAE Free Zone &amp; Mainland company formation.
              </p>
              <div className="text-[11px] text-slate-400 font-mono">
                <span>SHAMS Licence No: </span>
                <span className="text-gold-400 font-semibold">2646813.01</span>
              </div>
              {/* Social Connections & Google Profile */}
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
              <div className="pt-2 flex justify-center md:justify-start">
                <AddToPreferredSources onClick={() => setGooglePreferredModalOpen(true)} />
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="font-mono font-bold text-[11px] uppercase tracking-[0.16em] text-slate-300">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                <li><a href="#home" className="hover:text-gold-400 transition-colors">Overview</a></li>
                <li><a href="#services" className="hover:text-gold-400 transition-colors">Services &amp; Expertise</a></li>
                <li><a href="#about" className="hover:text-gold-400 transition-colors">Why Dias</a></li>
                <li><a href="#pricing" className="hover:text-gold-400 transition-colors">Fee Schedule</a></li>
                <li><a href="#blogs" className="hover:text-gold-400 transition-colors">Regulatory Insights</a></li>
                <li><a href="#contact" className="hover:text-gold-400 transition-colors">Book Consultation</a></li>
              </ul>
            </div>

            {/* Services Links Column */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-mono font-bold text-[11px] uppercase tracking-[0.16em] text-slate-300">
                Advisory Practices
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><a href="/small-business-tax-relief" onClick={(e) => { e.preventDefault(); navigateTo("/small-business-tax-relief"); }} className="hover:text-gold-300 transition-colors block text-gold-400 font-semibold">Small Business Tax Relief (AED 3M SBR)</a></li>
                <li><a href="/difc-dtec-accounting" onClick={(e) => { e.preventDefault(); navigateTo("/difc-dtec-accounting"); }} className="hover:text-gold-300 transition-colors block text-gold-400 font-semibold">DIFC &amp; DTEC Accounting &amp; Audit</a></li>
                <li><a href="/dividends-audit" onClick={(e) => { e.preventDefault(); navigateTo("/dividends-audit"); }} className="hover:text-gold-300 transition-colors block text-gold-400 font-semibold">Dividend Audit &amp; Distribution Advisory</a></li>
                <li><a href="#services" className="hover:text-gold-400 transition-colors block">Corporate Tax Registration &amp; Filing (9%)</a></li>
                <li><a href="#services" className="hover:text-gold-400 transition-colors block">FTA VAT Return Preparation (5%)</a></li>
                <li><a href="#services" className="hover:text-gold-400 transition-colors block">IFRS Double-Entry Bookkeeping</a></li>
                <li><a href="#services" className="hover:text-gold-400 transition-colors block">SHAMS &amp; UAE Free Zone Formation</a></li>
              </ul>
            </div>

            {/* Legal compliance / Address Column */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-mono font-bold text-[11px] uppercase tracking-[0.16em] text-slate-300">
                Corporate Desk
              </h4>
              <div className="space-y-2.5 text-xs text-slate-400">
                <p className="leading-relaxed">
                  Sharjah Media City (Shams),<br />
                  Al Messaned, Sharjah,<br />
                  United Arab Emirates
                </p>
                <div className="pt-2 space-y-1.5 font-mono text-xs text-slate-300">
                  <span className="block">+971 52 922 6958</span>
                  <span className="block">info@diasuae.ae</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Terms block */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} Dias Accounting and Tax Consulting. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#faqs" className="hover:text-slate-300 transition-colors">Regulatory Disclaimers</a>
              <span>·</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setPrivacyOpen(true);
                }}
                className="hover:text-slate-300 transition-colors cursor-pointer focus:outline-none"
              >
                Privacy Policy
              </button>
              <span>·</span>
              <a href="#contact" className="hover:text-slate-300 transition-colors">FTA Compliance Terms</a>
              <span>·</span>
              <a
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("/admin");
                }}
                className="opacity-40 hover:opacity-100 transition-opacity hover:text-gold-400 inline-flex items-center gap-1 cursor-pointer"
                title="Advisor Portal (Authorized Personnel Only)"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>Advisor Portal</span>
              </a>
            </div>
          </div>

        </AnimatedSection>
      </footer>

      {/* 10. Global WhatsApp & Google Reviews Floating Widget */}
      <div className="fixed bottom-[88px] right-[34px] md:right-8 z-40 flex flex-col gap-2.5 items-center">
        <a
          href={GOOGLE_BUSINESS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-navy-900 hover:text-gold-500 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all duration-300 hover:scale-110 group relative"
          aria-label="Google Business Reviews"
          title="Google Reviews"
        >
          <GoogleLogo className="w-4.5 h-4.5 md:w-5 md:h-5" />
          <span className="absolute right-12 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 bg-navy-950 text-white text-[10px] font-bold py-1 px-2.5 rounded-md shadow-md transition-all duration-200 pointer-events-none whitespace-nowrap">
            5.0 ★ Google Reviews
          </span>
        </a>
        <a
          href="https://www.linkedin.com/company/diasaccounting/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-navy-900 hover:text-gold-500 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all duration-300 hover:scale-110 group relative"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-4.5 h-4.5 md:w-5 md:h-5" />
          <span className="absolute right-12 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 bg-navy-950 text-white text-[10px] font-bold py-1 px-2.5 rounded-md shadow-md transition-all duration-200 pointer-events-none whitespace-nowrap">
            LinkedIn
          </span>
        </a>
        <a
          href="https://www.instagram.com/diasuae.ae/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-navy-900 hover:text-gold-500 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all duration-300 hover:scale-110 group relative"
          aria-label="Instagram"
        >
          <Instagram className="w-4.5 h-4.5 md:w-5 md:h-5" />
          <span className="absolute right-12 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 bg-navy-950 text-white text-[10px] font-bold py-1 px-2.5 rounded-md shadow-md transition-all duration-200 pointer-events-none whitespace-nowrap">
            Instagram
          </span>
        </a>
        <a
          href="https://www.facebook.com/diasuae"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-navy-900 hover:text-gold-500 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all duration-300 hover:scale-110 group relative"
          aria-label="Facebook"
        >
          <Facebook className="w-4.5 h-4.5 md:w-5 md:h-5" />
          <span className="absolute right-12 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 bg-navy-950 text-white text-[10px] font-bold py-1 px-2.5 rounded-md shadow-md transition-all duration-200 pointer-events-none whitespace-nowrap">
            Facebook
          </span>
        </a>
      </div>

      {/* 11. Floating Scroll-to-Top Button (Appears after scrolling past hero) */}
      <button
        type="button"
        id="btn-scroll-to-top"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        title="Scroll to top"
        className={`fixed bottom-20 left-4 sm:left-6 md:bottom-8 md:left-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-navy-900/95 hover:bg-navy-950 text-gold-400 hover:text-gold-300 border border-gold-500/30 hover:border-gold-400/70 shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-300 transform group cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-400/60 ${
          showScrollTop
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto shadow-[0_8px_20px_rgba(15,23,42,0.35)]"
            : "opacity-0 scale-75 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        <span className="sr-only">Scroll back to top</span>
        
        {/* Desktop Tooltip */}
        <span className="hidden md:block absolute left-14 bg-navy-950 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all origin-left pointer-events-none whitespace-nowrap border border-white/10">
          Back to Top ↑
        </span>
      </button>

      {/* Sticky Side Quick Action Tabs (Book Free Consultation & View Pricing) */}
      <FloatingSideTabs
        onBookConsultation={() => {
          const el = document.getElementById("contact");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }}
        onViewPricing={() => {
          const el = document.getElementById("pricing");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />

      <React.Suspense fallback={null}>
        {mountFloatingWidgets && (
          <>
            <WhatsAppWidget
              activeSection={activeSection}
              selectedService={selectedService}
              selectedBlog={selectedBlog}
              customContext={preselectedServiceTitle ? "cfo-advisory" : undefined}
            />
            <StickyMobileLeadBar onOpenAudit={() => setTaxHealthModalOpen(true)} />
          </>
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
            businessName="Best Accounting firm in UAE | Dias LLC"
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
