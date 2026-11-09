import React from "react";
import {
  Shield,
  AlertCircle,
  Check,
  X,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import StandalonePricingCards from "./StandalonePricingCards";
import LazyMount from "./LazyMount";

interface HomepagePricingSectionProps {
  billingPeriod: "monthly" | "annual";
  setBillingPeriod: (period: "monthly" | "annual") => void;
  pricingPath: "prospective" | "retrospective";
  setPricingPath: (path: "prospective" | "retrospective") => void;
  onNavigate: (path: string) => void;
  language: "en" | "ar";
  onPreselectedCallBooking?: (serviceTitle?: string) => void;
}

export const HomepagePricingSection: React.FC<HomepagePricingSectionProps> = ({
  billingPeriod,
  setBillingPeriod,
  pricingPath,
  setPricingPath,
  onNavigate,
  language,
  onPreselectedCallBooking,
}) => {
  const isAr = language === "ar";

  const handleSelectPackage = (packageName: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dias_selected_service", packageName);
    }
    const text = isAr
      ? `مرحباً دياس للمحاسبة، أود اختيار ${packageName} (${
          billingPeriod === "annual" ? "اشتراك سنوي" : "اشتراك شهري"
        }) لشركتي في الإمارات.`
      : `Hi Dias Accounting, I would like to choose the ${packageName} (${
          billingPeriod === "annual" ? "Annual Billing" : "Monthly Billing"
        }) for my UAE business.`;
    window.open(`https://wa.me/971529226958?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section
      id="pricing"
      className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-20 sm:scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Block Matching Pricing & Packages */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-700 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-gold-600" />
            <span>
              {isAr
                ? "وكالة ضريبية مسجلة لدى الهيئة الاتحادية للضرائب · باقات ثابتة شفافة"
                : "FTA Registered Tax Agency · Transparent Fixed Pricing"}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight leading-tight">
            {isAr
              ? "باقات محاسبية ثابتة وشفافة للشركات في الإمارات"
              : "Transparent Fixed-Fee Accounting Packages for UAE Businesses"}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {isAr
              ? "لا مفاجآت، لا رسوم خفية، ولا تكاليف إضافية على المعاملات. راحة بال تامة مع مسك دفاتر متوافق مع معايير الهيئة، إقرارات ضريبة القيمة المضافة، وضريبة الشركات بأسعار شهرية محددة تبدأ من 500 درهم شهرياً."
              : "No hidden surprises, surprise hourly billing, or transaction markups. Get complete peace of mind with FTA-compliant bookkeeping, quarterly VAT filing, and corporate tax returns at predictable monthly rates starting at AED 500/month."}
          </p>

          {/* Pricing Note Banner */}
          <div className="p-4 rounded-xl bg-gold-500/15 border border-gold-400/40 text-gold-900 text-xs sm:text-sm leading-relaxed flex items-start gap-3 text-left rtl:text-right">
            <AlertCircle className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
            <p>
              <strong>{isAr ? "ملاحظة هامة:" : "Note:"}</strong>{" "}
              {isAr
                ? "يعتمد التسعير النهائي على نشاط عملك، وحجم المعاملات الشهرية، ومتطلبات تقديم الإقرارات. احجز استشارة مجانية للحصول على عرض سعر دقيق مخصص."
                : "Final pricing depends on your business activity, transaction volume, and filing requirements. Book a free consultation for an accurate quote."}
            </p>
          </div>
        </div>

        {/* Pricing Mode Toggle: Ongoing vs Backlog */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-navy-950 border border-gold-500/30 rounded-2xl shadow-lg max-w-md w-full">
            <button
              type="button"
              onClick={() => setPricingPath("prospective")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-display font-bold transition-all cursor-pointer text-center ${
                pricingPath === "prospective"
                  ? "bg-gold-500 text-navy-950 shadow-md font-extrabold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {isAr ? "الباقات الشهرية المستمرة" : "Ongoing Monthly Retainers"}
            </button>
            <button
              type="button"
              onClick={() => setPricingPath("retrospective")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-display font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                pricingPath === "retrospective"
                  ? "bg-gold-500 text-navy-950 shadow-md font-extrabold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <span>{isAr ? "إغلاق المتأخرات" : "Backlog Catch-Up"}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-mono">
                {isAr ? "عاجل" : "TAX URGENT"}
              </span>
            </button>
          </div>
        </div>

        {pricingPath === "prospective" ? (
          <div className="space-y-8">
            {/* Billing Interval Switcher */}
            <div className="flex justify-center items-center gap-4">
              <span
                className={`text-xs sm:text-sm font-bold ${
                  billingPeriod === "monthly" ? "text-navy-950" : "text-slate-500"
                }`}
              >
                {isAr ? "الدفع الشهري" : "Billed Monthly"}
              </span>
              <button
                type="button"
                onClick={() =>
                  setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")
                }
                className="w-14 h-8 bg-navy-950 rounded-full p-1 cursor-pointer transition-colors relative"
                aria-label="Toggle annual billing"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-gold-400 shadow-md transition-transform duration-200 ${
                    billingPeriod === "annual" ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
                  billingPeriod === "annual" ? "text-navy-950" : "text-slate-500"
                }`}
              >
                <span>{isAr ? "الدفع السنوي" : "Billed Annually"}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                  {isAr ? "وفر حتى 33% سنوياً" : "Save up to 33% Annually"}
                </span>
              </span>
            </div>

            {/* 3 Main Package Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* 1. Starter Package */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:border-gold-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      TIER 01
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-display text-[10px] font-bold">
                      {isAr ? "التأسيس" : "FOUNDATIONS"}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-navy-950 mb-2">
                    {isAr ? "باقة الأعمال للمبتدئين" : "Business Starter"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {isAr
                      ? "مسك الدفاتر المحاسبية الأساسي بنظام القيد المزدوج والامتثال السنوي لضريبة الشركات."
                      : "Essential double-entry bookkeeping and annual Corporate Tax compliance for new entities."}
                  </p>

                  <div className="p-3.5 bg-slate-50 rounded-2xl mb-6 border border-slate-100">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-navy-900 block mb-1">
                      {isAr ? "الأنسب لـ:" : "BEST FOR:"}
                    </span>
                    <p className="text-xs text-slate-600">
                      {isAr
                        ? "الشركات الناشئة، ورواد الأعمال، والشركات متناهية الصغر التي تبدأ امتثالها لضريبة الشركات لأول مرة."
                        : "Startups, solo entrepreneurs, and micro-SMEs setting up Corporate Tax and financial compliance for the first time."}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="border-y border-slate-100 py-6 mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-slate-700">AED</span>
                      <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy-950">
                        {billingPeriod === "annual" ? "400" : "500"}
                      </span>
                      <span className="text-xs text-slate-500">
                        / {isAr ? "شهر" : "month"}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {billingPeriod === "annual"
                        ? isAr
                          ? "تدفع 4,000 درهم / سنوياً (وفر 2,000 درهم) + 5% ضريبة"
                          : "Billed AED 4,000 / year (Save AED 2,000) + 5% VAT"
                        : isAr
                        ? "تدفع شهرياً 500 درهم + 5% ضريبة"
                        : "Billed monthly at AED 500/mo + 5% VAT"}
                    </span>
                  </div>

                  {/* What is Included */}
                  <div className="space-y-4 mb-6 text-left rtl:text-right">
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-emerald-800 block">
                      {isAr ? "✓ ما تتضمنه الباقة:" : "✓ What is Included:"}
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "مسك الدفاتر المحاسبية شهرياً وفق معايير IFRS"
                            : "Monthly IFRS double-entry bookkeeping & ledger maintenance"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "تسوية الحسابات البنكية وبطاقات الشركات (حتى 50 معاملة/شهر)"
                            : "Bank & corporate card reconciliation (up to 50 transactions/month)"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "إصدار الميزانية العمومية وقائمة الأرباح والخسائر شهرياً"
                            : "Monthly Balance Sheet and Profit & Loss statements"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "إعداد إقرار ضريبة الشركات وتفعيل إعفاء الأعمال الصغيرة 0%"
                            : "Annual Corporate Tax return preparation & 0% SBR election"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "دعم مستمر عبر البريد الإلكتروني مع محاسب أول"
                            : "Dedicated Senior Accountant email support"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* What is NOT Included */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 mb-8 text-left rtl:text-right">
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-500 block">
                      {isAr ? "✕ غير مشمول:" : "✕ What is Not Included:"}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-500">
                      <li className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "إقرارات ضريبة القيمة المضافة الربع سنوية (مشمولة في باقة النمو)"
                            : "Quarterly VAT 201 return filing (available in Corporate Growth)"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "تقرير التدقيق المالي الخارجي المعتمد"
                            : "External statutory audit report sign-off"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "ملفات التسعير التحويلي Transfer Pricing"
                            : "Transfer Pricing Local/Master File documentation"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <a
                    href={`https://wa.me/971529226958?text=${encodeURIComponent(
                      isAr
                        ? `مرحباً دياس للمحاسبة، أود اختيار باقة المبتدئين Business Starter (${
                            billingPeriod === "annual" ? "اشتراك سنوي" : "اشتراك شهري"
                          }) لشركتي في الإمارات.`
                        : `Hi Dias Accounting, I would like to choose the Business Starter Package (${
                            billingPeriod === "annual" ? "AED 400/mo billed annually" : "AED 500/mo"
                          }) for my UAE business.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl border-2 border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? "اختيار باقة المبتدئين" : "Choose Business Starter"}</span>
                  </a>
                  <a
                    href={`https://wa.me/971529226958?text=${encodeURIComponent(
                      isAr
                        ? `مرحباً دياس للمحاسبة، أود الاستفسار عن باقة Business Starter بسعر ${
                            billingPeriod === "annual" ? "400" : "500"
                          } درهم/شهر.`
                        : `Hello Dias Accounting, I'd like to ask about the Business Starter plan (${
                            billingPeriod === "annual" ? "400" : "500"
                          } AED/mo).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 text-center text-xs text-slate-500 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAr ? "استفسر عبر واتساب" : "Inquire via WhatsApp"}</span>
                  </a>
                </div>
              </div>

              {/* 2. Corporate Growth (Recommended / Most Popular) */}
              <div className="bg-white rounded-3xl border-2 border-gold-500 p-8 shadow-xl relative flex flex-col justify-between">
                <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-gold-500 text-navy-950 font-display font-extrabold text-[11px] uppercase tracking-wider shadow-md">
                  {isAr ? "الأكثر طلباً" : "MOST POPULAR"}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-gold-600 uppercase tracking-wider">
                      TIER 02 · {isAr ? "موصى به" : "RECOMMENDED"}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-gold-50 text-gold-700 font-display text-[10px] font-bold">
                      {isAr ? "امتثال شامل" : "FULL COMPLIANCE"}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-navy-950 mb-2">
                    {isAr ? "باقة نمو الشركات" : "Corporate Growth"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {isAr
                      ? "امتثال ضريبي ومحاسبي شامل يغطي ضريبة الشركات (9%) وضريبة القيمة المضافة الربع سنوية."
                      : "Full-scope tax and accounting handling both Corporate Tax (9%) and quarterly VAT compliance."}
                  </p>

                  <div className="p-3.5 bg-gold-50/60 rounded-2xl mb-6 border border-gold-100">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-navy-900 block mb-1">
                      {isAr ? "الأنسب لـ:" : "BEST FOR:"}
                    </span>
                    <p className="text-xs text-slate-700">
                      {isAr
                        ? "الشركات المتوسطة والمتنامية، والتجارة العامة، والشركات الخدمية، والمتاجر الإلكترونية ذات الالتزامات الضريبية النشطة."
                        : "Growing UAE SMEs, trading entities, service companies, and e-commerce brands with active VAT and Corporate Tax obligations."}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="border-y border-slate-100 py-6 mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-slate-700">AED</span>
                      <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy-950">
                        {billingPeriod === "annual" ? "600" : "750"}
                      </span>
                      <span className="text-xs text-slate-500">
                        / {isAr ? "شهر" : "month"}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {billingPeriod === "annual"
                        ? isAr
                          ? "تدفع 6,000 درهم / سنوياً (وفر 3,000 درهم) + 5% ضريبة"
                          : "Billed AED 6,000 / year (Save AED 3,000) + 5% VAT"
                        : isAr
                        ? "تدفع شهرياً 750 درهم + 5% ضريبة"
                        : "Billed monthly at AED 750/mo + 5% VAT"}
                    </span>
                  </div>

                  {/* What is Included */}
                  <div className="space-y-4 mb-6 text-left rtl:text-right">
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-emerald-800 block">
                      {isAr ? "✓ ما تتضمنه الباقة:" : "✓ What is Included:"}
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>
                            {isAr
                              ? "كل ما تشمله باقة المبتدئين"
                              : "Everything in Business Starter"}
                          </strong>{" "}
                          {isAr ? "مشمول بالكامل" : "included"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "احتساب وتقديم إقرارات ضريبة القيمة المضافة VAT 201 عبر منصة إمارات تاكس"
                            : "Quarterly VAT 201 return computation & electronic EmaraTax filing"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "تحسين استرداد ضريبة المدخلات وتدقيق امتثال الفواتير الضريبية"
                            : "Input VAT recovery optimization & invoice compliance verification"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "تقديم إقرار ضريبة الشركات والتسويات الضريبية القانونية للـ 9%"
                            : "Annual Corporate Tax return filing & 9% statutory profit adjustments"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "الجاهزية للفواتير الإلكترونية المرحلة الأولى وتفعيل مزود الخدمة ASP"
                            : "E-invoicing Phase 1 readiness & ASP setup guidance"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "قناة استشارية ذات أولوية عبر الهاتف والواتساب المباشر"
                            : "Priority phone & direct WhatsApp advisory channel"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* What is NOT Included */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 mb-8 text-left rtl:text-right">
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-500 block">
                      {isAr ? "✕ غير مشمول:" : "✕ What is Not Included:"}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-500">
                      <li className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "إعادة بناء الدفاتر المتأخرة للسنوات السابقة (تسعر بشكل منفصل)"
                            : "Multi-year historical backlog ledger reconstruction (quoted separately)"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "دراسات المقارنة الاقتصادية للتسعير التحويلي عبر الحدود"
                            : "Cross-border transfer pricing economic benchmarking studies"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <a
                    href={`https://wa.me/971529226958?text=${encodeURIComponent(
                      isAr
                        ? `مرحباً دياس للمحاسبة، أود اختيار باقة نمو الشركات Corporate Growth (${
                            billingPeriod === "annual" ? "اشتراك سنوي" : "اشتراك شهري"
                          }) لشركتي في الإمارات.`
                        : `Hi Dias Accounting, I would like to choose the Corporate Growth Package (${
                            billingPeriod === "annual" ? "AED 600/mo billed annually" : "AED 750/mo"
                          }) for my UAE business.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-gold-500/20 cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-800" />
                    <span>{isAr ? "اختيار باقة نمو الشركات" : "Choose Corporate Growth"}</span>
                  </a>
                  <a
                    href={`https://wa.me/971529226958?text=${encodeURIComponent(
                      isAr
                        ? `مرحباً دياس للمحاسبة، أود حجز باقة Corporate Growth الأكثر طلباً بسعر ${
                            billingPeriod === "annual" ? "600" : "750"
                          } درهم/شهر.`
                        : `Hello Dias Accounting, I'd like to book the Corporate Growth package (${
                            billingPeriod === "annual" ? "600" : "750"
                          } AED/mo).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 text-center text-xs text-slate-600 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition-colors font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAr ? "حجز فوري عبر واتساب" : "Fast Book via WhatsApp"}</span>
                  </a>
                </div>
              </div>

              {/* 3. Enterprise & CFO Advisory */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:border-gold-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      TIER 03
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white font-display text-[10px] font-bold">
                      {isAr ? "تنفيذي متقدم" : "EXECUTIVE"}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-navy-950 mb-2">
                    {isAr
                      ? "باقة المؤسسات والاستشارات المالية (CFO)"
                      : "Enterprise & CFO Advisory"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {isAr
                      ? "استراتيجيات مالية متقدمة، هيكلة المناطق الحرة لنسبة 0% QFZP، وإدارة مالية تنفيذية متخصصة."
                      : "Advanced strategic finance, Free Zone 0% QFZP structuring, and fractional CFO leadership."}
                  </p>

                  <div className="p-3.5 bg-slate-50 rounded-2xl mb-6 border border-slate-100">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-navy-900 block mb-1">
                      {isAr ? "الأنسب لـ:" : "BEST FOR:"}
                    </span>
                    <p className="text-xs text-slate-600">
                      {isAr
                        ? "مجموعات الشركات متعددة التراخيص، كيانات المناطق الحرة المؤهلة، والشركات ذات الإيرادات المرتفعة."
                        : "Multi-license corporate groups, Free Zone QFZP entities, and high-revenue companies needing senior strategic financial direction."}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="border-y border-slate-100 py-6 mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-slate-700">AED</span>
                      <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy-950">
                        {billingPeriod === "annual" ? "1,000" : "1,250"}
                      </span>
                      <span className="text-xs text-slate-500">
                        / {isAr ? "شهر" : "month"}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {billingPeriod === "annual"
                        ? isAr
                          ? "تدفع 10,000 درهم / سنوياً (وفر 5,000 درهم) + 5% ضريبة"
                          : "Billed AED 10,000 / year (Save AED 5,000) + 5% VAT"
                        : isAr
                        ? "تدفع شهرياً 1,250 درهم + 5% ضريبة"
                        : "Billed monthly at AED 1,250/mo + 5% VAT"}
                    </span>
                  </div>

                  {/* What is Included */}
                  <div className="space-y-4 mb-6 text-left rtl:text-right">
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-emerald-800 block">
                      {isAr ? "✓ ما تتضمنه الباقة:" : "✓ What is Included:"}
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>
                            {isAr
                              ? "كل ما تشمله باقة نمو الشركات"
                              : "Everything in Corporate Growth"}
                          </strong>{" "}
                          {isAr ? "مشمول" : "included"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "جلسة شهرية للتخطيط المالي وتوقعات التدفقات النقدية مع مدير مالي تنفيذي"
                            : "Monthly fractional CFO strategy review & rolling cash flow forecasts"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "امتثال متطلبات الجوهر الاقتصادي ونسبة 0% للمناطق الحرة (QFZP)"
                            : "0% Free Zone Qualifying Free Zone Person (QFZP) substance compliance"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "تنسيق وتسهيل التدقيق القانوني الخارجي وإعداد ملفات المدققين"
                            : "Statutory audit facilitation & external auditor file coordination"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "المساعدة في استخراج شهادة الإقامة الضريبية (TRC) وتقارير ESR"
                            : "Tax residency certificate (TRC) assistance & ESR filings"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "قناة واتساب مباشرة مع الشريك الضريبي الأول"
                            : "Dedicated WhatsApp channel with Senior Tax Partner"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* What is NOT Included */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 mb-8 text-left rtl:text-right">
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-500 block">
                      {isAr ? "✕ غير مشمول:" : "✕ What is Not Included:"}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-500">
                      <li className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "التمثيل القانوني القضائي متعدد المستويات أمام المحاكم"
                            : "Cross-border multi-tier litigation legal representation"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "الفحص النافي للجهالة الشامل لصفقات الاستحواذ والاندماج الكبرى"
                            : "Mergers & Acquisitions buy-side financial due diligence"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <a
                    href={`https://wa.me/971529226958?text=${encodeURIComponent(
                      isAr
                        ? `مرحباً دياس للمحاسبة، أود اختيار باقة المؤسسات Enterprise & CFO Advisory (${
                            billingPeriod === "annual" ? "اشتراك سنوي" : "اشتراك شهري"
                          }) لشركتي في الإمارات.`
                        : `Hi Dias Accounting, I would like to choose the Enterprise Package (${
                            billingPeriod === "annual" ? "AED 1,000/mo billed annually" : "AED 1,250/mo"
                          }) for my UAE business.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl border-2 border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? "اختيار باقة المؤسسات" : "Choose Enterprise Package"}</span>
                  </a>
                  <a
                    href={`https://wa.me/971529226958?text=${encodeURIComponent(
                      isAr
                        ? `مرحباً دياس للمحاسبة، أود مناقشة متطلبات باقة Enterprise & CFO بسعر ${
                            billingPeriod === "annual" ? "1,000" : "1,250"
                          } درهم/شهر.`
                        : `Hello Dias Accounting, I'd like to discuss the Enterprise & CFO plan (${
                            billingPeriod === "annual" ? "1,000" : "1,250"
                          } AED/mo).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 text-center text-xs text-slate-500 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAr ? "استفسر عبر واتساب" : "Inquire via WhatsApp"}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Backlog Catch-Up Pricing Cards (3 Tiers matching PricingPage) */
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* 1. Single Year Catch-Up */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-xs hover:border-gold-400 transition-all text-left rtl:text-right">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      TIER 01
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-display text-[10px] font-bold">
                      {isAr ? "سنة مالية واحدة" : "SINGLE FY"}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-navy-950 mb-2">
                    {isAr
                      ? "إغلاق متأخرات سنة مالية واحدة"
                      : "Single Fiscal Year Backlog"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {isAr
                      ? "إعادة بناء الدفاتر المحاسبية وإعداد القوائم المالية وتقديم إقرار ضريبة الشركات المتأخر لسنة كاملة."
                      : "Complete ledger reconstruction, bank reconciliations, and overdue Corporate Tax filing for 1 fiscal year."}
                  </p>

                  <div className="border-y border-slate-100 py-6 mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-slate-700">AED</span>
                      <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy-950">
                        2,500
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {isAr
                        ? "دفعة واحدة ثابتة لكل سنة مالية + 5% ضريبة"
                        : "One-time fixed fee per fiscal year + 5% VAT"}
                    </span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-emerald-800 block">
                      {isAr ? "المخرجات المشمولة:" : "Included Deliverables:"}
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "تسوية كامل كشوفات الحسابات البنكية للسنة"
                            : "Full bank & card reconciliations for the FY"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "إعداد ميزان المراجعة والميزانية العمومية"
                            : "Trial balance & IFRS balance sheet preparation"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "تقديم إقرار ضريبة الشركات عبر إمارات تاكس"
                            : "Filing overdue corporate tax return on EmaraTax"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <a
                  href={`https://wa.me/971529226958?text=${encodeURIComponent(
                    isAr
                      ? "مرحباً دياس للمحاسبة، أود حجز باكيج إغلاق متأخرات سنة مالية واحدة (2,500 درهم). يرجى إرشادي بالمستندات المطلوبة."
                      : "Hello Dias Accounting, I would like to book the Single Fiscal Year Backlog package (AED 2,500). Please guide me on required documents."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl border-2 border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>
                    {isAr ? "حجز باكيج السنة الواحدة" : "Book Single FY Catchup"}
                  </span>
                </a>
              </div>

              {/* 2. Multi-Year Catch-Up (Recommended for Backlogs) */}
              <div className="bg-white border-2 border-gold-500 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative text-left rtl:text-right">
                <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-gold-500 text-navy-950 font-display font-extrabold text-[11px] uppercase tracking-wider shadow-md">
                  {isAr ? "الأكثر طلباً للمتأخرات" : "POPULAR CATCH-UP"}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-gold-600 uppercase tracking-wider">
                      TIER 02 · {isAr ? "سنتين ماليتين" : "2 FISCAL YEARS"}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-gold-50 text-gold-700 font-display text-[10px] font-bold">
                      {isAr ? "توفير 200 درهم" : "SAVE AED 200"}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-navy-950 mb-2">
                    {isAr
                      ? "إغلاق متأخرات سنتين ماليتين"
                      : "Multi-Year Full Catch-Up (2 FYs)"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {isAr
                      ? "إعادة هيكلة الحسابات بالكامل لسنتين، ومطابقة الفواتير، وحماية المنشأة من غرامات الهيئة التراكمية."
                      : "Two consecutive years of accounting clean-up, statutory audit preparation, and corporate tax submissions."}
                  </p>

                  <div className="border-y border-slate-100 py-6 mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-slate-700">AED</span>
                      <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy-950">
                        4,800
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {isAr
                        ? "دفعة واحدة تشمل عامين كاملين (2,400 درهم/سنة) + 5% ضريبة"
                        : "One-time fee for both years (AED 2,400/yr) + 5% VAT"}
                    </span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-emerald-800 block">
                      {isAr ? "المخرجات المشمولة:" : "Included Deliverables:"}
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "إعادة بناء الأستاذ العام وتصنيف المصروفات الاستثمارية"
                            : "General ledger reconstruction & capital expense tracking"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "إعداد القوائم المالية المقارنة للتدقيق القانوني"
                            : "Comparative IFRS financial statements ready for statutory audit"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "تقديم إقراري ضريبة الشركات للعامين معاً"
                            : "Filing of 2 corporate tax returns on EmaraTax"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <a
                  href={`https://wa.me/971529226958?text=${encodeURIComponent(
                    isAr
                      ? "مرحباً دياس للمحاسبة، أود حجز باكيج إغلاق متأخرات سنتين ماليتين (4,800 درهم). يرجى إرشادي بالمستندات المطلوبة."
                      : "Hello Dias Accounting, I would like to book the Multi-Year Full Catch-Up (2 FYs) package (AED 4,800). Please guide me on required documents."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-gold-500/20 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-navy-950" />
                  <span>
                    {isAr
                      ? "حجز باكيج السنتين عبر واتساب"
                      : "Book 2-Year Catchup on WhatsApp"}
                  </span>
                </a>
              </div>

              {/* 3. E-Commerce & High Volume Clean-up */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-xs hover:border-gold-400 transition-all text-left rtl:text-right">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      TIER 03
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white font-display text-[10px] font-bold">
                      {isAr ? "تجارة إلكترونية وحجم مرتفع" : "E-COMMERCE"}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-navy-950 mb-2">
                    {isAr
                      ? "المتاجر الإلكترونية والشركات المتعددة"
                      : "E-Commerce & High Volume Clean-up"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {isAr
                      ? "تسوية آلاف المعاملات من Stripe وShopify وبوابات الدفع والمنصات الرقمية متعددة العملات."
                      : "High-volume gateway reconciliations (Stripe, Amazon, Tabby, Tamara) with multi-currency books."}
                  </p>

                  <div className="border-y border-slate-100 py-6 mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-slate-700">AED</span>
                      <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy-950">
                        7,500
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {isAr
                        ? "دفعة واحدة لسنة مالية معقدة + 5% ضريبة"
                        : "One-time fee per complex fiscal year + 5% VAT"}
                    </span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-emerald-800 block">
                      {isAr ? "المخرجات المشمولة:" : "Included Deliverables:"}
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "مطابقة بوابات الدفع ومبيعات نقاط البيع POS"
                            : "Payment gateway & merchant payout reconciliation"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "معالجة المخزون وتكلفة البضاعة المباعة COGS"
                            : "Inventory valuation & automated COGS tracking"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {isAr
                            ? "تقديم إقرار ضريبة الشركات وتجهيز ملف التدقيق"
                            : "Full corporate tax filing + audit readiness dossier"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <a
                  href={`https://wa.me/971529226958?text=${encodeURIComponent(
                    isAr
                      ? "مرحباً دياس للمحاسبة، أود حجز باكيج تسوية حسابات المتاجر الإلكترونية (7,500 درهم). يرجى إرشادي بالمستندات المطلوبة."
                      : "Hello Dias Accounting, I would like to book the E-Commerce & High Volume Clean-up package (AED 7,500). Please guide me on required documents."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl border-2 border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>
                    {isAr
                      ? "حجز باكيج التجارة الإلكترونية"
                      : "Book E-Commerce Package"}
                  </span>
                </a>
              </div>
            </div>

            {/* Standalone Regulatory Services */}
            <div className="pt-4">
              <LazyMount minHeight={280}>
                <React.Suspense
                  fallback={
                    <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                      Loading Standalone Services...
                    </div>
                  }
                >
                  <StandalonePricingCards
                    onSelectService={onPreselectedCallBooking}
                  />
                </React.Suspense>
              </LazyMount>
            </div>
          </div>
        )}

        {/* Bottom Action Card & Links */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left rtl:md:text-right">
          <div className="space-y-1">
            <h4 className="font-display font-bold text-base text-navy-950">
              {isAr
                ? "هل تبحث عن جدول مقارنة تفصيلي لجميع الميزات أو عرض مخصص؟"
                : "Looking for the full detailed feature comparison table or a custom quote?"}
            </h4>
            <p className="text-xs text-slate-500">
              {isAr
                ? "اطلع على صفحة الأسعار الكاملة مع مقارنة 20+ معيار محاسبي وضريبي أو تواصل مع فريقنا مباشرة."
                : "Explore the comprehensive Pricing & Packages page with 20+ feature line items, FAQ breakdown, or speak directly with an FTA consultant."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate("/pricing")}
              className="px-5 py-3 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>
                {isAr
                  ? "عرض صفحة الأسعار الكاملة"
                  : "View Full Pricing & Packages"}
              </span>
              <ArrowRight className="w-4 h-4 text-gold-400 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/contact")}
              className="px-5 py-3 rounded-xl border-2 border-gold-500 hover:bg-gold-50 text-navy-950 font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {isAr ? "حجز استشارة مجانية" : "Book Free Consultation"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepagePricingSection;
