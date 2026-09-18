import React from "react";
import { motion } from "motion/react";
import {
  Award,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Clock,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface WhyChooseUsGridProps {
  onBookCall?: () => void;
}

export const WhyChooseUsGrid: React.FC<WhyChooseUsGridProps> = ({ onBookCall }) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === "ar";

  const pillars = [
    {
      id: "proficiency",
      icon: Award,
      titleEn: "Proficiency",
      titleAr: "الكفاءة والاعتماد",
      descEn: "Led by certified CAs, CPAs, and registered FTA tax agents with deep UAE audit experience.",
      descAr: "فريق من المحاسبين القانونيين (CA/CPA) والوكلاء الضريبيين المعتمدين لدى الهيئة.",
      badgeEn: "FTA Accredited",
      badgeAr: "معتمد رسمياً",
    },
    {
      id: "insights",
      icon: TrendingUp,
      titleEn: "Actionable Insights",
      titleAr: "رؤى مالية ذكية",
      descEn: "Monthly financial dashboards that pinpoint cash leaks, trim tax overhead, and boost profit margins.",
      descAr: "تقارير مالية دورية تكشف مواطن الهدر المالي وترفع هوامش أرباحك الصافية.",
      badgeEn: "Growth Focused",
      badgeAr: "توجيه النمو",
    },
    {
      id: "knowledge",
      icon: BookOpen,
      titleEn: "In-Depth Knowledge",
      titleAr: "معرفة قانونية شاملة",
      descEn: "Real-time compliance with latest FTA cabinet decisions, QFZP rulings, and corporate tax regulations.",
      descAr: "متابعة فورية لأحدث لوائح الهيئة الاتحادية وقرارات مجلس الوزراء وضريبة الشركات.",
      badgeEn: "100% Up to Date",
      badgeAr: "محدث باستمرار",
    },
    {
      id: "accuracy",
      icon: ShieldCheck,
      titleEn: "Uncompromising Accuracy",
      titleAr: "دقة متناهية بلا أخطاء",
      descEn: "Triple-checked review by senior audit managers to guarantee 100% FTA & IFRS compliance.",
      descAr: "مراجعة ثلاثية المستويات بإشراف مديري تدقيق لضمان الامتثال التام ومنع أي غرامات.",
      badgeEn: "99.4% Precision",
      badgeAr: "دقة 99.4%",
    },
    {
      id: "reliability",
      icon: Clock,
      titleEn: "Absolute Reliability",
      titleAr: "التزام ومواعيد مضمونة",
      descEn: "Dedicated client accountant on WhatsApp and phone with guaranteed SLA delivery times.",
      descAr: "محاسب خاص متاح دائماً عبر الواتساب والهاتف مع التزام صارم بكافة المواعيد القانونية.",
      badgeEn: "Guaranteed SLAs",
      badgeAr: "مواعيد مضمونة",
    },
    {
      id: "automation",
      icon: Cpu,
      titleEn: "Cloud Automation",
      titleAr: "أتمتة سحابية متقدمة",
      descEn: "Cut 80% of paperwork with live bank feeds, digital receipts, and Zoho / Xero / QuickBooks sync.",
      descAr: "ربط رقمي مباشر مع Zoho وXero وتغذية بنكية آلية تلغي 80% من المعاملات الورقية.",
      badgeEn: "Zero Paperwork",
      badgeAr: "أنظمة بلا أوراق",
    },
  ];

  return (
    <section className="py-10 sm:py-12 md:py-14 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Compact, Scannable Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-700 text-[11px] font-bold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>{isAr ? "لماذا تختار دياس للمحاسبة؟" : "Why Choose Dias Accounting"}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            {isAr
              ? "ركائز التميز الست التي تميز خدماتنا"
              : "6 Core Pillars of Excellence That Set Us Apart"}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            {isAr
              ? "خبرة محاسبية معتمدة، دقة تدقيق صارمة، وأتمتة سحابية تضمن الامتثال الضريبي الكامل لشركتك."
              : "Certified expertise, multi-tier audit accuracy, and automated cloud workflows that safeguard your business."}
          </p>
        </div>

        {/* Crisp 6 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                className="bg-slate-50/70 hover:bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-gold-400/90 transition-all hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-navy-950 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
                      <Icon className="w-4 h-4 text-navy-900 group-hover:text-navy-950" />
                    </div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                      {isAr ? pillar.badgeAr : pillar.badgeEn}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-navy-950 mb-1.5 group-hover:text-gold-700 transition-colors">
                    {isAr ? pillar.titleAr : pillar.titleEn}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed">
                    {isAr ? pillar.descAr : pillar.descEn}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-200/70 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 group-hover:text-navy-900 transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isAr ? "معايير IFRS والامتثال الضريبي" : "IFRS & FTA Compliant"}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Streamlined Bottom Action Bar */}
        <div className="mt-8 bg-navy-950 rounded-2xl p-4 sm:p-5 text-white border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <h4 className="font-display text-sm sm:text-base font-bold text-white">
              {isAr ? "جاهز لضمان الامتثال المالي والضريبي لشركتك؟" : "Ready for Flawless UAE Financial & Tax Compliance?"}
            </h4>
            <p className="text-[11px] text-slate-300">
              {isAr
                ? "احصل على تدقيق مجاني ومراجعة محاسبية تمهيدية مع مستشارنا المعتمد."
                : "Schedule a complimentary 30-minute consultation with a senior UAE tax advisor."}
            </p>
          </div>

          <button
            onClick={() => {
              if (onBookCall) {
                onBookCall();
              } else {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="shrink-0 bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold py-2 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5 text-xs cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <span>{isAr ? "تحدث مع مستشار معتمد الآن" : "Speak with an Advisor"}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUsGrid;
