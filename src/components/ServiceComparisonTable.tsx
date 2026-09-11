import React, { useState } from "react";
import { 
  Check, 
  Minus, 
  Sparkles, 
  Briefcase, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Award
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface FeatureRow {
  name: string;
  tooltip?: string;
  isKeyHighlight?: boolean;
  standard: {
    included: boolean | "basic" | "addon";
    text: string;
  };
  cfo: {
    included: boolean | "advanced";
    text: string;
  };
}

interface CategoryGroup {
  id: string;
  title: string;
  icon: React.ReactNode;
  features: FeatureRow[];
}

interface ServiceComparisonTableProps {
  onSelectTier?: (tierName: string) => void;
}

export const ServiceComparisonTable: React.FC<ServiceComparisonTableProps> = ({ onSelectTier }) => {
  const { language, isRTL } = useLanguage();
  const [mobileActiveTab, setMobileActiveTab] = useState<"standard" | "cfo">("cfo");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const comparisonData: CategoryGroup[] = [
    {
      id: "bookkeeping",
      title: language === "ar" ? "مسك الدفاتر والامتثال المالي" : "Bookkeeping & Financial Records",
      icon: <FileText className="w-3.5 h-3.5 text-gold-500" />,
      features: [
        {
          name: language === "ar" ? "مسك الدفاتر وتسجيل المعاملات" : "Ledger Maintenance & Bookkeeping",
          isKeyHighlight: true,
          standard: {
            included: true,
            text: language === "ar" ? "شهري / ربع سنوي" : "Monthly / Quarterly",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "تسوية مستمرة وفورية" : "Continuous & Real-time",
          },
        },
        {
          name: language === "ar" ? "تسوية الحسابات وبوابات الدفع" : "Bank & Gateway Reconciliations",
          isKeyHighlight: true,
          standard: {
            included: true,
            text: language === "ar" ? "البنوك الرئيسية" : "Primary bank accounts",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "متعددة العملات وبوابات الدفع" : "Multi-bank, multi-currency & gateways",
          },
        },
        {
          name: language === "ar" ? "القوائم المالية (IFRS)" : "IFRS Financial Statements",
          isKeyHighlight: true,
          standard: {
            included: true,
            text: language === "ar" ? "بيانات ربع سنوية وسنوية" : "Quarterly & Annual reports",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "حزمة تقارير مجلس الإدارة الشهرية" : "Monthly Executive Board package",
          },
        },
      ],
    },
    {
      id: "tax",
      title: language === "ar" ? "الضرائب الإماراتية وهيئة الضرائب (FTA)" : "UAE Tax & FTA Regulatory Defense",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />,
      features: [
        {
          name: language === "ar" ? "إقرارات ضريبة القيمة المضافة (VAT)" : "UAE VAT Filing on EmaraTax",
          isKeyHighlight: true,
          standard: {
            included: true,
            text: language === "ar" ? "تقديم ربع سنوي قياسي" : "Standard quarterly filing",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "تدقيق متقدم واسترداد الضريبة" : "Advanced input VAT optimization",
          },
        },
        {
          name: language === "ar" ? "ضريبة الشركات 9% و0% للمناطق الحرة" : "Corporate Tax (9% & 0% Free Zone)",
          isKeyHighlight: true,
          standard: {
            included: true,
            text: language === "ar" ? "تقديم الإقرار السنوي" : "Annual return filing",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "هيكلة الدخل المؤهل 0% وتخطيط استراتيجي" : "0% QFZP structuring & strategic tax planning",
          },
        },
        {
          name: language === "ar" ? "الدفاع والتمثيل أثناء التدقيق الضريبي" : "FTA Audit Defense & Representation",
          isKeyHighlight: false,
          standard: {
            included: "addon",
            text: language === "ar" ? "إضافي عند الطلب" : "On-demand add-on",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "مشمول بالكامل" : "Fully included with zero-penalty protocol",
          },
        },
      ],
    },
    {
      id: "intelligence",
      title: language === "ar" ? "التقارير المالية والتحليلات" : "Financial Intelligence & KPIs",
      icon: <BarChart3 className="w-3.5 h-3.5 text-blue-500" />,
      features: [
        {
          name: language === "ar" ? "لوحة مؤشرات الأداء والتحليلات" : "Executive KPI Dashboard",
          isKeyHighlight: false,
          standard: {
            included: "basic",
            text: language === "ar" ? "ملخص PDF ثابت" : "Static PDF summary",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "لوحة سحابية تفاعلية مباشرة" : "Live interactive cloud dashboard",
          },
        },
        {
          name: language === "ar" ? "تحليل انحراف الميزانية (Budget vs Actual)" : "Budget vs. Actual Variance Analysis",
          isKeyHighlight: true,
          standard: {
            included: false,
            text: language === "ar" ? "غير مشمول" : "Not included",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "تحليل شهري مفصل للمصروفات" : "Monthly deep-dive into revenue & cost drivers",
          },
        },
        {
          name: language === "ar" ? "تحليل ربحية المنتجات والخدمات" : "Unit Economics & SKU Profitability",
          isKeyHighlight: false,
          standard: {
            included: false,
            text: language === "ar" ? "غير مشمول" : "Not included",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "نمذجة هوامش المشاريع" : "Granular margin & contribution modeling",
          },
        },
      ],
    },
    {
      id: "cashflow",
      title: language === "ar" ? "إدارة السيولة والتنبؤ المالي" : "Cash Flow Forecasting & Runway",
      icon: <TrendingUp className="w-3.5 h-3.5 text-gold-600" />,
      features: [
        {
          name: language === "ar" ? "توقعات التدفقات النقدية لـ 13 أسبوعاً" : "13-Week Rolling Cash Flow Forecast",
          isKeyHighlight: true,
          standard: {
            included: false,
            text: language === "ar" ? "بيانات تاريخية فقط" : "Historical cash flows only",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "نموذج توقعات أسبوعي متجدد" : "Dynamic weekly predictive model",
          },
        },
        {
          name: language === "ar" ? "إدارة رأس المال العامل وتحصيل الذمم" : "Working Capital & AR/AP Optimization",
          isKeyHighlight: false,
          standard: {
            included: "basic",
            text: language === "ar" ? "تقرير أعمار الديون" : "Basic aging reports",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "تسريع التحصيل والتفاوض" : "Active DSO reduction & vendor terms",
          },
        },
        {
          name: language === "ar" ? "تسهيلات البنوك ونمذجة التمويل" : "Bank Credit Facilities & Pitch Decks",
          isKeyHighlight: false,
          standard: {
            included: false,
            text: language === "ar" ? "كشوفات فقط" : "Statement exports only",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "ملفات التمويل ونماذج المستثمرين" : "Loan application packages & investor models",
          },
        },
      ],
    },
    {
      id: "advisory",
      title: language === "ar" ? "القيادة ومستوى الدعم (SLA)" : "Strategic Leadership & SLA",
      icon: <Award className="w-3.5 h-3.5 text-navy-600" />,
      features: [
        {
          name: language === "ar" ? "الخبير المالي المسؤول" : "Assigned Financial Lead",
          isKeyHighlight: true,
          standard: {
            included: true,
            text: language === "ar" ? "محاسب أول معتمد" : "Senior Certified Accountant",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "مدير مالي تنفيذي ومستشار شريك" : "Fractional CFO & Partner Director",
          },
        },
        {
          name: language === "ar" ? "جلسات التوجيه المالي" : "Executive Strategy Sessions",
          isKeyHighlight: false,
          standard: {
            included: false,
            text: language === "ar" ? "تواصل كتابي" : "Written email Q&A",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "جلسة استراتيجية شهرية (1:1)" : "Monthly 1-on-1 Board sessions",
          },
        },
        {
          name: language === "ar" ? "قنوات وسرعة الاستجابة" : "Support Channels & Priority SLA",
          isKeyHighlight: false,
          standard: {
            included: true,
            text: language === "ar" ? "بريد إلكتروني (24-48 ساعة)" : "Email & Portal (24-48h)",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "واتساب مخصص وهاتف (<4 ساعات)" : "Direct WhatsApp & Phone (<4h)",
          },
        },
      ],
    },
  ];

  const handleAction = (tier: string) => {
    if (onSelectTier) {
      onSelectTier(tier);
    }
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter categories and features if not expanded
  const displayedCategories = isExpanded 
    ? comparisonData 
    : comparisonData.map(cat => ({
        ...cat,
        features: cat.features.filter(f => f.isKeyHighlight)
      })).filter(cat => cat.features.length > 0);

  const totalFeaturesCount = comparisonData.reduce((acc, cat) => acc + cat.features.length, 0);
  const compactFeaturesCount = comparisonData.reduce((acc, cat) => acc + cat.features.filter(f => f.isKeyHighlight).length, 0);

  return (
    <div className="mt-8 pt-6 border-t border-slate-200/80 space-y-4" id="service-comparison">
      {/* Compact Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-5xl mx-auto px-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gold-600 mb-0.5">
            <Sparkles className="w-3 h-3" />
            <span>{language === "ar" ? "مقارنة المستويات" : "Tier Comparison"}</span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-navy-950">
            {language === "ar"
              ? "المحاسبة القياسية مقابل الإدارة المالية التنفيذية (CFO)"
              : "Standard Accounting vs. Premium CFO Advisory"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === "ar"
              ? "قارن بين الامتثال المحاسبي اليومي والاستشارات المالية التوجيهية لاختيار الباقة الأنسب."
              : "Compare core compliance with strategic Fractional CFO steering to choose the right fit."}
          </p>
        </div>

        {/* Expand / Collapse Quick Toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <span>
            {isExpanded
              ? (language === "ar" ? "عرض مختصر" : "Compact View")
              : (language === "ar" ? `عرض كل التفاصيل (${totalFeaturesCount})` : `Show All (${totalFeaturesCount})`)}
          </span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Slim Two-Tier Header Strip (Replaces massive duplicate cards to save space) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-5xl mx-auto px-4">
        {/* Tier 1: Standard Accounting Compact Bar */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-display text-xs font-bold text-navy-950 truncate">
                  {language === "ar" ? "المحاسبة والضرائب القياسية" : "Standard Accounting"}
                </h4>
                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {language === "ar" ? "امتثال" : "Essential"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {language === "ar" ? "مسك الدفاتر وامتثال الضرائب" : "Clean books & FTA tax compliance"}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleAction("Standard Accounting")}
            className="shrink-0 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-950 text-xs font-bold transition-colors cursor-pointer"
          >
            {language === "ar" ? "اختيار" : "Select"}
          </button>
        </div>

        {/* Tier 2: CFO Advisory Compact Bar */}
        <div className="bg-gradient-to-r from-navy-950 to-slate-900 border border-gold-500/50 rounded-xl p-3 shadow-xs text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-display text-xs font-bold text-white truncate">
                  {language === "ar" ? "الإدارة المالية التنفيذية (CFO)" : "Fractional CFO Advisory"}
                </h4>
                <span className="text-[9px] font-bold text-navy-950 bg-gold-400 px-1.5 py-0.5 rounded">
                  {language === "ar" ? "استراتيجي" : "Strategic"}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                {language === "ar" ? "توقعات السيولة وجلسات الإدارة" : "Cash forecasting & board advisory"}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleAction("Fractional CFO Advisory")}
            className="shrink-0 py-1.5 px-3 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>{language === "ar" ? "استشارة CFO" : "Book CFO"}</span>
            <ArrowRight className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="block md:hidden max-w-md mx-auto px-4">
        <div className="bg-slate-200/70 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => setMobileActiveTab("standard")}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
              mobileActiveTab === "standard"
                ? "bg-white text-navy-950 shadow-xs"
                : "text-slate-600 hover:text-navy-950"
            }`}
          >
            {language === "ar" ? "المحاسبة القياسية" : "Standard Plan"}
          </button>
          <button
            onClick={() => setMobileActiveTab("cfo")}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
              mobileActiveTab === "cfo"
                ? "bg-navy-950 text-gold-400 shadow-xs"
                : "text-slate-600 hover:text-navy-950"
            }`}
          >
            <Sparkles className="w-3 h-3 text-gold-400" />
            <span>{language === "ar" ? "استشارات CFO" : "CFO Advisory"}</span>
          </button>
        </div>
      </div>

      {/* Streamlined Comparison Matrix Table */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
          
          {/* Table Header (Desktop) */}
          <div className="hidden md:grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-xs font-display font-bold text-navy-950 py-2.5 px-4">
            <div className="col-span-6 flex items-center gap-1.5">
              <span>{language === "ar" ? "نطاق الميزات والخدمات" : "Scope & Key Deliverables"}</span>
              {!isExpanded && (
                <span className="text-[10px] text-slate-400 font-normal">
                  ({compactFeaturesCount} {language === "ar" ? "أبرز الفروقات" : "highlights"})
                </span>
              )}
            </div>
            <div className="col-span-3 text-center border-x border-slate-200/80 px-2 text-slate-700">
              <span>{language === "ar" ? "المحاسبة القياسية" : "Standard Accounting"}</span>
            </div>
            <div className="col-span-3 text-center px-2 text-gold-700 font-extrabold flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-gold-500" />
              <span>{language === "ar" ? "استشارات CFO التنفيذية" : "Premium CFO Advisory"}</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100 text-xs">
            {displayedCategories.map((category) => (
              <div key={category.id} className="divide-y divide-slate-50">
                {/* Category Subhead */}
                <div className="bg-slate-50/70 px-4 py-1.5 flex items-center gap-1.5 font-display font-bold text-[11px] text-navy-900 uppercase tracking-wider">
                  {category.icon}
                  <span>{category.title}</span>
                </div>

                {/* Feature Rows */}
                {category.features.map((feature, idx) => (
                  <div key={idx}>
                    {/* Desktop Row */}
                    <div className="hidden md:grid grid-cols-12 px-4 py-2 hover:bg-slate-50/60 transition-colors items-center">
                      <div className="col-span-6 pr-3">
                        <span className="font-semibold text-slate-800 text-xs">{feature.name}</span>
                      </div>

                      {/* Standard Value */}
                      <div className="col-span-3 text-center border-x border-slate-100 px-2 py-0.5 flex items-center justify-center gap-1.5 text-slate-600">
                        {feature.standard.included === true && (
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        {feature.standard.included === "basic" && (
                          <span className="text-[9px] font-bold uppercase text-amber-700 bg-amber-50 px-1 py-0.5 rounded shrink-0">
                            {language === "ar" ? "أساسي" : "Basic"}
                          </span>
                        )}
                        {feature.standard.included === "addon" && (
                          <span className="text-[9px] font-bold uppercase text-blue-700 bg-blue-50 px-1 py-0.5 rounded shrink-0">
                            {language === "ar" ? "إضافي" : "Add-on"}
                          </span>
                        )}
                        {feature.standard.included === false && (
                          <Minus className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        )}
                        <span className="text-[11px] text-slate-600 truncate">
                          {feature.standard.text}
                        </span>
                      </div>

                      {/* CFO Value */}
                      <div className="col-span-3 text-center px-2 py-0.5 flex items-center justify-center gap-1.5 font-medium bg-gold-50/20 rounded">
                        {feature.cfo.included === true && (
                          <div className="w-3.5 h-3.5 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                        <span className="text-[11px] text-navy-950 font-semibold truncate">
                          {feature.cfo.text}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Row */}
                    <div className="block md:hidden p-2.5 bg-white border-b border-slate-50 space-y-1">
                      <div className="font-semibold text-xs text-navy-950">
                        {feature.name}
                      </div>

                      {mobileActiveTab === "standard" ? (
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-2 text-xs">
                          {feature.standard.included === true && (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                          {feature.standard.included === "basic" && (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1 py-0.5 rounded shrink-0">
                              {language === "ar" ? "أساسي" : "Basic"}
                            </span>
                          )}
                          {feature.standard.included === "addon" && (
                            <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded shrink-0">
                              {language === "ar" ? "إضافي" : "Add-on"}
                            </span>
                          )}
                          {feature.standard.included === false && (
                            <Minus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className="text-slate-600 text-[11px]">
                            {feature.standard.text}
                          </span>
                        </div>
                      ) : (
                        <div className="bg-gold-50/50 p-2 rounded-lg border border-gold-200/60 flex items-center gap-2 text-xs">
                          <div className="w-3.5 h-3.5 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="text-navy-950 font-semibold text-[11px]">
                            {feature.cfo.text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Slim Bottom Bar with Show All toggle */}
          <div className="bg-slate-50/80 border-t border-slate-200 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 text-[11px]">
              {language === "ar"
                ? "جميع الباقات تتضمن مسك الدفاتر واستشارات ضريبية مرخصة من الهيئة."
                : "All tiers include FTA-compliant bookkeeping and licensed advisory."}
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gold-700 hover:text-gold-800 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
            >
              <span>
                {isExpanded
                  ? (language === "ar" ? "طي المصفوفة (عرض مختصر)" : "Collapse matrix (compact view)")
                  : (language === "ar" ? `عرض جميع الميزات الـ ${totalFeaturesCount}` : `Show all ${totalFeaturesCount} deliverables & SLA details`)}
              </span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

