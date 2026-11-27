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
    <section id="case-studies" className="py-10 sm:py-12 md:py-14 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#FFFFFF] border-y border-[#E2E8F0] text-[#0D1B2A] relative overflow-hidden scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5 sm:space-y-6">
        
        {/* Crisp Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#C5A059]/40 text-[#856422] text-[10.5px] font-bold uppercase tracking-wider font-mono"
          >
            <Award className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{isAr ? "نتائج حقيقية موثقة" : "Proven UAE Results"}</span>
          </motion.div>

          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0D1B2A] tracking-tight">
            {isAr ? (
              <>وفورات ضريبية وحماية من الغرامات <span className="text-[#856422]">بأرقام ملموسة</span></>
            ) : (
              <>Defensible Tax Savings &amp; <span className="text-[#856422]">Zero-Penalty Track Record</span></>
            )}
          </h2>

          <p className="text-[#475569] text-xs sm:text-sm max-w-md mx-auto">
            {isAr
              ? "أمثلة حقيقية على حل النزاعات الضريبية، وهيكلة 0% للشخص المؤهل، وإسقاط الغرامات الإدارية."
              : "Measurable outcomes resolving FTA audits, securing 0% QFZP tax, and waiving late fines."}
          </p>
        </div>

        {/* 3 Animated Metric-First Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CASE_STUDIES.map((study, idx) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
              className="group bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#C5A059] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all text-left rtl:text-right"
            >
              <div className="space-y-2.5">
                {/* Metric & Tag Top Bar */}
                <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2.5">
                  <span className="font-display text-xl sm:text-2xl font-extrabold text-[#1B4332] group-hover:scale-102 transition-transform inline-block">
                    {study.metric}
                  </span>
                  <span className="text-[9.5px] font-mono font-bold text-[#1B4332] bg-[#1B4332]/8 border border-[#1B4332]/20 px-2 py-0.5 rounded-full shrink-0">
                    {isAr ? study.badgeAr : study.badge}
                  </span>
                </div>

                {/* Sub-label & Industry */}
                <div>
                  <div className="text-xs font-bold text-[#0D1B2A]">
                    {isAr ? study.metricLabelAr : study.metricLabel}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10.5px] text-[#856422] font-semibold mt-0.5">
                    <span>{isAr ? study.industryAr : study.industry}</span>
                    <span className="text-[#CBD5E1]">•</span>
                    <span className="text-[#64748B]">{study.location}</span>
                  </div>
                </div>

                {/* Crisp Takeaway */}
                <p className="text-xs text-[#475569] leading-relaxed pt-1">
                  {isAr ? study.takeawayAr : study.takeaway}
                </p>
              </div>

              {/* Bottom Verification Status */}
              <div className="mt-3.5 pt-2.5 border-t border-[#E2E8F0] flex items-center gap-1.5 text-[10.5px] text-[#1B4332] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
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
          className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#C5A059] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm transition-colors"
        >
          <div className="flex items-center gap-2.5 text-center sm:text-left rtl:sm:text-right">
            <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span className="text-[#0D1B2A] text-xs sm:text-sm font-semibold">
              {isAr 
                ? "هل تريد نتائج وحماية ضريبية مماثلة لشركتك في الإمارات؟" 
                : "Want measurable tax savings and zero penalties for your UAE business?"}
            </span>
          </div>

          <a
            href="#contact"
            className="shrink-0 inline-flex items-center gap-1.5 bg-[#1B4332] hover:bg-[#143326] text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
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
