import React, { useState } from "react";
import { X, ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, MessageSquare, Send, Award, Phone, Building2, User, Mail, Sparkles } from "lucide-react";
import { submitToGoogleSheetsDirectly } from "../lib/sheetsService";

interface TaxHealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaxHealthCheckModal({ isOpen, onClose }: TaxHealthCheckModalProps) {
  const [step, setStep] = useState<"quiz" | "result" | "success">("quiz");
  
  // Quiz state
  const [jurisdiction, setJurisdiction] = useState<string>("mainland");
  const [turnover, setTurnover] = useState<string>("under3m");
  const [ctStatus, setCtStatus] = useState<string>("unregistered");
  const [vatStatus, setVatStatus] = useState<string>("registered");
  const [backlogStatus, setBacklogStatus] = useState<string>("some-backlog");

  // Contact form state
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculate audit risk score & recommendations
  const getAuditInsights = () => {
    let penaltyRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
    let riskReason = "";
    const keyActions: string[] = [];

    if (ctStatus === "unregistered") {
      penaltyRisk = "CRITICAL";
      riskReason = "Mandatory AED 10,000 FTA fine applies for late Corporate Tax EmaraTax registration.";
      keyActions.push("Immediate EmaraTax Corporate Tax registration to avoid fines");
    }

    if (vatStatus === "unregistered-over-threshold") {
      penaltyRisk = "CRITICAL";
      riskReason = "Mandatory AED 10,000 late VAT registration fine + potential retroactive tax penalties.";
      keyActions.push("Urgent VAT Voluntary Disclosure and retroactive FTA registration");
    }

    if (jurisdiction === "freezone" && penaltyRisk === "LOW") {
      penaltyRisk = "MEDIUM";
      riskReason = "Qualifying Free Zone Person (QFZP) 0% rate requires strict audited statements and substance proofs.";
      keyActions.push("Audit Qualifying Income to defend 0% Free Zone tax rate");
    }

    if (turnover === "under3m") {
      keyActions.push("Eligible for UAE Small Business Relief (0% Corporate Tax up to AED 3M revenue)");
    }

    if (backlogStatus === "heavy-backlog" || backlogStatus === "some-backlog") {
      keyActions.push("Backlog accounting reconstruction needed to support tax deductions & IFRS audits");
    }

    return { penaltyRisk, riskReason, keyActions };
  };

  const insights = getAuditInsights();

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) return;

    setIsSubmitting(true);

    const auditSummary = `[Tax Health Audit] Jurisdiction: ${jurisdiction}, Turnover: ${turnover}, CT Status: ${ctStatus}, VAT Status: ${vatStatus}, Backlog: ${backlogStatus}, Penalty Risk: ${insights.penaltyRisk}`;

    try {
      await submitToGoogleSheetsDirectly({
        name: fullName,
        email: email,
        phone: phone,
        company: companyName || "N/A",
        serviceType: "Free UAE Tax & Penalty Risk Audit",
        message: auditSummary,
      });
    } catch (err) {
      console.warn("Audit lead sync note:", err);
    }

    setIsSubmitting(false);
    setStep("success");
  };

  const handleWhatsAppRedirect = () => {
    const text = `Hi Glen! I just completed the Free UAE Tax Risk Audit on your website. 
Company: ${companyName || fullName}
Jurisdiction: ${jurisdiction}
Turnover: ${turnover}
Corporate Tax Status: ${ctStatus}
Risk Level: ${insights.penaltyRisk}

I would like my Free 15-Minute FTA Tax Strategy Consultation.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/971529226958?text=${encoded}`, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 overflow-hidden">
        
        {/* Decorative background accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-navy-950 hover:bg-slate-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Interactive Audit Quiz */}
        {step === "quiz" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant 60-Second FTA Compliance Scanner</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight">
                Free UAE Tax & Penalty Risk Audit
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                Answer 4 quick questions to instantly verify your 2026 Corporate Tax, VAT, and Free Zone compliance status.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              
              {/* Question 1: Jurisdiction */}
              <div className="space-y-2">
                <label className="font-bold text-navy-950 block">1. Company Jurisdiction:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "mainland", label: "Mainland LLC" },
                    { id: "freezone", label: "Free Zone (DMCC/DIFC/etc)" },
                    { id: "offshore", label: "Branch / Offshore" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setJurisdiction(item.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                        jurisdiction === item.id
                          ? "bg-navy-950 text-white border-navy-950 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Annual Turnover */}
              <div className="space-y-2">
                <label className="font-bold text-navy-950 block">2. Annual Revenue / Turnover:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "under375k", label: "< AED 375k" },
                    { id: "under3m", label: "AED 375k - 3M" },
                    { id: "over3m", label: "> AED 3M+" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTurnover(item.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                        turnover === item.id
                          ? "bg-navy-950 text-white border-navy-950 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Corporate Tax Status */}
              <div className="space-y-2">
                <label className="font-bold text-navy-950 block">3. UAE Corporate Tax EmaraTax Status:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: "unregistered", label: "⚠️ Not Registered Yet" },
                    { id: "registered-pending", label: "Registered, Filing Pending" },
                    { id: "fully-filed", label: "Fully Filed & Compliant" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCtStatus(item.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                        ctStatus === item.id
                          ? "bg-navy-950 text-white border-navy-950 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Books & Ledgers */}
              <div className="space-y-2">
                <label className="font-bold text-navy-950 block">4. Financial Records & Bookkeeping:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: "clean-monthly", label: "Up to date monthly" },
                    { id: "some-backlog", label: "Needs Backlog Cleanup" },
                    { id: "no-books", label: "No formal bookkeeping" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBacklogStatus(item.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                        backlogStatus === item.id
                          ? "bg-navy-950 text-white border-navy-950 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Next Button */}
            <button
              onClick={() => setStep("result")}
              className="w-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-navy-950 font-display font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>Calculate My Risk Score & Savings</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

        {/* STEP 2: Instant Results & Lead Capture Form */}
        {step === "result" && (
          <div className="space-y-6">
            
            {/* Risk Assessment Box */}
            <div className={`p-4 sm:p-5 rounded-2xl border ${
              insights.penaltyRisk === "CRITICAL"
                ? "bg-red-50/80 border-red-200 text-red-950"
                : insights.penaltyRisk === "MEDIUM"
                ? "bg-amber-50/80 border-amber-200 text-amber-950"
                : "bg-emerald-50/80 border-emerald-200 text-emerald-950"
            }`}>
              <div className="flex items-start gap-3">
                {insights.penaltyRisk === "CRITICAL" ? (
                  <ShieldAlert className="w-7 h-7 text-red-600 shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider">FTA Risk Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      insights.penaltyRisk === "CRITICAL" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
                    }`}>
                      {insights.penaltyRisk} RISK
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {insights.riskReason || "Your entity has high potential for Small Business Relief and 0% Free Zone tax rates."}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Action Points */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-navy-950 uppercase tracking-wider block">
                Recommended FTA Compliance Strategy:
              </span>
              <div className="space-y-1.5">
                {insights.keyActions.map((act, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Capture Form */}
            <form onSubmit={handleSubmitLead} className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-navy-950 block">
                Claim Your Free 15-Min Strategy Session & Full Audit Breakdown:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Your Name *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Mohammed Al Hashimi"
                      className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Falcon Trading LLC"
                      className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">WhatsApp / Phone *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.ae"
                      className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("quiz")}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-navy-950 hover:bg-navy-900 text-white font-display font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Securing Your Audit...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-gold-400" />
                      <span>Get Free Consultation & Full Audit Report</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                🔒 100% Confidential. Zero spam. Authorized UAE FTA Tax Consultants.
              </p>
            </form>

          </div>
        )}

        {/* STEP 3: Success Confirmation & 1-Click WhatsApp Direct Connect */}
        {step === "success" && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-navy-950">
                Audit Details Received!
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto">
                Thank you, <strong className="text-navy-950">{fullName}</strong>. Senior Tax Advisor Glen Dias has been notified and will review your compliance roadmap immediately.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span>Next Step for Urgent Assistance:</span>
              </div>
              <p className="text-slate-600">
                Want immediate answers or facing an imminent FTA deadline? Connect directly with Glen on WhatsApp right now with your audit summary pre-loaded.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Connect with Glen on WhatsApp Now</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-semibold text-xs py-3 px-5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
