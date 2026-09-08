import React, { useState } from "react";
import {
  Award,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Building2,
  FileCheck,
  ArrowRight,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface CaseStudy {
  id: string;
  clientIndustry: string;
  clientIndustryAr: string;
  location: string;
  challenge: string;
  challengeAr: string;
  solution: string;
  solutionAr: string;
  resultMetric: string;
  resultMetricLabel: string;
  resultMetricLabelAr: string;
  secondaryMetric: string;
  serviceUsed: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "case-1",
    clientIndustry: "E-Commerce & Digital Marketplace",
    clientIndustryAr: "تجارة إلكترونية ومنصات رقمية",
    location: "IFZA Free Zone, Dubai",
    challenge: "Surpassed AED 3M revenue with unorganized multi-currency payment gateway ledgers (Stripe/Checkout) and faced urgent Corporate Tax registration deadline.",
    challengeAr: "تجاوزت الإيرادات 3 ملايين درهم مع فوضى في قيود بوابات الدفع متعددة العملات (Stripe/Checkout) واقتراب موعد التسجيل الإلزامي لضريبة الشركات.",
    solution: "Reconstructed 18 months of transactional data, automated Zoho Books integrations, applied Small Business Relief (SBR) for earlier periods, and submitted EmaraTax returns.",
    solutionAr: "إعادة بناء 18 شهراً من السجلات المحاسبية، ربط نظام زوهو بوكس تلقائياً، وتطبيق تسهيلات الشركات الصغيرة (SBR) لضمان نسبة 0% قانونية.",
    resultMetric: "AED 185,000",
    resultMetricLabel: "Tax & Penalty Savings",
    resultMetricLabelAr: "وفورات ضريبية وغرامات تم تجنبها",
    secondaryMetric: "100% FTA Audit Compliant",
    serviceUsed: "Corporate Tax & Backlog Accounting"
  },
  {
    id: "case-2",
    clientIndustry: "Cross-Border Logistics & Commodity Trading",
    clientIndustryAr: "شحن دولي وتجارة سلع",
    location: "DMCC Free Zone, JLT Dubai",
    challenge: "Complex cross-border import/export transactions triggering multiple FTA VAT reverse charge inquiries and risk of 9% standard tax on non-qualifying income.",
    challengeAr: "عمليات استيراد وتصدير معقدة أدت إلى استفسارات من الهيئة الاتحادية للضرائب حول آلية الاحتساب العكسي لضريبة القيمة المضافة وخطر فرض ضريبة 9%.",
    solution: "Structured Qualifying Free Zone Person (QFZP) substance framework, segmented local vs. international trading accounts, and produced DMCC approved audit reports.",
    solutionAr: "هيكلة متطلبات الشخص المؤهل في المنطقة الحرة (QFZP)، فصل حسابات التجارة المحلية عن الدولية، وإعداد تقارير تدقيق معتمدة لسلطة DMCC.",
    resultMetric: "0% Corporate Tax",
    resultMetricLabel: "Secured on Qualifying Income",
    resultMetricLabelAr: "تثبيت نسبة 0% على الدخل المؤهل",
    secondaryMetric: "Zero FTA Inquiries / Fines",
    serviceUsed: "0% QFZP Structuring & DMCC Audit"
  },
  {
    id: "case-3",
    clientIndustry: "Luxury Hospitality & Restaurant Group",
    clientIndustryAr: "مطاعم وضيافة راقية",
    location: "Downtown Dubai & Business Bay",
    challenge: "Legacy accounting firm left a 14-month backlog with missing POS reconciliations and missed quarterly VAT return submissions.",
    challengeAr: "تراكم 14 شهراً من السجلات غير المكتملة وفواتير نقاط البيع غير المطابقة مع التأخر في تقديم إقرارات ضريبة القيمة المضافة.",
    solution: "Rapid 10-day emergency backlog reconciliation, voluntary disclosure submission with FTA (Form 211), and successful waiver of late-payment penalty surcharges.",
    solutionAr: "خطة طوارئ استغرقت 10 أيام لإعادة مطابقة الحسابات، وتقديم إفصاح طوعي لدى الهيئة (Form 211) وإسقاط الغرامات الإدارية.",
    resultMetric: "AED 64,500",
    resultMetricLabel: "Administrative Fines Waived",
    resultMetricLabelAr: "غرامات إدارية تم إسقاطها",
    secondaryMetric: "5-Day Turnaround",
    serviceUsed: "VAT Voluntary Disclosure & Cleanup"
  }
];

export function ClientCaseStudies() {
  const { language } = useLanguage();

  return (
    <section id="case-studies" className="py-16 md:py-24 bg-navy-900 border-b border-slate-800 text-white relative overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>{language === "ar" ? "نتائج حقيقية وموثقة لعملائنا في الإمارات" : "Proven Client Results & E-E-A-T Track Record"}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {language === "ar" ? (
              <>
                كيف نساعد الشركات في دبي على <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-emerald-300">توفير الضرائب وتجنب الغرامات</span>
              </>
            ) : (
              <>
                How We Deliver Defensible Tax Savings & <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-emerald-300">Zero-Penalty Compliance in the UAE</span>
              </>
            )}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {language === "ar"
              ? "دراسات حالة موثقة تعكس كفاءتنا في تطبيق معايير الهيئة الاتحادية للضرائب، وقوانين ضريبة الشركات 9%، واسترداد ضريبة القيمة المضافة."
              : "Real, audit-verified case studies demonstrating our track record in FTA tax dispute resolutions, corporate tax reliefs, and statutory audits."}
          </p>
        </div>

        {/* Case Studies Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="bg-navy-950/80 border border-white/10 hover:border-gold-400/50 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] group text-left rtl:text-right"
            >
              <div className="space-y-4">
                {/* Industry & Location Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-gold-400">
                    {language === "ar" ? study.clientIndustryAr : study.clientIndustry}
                  </span>
                  <span className="text-[11px] text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full">
                    {study.location}
                  </span>
                </div>

                {/* Challenge */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                    {language === "ar" ? "التحدي:" : "Challenge:"}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === "ar" ? study.challengeAr : study.challenge}
                  </p>
                </div>

                {/* Solution */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                    {language === "ar" ? "الحل المقدم من دياس:" : "Dias Solution:"}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === "ar" ? study.solutionAr : study.solution}
                  </p>
                </div>
              </div>

              {/* Bottom Result Box */}
              <div className="mt-6 pt-4 border-t border-white/10 bg-slate-900/60 rounded-2xl p-4 border border-white/5 space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-emerald-300">
                    {study.resultMetric}
                  </span>
                  <span className="text-[11px] text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md">
                    {study.secondaryMetric}
                  </span>
                </div>
                <span className="text-[11px] text-slate-300 font-medium block">
                  {language === "ar" ? study.resultMetricLabelAr : study.resultMetricLabel}
                </span>
                <span className="text-[10px] text-gold-400/80 font-mono block">
                  Service: {study.serviceUsed}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust CTA */}
        <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-gold-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left rtl:sm:text-right">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white">
              {language === "ar" ? "هل ترغب في تقييم وضع شركتك الضريبي وتوفير التكاليف؟" : "Want Similar Measurable Results for Your UAE Business?"}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              {language === "ar"
                ? "تحدث مع مستشار ضريبي معتمد مجاناً لتقييم أهليتك لإعفاءات ضريبة الشركات 0% وتسهيلات الشركات الصغيرة."
                : "Schedule a confidential 30-minute consultation with FTA-registered senior consultants."}
            </p>
          </div>

          <a
            href="#contact"
            className="shrink-0 inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
          >
            <span>{language === "ar" ? "احجز استشارة مجانية" : "Book Free Strategy Call"}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}

export default ClientCaseStudies;
