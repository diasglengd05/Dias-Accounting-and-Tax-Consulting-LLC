import React from "react";
import {
  Award,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Clock,
  Cpu,
  ShieldCheck,
  Zap,
  Users2,
  ArrowRight,
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
      titleAr: "الكفاءة والخبرة العالية",
      taglineEn: "Certified Chartered Accountants & FTA Tax Agents",
      taglineAr: "محاسبون قانونيون ووكلاء ضريبيون معتمدون",
      descEn:
        "Our team comprises certified CAs, CPAs, and registered FTA tax specialists who bring decades of combined audit and regulatory experience across UAE jurisdictions.",
      descAr:
        "يضم فريقنا نخبة من المحاسبين القانونيين المعتمدين (CA/CPA) والخبراء الضريبيين المسجلين لدى الهيئة الاتحادية للضرائب بخبرات عريقة.",
      badgeEn: "FTA Accredited",
      badgeAr: "معتمد من الهيئة",
    },
    {
      id: "insights",
      icon: TrendingUp,
      titleEn: "Actionable Insights",
      titleAr: "رؤى مالية استراتيجية",
      taglineEn: "Clear Management Reporting & Margin Tracking",
      taglineAr: "تقارير مالية دورية ومراقبة هوامش الربح",
      descEn:
        "We don't just record historical numbers—we construct custom dashboards and monthly financial packages that identify cash leaks, reduce tax overhead, and boost gross margins.",
      descAr:
        "لا نكتفي بتسجيل القيود المحاسبية، بل نمنحك لوحات تحكم متقدمة وتقارير شهرية تكشف مواطن الهدر المالي وتزيد أرباحك الصافية.",
      badgeEn: "Growth Focused",
      badgeAr: "توجيه للنمو",
    },
    {
      id: "knowledge",
      icon: BookOpen,
      titleEn: "In-Depth Knowledge",
      titleAr: "معرفة قانونية شاملة",
      taglineEn: "Up-to-the-minute UAE Corporate Tax & VAT Laws",
      taglineAr: "إحاطة كاملة بقرارات مجلس الوزراء والأنظمة الضريبية",
      descEn:
        "UAE corporate tax laws and Cabinet decisions evolve rapidly. We continuously track FTA regulatory updates, qualifying free zone rulings, and transfer pricing mandates.",
      descAr:
        "تتطور القوانين الضريبية في الإمارات باستمرار. نضمن لك الاطلاع الفوري وتطبيق قرارات مجلس الوزراء ولوائح ضريبة الشركات وأسعار التحويل.",
      badgeEn: "100% Up to Date",
      badgeAr: "محدث باستمرار",
    },
    {
      id: "accuracy",
      icon: ShieldCheck,
      titleEn: "Uncompromising Accuracy",
      titleAr: "دقة متناهية وحماية من الغرامات",
      taglineEn: "Multi-Tier Peer Review & Zero-Penalty Assurance",
      taglineAr: "مراجعة ثلاثية المستويات وضمان عدم وجود غرامات",
      descEn:
        "Every tax return and monthly ledger passes through a strict multi-tier review process by senior audit managers to ensure 100% mathematical and statutory precision.",
      descAr:
        "يخضع كل إقرار ضريبي وكل دفتر حسابات لعملية تدقيق ثلاثية المستويات بإشراف مديري تدقيق أول لضمان مطابقة تامة مع معايير IFRS وقوانين الهيئة.",
      badgeEn: "99.4% Accuracy",
      badgeAr: "دقة 99.4%",
    },
    {
      id: "reliability",
      icon: Clock,
      titleEn: "Absolute Reliability",
      titleAr: "التزام كامل ودعم مستمر",
      taglineEn: "Dedicated Account Manager & Strict SLA Delivery",
      taglineAr: "مدير حساب مخصص والتزام صارم بمواعيد التسليم",
      descEn:
        "Never miss a statutory filing deadline again. Your dedicated client accountant is always accessible via WhatsApp, phone, or email with guaranteed SLA response times.",
      descAr:
        "لن تفوتك أي مهلة قانونية بعد اليوم. محاسبك الخاص متاح دائماً عبر الهاتف والواتساب والبريد مع التزام معتمد بجودة وسرعة الاستجابة.",
      badgeEn: "Guaranteed SLAs",
      badgeAr: "مواعيد مضمونة",
    },
    {
      id: "automation",
      icon: Cpu,
      titleEn: "Cloud Automation",
      titleAr: "أتمتة سحابية متقدمة",
      taglineEn: "Direct Integration with Zoho, Xero & QuickBooks",
      taglineAr: "ربط رقمي مباشر مع أفضل البرامج السحابية",
      descEn:
        "Cut manual paperwork by 80%. We implement modern cloud accounting systems (Zoho Books, QuickBooks, Xero, Wafeq) with automated bank feeds and digital receipt capture.",
      descAr:
        "تخلص من الفواتير الورقية والمعاملات اليدوية. نربط أعمالك بأنظمة سحابية عالمية مع تغذية بنكية آلية وتوافق فوري مع منصة EmaraTax.",
      badgeEn: "Zero Paperwork",
      badgeAr: "أنظمة بلا أوراق",
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs text-gold-600 font-bold uppercase tracking-widest block">
            {isAr ? "لماذا تختار دياس للمحاسبة؟" : "Why Choose Us"}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight">
            {isAr
              ? "معايير الامتياز الستة التي تميزنا في الإمارات"
              : "The 6 Core Pillars of Excellence That Set Us Apart"}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {isAr
              ? "نجمع بين الكفاءة المحاسبية العميقة والتكنولوجيا السحابية الذكية لنمنح شركتك راحة البال التامة والامتثال الضريبي الخالي من الأخطاء."
              : "Discover how our certified expertise, rigorous multi-tier audit accuracy, and automated cloud workflows safeguard your business and accelerate growth."}
          </p>
        </div>

        {/* 6 Pillars Grid (BCL.ae layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="bg-slate-50 hover:bg-white rounded-3xl p-7 border border-slate-100 hover:border-gold-300 transition-all duration-300 hover:shadow-xl group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-navy-900 group-hover:bg-navy-950 group-hover:text-gold-400 group-hover:border-navy-950 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-gold-50 border border-gold-200/60 text-gold-700">
                      {isAr ? pillar.badgeAr : pillar.badgeEn}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-navy-950 mb-1 group-hover:text-gold-600 transition-colors">
                    {isAr ? pillar.titleAr : pillar.titleEn}
                  </h3>

                  <div className="text-xs font-semibold text-gold-600 mb-3">
                    {isAr ? pillar.taglineAr : pillar.taglineEn}
                  </div>

                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                    {isAr ? pillar.descAr : pillar.descEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/50 flex items-center gap-2 text-xs font-semibold text-navy-900 group-hover:text-gold-600 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "معايير تدقيق دولية IFRS" : "Standard IFRS & FTA Compliance"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner with Consultation CTA */}
        <div className="mt-12 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-display text-lg sm:text-xl font-bold text-white">
              {isAr ? "جاهز لحماية شركتك وضمان امتثالها الضريبي؟" : "Ready to Experience Flawless UAE Financial Management?"}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              {isAr
                ? "احصل على تدقيق مجاني ومراجعة محاسبية تمهيدية مع أحد كبار مستشارينا خلال 24 ساعة."
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
            className="shrink-0 bg-gold-500 hover:bg-gold-600 text-navy-950 font-display font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
          >
            <span>{isAr ? "تحدث مع مستشار معتمد الآن" : "Speak with a Certified Advisor"}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUsGrid;
