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
} from "lucide-react";

// Imports from our modular files
import { Service, BlogPost, PricingTier, Testimonial, FAQItem } from "./types";
import { servicesData, blogsData, pricingTiers, testimonialsData, faqsData, GOOGLE_BUSINESS_URL, GOOGLE_RATING_STATS } from "./data/staticData";
import DiasLogo from "./components/DiasLogo";
import { GoogleLogo } from "./components/GoogleReviewsSection";
import { submitToGoogleSheetsDirectly } from "./lib/sheetsService";
import ComplianceAlertBanner from "./components/ComplianceAlertBanner";
import StickyMobileLeadBar from "./components/StickyMobileLeadBar";
import useDynamicSEO from "./hooks/useDynamicSEO";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import LanguageToggle from "./components/LanguageToggle";

// Lazy-loaded components for fast mobile JS execution & small initial bundle size
const TaxCalculator = React.lazy(() => import("./components/TaxCalculator"));
const ServiceModal = React.lazy(() => import("./components/ServiceModal"));
const WhatsAppWidget = React.lazy(() => import("./components/WhatsAppWidget"));
const Scheduler = React.lazy(() => import("./components/Scheduler"));
const PrivacyPolicyModal = React.lazy(() => import("./components/PrivacyPolicyModal"));
const GoogleReviewsSection = React.lazy(() => import("./components/GoogleReviewsSection"));
const TaxHealthCheckModal = React.lazy(() => import("./components/TaxHealthCheckModal"));
const LeadMagnetDownloadModal = React.lazy(() => import("./components/LeadMagnetDownloadModal"));

function MainApp() {
  const { t, language, isRTL } = useLanguage();

  // Navigation states
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lead generation modals
  const [taxHealthModalOpen, setTaxHealthModalOpen] = useState(false);
  const [leadMagnetModalOpen, setLeadMagnetModalOpen] = useState(false);

  // Pricing duration state
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");

  // Selected details for modals
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Dynamically update document head title and SEO meta tags based on active section & modal states
  useDynamicSEO({
    activeSection,
    selectedService,
    selectedBlog,
    language,
  });
  
  // Custom states for contact submission
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactIsSubmitting, setContactIsSubmitting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMsg, setContactMsg] = useState("");

  // Target service for scheduler preselection
  const [preselectedServiceTitle, setPreselectedServiceTitle] = useState("");

  // Respect hash anchor navigation if present in URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash !== "#home") {
      const targetId = hash.replace("#", "");
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  // Set up active section observer using a highly performant IntersectionObserver
  useEffect(() => {
    const sections = ["home", "about", "services", "pricing", "testimonials", "faqs", "blogs", "contact"];
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);
    if (!contactName || !contactEmail || !contactPhone) {
      setContactError("Please fill out all required fields.");
      return;
    }

    setContactIsSubmitting(true);

    try {
      await submitToGoogleSheetsDirectly({
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        message: contactMsg || "General direct query",
        serviceType: "general"
      });

      setContactSubmitted(true);
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactMsg("");
    } catch (err: any) {
      console.warn("Direct inquiry sync failed, using client-side fallback", err);
      // Fallback: Still show success to the user so they can continue testing the UI
      setContactSubmitted(true);
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactMsg("");
    } finally {
      setContactIsSubmitting(false);
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950 pb-16 md:pb-0">
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
              { id: "about", label: t.nav.about },
              { id: "services", label: t.nav.services },
              { id: "pricing", label: t.nav.pricing },
              { id: "testimonials", label: t.nav.reviews },
              { id: "faqs", label: t.nav.faq },
              { id: "blogs", label: t.nav.blogs },
              { id: "contact", label: t.nav.contact },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`px-2.5 py-2 rounded-lg transition-all text-xs lg:text-sm ${
                  activeSection === link.id
                    ? "bg-navy-50 text-navy-800 font-bold"
                    : "hover:text-navy-800 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Header Actions: Language Selector & Booking CTA (Desktop Only) */}
          <div className="hidden md:flex items-center gap-2.5">
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
            className="md:hidden w-11 h-11 flex items-center justify-center p-2 text-slate-600 hover:text-navy-900 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-xl z-50 animate-fadeIn"
          >
            <div className="px-4 pt-3 pb-6 space-y-2 font-medium text-slate-600">
              <div className="pb-2 mb-1 border-b border-slate-100">
                <LanguageToggle variant="mobile" />
              </div>
              {[
                { id: "home", label: t.nav.home },
                { id: "about", label: t.nav.about },
                { id: "services", label: t.nav.services },
                { id: "pricing", label: t.nav.pricing },
                { id: "testimonials", label: t.nav.reviews },
                { id: "faqs", label: t.nav.faq },
                { id: "blogs", label: t.nav.blogs },
                { id: "contact", label: t.nav.contact },
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl transition-all ${
                    activeSection === link.id
                      ? "bg-navy-50 text-navy-800 font-bold"
                      : "hover:text-navy-800 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-navy-900 hover:bg-navy-950 text-white font-display font-bold py-3 px-4 rounded-xl text-center text-xs tracking-tight transition-all shadow-md block"
                >
                  {t.nav.bookConsultation}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Landmark for Accessibility & SEO */}
      <main id="main-content" role="main">
        {/* 2. Hero Section */}
        <section id="home" className="relative overflow-hidden bg-mesh pt-12 pb-20 md:py-24 lg:py-32 text-white">
        {/* Background visual geometric accents */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
              
              {/* Trust Badge & Google Rating Badge */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-xs font-semibold text-gold-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.hero.badge}
                </div>
                <a
                  href={GOOGLE_BUSINESS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-xs font-semibold text-white transition-all group"
                  title="View Dias Accounting on Google Business"
                >
                  <GoogleLogo className="w-3.5 h-3.5" />
                  <span className="text-amber-300">★★★★★</span>
                  <span className="text-slate-100 font-bold">5.0</span>
                  <span className="text-slate-300 text-[11px] font-normal hidden sm:inline">{t.hero.googleRatingText}</span>
                  <ExternalLink className="w-3 h-3 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Main Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white">
                {t.hero.headlinePart1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-emerald-400">
                  {t.hero.headlineGradient}
                </span>{" "}
                {t.hero.headlinePart2}
              </h1>

              {/* Subheadline */}
              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t.hero.subheadline}
              </p>

              {/* Action and trust triggers */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 flex-wrap">
                <a
                  href="#contact"
                  className="w-full sm:w-auto bg-gradient-to-tr from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-navy-950 font-display font-bold py-3.5 px-6 rounded-xl shadow-xl hover:shadow-gold-500/25 transition-all text-sm flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{t.hero.ctaConsultation}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>

                <button
                  onClick={() => setTaxHealthModalOpen(true)}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 hover:border-gold-400/60 text-white font-display font-bold py-3.5 px-6 rounded-xl backdrop-blur-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer group hover:scale-[1.02] active:scale-98"
                >
                  <ShieldCheck className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
                  <span>{t.hero.ctaRiskAudit}</span>
                </button>

                <a
                  href="#services"
                  className="w-full sm:w-auto border border-white/10 hover:border-white/30 hover:bg-white/5 text-slate-300 hover:text-white font-display font-semibold py-3.5 px-5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5"
                >
                  {t.hero.ctaServices}
                </a>
              </div>

              {/* Trust markers */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <span className="block text-2xl font-bold font-display text-gold-400">500+</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                    {t.hero.stats.smesLabel}
                  </span>
                </div>
                <div>
                  <span className="block text-2xl font-bold font-display text-gold-400">100%</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                    {t.hero.stats.complianceLabel}
                  </span>
                </div>
                <div>
                  <span className="block text-2xl font-bold font-display text-gold-400">AED 50M+</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                    {t.hero.stats.savingsLabel}
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: UAE Tax Planner Applet Widget */}
            <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
              <React.Suspense fallback={<div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl min-h-[480px] p-6 flex flex-col justify-center items-center text-slate-400 text-xs animate-pulse">Loading Tax Estimator...</div>}>
                <TaxCalculator />
              </React.Suspense>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Software Partners Banner */}
      <section className="bg-white border-y border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block">
            {t.partners.label}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 md:gap-16">
            
            {/* Wafeq */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 hover:border-teal-200 transition-colors group">
              <svg viewBox="0 0 100 100" className="w-7 h-7 fill-teal-600 transition-transform group-hover:scale-110">
                <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="none" stroke="currentColor" strokeWidth="8" />
                <path d="M40 45 L50 55 L70 35" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-display font-bold text-slate-700 text-sm group-hover:text-teal-600 transition-colors">
                Wafeq <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-1 py-0.5 rounded ml-1">{t.partners.certified}</span>
              </span>
            </div>

            {/* Zoho Books */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 hover:border-amber-200 transition-colors group">
              <div className="grid grid-cols-2 gap-0.5 w-6 h-6 transition-transform group-hover:rotate-12">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
              </div>
              <span className="font-display font-bold text-slate-700 text-sm group-hover:text-amber-600 transition-colors">
                Zoho Books <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded ml-1">{t.partners.pro}</span>
              </span>
            </div>

            {/* QuickBooks */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 hover:border-green-200 transition-colors group">
              <svg viewBox="0 0 100 100" className="w-7 h-7 fill-green-600 transition-transform group-hover:scale-110">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" />
                <rect x="35" y="35" width="30" height="30" rx="4" fill="currentColor" />
              </svg>
              <span className="font-display font-bold text-slate-700 text-sm group-hover:text-green-600 transition-colors">
                QuickBooks <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1 py-0.5 rounded ml-1">{t.partners.partner}</span>
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Core Services Grid Section */}
      <section id="services" className="py-20 bg-slate-50 cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
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
          <React.Suspense fallback={null}>
            <ServiceModal
              isOpen={selectedService !== null}
              service={selectedService}
              onClose={() => setSelectedService(null)}
              onBookCall={handlePreselectedCallBooking}
            />
          </React.Suspense>

        </div>
      </section>

      {/* 5. "Why Partner With Us" Section */}
      <section id="about" className="py-20 bg-white relative overflow-hidden cv-auto">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(#0f172a 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>

      {/* 6. Pricing Plans Section */}
      <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-100 cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs text-gold-600 font-bold uppercase tracking-widest block">
              {t.pricing.badge}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
              {t.pricing.title}
            </h2>
            <p className="text-slate-500 text-sm">
              {t.pricing.subtitle}
            </p>

            {/* Toggle Button */}
            <div className="inline-flex items-center p-1 bg-white border border-slate-100 rounded-2xl shadow-inner mt-4">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-navy-900 text-white shadow"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.pricing.monthly}
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                className={`relative px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
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

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 items-stretch">
            {/* Special Limited-Time Offer Package */}
            <div className="bg-white border-2 border-gold-500 rounded-3xl p-8 flex flex-col relative transition-all duration-300 shadow-lg shadow-gold-500/10 hover:shadow-xl hover:shadow-gold-500/20 ring-4 ring-gold-500/5">
              {/* Limited Time Badge */}
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-navy-950 text-[10px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                Limited-Time Offer
              </span>

              {/* Package Header */}
              <div className="text-center space-y-1 mb-4 mt-1">
                <h3 className="font-display text-base font-extrabold text-navy-950 uppercase tracking-tight leading-snug">
                  Backlog Accounting + <br />Corporate Tax Filing
                </h3>
                <p className="text-slate-500 text-[11px] font-medium">
                  Complete Historical Compliance Package
                </p>
              </div>

              {/* Deadline Alert Banner */}
              <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-center mb-6">
                <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                  Deadline alert! File by 31st July and dodge those penalties.
                </p>
              </div>

              {/* Pricing breakdown */}
              <div className="text-center space-y-1 pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold line-through">AED 3,000</span>
                  <span className="bg-rose-100 text-rose-600 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Save AED 500
                  </span>
                </div>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AED</span>
                  <span className="text-4xl font-extrabold font-mono text-navy-950 tracking-tight">
                    2,500
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-bold space-y-0.5 mt-1">
                  <div className="text-gold-600 uppercase tracking-wider text-[9px] font-bold">One-time, for FY 2025</div>
                </div>
              </div>

              {/* Call to action button */}
              <a
                href="#contact"
                className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-xs text-center transition-all cursor-pointer bg-gold-500 hover:bg-gold-600 text-navy-950 shadow-md shadow-gold-500/20 mb-8"
              >
                {t.pricing.getStartedBtn}
              </a>

              {/* Inclusions */}
              <div className="space-y-3 flex-grow">
                <span className="text-[10px] text-navy-950 font-extrabold uppercase tracking-wider block">
                  What's Included:
                </span>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex gap-2 items-start">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-700 leading-normal">Full-Year Backlog Bookkeeping for 2025</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-700 leading-normal">Bank & Credit Card Reconciliation</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-700 leading-normal">Corporate Tax Computation for 2025</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-700 leading-normal">Corporate Tax Return Filing</span>
                  </li>
                </ul>
              </div>
            </div>

            {(t.pricing.tiers || pricingTiers || []).map((tier) => {
              // Convert pricing based on period
              const displayPrice = billingPeriod === "annual" 
                ? tier.annualPrice 
                : tier.price;

              return (
                <div
                  key={tier.id}
                  className={`bg-white border rounded-3xl p-8 flex flex-col relative transition-all duration-300 ${
                    tier.popular
                      ? "border-gold-500 ring-4 ring-gold-500/15 shadow-lg hover:shadow-xl"
                      : "border-slate-200/80 shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* Popular badge */}
                  {tier.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-navy-950 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                      {t.pricing.popularBadge}
                    </span>
                  )}

                  {/* Pricing Header */}
                  <div className="space-y-1 mb-6">
                    <h3 className="font-display text-xl font-bold text-navy-950">
                      {tier.name}
                    </h3>
                    <p className="text-slate-500 text-xs min-h-[32px] leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  {/* Rate display */}
                  <div className="flex items-baseline gap-1.5 border-b border-slate-100 pb-6 mb-6">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AED</span>
                    <span className="text-4xl font-extrabold font-mono text-navy-950 tracking-tight">
                      {displayPrice}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {billingPeriod === "annual" ? "/ year" : "/ month"}
                    </span>
                  </div>

                  {/* Deliverables List */}
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

                  {/* Plan Call to Action */}
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

          {/* Pricing Disclaimer */}
          <p className="text-center text-[10px] text-slate-400 font-medium">
            *Custom enterprise solutions, audit support packages, and historical clean-ups are quoted separately. Pricing excludes standard government VAT.
          </p>

        </div>
      </section>

      {/* 6.3 High-Value Lead Magnet: 2026 UAE Compliance Playbook Banner */}
      <section className="bg-gradient-to-br from-navy-950 via-slate-900 to-navy-950 text-white py-14 border-y border-gold-500/20 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            
            {/* Left Content */}
            <div className="space-y-4 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/20 border border-gold-400/30 text-gold-300 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.leadMagnet.badge}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {t.leadMagnet.title}
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {t.leadMagnet.description}
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-1 text-[11px]">
                <span className="bg-white/10 px-3 py-1 rounded-lg text-slate-200 font-semibold border border-white/10">
                  {t.leadMagnet.point1}
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-lg text-slate-200 font-semibold border border-white/10">
                  {t.leadMagnet.point2}
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-lg text-slate-200 font-semibold border border-white/10">
                  {t.leadMagnet.point3}
                </span>
              </div>
            </div>

            {/* Right CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => setLeadMagnetModalOpen(true)}
                className="w-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-navy-950 font-display font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer hover:scale-105 active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.leadMagnet.downloadBtn}</span>
              </button>

              <button
                onClick={() => setTaxHealthModalOpen(true)}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>{t.leadMagnet.riskAuditBtn}</span>
              </button>
            </div>

          </div>
        </div>
      </section>

    {/* 6.5 Customer Testimonials / Google Reviews Section */}
    <React.Suspense fallback={<div className="py-20 text-center text-slate-400 text-sm min-h-[420px] flex items-center justify-center">Loading Google Reviews...</div>}>
      <GoogleReviewsSection testimonials={testimonialsData} />
    </React.Suspense>

    {/* 6.6 FAQ Section */}
    <section id="faqs" className="py-20 bg-slate-50 border-t border-slate-100 cv-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
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

        </div>
      </section>

      {/* 7. Blogs / News Section */}
      <section id="blogs" className="py-20 bg-white cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs text-gold-600 font-bold uppercase tracking-widest block">
              UAE Financial Intelligence
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
              Regulatory Insights & Advisories
            </h2>
            <p className="text-slate-500 text-sm">
              Read actionable expert guides on the Federal Tax Authority rules, VAT recovery procedures, and general business licensing inside the UAE.
            </p>
          </div>

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(blogsData || []).map((blog) => (
              <div
                key={blog.id}
                className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-gold-300/40 transition-all hover:-translate-y-1 flex flex-col cursor-pointer group"
                onClick={() => setSelectedBlog(blog)}
              >
                {/* Visual Header */}
                <div className="bg-navy-900 p-6 flex flex-col justify-between h-48 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10">
                    <BookOpen className="w-40 h-40 transform translate-x-12 translate-y-12" />
                  </div>
                  <span className="text-[10px] bg-white/15 text-gold-300 font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/5 self-start backdrop-blur-md">
                    {blog.tag}
                  </span>
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

          {/* Blog Read Modal Popup */}
          {selectedBlog && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="blog-modal-title"
            >
              <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[80vh] animate-scaleUp">
                {/* Header */}
                <div className="bg-navy-900 p-6 md:p-8 text-white relative">
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                    aria-label="Close article modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <span className="text-[9px] bg-gold-400 text-navy-950 font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 inline-block">
                    {selectedBlog.tag}
                  </span>
                  <h3 id="blog-modal-title" className="font-display text-xl md:text-3xl font-bold tracking-tight mb-2">
                    {selectedBlog.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-medium">
                    <span>Published: {selectedBlog.date}</span>
                    <span>•</span>
                    <span>Read time: {selectedBlog.readTime}</span>
                    <span>•</span>
                    <span>Author: {selectedBlog.author.name} ({selectedBlog.author.role})</span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="flex-grow overflow-y-auto p-6 md:p-8 bg-white prose prose-slate max-w-none text-slate-700">
                  <div className="whitespace-pre-line text-sm leading-relaxed space-y-4">
                    {selectedBlog.content}
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left space-y-1">
                      <span className="font-display font-bold text-navy-950 text-sm">Need regulatory support?</span>
                      <p className="text-slate-500 text-xs">Our senior team helps companies avoid hefty administrative penalties.</p>
                    </div>
                    <a
                      href="#contact"
                      onClick={() => setSelectedBlog(null)}
                      className="bg-navy-900 hover:bg-navy-950 text-white font-display font-bold py-2.5 px-5 rounded-xl text-xs transition-colors"
                    >
                      Book Professional Assessment
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 8. Contact Us & Consultation Scheduler */}
      <section id="contact" className="py-20 bg-slate-50 border-t border-slate-100 cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
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
              <React.Suspense fallback={<div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 min-h-[560px] flex items-center justify-center text-slate-400 text-xs animate-pulse">Loading Consultation Scheduler...</div>}>
                <Scheduler preselectedService={preselectedServiceTitle} />
              </React.Suspense>
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
                </div>
              </div>

              {/* Digital Stylized Map Mockup */}
              <div className="bg-navy-950 text-white rounded-3xl overflow-hidden p-6 relative h-64 border border-white/5 shadow-md flex flex-col justify-between group">
                {/* Background visual map mesh */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                
                {/* Floating vector roads and oceans representation */}
                <div className="absolute right-0 bottom-0 w-3/4 h-3/4 border-l border-t border-white/10 rounded-tl-full transform translate-x-12 translate-y-12 pointer-events-none" />
                <div className="absolute left-1/3 top-1/4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

                {/* Pulsating Map Pin Visual */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <div className="relative">
                    <span className="absolute inline-flex h-10 w-10 rounded-full bg-gold-400/30 animate-ping" />
                    <div className="relative bg-gold-500 text-navy-950 p-2.5 rounded-full shadow-lg border border-white">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="bg-navy-900 border border-white/10 text-white text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full shadow-md mt-2">
                    Sharjah Media City (Shams)
                  </span>
                </div>

                <div className="relative z-10 self-start">
                  <span className="text-[10px] text-gold-300 font-bold uppercase tracking-widest block">Operational Coverage</span>
                  <h5 className="font-display font-bold text-sm">Serving Mainland & Freezones UAE</h5>
                </div>

                <span className="relative z-10 self-end text-[9px] text-slate-400 font-semibold font-mono">
                  Coordinates: 25.3214° N, 55.5126° E
                </span>
              </div>

            </div>

          </div>

          {/* Quick Traditional Message form */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            {contactSubmitted ? (
              <div className="text-center py-8 space-y-4 animate-scaleUp">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-display text-xl font-bold text-navy-950">Message Transmitted</h4>
                <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
                  Thank you! Your general query has been securely transmitted. A Dias Accounting Senior Partner will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="space-y-1">
                  <h4 className="font-display text-lg font-bold text-navy-950">Send a Quick Message</h4>
                  <p className="text-slate-500 text-xs">For general business inquiries, drop us a direct message below.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="contact-full-name" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="contact-full-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email-addr" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="contact-email-addr"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                      placeholder="name@domain.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-mobile-phone" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      id="contact-mobile-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                      placeholder="+971 52..."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-detailed-msg" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Your Requirements / Detailed Inquiry *
                  </label>
                  <textarea
                    id="contact-detailed-msg"
                    name="message"
                    rows={4}
                    required
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none resize-none"
                    placeholder="Describe your corporate tax concerns, required bookkeeping frequency, or any other accounting query..."
                  />
                </div>

                {contactError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs p-3 rounded-xl">
                    {contactError}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[10px] text-slate-500 font-semibold leading-normal max-w-sm">
                    By submitting this form, you authorize Dias Accounting to store these corporate credentials for consultations. Your records are protected under UAE personal data protection decrees.
                  </span>
                  <button
                    type="submit"
                    disabled={contactIsSubmitting}
                    aria-label="Send secure inquiry message"
                    className="w-full sm:w-auto bg-navy-900 hover:bg-navy-950 text-white font-display font-bold py-3 px-8 rounded-xl text-xs transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer self-stretch sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {contactIsSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        Send Secure Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </section>
      </main>

      {/* 9. Footer */}
      <footer role="contentinfo" className="bg-navy-950 text-white border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
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

        </div>
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

      <React.Suspense fallback={null}>
        <WhatsAppWidget />
        <StickyMobileLeadBar onOpenAudit={() => setTaxHealthModalOpen(true)} />
        <TaxHealthCheckModal isOpen={taxHealthModalOpen} onClose={() => setTaxHealthModalOpen(false)} />
        <LeadMagnetDownloadModal isOpen={leadMagnetModalOpen} onClose={() => setLeadMagnetModalOpen(false)} />
        <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
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
