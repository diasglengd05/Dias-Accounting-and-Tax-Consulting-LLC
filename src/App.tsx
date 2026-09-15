import React, { useState, useEffect } from "react";
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
import { servicesData, blogsData, pricingTiers, testimonialsData, faqsData, GOOGLE_BUSINESS_URL, GOOGLE_RATING_STATS } from "./data/staticData";
import DiasLogo from "./components/DiasLogo";
import { GoogleLogo } from "./components/GoogleLogo";
import ComplianceAlertBanner from "./components/ComplianceAlertBanner";
import StickyMobileLeadBar from "./components/StickyMobileLeadBar";
import FloatingSideTabs from "./components/FloatingSideTabs";
import AddToPreferredSources from "./components/AddToPreferredSources";
import GoogleOfficeMap from "./components/GoogleOfficeMap";
import useDynamicSEO from "./hooks/useDynamicSEO";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import LanguageToggle from "./components/LanguageToggle";
import LazyMount from "./components/LazyMount";
import AnimatedSection from "./components/AnimatedSection";

// Lazy-loaded components for fast mobile JS execution & small initial bundle size
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
const ClientCaseStudies = React.lazy<React.ComponentType<any>>(() => import("./components/ClientCaseStudies").then(m => ({ default: (m as any).default || (m as any).ClientCaseStudies })));
const TaxAiAdvisorModal = React.lazy<React.ComponentType<any>>(() => import("./components/TaxAiAdvisorModal"));
const CompanySetupHub = React.lazy<React.ComponentType<any>>(() => import("./components/CompanySetupHub").then(m => ({ default: (m as any).default || (m as any).CompanySetupHub })));
const WhyChooseUsGrid = React.lazy<React.ComponentType<any>>(() => import("./components/WhyChooseUsGrid").then(m => ({ default: (m as any).default || (m as any).WhyChooseUsGrid })));
const SeoEngineDashboardModal = React.lazy(() => import("./components/SeoEngineDashboardModal"));

function MainApp() {
  const { t, language, isRTL } = useLanguage();

  // Navigation states
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    if (hash && hash !== "#home") {
      const targetId = hash.replace("#", "");
      const scrollToTarget = () => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      };
      const timer = setTimeout(scrollToTarget, 100);
      return () => clearTimeout(timer);
    } else {
      // Default: ensure viewport starts cleanly at the top on home page
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
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
    // Fetch latest dynamic blog posts from 24-hour Cloud Function trigger
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
          setAllBlogs(data.blogs);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch dynamic blogs, using static fallback:", err);
      });

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#blog-")) {
        const blogId = hash.replace("#blog-", "");
        const found = allBlogs.find((b) => b.id === blogId) || blogsData.find((b) => b.id === blogId);
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
  }, [allBlogs.length]);

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

  const handlePreselectedCallBooking = (serviceTitle: string) => {
    setPreselectedServiceTitle(serviceTitle);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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

      {/* 1. Header / Navigation */}
      <header role="banner" className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#home" className="cursor-pointer" aria-label="Dias Accounting Home">
            <DiasLogo className="w-11 h-11" showText={true} textSize="text-2xl" textColor="text-navy-950" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 font-medium text-sm text-slate-600">
            {[
              { id: "home", label: t.nav.home },
              { id: "company-setup", label: language === "ar" ? "تأسيس الشركات" : "Company Setup", highlight: true },
              { id: "services", label: t.nav.services },
              { id: "pricing", label: t.nav.pricing },
              { id: "why-choose-us", label: language === "ar" ? "لماذا دياس؟" : "Why Choose Us" },
              { id: "testimonials", label: t.nav.reviews },
              { id: "faqs", label: t.nav.faq },
              { id: "contact", label: t.nav.contact },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`px-2.5 py-2 rounded-lg transition-all text-xs lg:text-sm ${
                  activeSection === link.id
                    ? "bg-navy-50 text-navy-800 font-bold"
                    : (link as any).highlight
                    ? "text-gold-600 font-bold hover:text-gold-700 hover:bg-gold-50/60"
                    : "hover:text-navy-800 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Header Actions: Language Selector & Booking CTA (Desktop Only) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-2.5">
            <LanguageToggle variant="desktop" />
            <a
              href="#contact"
              className="bg-navy-900 hover:bg-navy-950 text-white font-display font-bold py-2.5 px-4 lg:px-5 rounded-xl text-xs tracking-tight transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              <span>{t.nav.bookConsultation}</span>
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-12 h-12 min-w-[48px] min-h-[48px] flex items-center justify-center p-2.5 text-slate-600 hover:text-navy-900 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer touch-manipulation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer with Pure CSS Smooth Animation & Sticky Footer CTA */}
        <div
          id="mobile-nav-menu"
          className={`md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-300 ease-out origin-top ${
            mobileMenuOpen
              ? "opacity-100 max-h-[calc(100vh-5rem)] pointer-events-auto visible"
              : "opacity-0 max-h-0 pointer-events-none invisible"
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          {/* Scrollable Nav Links Content */}
          <div className="px-4 sm:px-5 pt-3.5 pb-4 space-y-2 font-medium text-slate-600 overflow-y-auto flex-1">
            <div className="pb-3 mb-2 border-b border-slate-100 flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                {language === "ar" ? "اللغة والتفضيلات" : "Language & Region"}
              </span>
              <LanguageToggle variant="mobile" />
            </div>

            <div className="space-y-1.5">
              {[
                { id: "home", label: t.nav.home },
                { id: "company-setup", label: language === "ar" ? "تأسيس الشركات في دبي" : "Company Setup in Dubai", highlight: true, badge: "Visas + Bank" },
                { id: "services", label: t.nav.services },
                { id: "pricing", label: t.nav.pricing },
                { id: "why-choose-us", label: language === "ar" ? "لماذا تختار دياس؟" : "Why Choose Us (6 Pillars)" },
                { id: "jurisdictions", label: language === "ar" ? "المناطق الحرة والضريبية" : "UAE Jurisdictions (0% QFZP)" },
                { id: "case-studies", label: language === "ar" ? "دراسات حالة العملاء" : "Client Case Studies" },
                { id: "testimonials", label: t.nav.reviews },
                { id: "faqs", label: t.nav.faq },
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 min-h-[48px] rounded-xl text-base sm:text-sm transition-all active:scale-[0.99] touch-manipulation cursor-pointer ${
                    activeSection === link.id
                      ? "bg-navy-900 text-white font-bold shadow-sm"
                      : (link as any).highlight
                      ? "bg-gold-50/90 text-gold-800 font-bold border border-gold-200/60"
                      : "text-slate-700 hover:text-navy-900 hover:bg-slate-50 active:bg-slate-100"
                  }`}
                >
                  <span className="font-semibold">{link.label}</span>
                  {(link as any).badge && (
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-700 border border-emerald-500/20">
                      {(link as any).badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Persistent Sticky Footer CTA within Mobile Menu Drawer */}
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-slate-50/95 backdrop-blur-md border-t border-slate-200 shadow-lg z-10">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-gradient-to-r from-navy-900 to-navy-950 hover:from-navy-950 hover:to-black text-white font-display font-bold py-3.5 sm:py-4 px-5 min-h-[52px] rounded-xl text-center text-sm sm:text-base tracking-tight transition-all shadow-md flex items-center justify-center gap-2.5 active:scale-[0.99] touch-manipulation cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-gold-400 shrink-0" />
              <span>{t.nav.bookConsultation}</span>
              <ArrowRight className="w-4 h-4 text-gold-400 shrink-0 rtl:rotate-180" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Landmark for Accessibility & SEO */}
      <main id="main-content" role="main">
        {/* 2. Hero Section - Dubai Skyline Panoramic Authority Banner */}
        <section
          id="home"
          className="relative overflow-hidden min-h-0 sm:min-h-[620px] lg:min-h-[720px] flex items-center justify-center text-white bg-navy-950 scroll-mt-20 sm:scroll-mt-24"
        >
          {/* Responsive LCP Hero Image - Discovered instantly by browser scanner & optimized for mobile screen payloads */}
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=75"
            srcSet="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=640&q=70 640w, https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1080&q=75 1080w, https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80 1920w"
            sizes="100vw"
            alt="Dubai Financial District Skyline - Dias Accounting & Tax Advisory"
            width={1920}
            height={1080}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-[center_38%] pointer-events-none select-none"
          />

          {/* Precision Gradient & Vignette Overlays for Maximum Text Legibility & Brand Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070d19]/85 via-[#0d1b2a]/75 to-[#070d19]/95 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/30 via-transparent to-[#070d19]/70 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-gold-500/10 via-transparent to-navy-950/80 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-b from-purple-500/10 to-transparent blur-3xl pointer-events-none" />

          <AnimatedSection className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 lg:py-24 relative z-10 text-center space-y-5 sm:space-y-8">
            
            {/* Trust Pill & Google Rating Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md text-[11px] sm:text-xs font-semibold text-gold-300 shadow-sm transition-all">
                <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                <span>{t.hero.badge}</span>
              </div>
              <a
                href={GOOGLE_BUSINESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-navy-900/80 hover:bg-navy-900 border border-gold-500/30 hover:border-gold-400/60 backdrop-blur-md text-[11px] sm:text-xs font-semibold text-white transition-all shadow-sm group"
                title="View Dias Accounting on Google Business"
              >
                <GoogleLogo className="w-3.5 h-3.5" />
                <span className="text-amber-400 font-bold">★★★★★</span>
                <span className="text-slate-100 font-bold">5.0</span>
                <span className="text-slate-300 text-[11px] font-normal hidden sm:inline">{t.hero.googleRatingText}</span>
                <ExternalLink className="w-3 h-3 text-gold-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Prominent Main Brand Title */}
            <div className="space-y-2">
              <h1 className="font-display text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white drop-shadow-md">
                {t.hero.companyTitle}
                <span className="sr-only"> - Best Accounting Firm in Dubai & UAE</span>
              </h1>

              {/* Sub-headline 1: UAE's leading firm */}
              <h2 className="text-base sm:text-2xl md:text-3xl font-bold text-slate-100 tracking-tight max-w-3xl mx-auto leading-snug drop-shadow">
                {t.hero.subheadline1}
              </h2>

              {/* Punchy Growth Tagline */}
              <p className="text-base sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-emerald-300 tracking-tight drop-shadow pt-1 leading-snug">
                {t.hero.subheadline2}
              </p>
            </div>

            {/* Clear, High-Converting Client Value Statement */}
            <p className="text-slate-200 text-xs sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-sm px-1">
              {t.hero.description}
            </p>

            {/* High-Converting Action Buttons Bar with Immediate 0% Relief & Small Business Incentive */}
            <div className="flex flex-col items-center justify-center gap-2.5 sm:gap-3.5 max-w-3xl mx-auto pt-1 sm:pt-2 w-full">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5 w-full">
                <a
                  href="#calculator"
                  className="sm:w-auto bg-gradient-to-tr from-gold-400 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-navy-950 font-display font-bold py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl shadow-lg hover:shadow-gold-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer hover:scale-[1.02] active:scale-98 text-center shrink-0"
                  title="Calculate UAE Corporate Tax & Discover 0% Relief Options"
                >
                  <Calculator className="w-4 h-4 text-navy-950 shrink-0" />
                  <span className="text-xs sm:text-sm font-extrabold">{t.hero.ctaConsultation}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 shrink-0 rtl:rotate-180" />
                </a>

                <button
                  type="button"
                  onClick={() => setTaxHealthModalOpen(true)}
                  className="sm:w-auto bg-white/15 hover:bg-white/25 border border-white/30 hover:border-gold-400/80 text-white font-display font-bold py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl backdrop-blur-md transition-all text-xs sm:text-base flex items-center justify-center gap-2 cursor-pointer group hover:scale-[1.02] active:scale-98 shadow-lg shrink-0"
                >
                  <ShieldCheck className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span>{t.hero.ctaRiskAudit}</span>
                </button>

                <a
                  href="https://wa.me/971529226958?text=Hello%20Glen,%20I%20would%20like%20to%20consult%20about%20verifying%20our%200%25%20Corporate%20Tax%20relief%20and%20accounting%20for%20our%20UAE%20business."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:w-auto bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-400/40 text-white font-display font-semibold py-3 sm:py-3.5 px-4 sm:px-5 rounded-2xl backdrop-blur-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-98 shrink-0"
                  title="Direct WhatsApp Chat with Senior Partner Glen Dias"
                >
                  <Phone className="w-4 h-4 text-emerald-200 shrink-0" />
                  <span>{t.hero.ctaWhatsApp}</span>
                </a>
              </div>
            </div>

            {/* 4 Core BCL-Style Value Guarantees Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2">
              <div className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-3 text-left rtl:text-right backdrop-blur-md transition-all">
                <div className="flex items-center gap-1.5 text-gold-400 font-display font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-gold-400" />
                  <span>{language === "ar" ? "معاملات غير محدودة" : "Unlimited Transactions"}</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-1 leading-snug">
                  {language === "ar" ? "لا رسوم إضافية مخفية ولا حد لعدد الفواتير" : "No hidden overage surcharges or transaction caps"}
                </p>
              </div>

              <div className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-3 text-left rtl:text-right backdrop-blur-md transition-all">
                <div className="flex items-center gap-1.5 text-emerald-300 font-display font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>{language === "ar" ? "بدون سقف للإيرادات" : "No Revenue Cap"}</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-1 leading-snug">
                  {language === "ar" ? "تسعير شفاف ينمو مع شركتك دون قفزات غير مبررة" : "Transparent scale without arbitrary bracket jumps"}
                </p>
              </div>

              <div className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-3 text-left rtl:text-right backdrop-blur-md transition-all">
                <div className="flex items-center gap-1.5 text-gold-400 font-display font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-gold-400" />
                  <span>{language === "ar" ? "ضمان الرضا 100%" : "100% Satisfaction Guarantee"}</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-1 leading-snug">
                  {language === "ar" ? "دفاتر جاهزة للتدقيق وضمان خلو من غرامات الهيئة" : "Zero penalty guarantee with audit-ready records"}
                </p>
              </div>

              <div className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-3 text-left rtl:text-right backdrop-blur-md transition-all">
                <div className="flex items-center gap-1.5 text-emerald-300 font-display font-bold text-xs">
                  <Award className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>{language === "ar" ? "وكالة ضريبية معتمدة" : "FTA Registered Agency"}</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-1 leading-snug">
                  {language === "ar" ? "محاسبون قانونيون معتمدون CAs & CPAs في دبي والإمارات" : "Licensed Chartered Accountants & CPAs across UAE"}
                </p>
              </div>
            </div>

            {/* Key Trust & Performance Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-white/15 max-w-4xl mx-auto">
              <div className="text-center">
                <span className="block text-2xl sm:text-3xl font-extrabold font-display text-gold-400">45+</span>
                <span className="text-[11px] text-slate-300 font-medium block mt-0.5">{language === "ar" ? "شركة انضمت إلينا" : "UAE Businesses Onboarded"}</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl sm:text-3xl font-extrabold font-display text-gold-400">100%</span>
                <span className="text-[11px] text-slate-300 font-medium block mt-0.5">{language === "ar" ? "سجل خالٍ تماماً من الغرامات" : "Zero-Penalty Compliance Rate"}</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl sm:text-3xl font-extrabold font-display text-gold-400">15+</span>
                <span className="text-[11px] text-slate-300 font-medium block mt-0.5">{language === "ar" ? "قطاعاً في المناطق الحرة والمحلية" : "Free Zone & Mainland Sectors"}</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl sm:text-3xl font-extrabold font-display text-gold-400">15+</span>
                <span className="text-[11px] text-slate-300 font-medium block mt-0.5">{language === "ar" ? "سنة خبرة مهنية للشريك الإداري" : "Years Senior Partner CA Exp"}</span>
              </div>
            </div>

          </AnimatedSection>
        </section>

        {/* 2.2 Instant Interactive Tax Planning & Health Estimator Section */}
        <section id="calculator" className="py-12 md:py-16 bg-navy-900 border-b border-slate-800 text-white relative overflow-hidden scroll-mt-20 sm:scroll-mt-24">
          <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Explanatory Column */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left rtl:lg:text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{language === "ar" ? "حاسبة ضريبة الشركات التفاعلية" : "Interactive Tax Estimator"}</span>
                </div>
                
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                  {language === "ar" 
                    ? "احسب التزامك الضريبي واكتشف فرص الإعفاء القانوني" 
                    : "Calculate Your UAE Corporate Tax & Discover 0% Relief Options"}
                </h2>
                
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {language === "ar"
                    ? "سواء كانت شركتك مسجلة في البر الرئيسي (Mainland) أو في إحدى المناطق الحرة (Free Zone)، استخدم حاسبتنا المعتمدة لتقدير ضريبة الـ 9%، والتحقق من أهلية تسهيلات الأعمال الصغيرة (SBR) حتى 3 مليون درهم."
                    : "Whether you operate in UAE Mainland or Free Zones (DMCC, Meydan, RAKEZ, IFZA, Shams), use our compliant estimator to calculate your 9% liability, check Small Business Relief eligibility, and verify 0% Qualifying Free Zone Person conditions."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-navy-950/70 border border-white/10 rounded-xl p-4 space-y-1 text-left rtl:text-right">
                    <div className="flex items-center gap-2 text-gold-400 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{language === "ar" ? "تسهيلات حتى 3M درهم" : "Small Business Relief"}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {language === "ar" ? "0% ضريبة إذا كانت الإيرادات السنوية أقل من 3,000,000 درهم." : "0% tax for UAE businesses with annual revenues under AED 3,000,000."}
                    </p>
                  </div>

                  <div className="bg-navy-950/70 border border-white/10 rounded-xl p-4 space-y-1 text-left rtl:text-right">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{language === "ar" ? "المناطق الحرة 0% QFZP" : "0% Free Zone QFZP"}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {language === "ar" ? "هيكلة متوافقة للاستفادة من الإعفاء للدخل المؤهل." : "Compliant structuring to maintain 0% corporate tax on qualifying income."}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <button
                    type="button"
                    onClick={() => setTaxHealthModalOpen(true)}
                    className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold py-3 px-5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{language === "ar" ? "افحص مخاطر الامتثال (مجاناً)" : "Free 60s Penalty Risk Audit"}</span>
                  </button>
                  <a
                    href="#services"
                    className="border border-white/20 hover:border-white/40 text-slate-200 hover:text-white font-display font-semibold py-3 px-5 rounded-xl text-xs sm:text-sm transition-all"
                  >
                    {language === "ar" ? "عرض جميع الخدمات" : "View All Services"}
                  </a>
                </div>
              </div>

              {/* Right Interactive Tax Calculator */}
              <div className="lg:col-span-6 w-full max-w-lg mx-auto">
                <LazyMount minHeight={480} sectionId="calculator">
                  <React.Suspense fallback={<div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl min-h-[480px] p-6 flex flex-col justify-center items-center text-slate-400 text-xs animate-pulse">Loading Tax Estimator...</div>}>
                    <TaxCalculator />
                  </React.Suspense>
                </LazyMount>
              </div>

            </div>
          </AnimatedSection>
        </section>

      {/* 3. Software Partners Banner - BCL.ae "We use the world's best softwares" */}
      <section className="bg-white border-y border-slate-100 py-12">
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs text-gold-600 font-bold uppercase tracking-widest block">
              {language === "ar" ? "شراكات التكنولوجيا المحاسبية العالمية" : "Cloud Accounting Software Partners"}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-navy-950">
              {language === "ar" ? "نستخدم أفضل برمجيات المحاسبة والأتمتة في العالم" : "We Use the World's Best Accounting Software"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
              {language === "ar"
                ? "ربط رقمي فوري، ترحيل سلس للبيانات التاريخية، وتكامل معتمد مع نظام الهيئة الاتحادية للضرائب EmaraTax"
                : "Real-time bank feeds, seamless historical migration, and direct compliance with the UAE FTA EmaraTax platform"}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 pt-2">
            
            {/* Intuit QuickBooks */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200/60 rounded-2xl hover:border-emerald-300 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-emerald-600 font-display font-black text-xl mb-2 group-hover:scale-110 transition-transform">
                qb
              </div>
              <span className="font-display font-bold text-slate-800 text-xs">QuickBooks</span>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-full mt-1">
                Global Elite
              </span>
            </div>

            {/* Xero */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200/60 rounded-2xl hover:border-sky-300 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-sky-500 text-white shadow-sm flex items-center justify-center font-display font-black text-base italic mb-2 group-hover:scale-110 transition-transform">
                xero
              </div>
              <span className="font-display font-bold text-slate-800 text-xs">Xero Cloud</span>
              <span className="text-[9px] font-bold text-sky-600 bg-sky-50 border border-sky-200/60 px-1.5 py-0.5 rounded-full mt-1">
                Platinum Partner
              </span>
            </div>

            {/* Zoho Books */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200/60 rounded-2xl hover:border-amber-300 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-2 h-2 bg-red-500 rounded-sm" />
                  <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                  <div className="w-2 h-2 bg-green-500 rounded-sm" />
                  <div className="w-2 h-2 bg-amber-500 rounded-sm" />
                </div>
              </div>
              <span className="font-display font-bold text-slate-800 text-xs">Zoho Books</span>
              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-full mt-1">
                Elite Partner
              </span>
            </div>

            {/* Wafeq */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200/60 rounded-2xl hover:border-teal-300 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-teal-600 mb-2 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 100 100" className="w-5 h-5 fill-teal-600">
                  <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="none" stroke="currentColor" strokeWidth="10" />
                  <path d="M40 45 L50 55 L70 35" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-display font-bold text-slate-800 text-xs">Wafeq</span>
              <span className="text-[9px] font-bold text-teal-600 bg-teal-50 border border-teal-200/60 px-1.5 py-0.5 rounded-full mt-1">
                FTA Certified
              </span>
            </div>

            {/* Odoo ERP */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200/60 rounded-2xl hover:border-purple-300 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-700 text-white shadow-sm flex items-center justify-center font-display font-extrabold text-sm mb-2 group-hover:scale-110 transition-transform">
                odoo
              </div>
              <span className="font-display font-bold text-slate-800 text-xs">Odoo ERP</span>
              <span className="text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-200/60 px-1.5 py-0.5 rounded-full mt-1">
                Implementation
              </span>
            </div>

            {/* EmaraTax Direct */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200/60 rounded-2xl hover:border-gold-300 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-navy-950 text-gold-400 shadow-sm flex items-center justify-center font-display font-bold text-xs mb-2 group-hover:scale-110 transition-transform">
                FTA
              </div>
              <span className="font-display font-bold text-slate-800 text-xs">EmaraTax</span>
              <span className="text-[9px] font-bold text-navy-800 bg-gold-50 border border-gold-300/60 px-1.5 py-0.5 rounded-full mt-1">
                Direct Portal
              </span>
            </div>

          </div>
        </AnimatedSection>
      </section>

      {/* 4. Core Services Grid Section */}
      <section id="services" className="py-20 bg-slate-50 scroll-mt-20 sm:scroll-mt-24">
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs text-gold-600 font-bold uppercase tracking-widest block">
              {t.services.badge}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
              {t.services.title}
            </h2>
            <p className="text-slate-500 text-sm">
              {t.services.subtitle}
            </p>
          </div>

          {/* Responsive Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(t.services.items || servicesData || []).map((service) => (
              <div
                key={service.id}
                className="premium-card rounded-3xl p-6 flex flex-col group"
              >
                {/* Header Icon */}
                <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center mb-5 group-hover:bg-gold-500 group-hover:border-gold-500 transition-all">
                  <div className="group-hover:text-navy-950 transition-colors">
                    {getServiceIcon(service.iconName)}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-bold text-navy-950 group-hover:text-gold-600 transition-colors mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed flex-grow mb-6">
                  {service.shortDesc}
                </p>

                {/* Action trigger */}
                <button
                  onClick={() => setSelectedService(service)}
                  className="w-full mt-auto border border-slate-100 bg-slate-50 hover:bg-navy-900 text-navy-800 hover:text-white font-display font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t.services.readMore}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
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

      {/* 4.7 BCL-Style 6 Pillars of Excellence: "Why Choose Dias Accounting?" */}
      <div id="why-choose-us" className="scroll-mt-20 sm:scroll-mt-24">
        <AnimatedSection>
          <LazyMount minHeight={480}>
            <React.Suspense fallback={<div className="py-16 text-center text-xs text-slate-400 animate-pulse">Loading Why Choose Us...</div>}>
              <WhyChooseUsGrid onBookCall={handlePreselectedCallBooking} />
            </React.Suspense>
          </LazyMount>
        </AnimatedSection>
      </div>

      {/* 5. "Why Partner With Us" Section */}
      <section id="about" className="py-20 bg-white relative overflow-hidden scroll-mt-20 sm:scroll-mt-24">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(#0f172a 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />

        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs text-gold-600 font-bold uppercase tracking-widest block">
                {t.about.badge}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
                {t.about.title} <br className="hidden sm:inline" />
                {t.about.titleLine2}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t.about.description}
              </p>

              {/* Statistics Panel */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold font-display text-navy-900">{t.about.accuracyStat}</span>
                    <span className="text-xs text-emerald-600 font-bold">▲</span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold block">{t.about.accuracyLabel}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold font-display text-navy-900">{t.about.slaStat}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold block">{t.about.slaLabel}</span>
                </div>
              </div>

              {/* Trust statement */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3 items-center text-xs text-slate-600">
                <Users className="w-5 h-5 text-gold-500 shrink-0" />
                <span>
                  {t.about.trustStatement}
                </span>
              </div>
            </div>

            {/* Right List Column: Benefits Visual blocks */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="bg-slate-50 border border-slate-100 hover:border-gold-300/60 hover:bg-white rounded-3xl p-5 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                      {getPartnerBenefitIcon(idx)}
                    </div>
                    <h3 className="font-display font-bold text-sm text-navy-950">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed mb-4">
                    {benefit.description || (benefit as any).desc}
                  </p>
                  {(benefit.bullets && benefit.bullets.length > 0) && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/40">
                      {benefit.bullets.map((b, bIdx) => (
                        <span
                          key={bIdx}
                          className="text-[9px] bg-white border border-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </AnimatedSection>
      </section>

      {/* 5.5 Proven Client Case Studies & E-E-A-T Track Record */}
      <AnimatedSection>
        <LazyMount minHeight={380}>
          <React.Suspense fallback={<div className="py-16 text-center text-xs text-slate-400 animate-pulse">Loading Client Case Studies...</div>}>
            <ClientCaseStudies />
          </React.Suspense>
        </LazyMount>
      </AnimatedSection>

      {/* 6. Pricing Plans Section - BCL.ae Dual Pathway ("Staying ahead going forward" vs "Catching up on the past") */}
      <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-100 scroll-mt-20 sm:scroll-mt-24">
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs text-gold-600 font-bold uppercase tracking-widest block">
              {t.pricing.badge}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
              {language === "ar" ? "أسعار واضحة وشفافة بدون مفاجآت" : "Transparent, Flat-Fee Pricing with Zero Surprises"}
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto">
              {language === "ar"
                ? "اختر المسار الأنسب لاحتياجاتك: اشتراك شهري لمواكبة المستقبل، أو حزمة إغلاق المتأخرات للسنوات السابقة."
                : "Choose your path: stay ahead with prospective ongoing compliance, or catch up on prior financial years for corporate tax."}
            </p>

            {/* BCL-Style Pathway Selector Tabs */}
            <div className="pt-4 flex justify-center">
              <div className="inline-flex p-1.5 bg-white border border-slate-200/80 rounded-2xl shadow-sm max-w-full overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setPricingPath("prospective")}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    pricingPath === "prospective"
                      ? "bg-navy-950 text-white shadow-sm"
                      : "text-slate-600 hover:text-navy-950 hover:bg-slate-50"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${pricingPath === "prospective" ? "bg-gold-400" : "bg-slate-300"}`} />
                  <span>{language === "ar" ? "1. مواكبة المستقبل (مستمر)" : "Staying ahead going forward"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPricingPath("retrospective")}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    pricingPath === "retrospective"
                      ? "bg-navy-950 text-white shadow-sm"
                      : "text-slate-600 hover:text-navy-950 hover:bg-slate-50"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${pricingPath === "retrospective" ? "bg-amber-400" : "bg-slate-300"}`} />
                  <span>{language === "ar" ? "2. إغلاق متأخرات السنوات السابقة" : "Catching up on the past (Backlog)"}</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full leading-none">
                    {language === "ar" ? "عاجل" : "Deadline"}
                  </span>
                </button>
              </div>
            </div>

            {/* Billing Toggle (Shown when on prospective pathway) */}
            {pricingPath === "prospective" && (
              <div className="pt-2">
                <div className="inline-flex items-center p-1 bg-white border border-slate-200/80 rounded-2xl shadow-inner">
                  <button
                    onClick={() => setBillingPeriod("monthly")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      billingPeriod === "monthly"
                        ? "bg-navy-900 text-white shadow"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t.pricing.monthly}
                  </button>
                  <button
                    onClick={() => setBillingPeriod("annual")}
                    className={`relative px-4 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      billingPeriod === "annual"
                        ? "bg-navy-900 text-white shadow"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <span>{t.pricing.annual}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full leading-none">
                      {t.pricing.annualSavingsBadge}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* BCL 3 Core Guarantees Banner */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left rtl:text-right">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gold-50 border border-gold-200/60 flex items-center justify-center text-gold-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-navy-950">
                    {language === "ar" ? "معاملات غير محدودة" : "Unlimited Transactions"}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {language === "ar"
                      ? "لا رسوم مفاجئة على عدد الفواتير أو قيود اليومية."
                      : "No invoice penalties or sudden surprise fees for scaling transactions."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t md:border-t-0 md:border-l rtl:md:border-l-0 rtl:md:border-r border-slate-100 pt-3 md:pt-0 md:pl-4 rtl:md:pl-0 rtl:md:pr-4">
                <div className="w-8 h-8 rounded-xl bg-gold-50 border border-gold-200/60 flex items-center justify-center text-gold-600 shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-navy-950">
                    {language === "ar" ? "بدون سقف للإيرادات" : "No Revenue Cap"}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {language === "ar"
                      ? "تسعير شفاف وثابت لا يعاقب شركتك على نمو مبيعاتها."
                      : "Transparent fixed pricing that doesn't penalize business revenue growth."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t md:border-t-0 md:border-l rtl:md:border-l-0 rtl:md:border-r border-slate-100 pt-3 md:pt-0 md:pl-4 rtl:md:pl-0 rtl:md:pr-4">
                <div className="w-8 h-8 rounded-xl bg-gold-50 border border-gold-200/60 flex items-center justify-center text-gold-600 shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-navy-950">
                    {language === "ar" ? "ضمان الرضا والامتثال 100%" : "100% Satisfaction Guarantee"}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
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
              {(t.pricing.tiers || pricingTiers || []).map((tier) => {
                const displayPrice = billingPeriod === "annual" ? tier.annualPrice : tier.price;
                return (
                  <div
                    key={tier.id}
                    className={`bg-white border rounded-3xl p-8 flex flex-col relative transition-all duration-300 ${
                      tier.popular
                        ? "border-gold-500 ring-4 ring-gold-500/15 shadow-xl"
                        : "border-slate-200/80 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-navy-950 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                        {t.pricing.popularBadge}
                      </span>
                    )}

                    <div className="space-y-1 mb-6">
                      <h3 className="font-display text-xl font-bold text-navy-950">
                        {tier.name}
                      </h3>
                      <p className="text-slate-500 text-xs min-h-[32px] leading-relaxed">
                        {tier.description}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-1.5 border-b border-slate-100 pb-6 mb-6">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AED</span>
                      <span className="text-4xl font-extrabold font-mono text-navy-950 tracking-tight">
                        {displayPrice}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {billingPeriod === "annual" ? "/ year" : "/ month"}
                      </span>
                    </div>

                    <div className="space-y-3.5 flex-grow mb-8">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Plan Inclusions:
                      </span>
                      <ul className="space-y-2.5 text-xs text-slate-600">
                        {(tier.features || []).map((feat, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href="#contact"
                      className={`w-full py-3.5 px-4 rounded-xl font-display font-bold text-xs text-center transition-all cursor-pointer ${
                        tier.popular
                          ? "bg-gold-500 hover:bg-gold-600 text-navy-950 shadow-md shadow-gold-500/10"
                          : "bg-navy-900 hover:bg-navy-950 text-white"
                      }`}
                    >
                      {t.pricing.getStartedBtn}
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
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-navy-950">
                      {language === "ar" ? "تنبيه الموعد النهائي لضريبة الشركات في الإمارات!" : "UAE Corporate Tax Filing Deadline Alert"}
                    </h4>
                    <p className="text-xs text-slate-600">
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
                <div className="bg-white border-2 border-gold-500 rounded-3xl p-8 flex flex-col relative transition-all duration-300 shadow-lg shadow-gold-500/10 hover:shadow-xl ring-4 ring-gold-500/5">
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-navy-950 text-[10px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                    {language === "ar" ? "الأكثر طلباً للمواعيد" : "High Urgency Package"}
                  </span>
                  
                  <div className="space-y-1 mb-4 mt-2">
                    <h3 className="font-display text-lg font-extrabold text-navy-950">
                      {language === "ar" ? "إغلاق سنة مالية واحدة + إقرار الضريبة" : "Single FY Backlog + Corporate Tax Return"}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {language === "ar"
                        ? "مخصص للشركات المتأخرة عن تقديم إقرار السنة المالية 2024 أو 2025"
                        : "Designed for UAE businesses needing full-year historical books and EmaraTax CT filing."}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1.5 border-b border-slate-100 pb-6 mb-6">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AED</span>
                    <span className="text-4xl font-extrabold font-mono text-navy-950 tracking-tight">2,500</span>
                    <span className="text-xs text-slate-400 font-medium">/ {language === "ar" ? "سنة مالية (دفعة واحدة)" : "financial year"}</span>
                  </div>

                  <div className="space-y-3 flex-grow mb-8 text-xs text-slate-600">
                    <span className="text-[10px] text-navy-950 font-extrabold uppercase tracking-wider block">
                      {language === "ar" ? "ما يتضمنه الباكيج:" : "Package Deliverables:"}
                    </span>
                    <ul className="space-y-2.5">
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "تسوية كامل كشوفات الحسابات البنكية لـ 12 شهراً" : "12-Month bank statement and credit card reconciliation"}</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "إعداد ميزانية عمومية وقائمة دخل مطابقة لمعايير IFRS" : "Balance sheet and P&L generation compliant with IFRS"}</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "احتساب ضريبة الشركات وتطبيق تسهيلات الأعمال الصغيرة SBR" : "Corporate tax calculation & Small Business Relief claiming"}</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "تقديم الإقرار النهائي رسمياً عبر بوابة EmaraTax" : "Official CT return submission via FTA EmaraTax portal"}</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "ضمان تجنب غرامات التأخير" : "Zero-penalty filing assurance"}</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePreselectedCallBooking("Single FY Backlog (AED 2,500)")}
                    className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-xs text-center transition-all cursor-pointer bg-gold-500 hover:bg-gold-600 text-navy-950 shadow-md shadow-gold-500/20"
                  >
                    {language === "ar" ? "احجز حزمة المتأخرات الآن" : "Book Single FY Package"}
                  </button>
                </div>

                {/* 2. Multi-Year Catchup */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col relative transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="space-y-1 mb-4 mt-2">
                    <h3 className="font-display text-lg font-extrabold text-navy-950">
                      {language === "ar" ? "إغلاق متأخرات متعدد السنوات (سنتين)" : "Multi-Year Full Catch-Up (2 FYs)"}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {language === "ar"
                        ? "للشركات التي لم تقم بأي قيود محاسبية منذ التأسيس وتحتاج جاهزية تدقيق كاملة"
                        : "For companies that have not maintained regular books since incorporation."}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1.5 border-b border-slate-100 pb-6 mb-6">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AED</span>
                    <span className="text-4xl font-extrabold font-mono text-navy-950 tracking-tight">4,800</span>
                    <span className="text-xs text-slate-400 font-medium">/ {language === "ar" ? "سنتين ماليتين" : "2 fiscal years"}</span>
                  </div>

                  <div className="space-y-3 flex-grow mb-8 text-xs text-slate-600">
                    <span className="text-[10px] text-navy-950 font-extrabold uppercase tracking-wider block">
                      {language === "ar" ? "ما يتضمنه الباكيج:" : "Package Deliverables:"}
                    </span>
                    <ul className="space-y-2.5">
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "تسوية متكاملة لـ 24 شهراً من المعاملات البنكية" : "24-Month full historical ledger & bank reconciliation"}</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "إعادة بناء الأستاذ العام وتصنيف المصروفات الاستثمارية" : "General ledger reconstruction & capital expense tracking"}</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "إعداد القوائم المالية المقارنة للتدقيق القانوني" : "Comparative IFRS financial statements ready for statutory audit"}</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "تقديم إقراري ضريبة الشركات للعامين معاً" : "Filing of 2 corporate tax returns on EmaraTax"}</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "فحص امتثال ضريبة القيمة المضافة التاريخي" : "Historical VAT compliance risk review"}</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePreselectedCallBooking("Multi-Year Backlog (AED 4,800)")}
                    className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-xs text-center transition-all cursor-pointer bg-navy-900 hover:bg-navy-950 text-white"
                  >
                    {language === "ar" ? "حجز باكيج السنتين" : "Book 2-Year Catchup"}
                  </button>
                </div>

                {/* 3. High-Volume E-Commerce / Multi-Entity */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col relative transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="space-y-1 mb-4 mt-2">
                    <h3 className="font-display text-lg font-extrabold text-navy-950">
                      {language === "ar" ? "المتاجر الإلكترونية والشركات المتعددة" : "E-Commerce & High Volume Clean-up"}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {language === "ar"
                        ? "تسوية آلاف المعاملات من Stripe وShopify وبوابات الدفع والمنصات الرقمية"
                        : "High-volume gateway reconciliations (Stripe, Amazon, Tabby, Tamara) with multi-currency books."}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1.5 border-b border-slate-100 pb-6 mb-6">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AED</span>
                    <span className="text-4xl font-extrabold font-mono text-navy-950 tracking-tight">7,500</span>
                    <span className="text-xs text-slate-400 font-medium">/ {language === "ar" ? "سنة مالية معقدة" : "complex fiscal year"}</span>
                  </div>

                  <div className="space-y-3 flex-grow mb-8 text-xs text-slate-600">
                    <span className="text-[10px] text-navy-950 font-extrabold uppercase tracking-wider block">
                      {language === "ar" ? "ما يتضمنه الباكيج:" : "Package Deliverables:"}
                    </span>
                    <ul className="space-y-2.5">
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "مطابقة بوابات الدفع الإلكتروني ومبيعات نقاط البيع" : "Payment gateway & merchant payout reconciliation"}</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "معالجة المخزون والتكلفة التقديرية للبضاعة المباعة COGS" : "Inventory valuation & automated COGS tracking"}</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "تسوية العملات الأجنبية وأسعار الصرف المتعددة" : "Multi-currency FX gain/loss adjustments"}</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{language === "ar" ? "تقديم إقرار ضريبة الشركات وتجهيز ملفات التدقيق" : "Full corporate tax filing + audit readiness dossier"}</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePreselectedCallBooking("E-Commerce Backlog Clean-up (AED 7,500)")}
                    className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-xs text-center transition-all cursor-pointer bg-navy-900 hover:bg-navy-950 text-white"
                  >
                    {language === "ar" ? "حجز باكيج التجارة الإلكترونية" : "Book E-Commerce Package"}
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Pricing Disclaimer */}
          <p className="text-center text-[10px] text-slate-400 font-medium">
            *Custom enterprise solutions, audit support packages, and historical clean-ups are quoted separately. Pricing excludes standard government VAT.
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
      <section id="lead-magnet" className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 text-white py-6 sm:py-8 border-y border-gold-500/20 relative overflow-hidden">
        <AnimatedSection className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            
            {/* Content Left */}
            <div className="space-y-1.5 text-center md:text-left rtl:md:text-right flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gold-400/20 border border-gold-400/30 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                  <BookOpen className="w-3 h-3" />
                  <span>{t.leadMagnet.badge}</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  {language === "ar" ? "تحديث 2026 فوري" : "2026 Edition"}
                </span>
              </div>

              <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                {t.leadMagnet.title}
              </h3>

              <p className="text-slate-300 text-xs line-clamp-1 max-w-xl">
                {t.leadMagnet.description}
              </p>

              {/* Micro points */}
              <div className="hidden sm:flex flex-wrap items-center justify-center md:justify-start gap-3 pt-0.5 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gold-400" />{t.leadMagnet.point1}</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{t.leadMagnet.point2}</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" />{t.leadMagnet.point3}</span>
              </div>
            </div>

            {/* CTAs Right */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setLeadMagnetModalOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold py-2 px-4 rounded-lg text-xs transition-colors shadow cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.leadMagnet.downloadBtn}</span>
              </button>

              <button
                onClick={() => setTaxHealthModalOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium py-2 px-3.5 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                <span>{language === "ar" ? "فحص المخاطر (60 ثانية)" : "Penalty Audit"}</span>
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
    <section id="faqs" className="py-20 bg-slate-50 border-t border-slate-100 scroll-mt-20 sm:scroll-mt-24">
      <AnimatedSection className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs text-gold-600 font-bold uppercase tracking-widest block">
            {t.faqs.badge}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
            {t.faqs.title}
          </h2>
          <p className="text-slate-500 text-sm">
            {t.faqs.subtitle}
          </p>
        </div>

          {/* Accordion List */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {(faqsData || []).map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1.5">
                      {faq.category && (
                        <span className="inline-block bg-navy-50 text-navy-800 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          {faq.category}
                        </span>
                      )}
                      <h3 className="font-display text-sm sm:text-base font-bold text-navy-950 hover:text-gold-600 transition-colors duration-200">
                        {faq.question}
                      </h3>
                    </div>
                    <span 
                      className={`flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 transition-transform duration-300 ${
                        isOpen ? "transform rotate-180 bg-gold-500 text-navy-950" : "group-hover:bg-slate-100"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {/* Collapsible Answer Body */}
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100 border-t border-slate-50" : "max-h-0 opacity-0 pointer-events-none"
                    } overflow-hidden`}
                  >
                    <div className="p-6 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 bg-slate-50/40">
                      <p>{faq.answer}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-[10px] text-slate-400 font-medium">Still have questions?</span>
                        <a href="#contact" className="text-[10px] text-gold-600 hover:text-gold-700 font-bold flex items-center gap-0.5 transition-colors">
                          Speak with our team <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Regulatory Search Banner in FAQ */}
          <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 rounded-3xl p-6 sm:p-8 text-white max-w-3xl mx-auto border border-gold-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left rtl:sm:text-right">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles className="w-6 h-6 text-gold-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start rtl:sm:justify-end flex-wrap">
                  <h4 className="font-display font-bold text-base text-white">
                    {language === "ar" ? "هل لديك سؤال حول قانون ضريبي أو موعد محدد؟" : "Have a specific UAE tax regulation or penalty question?"}
                  </h4>
                  <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                    Google Grounded
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {language === "ar"
                    ? "ابحث فورياً عبر مساعد الذكاء الاصطناعي المدعوم ببيانات بحث Google وقرارات الهيئة الاتحادية للضرائب."
                    : "Ask our live Search-Grounded AI assistant to retrieve official 2025/2026 Cabinet Decisions & circulars."}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenTaxAi()}
              className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-navy-950 font-display font-bold py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 w-full sm:w-auto"
            >
              <Globe className="w-4 h-4 text-navy-950" />
              <span>{language === "ar" ? "فتح البحث الضريبي المباشر" : "Ask Live Tax AI"}</span>
            </button>
          </div>

        </AnimatedSection>
      </section>

      {/* 7. Blogs / News Section */}
      <section id="blogs" className="py-20 bg-white scroll-mt-20 sm:scroll-mt-24">
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-gold-600 font-bold uppercase tracking-widest block">
                UAE Financial Intelligence
              </span>
              <button
                onClick={() => setSeoDashboardOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy-900 text-gold-300 hover:text-gold-200 hover:bg-navy-950 rounded-full text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                title="Open SEO Content Engine & Cloud Function Monitor"
              >
                <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" />
                <span>SEO Content Engine &amp; 24h Cloud Function</span>
              </button>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
              Regulatory Insights & Advisories
            </h2>
            <p className="text-slate-500 text-sm">
              Read actionable expert guides on the Federal Tax Authority rules, VAT recovery procedures, and general business licensing inside the UAE.
            </p>
          </div>

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(allBlogs || []).map((blog, idx) => (
              <div
                key={blog.id}
                className={`bg-white border ${idx === 0 ? "border-gold-400/80 shadow-md ring-1 ring-gold-400/20" : "border-slate-200/60 shadow-sm"} rounded-3xl overflow-hidden hover:shadow-lg hover:border-gold-400 transition-all hover:-translate-y-1 flex flex-col cursor-pointer group`}
                onClick={() => setSelectedBlog(blog)}
              >
                {/* Visual Header */}
                <div className="bg-navy-900 p-6 flex flex-col justify-between h-48 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10">
                    <BookOpen className="w-40 h-40 transform translate-x-12 translate-y-12" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-white/15 text-gold-300 font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/5 self-start backdrop-blur-md">
                      {blog.tag}
                    </span>
                    {blog.isAiGenerated ? (
                      <span className="text-[10px] bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        24h AI Grounded
                      </span>
                    ) : idx === 0 ? (
                      <span className="text-[10px] bg-gradient-to-r from-amber-400 to-gold-400 text-navy-950 font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                        Daily Briefing
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xs text-slate-400 font-medium flex justify-between">
                    <span>{blog.date}</span>
                    <span>{blog.readTime}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-2 mb-6">
                    <h3 className="font-display text-base font-bold text-navy-950 group-hover:text-gold-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                      {blog.summary}
                    </p>
                  </div>

                  {/* Author detail */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={blog.author.avatar}
                        alt={blog.author.name}
                        width={32}
                        height={32}
                        loading="lazy"
                        decoding="async"
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div className="leading-tight">
                        <span className="block text-[11px] font-bold text-navy-900">{blog.author.name}</span>
                        <span className="text-[9px] text-slate-400 font-medium">{blog.author.role}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-display font-bold text-gold-600 group-hover:text-gold-700 transition-all flex items-center gap-1 group-hover:translate-x-1">
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Blog Read Modal Popup (Lazy-Loaded to reduce main mobile JS bundle) */}
          <React.Suspense fallback={null}>
            {selectedBlog && (
              <BlogModal
                blog={selectedBlog}
                onClose={() => setSelectedBlog(null)}
              />
            )}
          </React.Suspense>

        </AnimatedSection>
      </section>

      {/* 8. Contact Us & Consultation Scheduler */}
      <section id="contact" className="py-20 bg-slate-50 border-t border-slate-100 scroll-mt-20 sm:scroll-mt-24">
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs text-gold-600 font-bold uppercase tracking-widest block">
              Inquire or Reserve Call
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
              Get Started with Your Free Consultation
            </h2>
            <p className="text-slate-500 text-sm">
              Submit your corporate details directly to our team, or write to us below and we will get back to you within 2 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Scheduler Form */}
            <div className="lg:col-span-7">
              <LazyMount minHeight={560} sectionId="contact">
                <React.Suspense fallback={<div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 min-h-[560px] flex items-center justify-center text-slate-400 text-xs animate-pulse">Loading Consultation Scheduler...</div>}>
                  <Scheduler preselectedService={preselectedServiceTitle} />
                </React.Suspense>
              </LazyMount>
            </div>

            {/* Right Column: Traditional contact + Map Mockup */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              
              {/* Info Blocks */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
                <h4 className="font-display text-xl font-bold text-navy-950">Corporate Headquarters</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Dias Accounting is centrally registered in Sharjah, supporting enterprises across Sharjah, Dubai, Abu Dhabi, and other UAE emirates.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-3.5 items-start">
                    <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-600 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Office Address</span>
                      <p className="text-slate-700 font-medium text-xs mt-0.5">
                        Sharjah Media City (Shams), Sharjah, United Arab Emirates
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-600 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Call Advisory</span>
                      <p className="text-slate-700 font-medium text-xs mt-0.5">
                        +971 52 922 6958
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-600 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Secure Email</span>
                      <p className="text-slate-700 font-medium text-xs mt-0.5">
                        info@diasuae.ae
                      </p>
                    </div>
                  </div>

                  {/* Google Add to Preferred Sources Badge */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-start">
                    <AddToPreferredSources onClick={() => setGooglePreferredModalOpen(true)} />
                  </div>
                </div>
              </div>

              {/* Real Google Maps Office Locator & Coverage */}
              <GoogleOfficeMap language={language} />

            </div>

          </div>

        </AnimatedSection>
      </section>
      </main>

      {/* 9. Footer */}
      <footer role="contentinfo" className="bg-navy-950 text-white border-t border-white/5 pt-16 pb-8">
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Bio Column */}
            <div className="md:col-span-4 space-y-4 text-center md:text-left">
              <DiasLogo className="w-12 h-12" showText={true} textSize="text-2xl" textColor="text-white" />
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto md:mx-0">
                At Dias Accounting, we don't just crunch numbers—we engineer growth. Offering legally optimized corporate bookkeeping, VAT compliance, corporate tax registration, and business setup structures inside the UAE.
              </p>
              <div className="text-[10px] text-slate-500">
                <span>Registrations: </span>
                <span className="font-mono text-gold-400">Trade Licence: 2646813.01</span>
              </div>
              {/* Social Connections & Google Profile */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
                <a
                  href={GOOGLE_BUSINESS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-gold-400/50 hover:bg-gold-500/10 hover:text-gold-400 flex items-center gap-1.5 text-xs text-slate-300 transition-all duration-300"
                  title="Dias Accounting Google Business Profile"
                >
                  <GoogleLogo className="w-3.5 h-3.5" />
                  <span className="font-semibold text-amber-400">5.0 ★</span>
                  <span className="text-[11px] text-slate-400">Google Reviews</span>
                </a>
                <a
                  href="https://www.linkedin.com/company/diasaccounting/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-gold-400/50 hover:bg-gold-500/10 hover:text-gold-400 flex items-center justify-center text-slate-400 transition-all duration-300"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/diasuae.ae/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-gold-400/50 hover:bg-gold-500/10 hover:text-gold-400 flex items-center justify-center text-slate-400 transition-all duration-300"
                  aria-label="Instagram Profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/diasuae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-gold-400/50 hover:bg-gold-500/10 hover:text-gold-400 flex items-center justify-center text-slate-400 transition-all duration-300"
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
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-slate-300">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li><a href="#home" className="hover:text-gold-300 transition-colors">Home Base</a></li>
                <li><a href="#about" className="hover:text-gold-300 transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-gold-300 transition-colors font-semibold">Our Services</a></li>
                <li><a href="#pricing" className="hover:text-gold-300 transition-colors">Pricing Structure</a></li>
                <li><a href="#blogs" className="hover:text-gold-300 transition-colors">Regulatory Blogs</a></li>
                <li><a href="#contact" className="hover:text-gold-300 transition-colors">Consult Advisory</a></li>
              </ul>
            </div>

            {/* Services Links Column */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-slate-300">
                Advisory Practices
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#services" className="hover:text-gold-300 transition-colors block">Corporate Tax Registration (9%)</a></li>
                <li><a href="#services" className="hover:text-gold-300 transition-colors block">VAT Return Preparation (5%)</a></li>
                <li><a href="#services" className="hover:text-gold-300 transition-colors block">Double-Entry Ledger Maintenance</a></li>
                <li><a href="#services" className="hover:text-gold-300 transition-colors block">Sharjah Media City Incorporation</a></li>
                <li><a href="#services" className="hover:text-gold-300 transition-colors block">Mainland Licensing & DED Visas</a></li>
              </ul>
            </div>

            {/* Legal compliance / Address Column */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-slate-300">
                Corporate Location
              </h4>
              <div className="space-y-2 text-xs text-slate-400">
                <p className="leading-relaxed">
                  Sharjah Media City (Shams),<br />
                  Sharjah, United Arab Emirates
                </p>
                <div className="pt-2 space-y-1 font-semibold text-[11px] text-slate-300">
                  <span className="block">Tel: +971 52 922 6958</span>
                  <span className="block">Email: info@diasuae.ae</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Terms block */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} Dias Accounting and Tax Consulting. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-300 transition-colors">Regulatory Disclaimers</a>
              <span>•</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setPrivacyOpen(true);
                }}
                className="hover:text-slate-300 transition-colors cursor-pointer focus:outline-none"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <a href="#" className="hover:text-slate-300 transition-colors">FTA Agreements</a>
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
