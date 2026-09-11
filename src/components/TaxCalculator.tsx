import React, { useState } from "react";
import { Calculator, Percent, ArrowRight, CheckCircle2, ShieldAlert, Award, Briefcase } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

type CalculatorTab = "corporate-tax" | "vat-estimator" | "gratuity-calculator";

export default function TaxCalculator() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>("corporate-tax");
  const { t, language, isRTL } = useLanguage();

  // Corporate Tax state
  const [taxableProfit, setTaxableProfit] = useState<number>(450000);
  
  // VAT state
  const [salesAmount, setSalesAmount] = useState<number>(300000);
  const [expenseAmount, setExpenseAmount] = useState<number>(120000);

  // Gratuity / End of Service State
  const [basicSalary, setBasicSalary] = useState<number>(12000);
  const [serviceYears, setServiceYears] = useState<number>(3);
  const [contractType, setContractType] = useState<"limited" | "unlimited">("limited");

  // Corporate Tax Calculations
  const calcCorporateTax = (profit: number) => {
    const THRESHOLD = 375000;
    const TAX_RATE = 0.09;

    if (profit <= THRESHOLD) {
      return {
        tier0: profit,
        tier9: 0,
        liability: 0,
        effectiveRate: 0,
      };
    } else {
      const taxableExcess = profit - THRESHOLD;
      const taxLiability = taxableExcess * TAX_RATE;
      const effectiveRate = (taxLiability / profit) * 100;

      return {
        tier0: THRESHOLD,
        tier9: taxableExcess,
        liability: Math.round(taxLiability),
        effectiveRate: parseFloat(effectiveRate.toFixed(2)),
      };
    }
  };

  const ctResults = calcCorporateTax(taxableProfit);

  // VAT Calculations
  const calcVAT = (sales: number, expenses: number) => {
    const VAT_RATE = 0.05;
    const outputVat = sales * VAT_RATE;
    const inputVat = expenses * VAT_RATE;
    const netVat = outputVat - inputVat;

    return {
      outputVat: Math.round(outputVat),
      inputVat: Math.round(inputVat),
      netVat: Math.round(netVat),
    };
  };

  const vatResults = calcVAT(salesAmount, expenseAmount);

  // UAE End of Service Gratuity Calculation (UAE Federal Decree-Law No. 33 of 2021)
  const calcGratuity = (salary: number, years: number) => {
    const dailyWage = salary / 30;
    let gratuity = 0;
    if (years < 1) {
      gratuity = 0;
    } else if (years <= 5) {
      // 21 days for each year of the first 5 years
      gratuity = years * 21 * dailyWage;
    } else {
      // 21 days for first 5 years + 30 days for each year beyond 5
      const first5Years = 5 * 21 * dailyWage;
      const additionalYears = (years - 5) * 30 * dailyWage;
      gratuity = first5Years + additionalYears;
    }
    // Cap at 2 years' basic salary
    const maxCap = salary * 24;
    const finalGratuity = Math.min(gratuity, maxCap);

    return {
      total: Math.round(finalGratuity),
      dailyWage: Math.round(dailyWage),
      isCapped: gratuity > maxCap,
    };
  };

  const gratuityResults = calcGratuity(basicSalary, serviceYears);

  // Format number to AED
  const formatAED = (val: number) => {
    const locale = language === "ar" ? "ar-AE" : "en-AE";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl overflow-hidden text-slate-800 transition-all hover:shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-950 px-6 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-gold-400" />
          <span className="font-display font-bold tracking-tight">{t.calculator.headerTitle}</span>
        </div>
        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">
          {t.calculator.headerBadge}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50">
        <button
          onClick={() => setActiveTab("corporate-tax")}
          className={`flex-1 py-3 text-center text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "corporate-tax"
              ? "border-gold-500 text-navy-800 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
          }`}
        >
          <Award className="w-3.5 h-3.5 shrink-0" />
          <span>{t.calculator.tabCorporateTax}</span>
        </button>
        <button
          onClick={() => setActiveTab("vat-estimator")}
          className={`flex-1 py-3 text-center text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "vat-estimator"
              ? "border-gold-500 text-navy-800 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
          }`}
        >
          <Percent className="w-3.5 h-3.5 shrink-0" />
          <span>{t.calculator.tabVat}</span>
        </button>
        <button
          onClick={() => setActiveTab("gratuity-calculator")}
          className={`flex-1 py-3 text-center text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "gratuity-calculator"
              ? "border-gold-500 text-navy-800 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 shrink-0 text-gold-600" />
          <span>{language === "ar" ? "مكافأة نهاية الخدمة" : "UAE Gratuity"}</span>
        </button>
      </div>

      <div className="p-6">
        {activeTab === "corporate-tax" ? (
          /* Corporate Tax Panel */
          <div className="space-y-5 animate-fadeIn">
            <div>
              <label htmlFor="ct-profit-range" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex justify-between">
                <span>{t.calculator.annualProfitLabel}</span>
                <span className="text-navy-800 font-mono text-sm">{formatAED(taxableProfit)}</span>
              </label>
              <input
                id="ct-profit-range"
                type="range"
                min="50000"
                max="5000000"
                step="25000"
                value={taxableProfit}
                onChange={(e) => setTaxableProfit(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none"
                aria-label="Annual taxable profit slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>50k</span>
                <span>375k ({language === "ar" ? "حد الإعفاء" : "Threshold"})</span>
                <span>1.5M</span>
                <span>5M+</span>
              </div>
              <div className="mt-3">
                <label htmlFor="ct-profit-number" className="sr-only">{t.calculator.annualProfitLabel}</label>
                <input
                  id="ct-profit-number"
                  type="number"
                  value={taxableProfit}
                  onChange={(e) => setTaxableProfit(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none font-mono focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none"
                  placeholder="Enter exact profit"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">{t.calculator.tier0Label}</span>
                <span className="font-mono text-sm font-bold text-slate-700">{formatAED(ctResults.tier0)}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">{t.calculator.tier9Label}</span>
                <span className="font-mono text-sm font-bold text-slate-700">{formatAED(ctResults.tier9)}</span>
              </div>
            </div>

            {/* Total Tax Liability Alert Box */}
            <div className="bg-navy-900 text-white rounded-xl p-4 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10">
                <Calculator className="w-32 h-32 transform translate-x-8 translate-y-8" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-slate-300 font-medium block">{t.calculator.estTaxLiability}</span>
                  <span className="text-2xl font-bold font-mono tracking-tight text-gold-400">
                    {formatAED(ctResults.liability)}
                  </span>
                </div>
                <div className={isRTL ? "text-left" : "text-right"}>
                  <span className="text-xs text-slate-300 font-medium block">{t.calculator.effectiveRate}</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">{ctResults.effectiveRate}%</span>
                </div>
              </div>
            </div>

            {/* Tax Relief Recommendation */}
            {taxableProfit <= 3000000 ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex gap-2.5 items-start text-emerald-900 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-emerald-800">{t.calculator.reliefBannerTitle}</span>
                  {t.calculator.reliefBannerDesc}
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2.5 items-start text-amber-900 text-xs">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-800">
                    {language === "ar" ? "تخطيط ضريبي متقدم مطلوب" : "Advanced Structure Required"}
                  </span>
                  {language === "ar"
                    ? "للأرباح التي تتجاوز 375,000 درهم، تخضع الزيادة لنسبة 9%. يساعد التخطيط الاستراتيجي في تقليل الالتزامات الضريبية قانونياً."
                    : "For profits exceeding AED 375,000, standard 9% corporate tax is mandatory. Proper structuring is critical to optimize liability."}
                </div>
              </div>
            )}
          </div>
        ) : activeTab === "vat-estimator" ? (
          /* VAT Estimator Panel */
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label htmlFor="vat-sales-range" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex justify-between">
                <span>{t.calculator.vatSalesLabel}</span>
                <span className="text-navy-800 font-mono text-sm">{formatAED(salesAmount)}</span>
              </label>
              <input
                id="vat-sales-range"
                type="range"
                min="10000"
                max="2000000"
                step="10000"
                value={salesAmount}
                onChange={(e) => setSalesAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none"
                aria-label="Annual taxable sales slider"
              />
              <label htmlFor="vat-sales-number" className="sr-only">{t.calculator.vatSalesLabel}</label>
              <input
                id="vat-sales-number"
                type="number"
                value={salesAmount}
                onChange={(e) => setSalesAmount(Math.max(0, Number(e.target.value)))}
                className="w-full mt-2 px-4 py-1.5 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none font-mono focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none"
                placeholder="Exact sales"
              />
            </div>

            <div>
              <label htmlFor="vat-expense-range" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex justify-between">
                <span>{t.calculator.vatExpensesLabel}</span>
                <span className="text-navy-800 font-mono text-sm">{formatAED(expenseAmount)}</span>
              </label>
              <input
                id="vat-expense-range"
                type="range"
                min="0"
                max="2000000"
                step="10000"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none"
                aria-label="Taxable expenses and purchases slider"
              />
              <label htmlFor="vat-expense-number" className="sr-only">{t.calculator.vatExpensesLabel}</label>
              <input
                id="vat-expense-number"
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(Math.max(0, Number(e.target.value)))}
                className="w-full mt-2 px-4 py-1.5 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none font-mono focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none"
                placeholder="Exact expenses"
              />
            </div>

            {/* Output vs Input VAT Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-semibold uppercase text-[9px] mb-0.5">{t.calculator.vatOutput}</span>
                <span className="font-mono text-slate-700 font-bold text-sm">{formatAED(vatResults.outputVat)}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-semibold uppercase text-[9px] mb-0.5">{t.calculator.vatInput}</span>
                <span className="font-mono text-slate-700 font-bold text-sm">{formatAED(vatResults.inputVat)}</span>
              </div>
            </div>

            {/* VAT Net Summary Block */}
            <div className={`rounded-xl p-4 ${vatResults.netVat >= 0 ? "bg-navy-900 text-white" : "bg-emerald-900 text-white"}`}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-300 font-medium block">
                    {vatResults.netVat >= 0 ? t.calculator.vatNetPayable : t.calculator.vatRefundEligible}
                  </span>
                  <span className="text-xl font-bold font-mono tracking-tight text-gold-400">
                    {formatAED(Math.abs(vatResults.netVat))}
                  </span>
                </div>
                <div className={`text-xs max-w-[50%] text-slate-300 ${isRTL ? "text-left" : "text-right"}`}>
                  {vatResults.netVat >= 0
                    ? (language === "ar" ? "يستحق السداد للهيئة خلال 28 يوماً من نهاية الربع." : "Due to FTA within 28 days of your quarter end.")
                    : (language === "ar" ? "مؤهل للاسترداد النقدي أو التسوية من الهيئة." : "Eligible for FTA cash back or credit offset.")}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* UAE Gratuity / End of Service Panel */
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label htmlFor="gratuity-salary-range" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex justify-between">
                <span>{language === "ar" ? "الراتب الأساسي الشهري" : "Monthly Basic Salary"}</span>
                <span className="text-navy-800 font-mono text-sm">{formatAED(basicSalary)}</span>
              </label>
              <input
                id="gratuity-salary-range"
                type="range"
                min="2000"
                max="100000"
                step="1000"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none"
                aria-label="Monthly Basic Salary slider"
              />
              <label htmlFor="gratuity-salary-number" className="sr-only">Monthly Basic Salary</label>
              <input
                id="gratuity-salary-number"
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Math.max(0, Number(e.target.value)))}
                className="w-full mt-2 px-4 py-1.5 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none font-mono"
                placeholder="Basic Salary"
              />
            </div>

            <div>
              <label htmlFor="gratuity-years-range" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex justify-between">
                <span>{language === "ar" ? "سنوات الخدمة المكتملة" : "Completed Years of Service"}</span>
                <span className="text-navy-800 font-mono text-sm">{serviceYears} {language === "ar" ? "سنوات" : "Years"}</span>
              </label>
              <input
                id="gratuity-years-range"
                type="range"
                min="1"
                max="25"
                step="1"
                value={serviceYears}
                onChange={(e) => setServiceYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none"
                aria-label="Completed Years of Service slider"
              />
            </div>

            {/* Statutory Legal Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-semibold uppercase text-[9px] mb-0.5">
                  {language === "ar" ? "الأجر اليومي المحسوب" : "Calculated Daily Wage"}
                </span>
                <span className="font-mono text-slate-700 font-bold text-sm">{formatAED(gratuityResults.dailyWage)}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-semibold uppercase text-[9px] mb-0.5">
                  {language === "ar" ? "الأساس القانوني (قانون العمل)" : "Statutory Formula"}
                </span>
                <span className="text-slate-700 font-bold text-[10px]">
                  {serviceYears <= 5 ? "21 days / yr (1-5 yrs)" : "21d (1-5y) + 30d (>5y)"}
                </span>
              </div>
            </div>

            {/* Gratuity Total Summary Block */}
            <div className="rounded-xl p-4 bg-navy-950 text-white border border-gold-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-300 font-medium block">
                    {language === "ar" ? "إجمالي مكافأة نهاية الخدمة المستحقة" : "Total End of Service Gratuity"}
                  </span>
                  <span className="text-xl font-bold font-mono tracking-tight text-gold-400">
                    {formatAED(gratuityResults.total)}
                  </span>
                </div>
                <div className={`text-[10px] max-w-[45%] text-slate-300 ${isRTL ? "text-left" : "text-right"}`}>
                  {gratuityResults.isCapped
                    ? (language === "ar" ? "تم تطبيق الحد الأقصى القانوني (راتب سنتين)." : "Capped at statutory 2 years' salary limit.")
                    : (language === "ar" ? "وفقاً للمرسوم بقانون اتحادي رقم 33 لسنة 2021." : "Compliant with UAE Labour Law Decree No. 33/2021.")}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action Inside Calculator */}
        <a
          href="#contact"
          className="mt-5 w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-display font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm group cursor-pointer"
        >
          {t.calculator.bookStrategySession}
          <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
        </a>
      </div>
    </div>
  );
}
