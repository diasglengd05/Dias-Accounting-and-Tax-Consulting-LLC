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
import PageNavigation from "./components/PageNavigation";
import PageFooter from "./components/PageFooter";
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
import { motion, type Variants } from "framer-motion";

// Lazy-loaded components for fast mobile JS execution & small initial bundle size
const GoogleOfficeMap = React.lazy(() => import("./components/GoogleOfficeMap"));
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
const ServicesPage = React.lazy(() => import("./pages/ServicesPage"));
const CompanySetupPage = React.lazy(() => import("./pages/CompanySetupPage"));
const PricingPage = React.lazy(() => import("./pages/PricingPage"));
const WhyChooseUsPage = React.lazy(() => import("./pages/WhyChooseUsPage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const TermsPage = React.lazy(() => import("./pages/TermsPage"));
const PrivacyPolicyPage = React.lazy(() => import("./pages/PrivacyPolicyPage"));
const BlogsPage = React.lazy(() => import("./pages/BlogsPage"));
const TestimonialsPage = React.lazy(() => import("./pages/TestimonialsPage"));
const FaqsPage = React.lazy(() => import("./pages/FaqsPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const TaxPlannerPage = React.lazy(() => import("./pages/TaxPlannerPage"));
const ServiceDetailPage = React.lazy(() => import("./pages/ServiceDetailPage"));
const CorporateTaxSavingsPage = React.lazy(() => import("./pages/CorporateTaxSavingsPage"));
const VatPlannerPage = React.lazy(() => import("./pages/VatPlannerPage"));
const FtaDeadlinesPage = React.lazy(() => import("./pages/FtaDeadlinesPage"));
import CookieConsentBanner from "./components/CookieConsentBanner";
import HomepagePricingSection from "./components/HomepagePricingSection";

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
  const [openPricingAddons, setOpenPricingAddons] = useState<Record<string, boolean>>({});

  const isAddonOpen = (key: string, defaultOpen = true) =>
    openPricingAddons[key] !== undefined ? openPricingAddons[key] : defaultOpen;
  const togglePricingAddon = (key: string, defaultOpen = true) => {
    setOpenPricingAddons((prev) => {
      const current = prev[key] !== undefined ? prev[key] : defaultOpen;
      return {
        ...prev,
        [key]: !current,
      };
    });
  };

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

  if (
    currentPath === "/difc-dtec-accounting" ||
    currentPath === "/dtec-accounting" ||
    currentPath === "/accounting-services-in-dtec"
  ) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading DIFC &amp; DTEC Hub...</div>}>
        <DifcDtecAccountingPage onNavigate={navigateTo} />
      </Suspense>
    );
  }

  if (
    currentPath === "/dividends-audit" ||
    currentPath === "/dividends-audit-dubai" ||
    currentPath === "/dividends-audit-uae"
  ) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Dividend Audit Hub...</div>}>
        <DividendsAuditPage onNavigate={navigateTo} />
      </Suspense>
    );
  }

  if (
    currentPath === "/business-incorporation-services" ||
    currentPath === "/business-incorporation"
  ) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Business Incorporation Services Hub...</div>}>
        <ServiceDetailPage
          serviceId="business-incorporation-services"
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
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Services Hub...</div>}>
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
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Service Practice Hub...</div>}>
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
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Company Setup Hub...</div>}>
        <CompanySetupPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/pricing") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Pricing Hub...</div>}>
        <PricingPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/uae-tax-planner" || currentPath === "/tax-planner" || currentPath === "/tax-calculator" || currentPath === "/calculator") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading UAE Tax Planner...</div>}>
        <TaxPlannerPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/corporate-tax-calculator" || currentPath === "/tax-savings" || currentPath === "/tax-savings-assessment") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Corporate Tax Savings Assessment...</div>}>
        <CorporateTaxSavingsPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/uae-vat-calculator" || currentPath === "/vat-calculator" || currentPath === "/vat-planner") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading UAE VAT Calculator...</div>}>
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
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading FTA Deadlines Calendar...</div>}>
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
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading About Dias...</div>}>
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
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Why Dias Hub...</div>}>
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
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Privacy Policy...</div>}>
        <PrivacyPolicyPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/terms" || currentPath === "/terms-of-service" || currentPath === "/terms-and-conditions") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Terms of Service...</div>}>
        <TermsPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/blogs" || currentPath === "/insights" || currentPath.startsWith("/blog/")) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Insights Hub...</div>}>
        <BlogsPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/testimonials" || currentPath === "/reviews") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Reviews Hub...</div>}>
        <TestimonialsPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/faqs" || currentPath === "/faq") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading FAQs Hub...</div>}>
        <FaqsPage
          onNavigate={navigateTo}
          onOpenAudit={() => setTaxHealthModalOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
        />
      </Suspense>
    );
  }

  if (currentPath === "/contact" || currentPath === "/book-consultation") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 font-sans">Loading Contact Desk...</div>}>
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
    <div className="mobile-container min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950 pb-24 md:pb-0">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-gold-500 focus:text-navy-950 focus:font-display focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>
      
      {/* Unified Multi-Page Header & Navigation */}
      <PageNavigation
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenAudit={() => setTaxHealthModalOpen(true)}
      />

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
            <div className="max-w-3xl">
              {/* Value Proposition, Authority Kicker & Primary Actions */}
              <div className="flex flex-col justify-between space-y-8 text-left rtl:text-right">
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
                      className="font-display text-3xl sm:text-5xl lg:text-[50px] font-bold tracking-tight text-white leading-[1.15]"
                      style={{ textWrap: "balance" } as React.CSSProperties}
                    >
                      Corporate Tax, VAT and Bookkeeping for UAE Businesses. Stay FTA-compliant without the stress.
                    </h1>

                    {/* Subheadline stating clearly who is served & what is done */}
                    <p className="text-base sm:text-lg font-medium text-gold-300 leading-relaxed">
                      Tailored for UAE SMEs, Free Zone companies, startups, and freelancers tired of hidden fees and hourly billing.
                    </p>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                      Dias Accounting &amp; Tax Consulting LLC is an FTA Registered Tax Agency in Dubai and Sharjah. We handle your monthly double-entry bookkeeping, quarterly VAT returns, and 9% Corporate Tax advisory under transparent flat-fee retainers starting at AED 500/month.
                    </p>
                  </div>
                </div>

                {/* Primary & Secondary Action Bar */}
                <div className="space-y-5 pt-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-xl">
                    {/* Primary CTA: Book a Free Consultation */}
                    <button
                      type="button"
                      onClick={() => navigateTo("/contact")}
                      className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold py-3.5 px-6 rounded-xl transition-all duration-150 flex items-center justify-center gap-2.5 text-sm whitespace-nowrap shrink-0 cursor-pointer shadow-lg shadow-gold-500/20"
                    >
                      <Calendar className="w-4 h-4 text-navy-950 shrink-0" />
                      <span>Book a Free Consultation</span>
                      <ArrowRight className="w-4 h-4 shrink-0 rtl:rotate-180" />
                    </button>

                    {/* Secondary CTA: Try the UAE Tax Planner */}
                    <button
                      type="button"
                      onClick={() => navigateTo("/uae-tax-planner")}
                      className="bg-white/10 hover:bg-white/20 border border-white/25 hover:border-gold-400/60 text-white font-display font-bold py-3.5 px-5 rounded-xl transition-all duration-150 text-sm flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Calculator className="w-4 h-4 text-gold-400 shrink-0" />
                      <span>Try the UAE Tax Planner</span>
                    </button>
                  </div>

                  {/* Secondary WhatsApp & Risk Audit Quick Links */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-300">
                    <a
                      href="https://wa.me/971529226958?text=Hi,%20I'd%20like%20to%20know%20more%20about%20your%20tax%20services."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gold-400 transition-colors flex items-center gap-1.5 font-medium underline underline-offset-4"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>WhatsApp Advisory Desk (+971 52 922 6958)</span>
                    </a>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <button
                      type="button"
                      onClick={() => setTaxHealthModalOpen(true)}
                      className="hover:text-gold-400 transition-colors underline underline-offset-4 cursor-pointer flex items-center gap-1.5 font-medium"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>Free 60s Penalty Risk Audit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Bar Directly Below Hero */}
            <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="block text-xl sm:text-2xl font-bold font-mono text-gold-400 tabular-nums">
                  15+ Years
                </span>
                <span className="text-xs text-slate-300 mt-1 block">
                  UAE Market Experience
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="block text-xl sm:text-2xl font-bold font-mono text-gold-400 tabular-nums">
                  50+ Businesses
                </span>
                <span className="text-xs text-slate-300 mt-1 block">
                  UAE Clients Served
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="block text-xl sm:text-2xl font-bold font-mono text-gold-400">
                  FTA Registered
                </span>
                <span className="text-xs text-slate-300 mt-1 block">
                  Tax Agency (Dubai &amp; Sharjah)
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="block text-xl sm:text-2xl font-bold font-mono text-gold-400 tabular-nums">
                  Google 5.0 ★
                </span>
                <span className="text-xs text-slate-300 mt-1 block">
                  From 48 Verified Client Reviews
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Core Services Grid Section - Structured BCL.ae Practice Architecture */}
        <section id="services" className="py-20 sm:py-24 bg-slate-50 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Section Header: Services at a Glance (4 Core Services Only) */}
            <AnimatedSection direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-8">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-mono text-gold-600 font-semibold uppercase tracking-wider block">
                  CORE PRACTICE AREAS
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
                  Services at a Glance
                </h2>
                <p className="text-slate-600 text-sm max-w-md leading-relaxed">
                  Four core disciplines tailored to keep UAE Mainland and Free Zone companies fully compliant, penalty-free, and audit-ready.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigateTo("/services")}
                className="text-xs font-display font-bold text-navy-950 hover:text-gold-600 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Full Practice Directory</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </AnimatedSection>

            {/* 4 Core Services Cards Only */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: "corporate-tax-advisory",
                  title: "Corporate Tax Registration and Filing",
                  num: "01",
                  icon: "TrendingUp",
                  desc: "Complete UAE Corporate Tax compliance for mainland LLCs and Free Zone entities. We manage EmaraTax registration, 0% Small Business Relief (SBR) elections up to AED 3M, and accurate 9% corporate return submissions.",
                  link: "/services/corporate-tax-advisory",
                },
                {
                  id: "vat-compliance",
                  title: "VAT Registration and Returns",
                  num: "02",
                  icon: "Percent",
                  desc: "End-to-end Value Added Tax compliance under FTA regulations. We handle timely quarterly VAT 201 filing, optimize legal input tax recovery, and safeguard against late registration penalties.",
                  link: "/services/vat-compliance",
                },
                {
                  id: "accounting-bookkeeping",
                  title: "Bookkeeping",
                  num: "03",
                  icon: "Calculator",
                  desc: "IFRS-compliant double-entry monthly bookkeeping by dedicated chartered accountants. Get reconciled ledgers, monthly Profit & Loss statements, and clean opening balance sheets without hidden fees.",
                  link: "/services/accounting-bookkeeping",
                },
                {
                  id: "auditing-assurance",
                  title: "Audit Readiness and Advisory",
                  num: "04",
                  icon: "ShieldCheck",
                  desc: "Pre-audit verification, balance sheet cleanup, and Free Zone renewal compliance. We prepare defensible audit files that satisfy external auditors, banks, and licensing authorities.",
                  link: "/services/auditing-assurance",
                },
              ].map((service) => (
                <article
                  key={service.id}
                  onClick={() => navigateTo(service.link)}
                  className="bg-white border border-slate-200/90 hover:border-gold-500 rounded-2xl p-7 flex flex-col justify-between group transition-all duration-200 hover:shadow-md cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-gold-600 transition-colors tabular-nums">
                        {service.num}.
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center group-hover:bg-navy-950 group-hover:border-navy-950 transition-colors duration-200">
                        {getServiceIcon(service.icon)}
                      </div>
                    </div>

                    <h3 className="font-display text-lg font-bold text-navy-950 group-hover:text-gold-600 transition-colors duration-150 mb-2.5">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-6">
                      {service.desc}
                    </p>
                  </div>

                  <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo(service.link);
                      }}
                      className="text-navy-950 group-hover:text-gold-600 font-display font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{language === "ar" ? "تفاصيل الخدمة" : "Learn More"}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1 rtl:rotate-180" />
                    </button>
                    <a
                      href={`https://wa.me/971529226958?text=${encodeURIComponent(
                        language === "ar"
                          ? `مرحباً دياس للمحاسبة، أود استشارة حول خدمة "${service.title}".`
                          : `Hi, I'd like to consult with Dias Accounting regarding ${service.title}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy-950 text-white hover:bg-gold-500 hover:text-navy-950 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === "ar" ? "استشارة" : "Consult"}</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* HOW IT WORKS: 3-Step Process */}
            <div className="pt-12 pb-4">
              <div className="bg-navy-950 rounded-3xl p-8 sm:p-12 text-white border border-gold-500/20 shadow-xl">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider block mb-1">
                    SIMPLE 3-STEP ONBOARDING
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold">
                    How Working with Dias Works
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2">
                    Transparent, stress-free compliance without hourly billing or lengthy onboarding delays.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  {/* Step 1 */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative">
                    <span className="w-8 h-8 rounded-full bg-gold-500 text-navy-950 font-mono text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <h4 className="font-display font-bold text-base text-white">
                      Book a Free Consultation
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Connect with Glen Dias or our senior advisory team to discuss your business activity, revenue range, and upcoming tax deadlines.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative">
                    <span className="w-8 h-8 rounded-full bg-gold-500 text-navy-950 font-mono text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <h4 className="font-display font-bold text-base text-white">
                      We Review Books &amp; Set Up Compliance
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      We audit your ledgers, check 0% Small Business Relief eligibility, configure cloud software (Zoho, QuickBooks, Xero), and reconcile bank transactions.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative">
                    <span className="w-8 h-8 rounded-full bg-gold-500 text-navy-950 font-mono text-xs font-black flex items-center justify-center">
                      3
                    </span>
                    <h4 className="font-display font-bold text-base text-white">
                      Stress-Free Ongoing Filing &amp; Advisory
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Enjoy predictable flat-fee retainers, accurate quarterly VAT returns, timely Corporate Tax filings, and proactive penalty defense.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-300">
                    Ready to set up your 2026 financial compliance?
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateTo("/contact")}
                    className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                  >
                    Get Started with Step 1
                  </button>
                </div>
              </div>
            </div>

            {/* Authoritative 4-Pillar Tax & Accounting Practice Matrix (Semantic HTML5 SEO Content) */}
            <div className="pt-8 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-mono text-gold-600 font-semibold uppercase tracking-wider block">
                    Specialized Regulatory Practice Areas
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight mt-1">
                    Professional Tax and Accounting Services in Dubai &amp; UAE
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed">
                    Navigating the UAE&apos;s financial landscape requires certified expertise. Dias Accounting and Tax Consulting LLC provides end-to-end accounting services, statutory bookkeeping, and FTA-accredited tax advisory to keep your business fully compliant with Federal Decree-Law No. 47 of 2022 (Corporate Tax) and Federal Decree-Law No. 8 of 2017 (VAT).
                  </p>
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
                  <a
                    href="/pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/pricing");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-400 text-navy-950 hover:bg-gold-500 hover:text-navy-950 transition-colors"
                  >
                    Fixed-Fee Packages from AED 400/mo →
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
                    Corporate Tax Advisory, Tax Planning &amp; Tax Filing Services in UAE
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    As one of the premier <strong>tax firms in UAE</strong>, our <strong>tax advisory services in Dubai</strong> guide mainland LLCs and Free Zone enterprises through every phase of the UAE 9% Corporate Tax regime. We provide certified <strong>tax filing services in UAE</strong> on EmaraTax to eliminate the AED 10,000 late registration penalty under Cabinet Decision No. 75, provide strategic <strong>tax planning services in Dubai</strong>, evaluate <strong>Small Business Relief (0% tax on revenue up to AED 3,000,000)</strong>, and structure <strong>Qualifying Free Zone Person (QFZP)</strong> substance and Transfer Pricing documentation.
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
                    Taxation Services in Dubai &amp; VAT 201 Return Compliance UAE
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Our full-suite <strong>taxation services in Dubai</strong> cover mandatory (AED 375,000) and voluntary (AED 187,500) TRN registration, quarterly <strong>VAT 201 return filing</strong>, input VAT recovery maximization, Reverse Charge Mechanism (RCM) on cross-border services, FTA Voluntary Disclosures (Form 211), and penalty reconsideration submissions under certified <strong>tax consulting services in UAE</strong>.
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
                    Accounting Services UAE &amp; Tax Accounting Services in Dubai
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Top-tier <strong>accounting services in UAE</strong> and specialized <strong>tax accounting services</strong> for corporate consultants, commercial companies, and tech startups. Whether your enterprise needs ongoing monthly bookkeeping on Zoho Books, Xero, QuickBooks, or Wafeq, or rapid <strong>backlog accounting</strong> to reconstruct historical ledgers, our certified accountants deliver audit-ready Trial Balances, P&amp;L reports, and Balance Sheets.
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
                    Accounting Consulting in Dubai &amp; Free Zone Business Incorporation
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Strategic <strong>accounting consulting in Dubai</strong> and turnkey company setup across SHAMS, IFZA, DMCC, Meydan, DIFC, DTEC, and Dubai Mainland (DET). We handle trade licenses, corporate bank account onboarding, investor visa processing, and statutory financial audit coordination with transparent retainers starting from AED 400/month.
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



      {/* Official UAE Free Zone & Mainland Affiliations Section */}
      <AnimatedSection>
        <LazyMount minHeight={160}>
          <React.Suspense fallback={<div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading Affiliations...</div>}>
            <OurAffiliations />
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




      {/* 6. Pricing Plans Section - Matching Pricing & Packages */}
      <HomepagePricingSection
        billingPeriod={billingPeriod}
        setBillingPeriod={setBillingPeriod}
        pricingPath={pricingPath}
        setPricingPath={setPricingPath}
        onNavigate={navigateTo}
        language={language}
        onPreselectedCallBooking={handlePreselectedCallBooking}
      />

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

      {/* 6.5 Featured Testimonials Section */}
      <section id="testimonials" className="py-20 bg-slate-50 border-t border-slate-200/80 scroll-mt-20">
        <AnimatedSection className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <span className="text-xs font-mono text-gold-600 font-bold uppercase tracking-wider block mb-1">
                CLIENT SUCCESS STORIES
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950">
                What UAE Business Owners Say
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigateTo("/testimonials")}
              className="text-xs font-display font-bold text-navy-950 hover:text-gold-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View All Reviews &amp; Video Testimonials</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col justify-between hover:border-gold-400 transition-all">
              <div>
                <div className="flex items-center gap-1 text-gold-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                  "Dias Accounting took over our monthly books and filed our first UAE Corporate Tax return with zero stress. Their transparent fixed fees mean no surprises at the end of the month."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gold-500/15 text-navy-950 font-bold flex items-center justify-center font-mono text-[10px] shrink-0 border border-gold-400/30">
                  AT
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-navy-950">
                    Tareq Al-Mansoori
                  </h3>
                  <p className="text-xs text-slate-500">
                    Apex Tech Ventures LLC · Tech Investments (Business Bay, Dubai)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col justify-between hover:border-gold-400 transition-all">
              <div>
                <div className="flex items-center gap-1 text-gold-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                  "As a Free Zone startup founder, understanding whether we qualified for 0% SBR was confusing. Dias audited our setup, saved us substantial tax liability, and gave us total peace of mind."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gold-500/15 text-navy-950 font-bold flex items-center justify-center font-mono text-[10px] shrink-0 border border-gold-400/30">
                  CS
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-navy-950">
                    Elena Rostova
                  </h3>
                  <p className="text-xs text-slate-500">
                    Helios Global Logistics · Supply Chain (SHAMS &amp; Dubai)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

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

                  <a href="tel:+971529226958" className="flex gap-3.5 items-start hover:text-gold-600 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-gold-600 shrink-0 group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Direct Advisory Line (Tap to Call)</span>
                      <p className="text-navy-950 group-hover:text-gold-600 font-mono font-semibold text-xs mt-1">
                        +971 52 922 6958
                      </p>
                    </div>
                  </a>

                  <a href="mailto:info@diasuae.ae" className="flex gap-3.5 items-start hover:text-gold-600 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-gold-600 shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Official Client Desk (Mailto)</span>
                      <p className="text-navy-950 group-hover:text-gold-600 font-mono font-semibold text-xs mt-1">
                        info@diasuae.ae
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/971529226958?text=Hi,%20I'd%20like%20to%20know%20more%20about%20your%20tax%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp (+971 52 922 6958)</span>
                  </a>

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

      {/* 9. Unified Footer */}
      <PageFooter
        onNavigate={navigateTo}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenGooglePreferred={() => setGooglePreferredModalOpen(true)}
      />

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
        onNavigate={navigateTo}
        onBookConsultation={() => {
          navigateTo("/contact");
        }}
        onViewPricing={() => {
          navigateTo("/pricing");
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
            <StickyMobileLeadBar
              onOpenAudit={() => setTaxHealthModalOpen(true)}
              onNavigate={navigateTo}
            />
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
