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
  PieChart, 
  Clock, 
  ArrowRight,
  HelpCircle,
  Award
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface FeatureRow {
  name: string;
  tooltip?: string;
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

  const comparisonData: CategoryGroup[] = [
    {
      id: "bookkeeping",
      title: language === "ar" ? "مسك الدفاتر والامتثال المالي الأساسي" : "Bookkeeping & Core Financial Records",
      icon: <FileText className="w-4 h-4 text-gold-500" />,
      features: [
        {
          name: language === "ar" ? "مسك الدفاتر وتوثيق المعاملات" : "Ledger Maintenance & Bookkeeping",
          tooltip: language === "ar" ? "تسجيل وتسوية قيود اليومية والفواتير شهرياً" : "Monthly entry recording, invoice validation, and bank reconciliation",
          standard: {
            included: true,
            text: language === "ar" ? "شهري / ربع سنوي (حتى 100 معاملة)" : "Monthly / Quarterly (Up to 100 txns)",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "مستمر وفي الوقت الفعلي مع تسوية يومية/أسبوعية" : "Continuous & Real-time multi-currency reconciliations",
          },
        },
        {
          name: language === "ar" ? "تسوية الحسابات البنكية وبوابات الدفع" : "Bank & Payment Gateway Reconciliation",
          standard: {
            included: true,
            text: language === "ar" ? "تسوية الحسابات البنكية الرئيسية" : "Primary bank accounts monthly",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "تسوية متعددة البنوك والعملات وبوابات Stripe/Checkout" : "Multi-bank, multi-currency & e-commerce payment gateways",
          },
        },
        {
          name: language === "ar" ? "القوائم المالية المتوافقة مع IFRS" : "IFRS Compliant Financial Statements",
          tooltip: language === "ar" ? "ميزانية عمومية، أرباح وخسائر، وتدفقات نقدية" : "Balance Sheet, Income Statement, and Cash Flow Statements",
          standard: {
            included: true,
            text: language === "ar" ? "بيانات ربع سنوية وسنوية قياسية" : "Standard Quarterly & Annual reports",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "حزمة تقارير تنفيذية شهرية شاملة ومفصلة" : "Detailed Monthly Executive Board reporting package",
          },
        },
      ],
    },
    {
      id: "tax",
      title: language === "ar" ? "الضرائب الإماراتية والامتثال للهيئة الاتحادية (FTA)" : "UAE Tax Compliance & FTA Regulatory Defense",
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
      features: [
        {
          name: language === "ar" ? "إقرارات ضريبة القيمة المضافة (VAT)" : "UAE VAT Filing & Return Preparation",
          standard: {
            included: true,
            text: language === "ar" ? "إعداد وتقديم الإقرارات الربع سنوية" : "Quarterly VAT return filing on EmaraTax",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "إعداد ومراجعة متقدمة مع تدقيق استرداد ضريبة المدخلات" : "Advanced review, input VAT optimization & audit trail validation",
          },
        },
        {
          name: language === "ar" ? "ضريبة الشركات بنسبة 9% وEmaraTax" : "9% Corporate Tax Compliance & Filing",
          standard: {
            included: true,
            text: language === "ar" ? "التسجيل وتقديم الإقرار السنوي الأساسي" : "Annual Corporate Tax return filing",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "هيكلة الدخل المؤهل للمناطق الحرة (0%) وتخطيط استراتيجي" : "Qualifying Free Zone Person (0%) structuring & proactive tax planning",
          },
        },
        {
          name: language === "ar" ? "الدفاع والتمثيل أثناء التدقيق الضريبي" : "FTA Audit Representation & Defense",
          tooltip: language === "ar" ? "الاستجابة لطلبات الهيئة الاتحادية للضرائب وتجنب الغرامات" : "Audit file preparation and defense against FTA penalty notices",
          standard: {
            included: "addon",
            text: language === "ar" ? "خدمة إضافية عند الطلب" : "Available as on-demand add-on",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "تمثيل شامل ودفاع استباقي مشمول ضمن الباقة" : "Full audit-readiness protocol & FTA defense included",
          },
        },
      ],
    },
    {
      id: "intelligence",
      title: language === "ar" ? "التقارير الذكية وتتبع مؤشرات الأداء" : "Financial Intelligence & Executive KPI Tracking",
      icon: <BarChart3 className="w-4 h-4 text-blue-500" />,
      features: [
        {
          name: language === "ar" ? "لوحة مؤشرات الأداء والتحليلات البيانية" : "Executive Performance Dashboard",
          standard: {
            included: "basic",
            text: language === "ar" ? "تقارير أرباح وخسائر بصيغة PDF" : "Standard static PDF summary",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "لوحة سحابية تفاعلية مباشرة مع مقاييس الهوامش والربحية" : "Live interactive cloud dashboard with gross margin & burn rate metrics",
          },
        },
        {
          name: language === "ar" ? "تحليل انحراف الميزانية (Budget vs Actual)" : "Budget vs. Actual Variance Analysis",
          standard: {
            included: false,
            text: language === "ar" ? "غير مشمول" : "Not included",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "تحليل شهري مفصل لانحراف المصروفات والإيرادات" : "Monthly deep-dive into revenue & cost drivers vs targets",
          },
        },
        {
          name: language === "ar" ? "تحليل تكلفة وحدة المنتج / الخدمة والربحية" : "Unit Economics & SKU/Project Profitability",
          standard: {
            included: false,
            text: language === "ar" ? "غير مشمول" : "Not included",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "تحليل مساهمة المشاريع وخطوط الإنتاج في الأرباح" : "Granular project/service line margin & contribution modeling",
          },
        },
      ],
    },
    {
      id: "cashflow",
      title: language === "ar" ? "إدارة السيولة والتخطيط المالي التطلعي" : "Cash Flow Forecasting & Capital Strategy",
      icon: <TrendingUp className="w-4 h-4 text-gold-600" />,
      features: [
        {
          name: language === "ar" ? "توقعات التدفقات النقدية المتجددة لـ 13 أسبوعاً" : "13-Week Rolling Cash Flow Forecast",
          tooltip: language === "ar" ? "رؤية استباقية للسيولة لتجنب نقص السيولة وتأمين التزامات الرواتب والموردين" : "Predictive cash runway model to prevent cash crunches & manage payroll",
          standard: {
            included: false,
            text: language === "ar" ? "بيانات التدفق النقدي التاريخية فقط" : "Historical cash flows only",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "نموذج توقعات أسبوعي متجدد وديناميكي" : "Dynamic predictive model updated weekly/monthly",
          },
        },
        {
          name: language === "ar" ? "إدارة رأس المال العامل وتحصيل الذمم" : "Working Capital & AR/AP Optimization",
          standard: {
            included: "basic",
            text: language === "ar" ? "تقرير أعمار الديون والمستحقات" : "Basic Accounts Aging reports",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "استراتيجيات تسريع التحصيل والتفاوض على شروط الدفع" : "Active DSO reduction strategies & vendor payment terms negotiation",
          },
        },
        {
          name: language === "ar" ? "تسهيلات البنوك ونمذجة التمويل / الاستثمار" : "Banking Credit Facilities & Fundraising Decks",
          standard: {
            included: false,
            text: language === "ar" ? "استخراج الكشوف البنكية فقط" : "Statement exports only",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "إعداد ملفات التمويل البنكي ونماذج التقييم للمستثمرين" : "Bank loan application packages & investor pitch financial models",
          },
        },
      ],
    },
    {
      id: "advisory",
      title: language === "ar" ? "المرافقة الاستراتيجية ومستوى الخدمة (SLA)" : "Strategic Advisory & Dedicated Leadership",
      icon: <Award className="w-4 h-4 text-navy-600" />,
      features: [
        {
          name: language === "ar" ? "مستوى الخبير المالي المسؤول" : "Assigned Financial Lead",
          standard: {
            included: true,
            text: language === "ar" ? "محاسب أول معتمد (Senior Accountant)" : "Certified Senior Accountant",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "مدير مالي تنفيذي معتمد ومستشار ضرائب شريك" : "Fractional CFO (Chartered Director / Big 4 background)",
          },
        },
        {
          name: language === "ar" ? "جلسات التوجيه المالي واجتماعات الإدارة" : "Monthly Executive Strategy Sessions",
          standard: {
            included: false,
            text: language === "ar" ? "تواصل كتابي واستفسارات قياسية" : "Written email Q&A",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "جلسة استراتيجية شهرية (1:1) مع حضور اجتماعات مجلس الإدارة" : "Monthly 1-on-1 Board/Executive sessions & leadership reviews",
          },
        },
        {
          name: language === "ar" ? "قنوات الدعم وسرعة الاستجابة" : "Support Channels & Priority SLA",
          standard: {
            included: true,
            text: language === "ar" ? "البريد الإلكتروني وتذاكر الدعم (خلال 24-48 ساعة)" : "Email & Helpdesk (24-48h response)",
          },
          cfo: {
            included: true,
            text: language === "ar" ? "واتساب مباشر وقناة مخصصة للرؤساء التنفيذيين (استجابة فورية)" : "Direct WhatsApp line, priority phone access (<4h SLA)",
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

  return (
    <div className="mt-16 pt-12 border-t border-slate-200/80 space-y-10" id="service-comparison">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-900/5 border border-navy-900/10 text-navy-900 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold-500" />
          <span>{language === "ar" ? "مصفوفة مقارنة الخدمات" : "Tier Comparison Matrix"}</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight">
          {language === "ar"
            ? "الخدمات المحاسبية القياسية مقابل الإدارة المالية التنفيذية (CFO)"
            : "Standard Accounting vs. Premium CFO Advisory"}
        </h3>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
          {language === "ar"
            ? "اكتشف الفروقات الجوهرية بين الامتثال المحاسبي اليومي والاستشارات المالية التوجيهية لاختيار المستوى الأمثل لنمو أعمالك في دولة الإمارات."
            : "Compare our core accounting compliance with strategic Fractional CFO stewardship to choose the exact level of support your UAE business requires."}
        </p>
      </div>

      {/* Tier Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto px-4">
        {/* Tier 1: Standard Accounting */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {language === "ar" ? "الامتثال الأساسي" : "Essential Compliance"}
              </span>
            </div>

            <div>
              <h4 className="font-display text-xl font-bold text-navy-950">
                {language === "ar" ? "المحاسبة والضرائب القياسية" : "Standard Accounting & Tax"}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {language === "ar"
                  ? "مثالية للشركات الناشئة والمنشآت الصغيرة التي تبحث عن امتثال كامل بنسبة 100% لمتطلبات هيئة الضرائب ودفاتر منظمة بأقل تكلفة."
                  : "Ideal for startups and growing SMEs needing 100% FTA tax compliance, clean books, and regular financial statements without full-time headcount."}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  <strong>{language === "ar" ? "التركيز الرئيسي:" : "Core Focus:"}</strong>{" "}
                  {language === "ar" ? "تسجيل المعاملات التاريخية والامتثال للضريبة" : "Historical compliance & tax filings"}
                </span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>
                  <strong>{language === "ar" ? "مستوى التسليم:" : "Delivery:"}</strong>{" "}
                  {language === "ar" ? "شهري / ربع سنوي" : "Monthly / Quarterly cycle"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleAction("Standard Accounting")}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-950 text-xs font-display font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === "ar" ? "استشارة الباقة القياسية" : "Select Standard Tier"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Tier 2: Fractional CFO Advisory */}
        <div className="bg-gradient-to-br from-navy-950 via-slate-900 to-navy-950 border-2 border-gold-500/60 rounded-2xl p-6 shadow-xl text-white flex flex-col justify-between relative overflow-hidden group">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold-500 text-navy-950 shadow-sm flex items-center gap-1">
                <Award className="w-3 h-3" />
                {language === "ar" ? "الأكثر شمولاً واستراتيجية" : "Strategic & High-Impact"}
              </span>
            </div>

            <div>
              <h4 className="font-display text-xl font-bold text-white flex items-center gap-2">
                {language === "ar" ? "الإدارة المالية التنفيذية (CFO)" : "Fractional CFO & Advisory"}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {language === "ar"
                  ? "للشركات المتوسعة، المجموعات التجارية، والشركات التي تستعد لجولات استثمارية أو تطلب قيادة مالية استراتيجية لتحسين السيولة والربحية."
                  : "Designed for high-growth firms and multi-entity groups needing proactive cash runway modeling, board advisory, and strategic financial leadership."}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="text-xs text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>
                  <strong>{language === "ar" ? "التركيز الرئيسي:" : "Core Focus:"}</strong>{" "}
                  {language === "ar" ? "التوسع، تعظيم الأرباح، وإدارة السيولة المستقبلية" : "Profit growth, cash forecasting & strategy"}
                </span>
              </div>
              <div className="text-xs text-slate-200 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>
                  <strong>{language === "ar" ? "مستوى التسليم:" : "Delivery:"}</strong>{" "}
                  {language === "ar" ? "أسبوعي ومباشر مع مستشار شريك" : "Active continuous steering & monthly 1:1 board sessions"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 relative z-10">
            <button
              onClick={() => handleAction("Fractional CFO Advisory")}
              className="w-full py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-display font-bold transition-all shadow-md shadow-gold-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === "ar" ? "حجز جلسة استراتيجية مع CFO" : "Book CFO Strategy Session"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher (Visible on small screens) */}
      <div className="block md:hidden max-w-md mx-auto px-4">
        <div className="bg-slate-200/70 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => setMobileActiveTab("standard")}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              mobileActiveTab === "standard"
                ? "bg-white text-navy-950 shadow-sm"
                : "text-slate-600 hover:text-navy-950"
            }`}
          >
            {language === "ar" ? "المحاسبة القياسية" : "Standard Accounting"}
          </button>
          <button
            onClick={() => setMobileActiveTab("cfo")}
            className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              mobileActiveTab === "cfo"
                ? "bg-navy-950 text-gold-400 shadow-sm"
                : "text-slate-600 hover:text-navy-950"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>{language === "ar" ? "استشارات CFO" : "CFO Advisory"}</span>
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table (Desktop & Tablet) */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Table Header (Desktop) */}
          <div className="hidden md:grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-xs font-display font-bold text-navy-950 py-4 px-6 sticky top-0 z-20 backdrop-blur-md">
            <div className="col-span-6 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-slate-400" />
              <span>{language === "ar" ? "الميزات والقدرات التفصيلية" : "Capability & Scope of Deliverables"}</span>
            </div>
            <div className="col-span-3 text-center border-x border-slate-200/80 px-2 text-slate-700">
              <span>{language === "ar" ? "المحاسبة القياسية" : "Standard Accounting"}</span>
            </div>
            <div className="col-span-3 text-center px-2 text-navy-950 font-extrabold flex items-center justify-center gap-1 text-gold-700">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>{language === "ar" ? "استشارات CFO التنفيذية" : "Premium CFO Advisory"}</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {comparisonData.map((category) => (
              <div key={category.id} className="divide-y divide-slate-50">
                {/* Category Header Row */}
                <div className="bg-slate-100/60 px-6 py-2.5 flex items-center gap-2 font-display font-bold text-xs text-navy-900 uppercase tracking-wider">
                  {category.icon}
                  <span>{category.title}</span>
                </div>

                {/* Feature Rows */}
                {category.features.map((feature, idx) => (
                  <div key={idx}>
                    {/* Desktop View Row */}
                    <div className="hidden md:grid grid-cols-12 px-6 py-3.5 hover:bg-slate-50/70 transition-colors items-center text-xs">
                      {/* Feature Name & Tooltip */}
                      <div className="col-span-6 pr-4 space-y-0.5">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <span>{feature.name}</span>
                          {feature.tooltip && (
                            <span 
                              title={feature.tooltip}
                              className="text-slate-400 hover:text-slate-600 cursor-help"
                            >
                              <HelpCircle className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        {feature.tooltip && (
                          <div className="text-[11px] text-slate-400 leading-tight">
                            {feature.tooltip}
                          </div>
                        )}
                      </div>

                      {/* Standard Value */}
                      <div className="col-span-3 text-center border-x border-slate-100 px-3 py-1 flex flex-col items-center justify-center text-slate-600">
                        {feature.standard.included === true && (
                          <Check className="w-4 h-4 text-emerald-600 mb-1" />
                        )}
                        {feature.standard.included === "basic" && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded mb-1">
                            {language === "ar" ? "أساسي" : "Basic"}
                          </span>
                        )}
                        {feature.standard.included === "addon" && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded mb-1">
                            {language === "ar" ? "إضافي" : "Add-on"}
                          </span>
                        )}
                        {feature.standard.included === false && (
                          <Minus className="w-4 h-4 text-slate-300 mb-1" />
                        )}
                        <span className="text-[11px] text-slate-500 text-center leading-snug">
                          {feature.standard.text}
                        </span>
                      </div>

                      {/* CFO Value */}
                      <div className="col-span-3 text-center px-3 py-1 flex flex-col items-center justify-center font-medium bg-gold-50/30 rounded-lg">
                        {feature.cfo.included === true && (
                          <div className="w-4 h-4 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center mb-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <span className="text-[11px] text-navy-950 font-semibold text-center leading-snug">
                          {feature.cfo.text}
                        </span>
                      </div>
                    </div>

                    {/* Mobile View Card (Toggled by active mobile tab) */}
                    <div className="block md:hidden p-4 space-y-2 bg-white">
                      <div className="font-semibold text-xs text-navy-950">
                        {feature.name}
                      </div>

                      {mobileActiveTab === "standard" ? (
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2 text-xs">
                          {feature.standard.included === true && (
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                          {feature.standard.included === "basic" && (
                            <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
                              {language === "ar" ? "أساسي" : "Basic"}
                            </span>
                          )}
                          {feature.standard.included === "addon" && (
                            <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                              {language === "ar" ? "إضافي" : "Add-on"}
                            </span>
                          )}
                          {feature.standard.included === false && (
                            <Minus className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <span className="text-slate-600 text-[11px]">
                            {feature.standard.text}
                          </span>
                        </div>
                      ) : (
                        <div className="bg-gold-50/60 p-2.5 rounded-xl border border-gold-200 flex items-start gap-2 text-xs">
                          <div className="w-4 h-4 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[3]" />
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

          {/* Table Footer Actions */}
          <div className="hidden md:grid grid-cols-12 bg-slate-50/90 border-t border-slate-200 p-6 items-center">
            <div className="col-span-6 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 block">
                {language === "ar" ? "هل تحتاج إلى استشارة مخصصة؟" : "Not sure which tier fits your current stage?"}
              </span>
              <span>
                {language === "ar"
                  ? "احجز مكالمة استكشافية مجانية مدتها 30 دقيقة لتقييم حجم أعمالك وتحديد الباقة الأنسب."
                  : "Book a complimentary 30-minute discovery session with Glen Dias to assess your transaction volume."}
              </span>
            </div>
            <div className="col-span-3 text-center px-2">
              <button
                onClick={() => handleAction("Standard Accounting")}
                className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-navy-900 border border-slate-200 font-display font-bold text-xs transition-all shadow-sm cursor-pointer"
              >
                {language === "ar" ? "طلب المحاسبة القياسية" : "Get Standard Plan"}
              </button>
            </div>
            <div className="col-span-3 text-center px-2">
              <button
                onClick={() => handleAction("Fractional CFO Advisory")}
                className="py-2.5 px-4 rounded-xl bg-navy-900 hover:bg-navy-950 text-gold-400 border border-gold-500/30 font-display font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>{language === "ar" ? "طلب استشارات CFO" : "Get CFO Advisory"}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
