import React from "react";
import { motion } from "motion/react";
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
    metric: "AED 185,000",
    metricLabel: "Tax & Penalties Saved",
    metricLabelAr: "وفورات ضريبية وغرامات تم تجنبها",
    badge: "100% FTA Compliant",
    badgeAr: "امتثال كامل للهيئة",
    industry: "E-Commerce",
    industryAr: "تجارة إلكترونية",
    location: "IFZA Dubai",
    takeaway: "Cleaned up 18 months of multi-currency ledgers and secured 0% Small Business Relief (SBR).",
    takeawayAr: "مطابقة 18 شهراً من قيود الدفع وتأمين إعفاء الشركات الصغيرة (SBR) بنسبة 0%."
  },
  {
    id: "case-2",
    metric: "0% Corporate Tax",
    metricLabel: "Locked on Qualifying Income",
    metricLabelAr: "تثبيت نسبة 0% على الدخل المؤهل",
    badge: "0% QFZP Approved",
    badgeAr: "اعتماد الشخص المؤهل",
    industry: "Commodity Trading",
    industryAr: "تجارة سلع وشحن",
    location: "DMCC Dubai",
    takeaway: "Substance framework separating local vs. foreign trade to guarantee 0% QFZP tax status.",
    takeawayAr: "هيكلة التواجد المادي لفصل التجارة المحلية وتثبيت ضريبة 0% مع تدقيق معتمد."
  },
  {
    id: "case-3",
    metric: "AED 64,500",
    metricLabel: "Late Fines 100% Waived",
    metricLabelAr: "غرامات تأخير تم إسقاطها بالكامل",
    badge: "10-Day Resolution",
    badgeAr: "إنجاز خلال 10 أيام",
    industry: "Hospitality Group",
    industryAr: "مجموعة ضيافة",
    location: "Downtown Dubai",
    takeaway: "Urgent POS ledger reconciliation & Form 211 filing with FTA to waive penalty surcharges.",
    takeawayAr: "مطابقة عاجلة لنقاط البيع وتقديم إفصاح طوعي للهيئة لإسقاط كامل الغرامات."
  }
];

export function ClientCaseStudies() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section id="case-studies" className="py-6 sm:py-8 md:py-10 bg-gradient-to-b from-navy-950 via-slate-900 to-navy-950 border-b border-slate-800 text-white relative overflow-hidden scroll-mt-20">
      {/* Ambient Animated Glows */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 left-1/3 w-96 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-20 right-1/4 w-80 h-40 bg-gold-500/15 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 sm:space-y-5">
        
        {/* Crisp Header */}
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10.5px] font-bold uppercase tracking-wider font-mono"
          >
            <Award className="w-3 h-3" />
            <span>{isAr ? "نتائج حقيقية موثقة" : "Proven UAE Results"}</span>
          </motion.div>

          <h2 className="font-display text-lg sm:text-2xl font-extrabold text-white tracking-tight">
            {isAr ? (
              <>وفورات ضريبية وحماية من الغرامات <span className="text-gold-400">بأرقام ملموسة</span></>
            ) : (
              <>Defensible Tax Savings & <span className="text-gold-400">Zero-Penalty Track Record</span></>
            )}
          </h2>

          <p className="text-slate-400 text-xs max-w-md mx-auto">
            {isAr
              ? "أمثلة حقيقية على حل النزاعات الضريبية، وهيكلة 0% للشخص المؤهل، وإسقاط الغرامات الإدارية."
              : "Measurable outcomes resolving FTA audits, securing 0% QFZP tax, and waiving late fines."}
          </p>
        </div>

        {/* 3 Animated Metric-First Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CASE_STUDIES.map((study, idx) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
              className="group bg-navy-950/80 border border-slate-800 hover:border-gold-400/70 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:shadow-xl hover:shadow-gold-500/5 transition-colors text-left rtl:text-right"
            >
              <div className="space-y-2">
                {/* Metric & Tag Top Bar */}
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <span className="font-display text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-amber-200 to-emerald-300 group-hover:scale-102 transition-transform inline-block">
                    {study.metric}
                  </span>
                  <span className="text-[9.5px] font-mono font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-2 py-0.5 rounded-full shrink-0">
                    {isAr ? study.badgeAr : study.badge}
                  </span>
                </div>

                {/* Sub-label & Industry */}
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {isAr ? study.metricLabelAr : study.metricLabel}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10.5px] text-gold-400 font-medium mt-0.5">
                    <span>{isAr ? study.industryAr : study.industry}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{study.location}</span>
                  </div>
                </div>

                {/* Crisp Takeaway */}
                <p className="text-[11.5px] text-slate-300 leading-relaxed pt-1">
                  {isAr ? study.takeawayAr : study.takeaway}
                </p>
              </div>

              {/* Bottom Verification Status */}
              <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>{isAr ? "معتمد ومطابق لـ EmaraTax" : "EmaraTax & Audit Verified"}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Streamlined Attractive CTA Bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-navy-950/90 border border-gold-500/25 hover:border-gold-500/40 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs shadow-md transition-colors"
        >
          <div className="flex items-center gap-2 text-center sm:text-left rtl:sm:text-right">
            <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
            <span className="text-slate-200 text-xs font-medium">
              {isAr 
                ? "هل تريد نتائج وحماية ضريبية مماثلة لشركتك في الإمارات؟" 
                : "Want measurable tax savings and zero penalties for your UAE business?"}
            </span>
          </div>

          <a
            href="#contact"
            className="shrink-0 inline-flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <span>{isAr ? "استشارة مجانية" : "Free Strategy Call"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}

export default ClientCaseStudies;
