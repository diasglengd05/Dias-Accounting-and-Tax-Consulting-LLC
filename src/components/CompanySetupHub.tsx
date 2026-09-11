import React, { useState } from "react";
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
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gold-50 border border-gold-200/60 flex items-center justify-center text-gold-600 mb-6 group-hover:bg-gold-500 group-hover:text-navy-950 transition-all duration-300 shadow-sm">
                <Users className="w-7 h-7" />
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
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-navy-900/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            
            <div>
              <div className="w-14 h-14 rounded-2xl bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-800 mb-6 group-hover:bg-navy-900 group-hover:text-gold-400 transition-all duration-300 shadow-sm">
                <Building2 className="w-7 h-7" />
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
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <CreditCard className="w-7 h-7" />
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
        <div className="bg-navy-950 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
              <div>
                <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
                  {isAr ? "المقارنة القانونية" : "Jurisdiction Selection"}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  {isAr ? "البر الرئيسي أم المنطقة الحرة؟ نحن نوجهك للأفضل" : "Mainland vs. Free Zone: Tailored to Your Model"}
                </h3>
              </div>

              {/* Tab Selector */}
              <div className="flex bg-white/10 p-1.5 rounded-2xl border border-white/10 shrink-0">
                <button
                  onClick={() => setActiveTab("mainland")}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "mainland"
                      ? "bg-gold-500 text-navy-950 shadow-md"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {isAr ? "البر الرئيسي (دبي DET)" : "Dubai Mainland (DET)"}
                </button>
                <button
                  onClick={() => setActiveTab("freezone")}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "freezone"
                      ? "bg-gold-500 text-navy-950 shadow-md"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {isAr ? "المناطق الحرة (SHAMS / Meydan / IFZA)" : "UAE Free Zones (0% QFZP)"}
                </button>
              </div>
            </div>

            {/* Dynamic Content Based on Selected Tab */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                {activeTab === "mainland" ? (
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-gold-300">
                      {isAr ? "ميزات تأسيس شركة في البر الرئيسي لدبي (Mainland)" : "Dubai Mainland (Department of Economy & Tourism)"}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {isAr
                        ? "تتيح رخصة البر الرئيسي التجارة بحرية داخل السوق المحلي الإماراتي والمشاركة في المناقصات الحكومية والتعاقد المباشر مع جميع الشركات دون قيود جغرافية، مع ملكية أجنبية بنسبة 100% لمعظم الأنشطة."
                        : "Trade freely anywhere in the UAE local mainland market, bid for government tenders, and establish retail or commercial locations across Dubai with 100% foreign ownership."}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-200 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                        <span>{isAr ? "حرية كاملة للبيع داخل السوق المحلي الإماراتي" : "Zero restrictions on local UAE direct retail & B2B trading"}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-200 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                        <span>{isAr ? "المشاركة في المناقصات والعقود الحكومية" : "Eligibility to bid on government & municipal contracts"}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-200 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                        <span>{isAr ? "عدد غير محدود من تأشيرات الإقامة حسب مساحة المكتب" : "Scalable employee visa quotas based on office space"}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-200 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                        <span>{isAr ? "الاستفادة من إعفاء الشركات الصغيرة (SBR حتى 3 مليون درهم)" : "Eligible for Small Business Relief up to AED 3M revenue"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-gold-300">
                      {isAr ? "ميزات تأسيس شركة في المناطق الحرة بالإمارات" : "UAE Top Free Zones (SHAMS, Meydan, IFZA, DMCC, RAKEZ)"}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {isAr
                        ? "المناطق الحرة هي الوجهة المثالية للشركات التقنية، والاستشارات الدولية، والتجارة الإلكترونية، حيث تتيح ملكية أجنبية 100%، وإمكانية الاستفادة من نسبة 0% ضريبة شركات للشخص المؤهل (QFZP)."
                        : "Ideal for tech startups, global consulting, international trade, and service providers. Benefit from 100% foreign equity, zero customs duties within free zones, and potential 0% Corporate Tax under Qualifying Free Zone Person (QFZP) rules."}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-200 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{isAr ? "0% ضريبة شركات للدخل المؤهل (QFZP)" : "0% Corporate Tax potential on Qualifying Income"}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-200 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{isAr ? "حزم مكاتب مرنة (Flexi-desk) منخفضة التكلفة" : "Affordable flexi-desk & virtual coworking packages"}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-200 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{isAr ? "إصدار فوري بدون الحاجة لرأس مال مدفوع" : "Fast incorporation without paid-up share capital upfront"}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-200 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{isAr ? "إعادة كاملة للأرباح ورأس المال إلى بلد المنشأ" : "100% repatriation of corporate capital and profits"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Callout action box */}
              <div className="lg:col-span-4 bg-white/10 rounded-2xl p-6 border border-white/15 text-center space-y-4">
                <div className="text-2xl font-bold font-mono text-gold-400">
                  {isAr ? "استشارة تأسيس مجانية" : "Free Formation Assessment"}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isAr
                    ? "تحدث مع مستشاري التأسيس والضرائب لتحديد الرخصة الأنسب لنشاطك بأقل تكلفة ممكنة."
                    : "Speak with our registered company setup & tax specialists to evaluate exact license costs, visa allocations, and banking pre-approvals."}
                </p>
                <button
                  onClick={() => handleConsultClick(activeTab === "mainland" ? "Dubai Mainland Company Setup" : "UAE Free Zone Company Setup")}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-display font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <span>{isAr ? "احجز استشارة التأسيس الآن" : "Book Free Setup Advisory"}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default CompanySetupHub;
