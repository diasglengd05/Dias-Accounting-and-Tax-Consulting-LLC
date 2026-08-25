import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  HelpCircle,
  Award,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface MonthlyDataPoint {
  monthKey: string;
  monthNameEn: string;
  monthNameAr: string;
  milestoneEn: string;
  milestoneAr: string;
  standardMonthly: number;
  premiumMonthly: number;
  standardCumulative: number;
  premiumCumulative: number;
}

type BusinessTier = "startup" | "sme" | "midmarket";

interface TierConfig {
  id: BusinessTier;
  labelEn: string;
  labelAr: string;
  subEn: string;
  subAr: string;
  multiplier: number;
  baseAnnualRevenue: string;
}

const TIERS: TierConfig[] = [
  {
    id: "startup",
    labelEn: "Startup / SME",
    labelAr: "الشركات الناشئة والصغيرة",
    subEn: "AED 500k – 3M Revenue",
    subAr: "إيرادات 500 ألف – 3 مليون د.إ",
    multiplier: 1,
    baseAnnualRevenue: "AED 1.8M",
  },
  {
    id: "sme",
    labelEn: "Growing Commercial LLC",
    labelAr: "شركات تجارية ذات مسؤولية محدودة",
    subEn: "AED 3M – 12M Revenue",
    subAr: "إيرادات 3 – 12 مليون د.إ",
    multiplier: 2.8,
    baseAnnualRevenue: "AED 6.5M",
  },
  {
    id: "midmarket",
    labelEn: "Free Zone / Multi-Entity Group",
    labelAr: "مجموعات المناطق الحرة والشركات الكبرى",
    subEn: "AED 12M – 35M+ Revenue",
    subAr: "إيرادات 12 – 35+ مليون د.إ",
    multiplier: 6.5,
    baseAnnualRevenue: "AED 20M",
  },
];

// Base monthly distribution (in AED) for a standard 12-month fiscal timeline
const BASE_12_MONTH_PROFILE = [
  {
    monthKey: "M1",
    monthNameEn: "M1: Setup & Onboarding",
    monthNameAr: "الشهر 1: التأسيس والتسجيل",
    milestoneEn: "EmaraTax Account Setup & Ledger Restructuring",
    milestoneAr: "إعداد حساب إماراتاكس وإعادة هيكلة الدفاتر",
    standard: 1200,
    premium: 3800,
  },
  {
    monthKey: "M2",
    monthNameEn: "M2: Backlog Audit",
    monthNameAr: "الشهر 2: تدقيق السجلات السابقة",
    milestoneEn: "Unclaimed Input VAT Recovery & Expense Reconciliation",
    milestoneAr: "استرداد مدخلات ضريبة القيمة المضافة غير المطالب بها",
    standard: 1500,
    premium: 5400,
  },
  {
    monthKey: "M3",
    monthNameEn: "M3: Q1 VAT Filing",
    monthNameAr: "الشهر 3: إقرار الربع الأول (VAT)",
    milestoneEn: "Zero-Error Quarterly VAT Return & Penalty Shield",
    milestoneAr: "إقرار ضريبي ربع سنوي خالٍ من الأخطاء وحماية من الغرامات",
    standard: 1800,
    premium: 6200,
  },
  {
    monthKey: "M4",
    monthNameEn: "M4: Corporate Tax Prep",
    monthNameAr: "الشهر 4: تجهيز ضريبة الشركات",
    milestoneEn: "Small Business Relief (SBR) Eligibility Claim",
    milestoneAr: "تطبيق تسهيلات الأعمال الصغيرة وتخفيض الوعاء الضريبي",
    standard: 1500,
    premium: 7100,
  },
  {
    monthKey: "M5",
    monthNameEn: "M5: Transfer Pricing Review",
    monthNameAr: "الشهر 5: مراجعة تسعير المعاملات",
    milestoneEn: "Related Party & Arm's Length Transaction Structuring",
    milestoneAr: "هيكلة معاملات الأطراف المرتبطة وفق مبدأ الحياد المالي",
    standard: 1600,
    premium: 6800,
  },
  {
    monthKey: "M6",
    monthNameEn: "M6: Q2 VAT & Mid-Year Audit",
    monthNameAr: "الشهر 6: إقرار الربع 2 ومراجعة نصف سنوية",
    milestoneEn: "Mid-Year Financial Audit & Disallowed Cost Cleanup",
    milestoneAr: "تدقيق مالي نصفي وتعديل التكاليف غير المسموح بخصمها",
    standard: 2000,
    premium: 8500,
  },
  {
    monthKey: "M7",
    monthNameEn: "M7: Cash Flow Optimization",
    monthNameAr: "الشهر 7: تحسين السيولة النقدية",
    milestoneEn: "Tax-Efficient Working Capital & Supplier VAT Timing",
    milestoneAr: "تحسين دورة رأس المال وتوقيت استرداد ضريبة الموردين",
    standard: 1600,
    premium: 7400,
  },
  {
    monthKey: "M8",
    monthNameEn: "M8: Free Zone 0% Structuring",
    monthNameAr: "الشهر 8: هيكلة إعفاء المنطقة الحرة 0%",
    milestoneEn: "Qualifying Free Zone Person (QFZP) Proof & De Minimis Rules",
    milestoneAr: "توثيق شروط الدخل المؤهل للمنطقة الحرة وتجنب فقدان نسبة 0%",
    standard: 1700,
    premium: 9200,
  },
  {
    monthKey: "M9",
    monthNameEn: "M9: Q3 VAT Filing",
    monthNameAr: "الشهر 9: إقرار الربع الثالث (VAT)",
    milestoneEn: "Quarterly Return & Cross-Border Supply Compliance",
    milestoneAr: "إقرار ربع سنوي وتوثيق توريدات التصدير بنسبة الصفر",
    standard: 1900,
    premium: 7800,
  },
  {
    monthKey: "M10",
    monthNameEn: "M10: Pre-Year End Strategy",
    monthNameAr: "الشهر 10: استراتيجية ما قبل نهاية العام",
    milestoneEn: "Allowable Deduction Maximization & Capital Allowance",
    milestoneAr: "تعظيم الإهلاكات الرأسمالية والخصومات الضريبية المقبولة",
    standard: 1800,
    premium: 9600,
  },
  {
    monthKey: "M11",
    monthNameEn: "M11: Final Return Prep",
    monthNameAr: "الشهر 11: إعداد الإقرار الختامي",
    milestoneEn: "Audit Trail Finalization & Closing Stock Valuation",
    milestoneAr: "اعتماد مسار التدقيق وتقييم المخزون الختامي وفق المعايير",
    standard: 2200,
    premium: 10400,
  },
  {
    monthKey: "M12",
    monthNameEn: "M12: Corporate Tax & 9% Filing",
    monthNameAr: "الشهر 12: إقرار 9% السنوي والتسوية",
    milestoneEn: "Corporate Tax Submission, Relief Locked & FTA Clearance",
    milestoneAr: "تقديم إقرار ضريبة الشركات واعتماد الإعفاءات وبراءة الذمة",
    standard: 2800,
    premium: 14500,
  },
];

export const TaxPlanningSavingsChart: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const isAr = language === "ar";

  const [selectedTier, setSelectedTier] = useState<BusinessTier>("startup");
  const [viewMode, setViewMode] = useState<"cumulative" | "monthly">("cumulative");

  const currentTierConfig = useMemo(
    () => TIERS.find((t) => t.id === selectedTier) || TIERS[0],
    [selectedTier]
  );

  // Compute 12-month dynamic series based on tier multiplier
  const chartData: MonthlyDataPoint[] = useMemo(() => {
    let cumStandard = 0;
    let cumPremium = 0;
    const mult = currentTierConfig.multiplier;

    return BASE_12_MONTH_PROFILE.map((item) => {
      const standardMonthly = Math.round(item.standard * mult);
      const premiumMonthly = Math.round(item.premium * mult);
      cumStandard += standardMonthly;
      cumPremium += premiumMonthly;

      return {
        monthKey: item.monthKey,
        monthNameEn: item.monthNameEn,
        monthNameAr: item.monthNameAr,
        milestoneEn: item.milestoneEn,
        milestoneAr: item.milestoneAr,
        standardMonthly,
        premiumMonthly,
        standardCumulative: cumStandard,
        premiumCumulative: cumPremium,
      };
    });
  }, [currentTierConfig]);

  const lastMonth = chartData[chartData.length - 1];
  const totalStandard = lastMonth.standardCumulative;
  const totalPremium = lastMonth.premiumCumulative;
  const totalNetDiff = totalPremium - totalStandard;
  const roiMultiplier = (totalPremium / (totalStandard || 1)).toFixed(1);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const dataPoint = chartData.find((d) => d.monthKey === label);
    if (!dataPoint) return null;

    const stdVal =
      viewMode === "cumulative"
        ? dataPoint.standardCumulative
        : dataPoint.standardMonthly;
    const premVal =
      viewMode === "cumulative"
        ? dataPoint.premiumCumulative
        : dataPoint.premiumMonthly;
    const diffVal = premVal - stdVal;

    return (
      <div className="bg-navy-950/95 backdrop-blur-md text-white border border-gold-500/30 rounded-xl p-3.5 shadow-2xl text-xs max-w-xs space-y-2">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <span className="font-display font-bold text-gold-400">
            {isAr ? dataPoint.monthNameAr : dataPoint.monthNameEn}
          </span>
          <span className="text-[10px] text-slate-300 font-mono">
            {viewMode === "cumulative"
              ? isAr
                ? "تراكمي 12 شهراً"
                : "12-Mo Cumulative"
              : isAr
              ? "وفورات شهرية"
              : "Monthly Savings"}
          </span>
        </div>

        <div className="space-y-1.5 font-mono">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
              {isAr ? "المحاسبة القياسية:" : "Standard Filing:"}
            </span>
            <span className="font-bold text-slate-100">
              AED {stdVal.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-gold-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400 inline-block" />
              {isAr ? "التخطيط الضريبي المتقدم:" : "Premium Strategy:"}
            </span>
            <span className="font-bold text-emerald-400">
              AED {premVal.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/10 text-[11px]">
            <span className="text-emerald-300 font-semibold">
              {isAr ? "وفورات إضافية مستردة:" : "Net Extra Saved:"}
            </span>
            <span className="font-bold text-emerald-400">
              +AED {diffVal.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="pt-1.5 border-t border-white/10 text-[10px] text-slate-300 italic leading-tight">
          💡 {isAr ? dataPoint.milestoneAr : dataPoint.milestoneEn}
        </div>
      </div>
    );
  };

  return (
    <div
      id="tax-planning-savings-chart"
      className="mt-12 bg-gradient-to-b from-navy-950 via-slate-900 to-navy-950 border-2 border-gold-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header Title and Description */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {isAr
                  ? "تحليل العائد على الاستثمار الضريبي (12 شهراً)"
                  : "12-Month Tax ROI & Planning Impact Visualizer"}
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isAr
                ? "مقارنة الوفورات المالية: المحاسبة القياسية مقابل التخطيط الضريبي الاستراتيجي"
                : "Standard Compliance vs. Premium Tax Strategy Savings"}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? "شاهد كيف يساهم التخطيط الضريبي المتقدم وهيكلة الدخل المؤهل واسترداد ضريبة المدخلات في مضاعفة أرباحك وتجنب غرامات الهيئة الاتحادية للضرائب على مدار العام."
                : "Interactive projection showing how proactive VAT optimization, 0% Free Zone structuring, allowable deductions, and audit defense protect bottom-line profits vs. basic ledger bookkeeping."}
            </p>
          </div>

          {/* Quick Metrics Callout */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {isAr ? "معدل العائد الإضافي" : "Average Tax Strategy ROI"}
              </div>
              <div className="font-display text-lg sm:text-xl font-bold text-emerald-400">
                {roiMultiplier}x{" "}
                <span className="text-xs font-medium text-slate-300">
                  (+AED {totalNetDiff.toLocaleString()})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-1">
          {/* Business Tier Switcher */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              {isAr ? "اختر حجم المنشأة ونطاق الإيرادات:" : "Select Entity Size & Scale:"}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedTier(tier.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    selectedTier === tier.id
                      ? "bg-gold-500 text-navy-950 border-gold-400 font-bold shadow-lg shadow-gold-500/25 scale-[1.02]"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div>{isAr ? tier.labelAr : tier.labelEn}</div>
                  <div className="text-[10px] opacity-75 font-normal">
                    {isAr ? tier.subAr : tier.subEn}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle: Cumulative vs Monthly */}
          <div className="space-y-1.5 md:self-end">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block md:text-right rtl:md:text-left">
              {isAr ? "طريقة العرض:" : "View Mode:"}
            </label>
            <div className="bg-navy-900/90 border border-white/15 p-1 rounded-xl flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("cumulative")}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
                  viewMode === "cumulative"
                    ? "bg-gold-500 text-navy-950 font-bold shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {isAr ? "الوفورات التراكمية (12 شهر)" : "12-Month Cumulative"}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("monthly")}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
                  viewMode === "monthly"
                    ? "bg-gold-500 text-navy-950 font-bold shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {isAr ? "الوفورات الشهرية" : "Monthly Breakdown"}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Key Stat Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              {isAr ? "المحاسبة والامتثال القياسي" : "Standard Compliance Savings"}
            </div>
            <div className="text-xl font-display font-bold text-slate-200">
              AED {totalStandard.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              {isAr
                ? "استرداد VAT روتيني وتوثيق القيود الدفترية الأساسية"
                : "Basic VAT deduction & routine statutory return filing"}
            </div>
          </div>

          <div className="bg-gold-500/10 border border-gold-500/30 rounded-2xl p-3.5 space-y-1">
            <div className="text-[11px] text-gold-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-gold-400" />
              {isAr ? "التخطيط الضريبي المتقدم (CFO)" : "Premium Strategy Savings"}
            </div>
            <div className="text-xl font-display font-bold text-gold-400">
              AED {totalPremium.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-300 leading-tight">
              {isAr
                ? "إعفاء 0% للمنطقة الحرة، SBR 3 مليون، وتدقيق استباقي"
                : "0% QFZP tax structuring, SBR claim & active audit shield"}
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 space-y-1">
            <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              {isAr ? "صافي الوفورات الإضافية المحققة" : "Net Incremental Profit Protected"}
            </div>
            <div className="text-xl font-display font-bold text-emerald-400">
              +AED {totalNetDiff.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-300 leading-tight">
              {isAr
                ? `عائد استثماري يبلغ ${roiMultiplier} أضعاف التكلفة`
                : `${roiMultiplier}x higher cash retention across 12 fiscal months`}
            </div>
          </div>
        </div>

        {/* Responsive Recharts Visualization Canvas */}
        <div className="bg-navy-950/80 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded bg-slate-400/80 inline-block" />
                {isAr ? "المحاسبة القياسية" : "Standard Accounting"}
              </span>
              <span className="flex items-center gap-1.5 font-medium text-gold-300">
                <span className="w-3 h-3 rounded bg-gold-400 inline-block" />
                {isAr ? "التخطيط الضريبي الاستراتيجي" : "Strategic Tax Planning (CFO)"}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              {isAr ? "القيم بالدرهم الإماراتي (AED)" : "Values in AED (UAE Dirham)"}
            </span>
          </div>

          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  {/* Premium Gold/Emerald Gradient */}
                  <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.45} />
                    <stop offset="60%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>

                  {/* Standard Slate Gradient */}
                  <linearGradient id="standardGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />

                <XAxis
                  dataKey="monthKey"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#475569" }}
                />

                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#475569" }}
                  tickFormatter={(val) =>
                    val >= 1000 ? `${Math.round(val / 1000)}k` : val
                  }
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Standard Series */}
                <Area
                  type="monotone"
                  dataKey={
                    viewMode === "cumulative"
                      ? "standardCumulative"
                      : "standardMonthly"
                  }
                  name={isAr ? "المحاسبة القياسية" : "Standard Accounting"}
                  stroke="#94a3b8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#standardGradient)"
                />

                {/* Premium Series */}
                <Area
                  type="monotone"
                  dataKey={
                    viewMode === "cumulative"
                      ? "premiumCumulative"
                      : "premiumMonthly"
                  }
                  name={isAr ? "التخطيط الضريبي المتقدم" : "Premium Tax Strategy"}
                  stroke="#fbbf24"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#premiumGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Timeline Milestones Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-2 border-t border-white/10 text-[11px]">
            <div className="p-2 rounded-lg bg-white/5">
              <span className="text-gold-400 font-bold block">Q1 (M1-M3)</span>
              <span className="text-slate-300 text-[10px]">
                {isAr ? "تسوية الدفاتر واسترداد VAT" : "Backlog Recovery & First VAT Filing"}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <span className="text-gold-400 font-bold block">Q2 (M4-M6)</span>
              <span className="text-slate-300 text-[10px]">
                {isAr ? "إعفاء 3 مليون & التدقيق النصفي" : "SBR Relief & Mid-Year Audit"}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <span className="text-gold-400 font-bold block">Q3 (M7-M9)</span>
              <span className="text-slate-300 text-[10px]">
                {isAr ? "شروط المنطقة الحرة 0% QFZP" : "0% Free Zone QFZP Structuring"}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <span className="text-gold-400 font-bold block">Q4 (M10-M12)</span>
              <span className="text-slate-300 text-[10px]">
                {isAr ? "إقرار 9% السنوي والخصومات" : "9% Corporate Tax Submission"}
              </span>
            </div>
            <div className="col-span-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-emerald-400 font-bold block">
                  {isAr ? "ضمان عدم التعرض للغرامات" : "Zero-Penalty Guarantee"}
                </span>
                <span className="text-slate-300 text-[10px]">
                  {isAr ? "توفير غرامة 10 آلاف درهم للتأخير" : "Saves AED 10k+ late filing fines"}
                </span>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-400 hover:text-gold-300 underline"
              >
                {isAr ? "احجز استشارتك" : "Claim Strategy"}
                <ChevronRight className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
