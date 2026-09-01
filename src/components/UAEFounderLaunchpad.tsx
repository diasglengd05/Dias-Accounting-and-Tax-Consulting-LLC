import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Percent,
  Landmark,
  ArrowRight,
  Sparkles,
  Phone,
  Calendar,
  Download,
  Clock,
  Briefcase,
  HelpCircle,
  TrendingUp,
  CreditCard,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { submitToGoogleSheetsDirectly } from "../lib/sheetsService";

interface UAEFounderLaunchpadProps {
  onBookCall?: (serviceTitle?: string) => void;
  onOpenAudit?: () => void;
}

type JurisdictionType = "mainland-dubai" | "mainland-sharjah" | "mainland-abudhabi" | "freezone-dmcc" | "freezone-ifza" | "freezone-meydan" | "freezone-shams" | "freezone-rakez" | "freezone-other";
type RevenueTier = "pre-revenue" | "under-375k" | "375k-3m" | "over-3m";
type BusinessType = "services" | "ecommerce" | "trading" | "tech" | "consulting" | "general";

export const UAEFounderLaunchpad: React.FC<UAEFounderLaunchpadProps> = ({
  onBookCall,
  onOpenAudit,
}) => {
  const { language, isRTL } = useLanguage();

  // Wizard States
  const [jurisdiction, setJurisdiction] = useState<JurisdictionType>("freezone-dmcc");
  const [revenueTier, setRevenueTier] = useState<RevenueTier>("375k-3m");
  const [businessType, setBusinessType] = useState<BusinessType>("services");
  const [licenseAge, setLicenseAge] = useState<"new" | "under-1-year" | "established">("new");
  
  // Lead Capture State
  const [founderName, setFounderName] = useState("");
  const [founderPhone, setFounderPhone] = useState("");
  const [founderEmail, setFounderEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Computed compliance insights based on UAE tax laws
  const isFreeZone = jurisdiction.startsWith("freezone");
  const isSmallBusinessReliefEligible = revenueTier === "pre-revenue" || revenueTier === "under-375k" || revenueTier === "375k-3m";
  const isVatMandatory = revenueTier === "375k-3m" || revenueTier === "over-3m";
  const isVatVoluntary = revenueTier === "under-375k";

  const getJurisdictionLabel = (key: JurisdictionType) => {
    switch (key) {
      case "mainland-dubai":
        return language === "ar" ? "دبي - البر الرئيسي (DED)" : "Dubai Mainland (DED)";
      case "mainland-sharjah":
        return language === "ar" ? "الشارقة - البر الرئيسي (SEDD)" : "Sharjah Mainland (SEDD)";
      case "mainland-abudhabi":
        return language === "ar" ? "أبوظبي - البر الرئيسي (ADDED)" : "Abu Dhabi Mainland (ADDED)";
      case "freezone-dmcc":
        return "DMCC Free Zone (Dubai)";
      case "freezone-ifza":
        return "IFZA Dubai Free Zone";
      case "freezone-meydan":
        return "Meydan Free Zone (Dubai)";
      case "freezone-shams":
        return "Sharjah Media City (Shams)";
      case "freezone-rakez":
        return "RAKEZ (Ras Al Khaimah)";
      default:
        return language === "ar" ? "منطقة حرة أخرى في الإمارات" : "Other UAE Free Zone (DAFZA, DSOA, etc.)";
    }
  };

  const handleFounderLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!founderName || !founderPhone || !founderEmail) {
      setSubmitError(language === "ar" ? "يرجى ملء جميع الحقول المطلوبة." : "Please fill in all required contact details.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitToGoogleSheetsDirectly({
        name: founderName,
        email: founderEmail,
        phone: founderPhone,
        message: `UAE Founder Launchpad Assessment: Jurisdiction=${jurisdiction}, RevenueTier=${revenueTier}, Activity=${businessType}, LicenseAge=${licenseAge}, Company=${companyName || "New Setup"}`,
        serviceType: "Founder Launchpad & New License Setup",
      });

      setIsSubmitted(true);
    } catch (err) {
      console.warn("Founder lead submission fallback", err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Glen, I am a UAE Founder with a ${getJurisdictionLabel(jurisdiction)} license (${businessType}, estimated revenue: ${revenueTier}). I would like to get tax registration & monthly bookkeeping for my company.`
    );
    window.open(`https://wa.me/971529226958?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="founder-launchpad"
      className="py-16 sm:py-20 bg-gradient-to-b from-navy-950 via-slate-900 to-navy-950 text-white relative overflow-hidden"
    >
      {/* Decorative ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header with UAE Founder Focus */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Zap className="w-3.5 h-3.5 text-gold-400" />
            <span>
              {language === "ar"
                ? "منصة رواد الأعمال والشركات الجديدة في الإمارات 2026"
                : "UAE New Business & Founder Compliance Launchpad"}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {language === "ar" ? (
              <>
                حصلت على رخصتك التجارية؟ <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-emerald-300">
                  امتثل لضريبة الشركات، افتح حسابك البنكي، وتجنب غرامة 10,000 درهم
                </span>
              </>
            ) : (
              <>
                Got Your UAE Trade Licence? <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-emerald-300">
                  Stay 100% Tax Compliant, Open Bank Accounts & Claim 0% Relief
                </span>
              </>
            )}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {language === "ar"
              ? "صُممت هذه المنصة خصيصاً لمؤسسي الشركات وأصحاب الرخص الجديدة في دبي، الشارقة، أبوظبي، وكافة المناطق الحرة. احصل على خارطة طريق ضريبية ومحاسبية فورية خلال 60 ثانية."
              : "Built exclusively for startup founders, new LLC owners, and Free Zone license holders across Dubai, Sharjah, Abu Dhabi & beyond. Generate your instant 60-second compliance & tax roadmap."}
          </p>
        </div>

        {/* Interactive 2-Column Founder Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Configurator: 4 Quick Steps */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold text-xs">
                  1
                </div>
                <span className="font-display font-bold text-sm text-white">
                  {language === "ar" ? "حدد تفاصيل رخصتك التجارية" : "Configure Your UAE Business Profile"}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Instant Calculation
              </span>
            </div>

            {/* Step 1: Select Jurisdiction */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === "ar" ? "1. المنطقة وسلطة الترخيص" : "1. Licensing Authority / Jurisdiction"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: "freezone-dmcc", label: "DMCC (Dubai)" },
                  { id: "freezone-ifza", label: "IFZA Dubai" },
                  { id: "freezone-meydan", label: "Meydan (Dubai)" },
                  { id: "freezone-shams", label: "Shams (Sharjah)" },
                  { id: "mainland-dubai", label: "Dubai Mainland" },
                  { id: "mainland-sharjah", label: "Sharjah Mainland" },
                  { id: "mainland-abudhabi", label: "Abu Dhabi DED" },
                  { id: "freezone-rakez", label: "RAKEZ (RAK)" },
                  { id: "freezone-other", label: "Other Free Zone" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setJurisdiction(item.id as JurisdictionType)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all border text-center truncate cursor-pointer ${
                      jurisdiction === item.id
                        ? "bg-gold-500 text-navy-950 border-gold-400 font-bold shadow-md shadow-gold-500/20"
                        : "bg-slate-800/80 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Expected Annual Revenue */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === "ar" ? "2. حجم الإيرادات السنوية المتوقعة" : "2. Expected Annual Revenue (AED)"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "pre-revenue", label: "< AED 375,000", badge: "Pre-Revenue / Seed" },
                  { id: "under-375k", label: "AED 187.5k - 375k", badge: "Voluntary VAT Tier" },
                  { id: "375k-3m", label: "AED 375k - 3,000,000", badge: "0% Small Business Relief" },
                  { id: "over-3m", label: "> AED 3,000,000", badge: "Standard 9% Tax Tier" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRevenueTier(item.id as RevenueTier)}
                    className={`p-2.5 rounded-xl text-xs transition-all border text-left rtl:text-right cursor-pointer flex flex-col justify-between ${
                      revenueTier === item.id
                        ? "bg-navy-800/90 text-white border-gold-400 ring-1 ring-gold-400/50 shadow-md"
                        : "bg-slate-800/60 text-slate-300 border-white/10 hover:bg-slate-800"
                    }`}
                  >
                    <span className="font-bold text-xs">{item.label}</span>
                    <span className="text-[10px] text-gold-300 font-medium">{item.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Business Activity Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === "ar" ? "3. نوع النشاط التجاري" : "3. Business Activity / Industry"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "services", label: language === "ar" ? "خدمات واستشارات" : "Services & Agency" },
                  { id: "ecommerce", label: language === "ar" ? "تجارة إلكترونية" : "E-Commerce & Tech" },
                  { id: "trading", label: language === "ar" ? "تجارة واستيراد" : "General Trading" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBusinessType(item.id as BusinessType)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border text-center cursor-pointer transition-all ${
                      businessType === item.id
                        ? "bg-emerald-600/30 text-emerald-200 border-emerald-400 font-bold"
                        : "bg-slate-800/60 text-slate-400 border-white/10 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: License Stage */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === "ar" ? "4. عمر الرخصة التجارية" : "4. License Age / Status"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "new", label: language === "ar" ? "رخصة جديدة (< 3 أشهر)" : "New (< 3 months)" },
                  { id: "under-1-year", label: language === "ar" ? "3 - 12 شهراً" : "3 - 12 Months" },
                  { id: "established", label: language === "ar" ? "أكثر من سنة" : "1+ Year (Renewed)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLicenseAge(item.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border text-center cursor-pointer transition-all ${
                      licenseAge === item.id
                        ? "bg-purple-600/30 text-purple-200 border-purple-400 font-bold"
                        : "bg-slate-800/60 text-slate-400 border-white/10 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Dynamic Report & Lead Capture */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Instant Compliance Status Card */}
            <div className="bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest block">
                    {language === "ar" ? "تقرير الامتثال الضريبي الفوري" : "Instant Founder Assessment"}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white">
                    {getJurisdictionLabel(jurisdiction)}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              {/* 4 Core Pillars Output */}
              <div className="space-y-3.5 text-xs">
                
                {/* 1. Corporate Tax Obligation */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gold-300 font-bold">
                      <Building2 className="w-4 h-4 text-gold-400 shrink-0" />
                      <span>{language === "ar" ? "تسجيل ضريبة الشركات (EmaraTax)" : "Corporate Tax Registration"}</span>
                    </div>
                    <span className="bg-red-500/20 text-red-300 border border-red-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Mandatory by Law
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {language === "ar"
                      ? "جميع الشركات ملزمة بالتسجيل لدى الهيئة الاتحادية للضرائب بغض النظر عن الأرباح، لتجنب غرامة 10,000 درهم المفروضة على التأخير."
                      : "Mandatory for all UAE licenses regardless of revenue. FTA penalty of AED 10,000 applies for missed registration deadlines."}
                  </p>
                </div>

                {/* 2. Small Business Relief (SBR) Status */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold">
                      <Percent className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{language === "ar" ? "تسهيلات الأعمال الصغيرة (0% ضريبة)" : "Small Business Relief (0% Tax)"}</span>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {isSmallBusinessReliefEligible ? "Eligible (0% Tax)" : "Standard 9% Tax"}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isSmallBusinessReliefEligible
                      ? language === "ar"
                        ? "مؤهل قانونياً لدفع 0% ضريبة شركات طالما كانت الإيرادات السنوية أقل من 3,000,000 درهم (بشرط تقديم الإقرار السنوي)."
                        : "Eligible to treat taxable income as ZERO (0% tax) under Ministerial Decision No. 73, provided election is made in the tax return."
                      : language === "ar"
                        ? "تخضع الأرباح الصافية التي تتجاوز 375,000 درهم لنسبة 9% ضريبة شركات."
                        : "Standard 9% corporate tax applies on taxable profits exceeding AED 375,000."}
                  </p>
                </div>

                {/* 3. VAT Registration Requirement */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-300 font-bold">
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{language === "ar" ? "ضريبة القيمة المضافة (5% VAT)" : "5% VAT Requirement"}</span>
                    </div>
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {isVatMandatory ? "Mandatory (> AED 375k)" : isVatVoluntary ? "Voluntary (> AED 187.5k)" : "Exempt (< AED 187.5k)"}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isVatMandatory
                      ? language === "ar"
                        ? "التسجيل إلزامي خلال 30 يوماً من تجاوز إيراداتك حاجز 375,000 درهم لتجنب غرامة 20,000 درهم."
                        : "Mandatory registration required within 30 days of crossing AED 375,000 threshold to avoid AED 20,000 FTA fine."
                      : isVatVoluntary
                      ? language === "ar"
                        ? "يمكنك التسجيل طوعياً لاسترداد ضريبة المدخلات المدفوعة على نفقات التأسيس والإيجار."
                        : "Voluntary registration allowed to reclaim input VAT paid on startup setup expenses, hardware & rent."
                      : language === "ar"
                        ? "غير ملزم بالتسجيل حالياً. حافظ على السجلات المحاسبية لمراقبة حد التسجيل."
                        : "Registration exempt until taxable turnover reaches voluntary threshold."}
                  </p>
                </div>

                {/* 4. Corporate Bank Account Approval Readiness */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-300 font-bold">
                      <Landmark className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{language === "ar" ? "جاهزية فتح الحساب البنكي للشركات" : "Corporate Bank Account Readiness"}</span>
                    </div>
                    <span className="bg-purple-500/20 text-purple-300 border border-purple-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Wio / ENBD / Mashreq
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {language === "ar"
                      ? "تطلب البنوك الإماراتية عقود تأسيس متوافقة، إثباتات النشاط، ومخطط محاسبي منظم لتفادي تأخير أو رفض فتح الحساب."
                      : "UAE corporate banks require clean bookkeeping, MOA validation, and business substance proof. Dias Accounting provides official compliance verification."}
                  </p>
                </div>

              </div>
            </div>

            {/* Quick 1-Click Lead Form: Claim Founder Package */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gold-600 font-bold uppercase tracking-widest block">
                    {language === "ar" ? "باقة انطلاق رواد الأعمال" : "Founder Starter Package"}
                  </span>
                  <h4 className="font-display text-lg font-bold text-navy-950">
                    {language === "ar" ? "احصل على استشارة مجانية وعرض سعر مخصص" : "Get Free Founder Consultation & Tax Roadmap"}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Starting From</span>
                  <span className="font-display font-extrabold text-navy-900 text-lg">AED 950<span className="text-xs font-normal text-slate-500">/mo</span></span>
                </div>
              </div>

              {isSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h5 className="font-display font-bold text-emerald-950 text-base">
                    {language === "ar" ? "تم استلام طلبك بنجاح!" : "Founder Roadmap Requested!"}
                  </h5>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                    {language === "ar"
                      ? "سيتواصل معك المستشار الضريبي غلين دياز عبر الواتساب أو الهاتف خلال 15 دقيقة لتزويدك بالخطة الضريبية وبدء تسجيل شركتك."
                      : "Senior Tax Partner Glen Dias will contact you via WhatsApp/Phone within 15 minutes to review your trade license and start your EmaraTax onboarding."}
                  </p>
                  <button
                    type="button"
                    onClick={handleDirectWhatsApp}
                    className="mt-2 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{language === "ar" ? "محادثة فورية عبر واتساب الآن" : "Chat on WhatsApp Instantly"}</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFounderLeadSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        {language === "ar" ? "اسم المؤسس / الشريك *" : "Founder Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={founderName}
                        onChange={(e) => setFounderName(e.target.value)}
                        placeholder="e.g. John Doe / محمد"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        {language === "ar" ? "رقم الهاتف / واتساب *" : "Mobile / WhatsApp (+971) *"}
                      </label>
                      <input
                        type="tel"
                        required
                        value={founderPhone}
                        onChange={(e) => setFounderPhone(e.target.value)}
                        placeholder="+971 50 123 4567"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        {language === "ar" ? "البريد الإلكتروني للعمل *" : "Work Email *"}
                      </label>
                      <input
                        type="email"
                        required
                        value={founderEmail}
                        onChange={(e) => setFounderEmail(e.target.value)}
                        placeholder="founder@company.ae"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        {language === "ar" ? "اسم الشركة / الرخصة (اختياري)" : "Company / License Name (Optional)"}
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Acme Tech FZ-LLC"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
                      {submitError}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-navy-900 hover:bg-navy-950 text-white font-display font-bold py-3 px-5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Calendar className="w-4 h-4 text-gold-400" />
                          <span>{language === "ar" ? "طلب خارطة الامتثال والتسجيل" : "Claim Founder Compliance Pack"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleDirectWhatsApp}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-display font-semibold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{language === "ar" ? "واتساب مباشر" : "WhatsApp"}</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center">
                    {language === "ar"
                      ? "🔒 بياناتك محمية وفقاً لقانون حماية البيانات الشخصية الإماراتي. لا نرسل رسائل غير مرغوب فيها."
                      : "🔒 Guaranteed 100% confidential under UAE Federal Data Protection laws. Zero spam."}
                  </p>
                </form>
              )}
            </div>

          </div>

        </div>

        {/* Local UAE Jurisdictions & Free Zones Quick Banner */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 text-center space-y-2">
          <span className="text-[11px] text-gold-300 font-bold uppercase tracking-widest block">
            {language === "ar" ? "تغطية شاملة لجميع مناطق وهيئات الترخيص في دولة الإمارات" : "Certified Support Across All UAE Economic Departments & Free Zones"}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300 font-medium">
            {[
              "Dubai Economy & Tourism (DET / DED)",
              "DMCC (Dubai Multi Commodities Centre)",
              "IFZA Dubai",
              "Meydan Free Zone",
              "Sharjah Media City (Shams)",
              "RAKEZ (Ras Al Khaimah)",
              "DAFZA",
              "Abu Dhabi DED / ADGM",
              "Dubai South (DWC)",
              "JAFZA",
              "Dubai Silicon Oasis",
              "Ajman Media City",
            ].map((zone, i) => (
              <span
                key={i}
                className="bg-white/5 border border-white/10 hover:border-gold-400/40 px-2.5 py-1 rounded-lg text-[11px] text-slate-300 transition-colors"
              >
                {zone}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default UAEFounderLaunchpad;
