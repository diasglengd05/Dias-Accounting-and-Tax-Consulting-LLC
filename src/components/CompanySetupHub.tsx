import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  FileCheck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Clock,
  Briefcase,
  Users,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface CompanySetupHubProps {
  onBookCall?: (serviceTitle?: string) => void;
  onOpenAudit?: () => void;
}

export const CompanySetupHub: React.FC<CompanySetupHubProps> = ({
  onBookCall,
  onOpenAudit,
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"mainland" | "freezone">("mainland");

  const handleConsultClick = (planName?: string) => {
    if (onBookCall) {
      onBookCall(planName || "Dubai Company Formation & Licensing");
    } else {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="company-setup" className="py-20 bg-slate-50 relative overflow-hidden border-t border-slate-100 scroll-mt-20">
      {/* Background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-navy-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header (Inspired by BCL.ae's signature formation header) */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-700 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-gold-600" />
            <span>{isAr ? "تأسيس وترخيص الشركات في الإمارات" : "Dubai & UAE Company Formation"}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight">
            {isAr ? "هل ترغب في تأسيس شركة في دبي؟" : "Want to set up Company in Dubai?"}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {isAr
              ? "حلول متكاملة وسلسة لتأسيس الشركات في البر الرئيسي والمناطق الحرة مع ملكية أجنبية 100% وإصدار فوري للتأشيرات وفتح الحسابات البنكية."
              : "Turnkey company formation across Dubai Mainland and premier Free Zones. Enjoy 100% foreign ownership, expedited residency visas, and guaranteed corporate banking support."}
          </p>
        </div>

        {/* 3 Core Pillars (Directly inspired by BCL.ae's 3-step setup framework) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          
          {/* Pillar 1: Residence Visas */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-gold-400 transition-all duration-200 group flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold-50 border border-gold-200/60 flex items-center justify-center text-gold-600 mb-5 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors shadow-sm">
                <Users className="w-6 h-6" />
              </div>

              <span className="text-xs font-mono font-bold text-gold-600 uppercase tracking-wider block mb-1">
                {isAr ? "الركيزة الأولى" : "Pillar 01"}
              </span>

              <h3 className="font-display text-xl font-bold text-navy-950 mb-3 group-hover:text-gold-600 transition-colors">
                {isAr ? "إصدار تأشيرات الإقامة للمستثمر والموظفين" : "Obtain 1 or 2 Residence Visas"}
              </h3>

              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                {isAr
                  ? "إصدار تأشيرات الإقامة الذهبية والمستثمر وتأشيرات الموظفين مع تسهيل الفحص الطبي VIP وإصدار بطاقة الهوية الإماراتية بسرعة قياسية."
                  : "Secure investor, partner, and employee residence visas with fast-track VIP medical typing, biometric scheduling, and Emirates ID issuance."}
              </p>

              <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "تأشيرات إقامة صالحة لمدة سنتين للمستثمرين" : "2-Year renewable investor residency"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "كفالة أفراد الأسرة والوالدين بسهولة" : "Family & dependent sponsorship support"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "تأهيل الإقامة الذهبية للمستثمرين المؤهلين" : "Golden Visa evaluation & processing"}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-gold-700">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {isAr ? "إصدار خلال 3 إلى 5 أيام" : "3-5 business days processing"}
              </span>
            </div>
          </div>

          {/* Pillar 2: Minimum Office Requirements */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-gold-400 transition-all duration-200 group flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-800 mb-5 group-hover:bg-navy-900 group-hover:text-gold-400 transition-colors shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>

              <span className="text-xs font-mono font-bold text-navy-800 uppercase tracking-wider block mb-1">
                {isAr ? "الركيزة الثانية" : "Pillar 02"}
              </span>

              <h3 className="font-display text-xl font-bold text-navy-950 mb-3 group-hover:text-gold-600 transition-colors">
                {isAr ? "تأسيس الشركة بأقل متطلبات مكتبية" : "Set up with Minimum Office Needs"}
              </h3>

              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                {isAr
                  ? "اختر من بين حلول المكاتب المرنة (Flexi-desk) أو المكاتب الافتراضية الذكية دون الحاجة إلى تكبد تكاليف إيجار باهظة من البداية."
                  : "Launch compliant operations using smart flexi-desks, virtual business addresses, or dedicated corporate office spaces with zero wasted overhead."}
              </p>

              <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "عناوين تجارية معتمدة في دبي والشارقة" : "Registered prestigious UAE business address"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "عقود إيجار (إيجاري / عقد المنطقة الحرة)" : "Ejari & lease agreement drafting"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "ملكية أجنبية 100% دون وكيل محلي إلزامي" : "100% Foreign Ownership structures"}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-navy-800">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {isAr ? "رخصة فورية خلال 24 - 48 ساعة" : "Instant license in 24 - 48 hours"}
              </span>
            </div>
          </div>

          {/* Pillar 3: Corporate Bank Account */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-gold-400 transition-all duration-200 group flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                <CreditCard className="w-6 h-6" />
              </div>

              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                {isAr ? "الركيزة الثالثة" : "Pillar 03"}
              </span>

              <h3 className="font-display text-xl font-bold text-navy-950 mb-3 group-hover:text-emerald-700 transition-colors">
                {isAr ? "فتح الحساب البنكي وبدء النشاط" : "Open Corporate Bank Account"}
              </h3>

              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                {isAr
                  ? "تسهيل فتح الحسابات المصرفية الرقمية والتجارية متعددة العملات لدى كبرى البنوك الإماراتية مع إعداد ملف الامتثال البنكي (KYC)."
                  : "Fast-track multi-currency business bank accounts (AED, USD, EUR, GBP) with UAE tier-1 institutions and modern digital banking apps."}
              </p>

              <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "حسابات رقمية خلال 48 ساعة (Wio, Mashreq)" : "Digital accounts in 48 hrs (Wio, Mashreq NEO)"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "بنوك تقليدية كبرى (Emirates NBD, ADCB, FAB)" : "Tier-1 bank partnerships (Emirates NBD, ADCB)"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "تجهيز خطة العمل وملف مكافحة غسل الأموال" : "Full business plan & KYC dossier prep"}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isAr ? "دعم بنكي مباشر مضمون" : "Dedicated Banker Introduction"}
              </span>
            </div>
          </div>

        </div>

        {/* Mainland vs Free Zone Selector Card */}
        <div className="bg-navy-950 rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden border border-slate-800 shadow-xl">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Header & Animated Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono font-bold text-gold-400 uppercase tracking-widest block mb-0.5">
                  {isAr ? "المقارنة القانونية" : "Jurisdiction Selection"}
                </span>
                <h3 className="font-display text-lg sm:text-2xl font-bold text-white">
                  {isAr ? "البر الرئيسي أم المنطقة الحرة؟" : "Mainland vs. Free Zone"}
                </h3>
              </div>

              {/* Animated Tab Switcher */}
              <div className="inline-flex bg-white/10 p-1 rounded-xl border border-white/10 shrink-0 self-start sm:self-auto">
                <button
                  onClick={() => setActiveTab("mainland")}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer select-none ${
                    activeTab === "mainland" ? "text-navy-950" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {activeTab === "mainland" && (
                    <motion.div
                      layoutId="setupActiveTab"
                      className="absolute inset-0 bg-gold-400 rounded-lg shadow-sm"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{isAr ? "البر الرئيسي (دبي DET)" : "Dubai Mainland (DET)"}</span>
                </button>
                <button
                  onClick={() => setActiveTab("freezone")}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer select-none ${
                    activeTab === "freezone" ? "text-navy-950" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {activeTab === "freezone" && (
                    <motion.div
                      layoutId="setupActiveTab"
                      className="absolute inset-0 bg-gold-400 rounded-lg shadow-sm"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{isAr ? "المناطق الحرة (0% QFZP)" : "UAE Free Zones (0% QFZP)"}</span>
                </button>
              </div>
            </div>

            {/* Dynamic Content with Spring Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-3.5"
              >
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                  {activeTab === "mainland"
                    ? (isAr
                        ? "تتيح رخصة البر الرئيسي التجارة بحرية كاملة داخل السوق المحلي الإماراتي والتعاقدات الحكومية مع ملكية أجنبية 100% لكافة الأنشطة التجارية."
                        : "Trade freely anywhere in the UAE local mainland market, bid for government tenders, and establish retail or commercial locations across Dubai with 100% foreign ownership.")
                    : (isAr
                        ? "الخيار المثالي للتجارة الدولية والخدمات الرقمية مع ميزة 0% ضريبة شركات للدخل المؤهل وحزم مكاتب افتراضية مرنة بأقل التكاليف."
                        : "Ideal for tech startups, global consulting, international trade, and service providers. Benefit from 100% foreign equity, zero customs duties, and potential 0% Corporate Tax under QFZP rules.")
                  }
                </p>

                {/* 4 Crisp Key Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {(activeTab === "mainland" ? [
                    { en: "100% Foreign Ownership on commercial activities", ar: "ملكية أجنبية 100% لكافة الأنشطة التجارية" },
                    { en: "Unrestricted direct local UAE B2B & retail sales", ar: "حرية بيع وتوزيع غير مقيدة داخل السوق المحلي" },
                    { en: "Direct eligibility for UAE government contracts", ar: "أهلية مباشرة للمناقصات والعقود الحكومية" },
                    { en: "Small Business Relief 0% tax up to AED 3M", ar: "إعفاء الشركات الصغيرة (0% حتى 3 مليون درهم)" },
                  ] : [
                    { en: "0% Corporate Tax on Qualifying Income (QFZP)", ar: "0% ضريبة شركات للدخل المؤهل (QFZP)" },
                    { en: "Affordable flexi-desk & virtual office packages", ar: "حزم مكاتب مرنة وافتراضية بأقل التكاليف" },
                    { en: "Fast setup with zero upfront paid-up capital", ar: "تأسيس فوري بدون متطلبات رأس مال مدفوع" },
                    { en: "100% capital and profit repatriation to home country", ar: "إعادة كامل الأرباح ورأس المال بنسبة 100%" },
                  ]).map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${activeTab === "mainland" ? "text-gold-400" : "text-emerald-400"}`} />
                      <span className="leading-tight text-[11px]">{isAr ? item.ar : item.en}</span>
                    </div>
                  ))}
                </div>

                {/* Compact Bottom Action Bar */}
                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                  <span className="text-slate-400 text-xs">
                    {isAr
                      ? "تقييم مجاني لاختيار الهيئة والنشاط الأنسب لشركتك وتحديد الرسوم الدقيقة."
                      : "Free 15-minute advisory to match the optimal jurisdiction and exact formation fee."}
                  </span>

                  <button
                    onClick={() => handleConsultClick(activeTab === "mainland" ? "Dubai Mainland Company Setup" : "UAE Free Zone Company Setup")}
                    className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold py-2 px-3.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 text-xs cursor-pointer active:scale-95 shrink-0"
                  >
                    <span>{isAr ? "احجز استشارة التأسيس المجانية" : "Book Free Setup Advisory"}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CompanySetupHub;
