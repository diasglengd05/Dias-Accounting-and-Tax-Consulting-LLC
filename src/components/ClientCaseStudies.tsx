import React from "react";
import {
  Award,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface CaseStudy {
  id: string;
  metric: string;
  metricLabel: string;
  metricLabelAr: string;
  badge: string;
  badgeAr: string;
  industry: string;
  industryAr: string;
  location: string;
  takeaway: string;
  takeawayAr: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "case-1",
    metric: "AED 185k",
    metricLabel: "Tax & Penalties Saved",
    metricLabelAr: "وفورات ضريبية وغرامات تم تجنبها",
    badge: "100% FTA Compliant",
    badgeAr: "امتثال كامل للهيئة",
    industry: "E-Commerce Platform",
    industryAr: "منصة تجارة إلكترونية",
    location: "IFZA Dubai",
    takeaway: "Reconstructed 18 months of multi-currency Stripe ledgers, automated Zoho Books, and secured 0% Small Business Relief.",
    takeawayAr: "إعادة بناء 18 شهراً من قيود بوابات الدفع متعددة العملات وأتمتة الحسابات وتأمين إعفاء الشركات الصغيرة (SBR)."
  },
  {
    id: "case-2",
    metric: "0% Tax",
    metricLabel: "Secured on Qualifying Income",
    metricLabelAr: "تثبيت نسبة 0% على الدخل المؤهل",
    badge: "0% QFZP Approved",
    badgeAr: "اعتماد الشخص المؤهل",
    industry: "Logistics & Commodity Trading",
    industryAr: "شحن دولي وتجارة سلع",
    location: "DMCC JLT",
    takeaway: "Structured corporate substance framework separating local vs. foreign trade to lock in 0% QFZP status and approved DMCC audit.",
    takeawayAr: "هيكلة الوجود المادي للشخص المؤهل في المنطقة الحرة لفصل التجارة المحلية وتثبيت ضريبة 0% مع تدقيق معتمد."
  },
  {
    id: "case-3",
    metric: "AED 64.5k",
    metricLabel: "Late Fines Waived",
    metricLabelAr: "غرامات تأخير تم إسقاطها",
    badge: "10-Day Turnaround",
    badgeAr: "إنجاز خلال 10 أيام",
    industry: "Hospitality & Restaurant Group",
    industryAr: "مجموعة ضيافة ومطاعم",
    location: "Downtown Dubai",
    takeaway: "Emergency 10-day POS cleanup, Form 211 Voluntary Disclosure with FTA, and complete waiver of late-payment penalty surcharges.",
    takeawayAr: "مطابقة عاجلة لحسابات نقاط البيع، وتقديم إفصاح طوعي لدى الهيئة، وإسقاط كامل الغرامات الإدارية المتراكمة."
  }
];

export function ClientCaseStudies() {
  const { language } = useLanguage();

  return (
    <section id="case-studies" className="py-8 sm:py-10 bg-navy-900 border-b border-slate-800 text-white relative overflow-hidden scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Compact Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>{language === "ar" ? "نتائج حقيقية موثقة" : "Proven UAE Client Results"}</span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {language === "ar" ? (
              <>توفير الضرائب وتجنب الغرامات <span className="text-gold-400">بأرقام ملموسة</span></>
            ) : (
              <>Defensible Tax Savings & <span className="text-gold-400">Zero-Penalty Track Record</span></>
            )}
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm">
            {language === "ar"
              ? "أمثلة حقيقية على حل النزاعات الضريبية، وهيكلة الدخل المؤهل 0%، وإسقاط الغرامات الإدارية."
              : "Real results resolving FTA inquiries, structuring 0% QFZP income, and waiving late penalties."}
          </p>
        </div>

        {/* 3 Streamlined Metric-First Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="bg-navy-950/70 border border-white/10 hover:border-gold-400/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-colors text-left rtl:text-right space-y-3"
            >
              <div>
                {/* Metric & Tag Top Bar */}
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                  <span className="font-display text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-emerald-300">
                    {study.metric}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-md shrink-0">
                    {language === "ar" ? study.badgeAr : study.badge}
                  </span>
                </div>

                {/* Metric Sub-Label & Client Context */}
                <div className="pt-2 space-y-1">
                  <div className="text-xs font-bold text-slate-200">
                    {language === "ar" ? study.metricLabelAr : study.metricLabel}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gold-400 font-medium">
                    <span>{language === "ar" ? study.industryAr : study.industry}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{study.location}</span>
                  </div>
                </div>

                {/* Concise Takeaway */}
                <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                  {language === "ar" ? study.takeawayAr : study.takeaway}
                </p>
              </div>

              {/* Bottom Micro Check */}
              <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>{language === "ar" ? "معتمد ومطابق لـ EmaraTax" : "EmaraTax & Audit Verified"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Compact CTA Bar */}
        <div className="bg-navy-950/90 border border-gold-500/25 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2 text-center sm:text-left rtl:sm:text-right">
            <Sparkles className="w-4 h-4 text-gold-400 shrink-0 hidden sm:block" />
            <span className="text-slate-200 text-xs font-medium">
              {language === "ar" 
                ? "هل تريد نتائج وحماية ضريبية مماثلة لشركتك في الإمارات؟" 
                : "Want measurable tax savings and clean books for your UAE company?"}
            </span>
          </div>

          <a
            href="#contact"
            className="shrink-0 inline-flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <span>{language === "ar" ? "استشارة مجانية" : "Free Strategy Call"}</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

      </div>
    </section>
  );
}

export default ClientCaseStudies;
