import React, { useState } from "react";
import { Calculator, Percent, ArrowRight, CheckCircle2, ShieldAlert, Award } from "lucide-react";

type CalculatorTab = "corporate-tax" | "vat-estimator";

export default function TaxCalculator() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>("corporate-tax");

  // Corporate Tax state
  const [taxableProfit, setTaxableProfit] = useState<number>(450000);
  
  // VAT state
  const [salesAmount, setSalesAmount] = useState<number>(300000);
  const [expenseAmount, setExpenseAmount] = useState<number>(120000);

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

  // Format number to AED
  const formatAED = (val: number) => {
    return new Intl.NumberFormat("en-AE", {
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
          <span className="font-display font-bold tracking-tight">UAE Tax Planner</span>
        </div>
        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">
          FY 2026 Ready
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50">
        <button
          onClick={() => setActiveTab("corporate-tax")}
          className={`flex-1 py-3 text-center text-sm font-semibold transition-all border-b-2 flex items-center justify-center gap-2 ${
            activeTab === "corporate-tax"
              ? "border-gold-500 text-navy-800 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
          }`}
        >
          <Award className="w-4 h-4" />
          Corporate Tax (9%)
        </button>
        <button
          onClick={() => setActiveTab("vat-estimator")}
          className={`flex-1 py-3 text-center text-sm font-semibold transition-all border-b-2 flex items-center justify-center gap-2 ${
            activeTab === "vat-estimator"
              ? "border-gold-500 text-navy-800 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
          }`}
        >
          <Percent className="w-4 h-4" />
          VAT Estimator (5%)
        </button>
      </div>

      <div className="p-6">
        {activeTab === "corporate-tax" ? (
          /* Corporate Tax Panel */
          <div className="space-y-5 animate-fadeIn">
            <div>
              <label htmlFor="ct-profit-range" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex justify-between">
                <span>Annual Taxable Profit (AED)</span>
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
                <span>AED 50k</span>
                <span>AED 375k (Threshold)</span>
                <span>AED 1.5M</span>
                <span>AED 5M+</span>
              </div>
              <div className="mt-3">
                <label htmlFor="ct-profit-number" className="sr-only">Exact Taxable Profit (AED)</label>
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
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Tax-Free (0%) Tier</span>
                <span className="font-mono text-sm font-bold text-slate-700">{formatAED(ctResults.tier0)}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Taxable (9%) Tier</span>
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
                  <span className="text-xs text-slate-300 font-medium block">Est. Tax Liability</span>
                  <span className="text-2xl font-bold font-mono tracking-tight text-gold-400">
                    {formatAED(ctResults.liability)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-300 font-medium block">Effective Rate</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">{ctResults.effectiveRate}%</span>
                </div>
              </div>
            </div>

            {/* Tax Relief Recommendation */}
            {taxableProfit <= 3000000 ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex gap-2.5 items-start text-emerald-900 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-emerald-800">Eligible for Small Business Relief!</span>
                  As your annual gross revenue is under AED 3,000,000, you may qualify for SBR to reduce taxable income to AED 0. Let Dias Accounting file your SBR claim legally.
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2.5 items-start text-amber-900 text-xs">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-800">Advanced Structure Required</span>
                  For profits exceeding AED 375,000, standard 9% corporate tax is mandatory. Proper structuring (such as holding entities or Qualified Free Zones) is critical to optimize liability.
                </div>
              </div>
            )}
          </div>
        ) : (
          /* VAT Estimator Panel */
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label htmlFor="vat-sales-range" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex justify-between">
                <span>Annual Taxable Sales (AED)</span>
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
              <label htmlFor="vat-sales-number" className="sr-only">Exact Taxable Sales (AED)</label>
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
                <span>Taxable Expenses & Purchases (AED)</span>
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
              <label htmlFor="vat-expense-number" className="sr-only">Exact Taxable Expenses (AED)</label>
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
                <span className="text-slate-400 block font-semibold uppercase text-[9px] mb-0.5">Output VAT (5% on Sales)</span>
                <span className="font-mono text-slate-700 font-bold text-sm">{formatAED(vatResults.outputVat)}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-semibold uppercase text-[9px] mb-0.5">Input VAT (5% Recoverable)</span>
                <span className="font-mono text-slate-700 font-bold text-sm">{formatAED(vatResults.inputVat)}</span>
              </div>
            </div>

            {/* VAT Net Summary Block */}
            <div className={`rounded-xl p-4 ${vatResults.netVat >= 0 ? "bg-navy-900 text-white" : "bg-emerald-900 text-white"}`}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-300 font-medium block">
                    {vatResults.netVat >= 0 ? "Estimated VAT Payable" : "Estimated VAT Refundable"}
                  </span>
                  <span className="text-xl font-bold font-mono tracking-tight text-gold-400">
                    {formatAED(Math.abs(vatResults.netVat))}
                  </span>
                </div>
                <div className="text-xs max-w-[50%] text-right text-slate-300">
                  {vatResults.netVat >= 0
                    ? "Due to FTA within 28 days of your quarter end."
                    : "Eligible for FTA cash back or credit offset."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action Inside Calculator */}
        <a
          href="#contact"
          className="mt-5 w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-display font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm group"
        >
          Verify with a UAE Tax Expert
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}
