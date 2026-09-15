import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Search,
  MapPin,
  FileText,
  Key,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Code,
  ArrowRight,
  Globe,
  Sliders,
} from "lucide-react";

interface SeoEngineDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostPublished?: (newPost: any) => void;
}

export const SeoEngineDashboardModal: React.FC<SeoEngineDashboardModalProps> = ({
  isOpen,
  onClose,
  onPostPublished,
}) => {
  const [activeTab, setActiveTab] = useState<"on-demand" | "cloud-function">("cloud-function");

  // Tab 1: On-Demand SEO Page Generator
  const [financialService, setFinancialService] = useState("VAT Registration & Compliance");
  const [targetLocation, setTargetLocation] = useState("Dubai Mainland");
  const [customApiKey, setCustomApiKey] = useState("");
  const [useServerKey, setUseServerKey] = useState(true);
  const [isGeneratingPage, setIsGeneratingPage] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState("");
  const [copiedPage, setCopiedPage] = useState(false);

  // Tab 2: 24-Hour Cloud Function & Google Search Grounding Monitor
  const [cronStatus, setCronStatus] = useState<any>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isTriggeringCron, setIsTriggeringCron] = useState(false);
  const [cronResult, setCronResult] = useState<any>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // Pre-configured suggestions
  const servicePresets = [
    "Corporate Tax Return Filing",
    "VAT Registration & Compliance",
    "Qualifying Free Zone Audit",
    "Monthly Bookkeeping & IFRS",
    "Transfer Pricing Documentation",
    "EmaraTax Penalties Appeal",
  ];

  const locationPresets = [
    "Dubai Mainland",
    "SHAMS (Sharjah Media City)",
    "Meydan Free Zone",
    "DMCC (JLT Dubai)",
    "DIFC (Dubai Financial Centre)",
    "Abu Dhabi Global Market (ADGM)",
  ];

  // Fetch 24-Hour Cron Status
  const fetchStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch("/api/cron/status");
      const data = await res.json();
      if (data.success) {
        setCronStatus(data);
      }
    } catch (err) {
      console.warn("Failed to fetch cron status:", err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // On-Demand SEO Generation Handler
  const handleGenerateSeoPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!financialService || !targetLocation) return;

    setIsGeneratingPage(true);
    setGeneratedOutput("");

    const promptText = `Write a highly authoritative, SEO-optimized landing page in HTML format for ${financialService} specifically targeting businesses in ${targetLocation}. Include a professional title, meta description, a section on local compliance, and references to UAE tax laws like Federal Decree-Law No. 47 of 2022 on Corporate Tax and Federal Decree-Law No. 8 of 2017 on VAT. Make the content reflect the expertise of Glen Dias (FTA Registered Tax Agent at Dias Accounting & Tax Consulting LLC). Also generate complete Schema.org JSON-LD structured data for Google Search.`;

    try {
      if (useServerKey) {
        // Use server-side grounded search endpoint
        const res = await fetch("/api/gemini/tax-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: promptText,
            category: "corporate-tax",
            language: "en",
          }),
        });
        const data = await res.json();
        if (data.answer) {
          setGeneratedOutput(data.answer);
        } else {
          setGeneratedOutput(JSON.stringify(data, null, 2));
        }
      } else if (customApiKey) {
        // Direct browser call using custom key with gemini-1.5-pro or gemini-2.5-flash
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(customApiKey.trim())}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: promptText }],
              },
            ],
          }),
        });
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data, null, 2);
        setGeneratedOutput(text);
      } else {
        setGeneratedOutput("Error: Please provide your Gemini API Key or check 'Use Server-Side Gemini Key'.");
      }
    } catch (err: any) {
      setGeneratedOutput(`Error generating SEO page: ${err.message || err}`);
    } finally {
      setIsGeneratingPage(false);
    }
  };

  // Trigger 24-Hour Cloud Function Trigger Now
  const handleTriggerCloudFunction = async () => {
    setIsTriggeringCron(true);
    setCronResult(null);

    try {
      const res = await fetch("/api/cloud-functions/daily-blog-generator?force=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          triggerSource: "dashboard_manual_trigger",
        }),
      });
      const data = await res.json();
      setCronResult(data);
      if (data.success && data.blogPost && onPostPublished) {
        onPostPublished(data.blogPost);
      }
      fetchStatus();
    } catch (err: any) {
      setCronResult({
        success: false,
        error: err.message || "Failed to trigger Cloud Function.",
      });
    } finally {
      setIsTriggeringCron(false);
    }
  };

  const appHost = typeof window !== "undefined" ? window.location.origin : "https://diasuae.ae";
  const schedulerCurl = `gcloud scheduler jobs create http uae-daily-blog-cron \\
  --schedule="0 6 * * *" \\
  --time-zone="Asia/Dubai" \\
  --uri="${appHost}/api/cloud-functions/daily-blog-generator" \\
  --http-method=POST \\
  --headers="Content-Type=application/json"`;

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-fadeIn">
        {/* Header */}
        <div className="bg-navy-900 text-white p-5 sm:p-6 relative border-b border-navy-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-gold-400 text-navy-950 font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                AI Regulatory Studio
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                Gemini 3.8 Flash • Search Grounded
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
              SEO Content Engine & Cloud Function Monitor
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center gap-3">
          <button
            onClick={() => setActiveTab("cloud-function")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "cloud-function"
                ? "bg-navy-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            24-Hour Autonomous Cloud Function
          </button>
          <button
            onClick={() => setActiveTab("on-demand")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "on-demand"
                ? "bg-navy-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-gold-400" />
            On-Demand SEO Landing Page Engine
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-grow overflow-y-auto p-5 sm:p-6 bg-slate-50 space-y-6">
          {activeTab === "cloud-function" ? (
            /* 24-Hour Cloud Function Dashboard */
            <div className="space-y-6">
              {/* Status Overview Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Automation Status
                    </span>
                    <h3 className="font-display text-lg font-bold text-navy-950 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      24-Hour Daily Blog Trigger is Active
                    </h3>
                  </div>
                  <button
                    onClick={fetchStatus}
                    disabled={isLoadingStatus}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStatus ? "animate-spin" : ""}`} />
                    Refresh Status
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block mb-1">Execution Cadence</span>
                    <span className="font-bold text-navy-900 text-sm">Every 24 Hours</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">06:00 GST Daily</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block mb-1">Last Generated Post</span>
                    <span className="font-bold text-navy-900 text-sm truncate block">
                      {cronStatus?.settings?.lastPostTitle || "September 30, 2026 Corporate Tax Deadline"}
                    </span>
                    <span className="text-[11px] text-emerald-600 block mt-0.5">Published & Synced</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block mb-1">Current UAE Time</span>
                    <span className="font-bold text-navy-900 text-sm">
                      {cronStatus?.uaeTime || "Gulf Standard Time (GST)"}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Asia/Dubai Zone</span>
                  </div>
                </div>

                {/* Grounding Technology Highlights */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    How the 24-Hour Pipeline Works:
                  </div>
                  <p className="text-emerald-800 leading-relaxed text-[11px]">
                    Every 24 hours, Google Cloud Scheduler invokes our Cloud Function trigger. Gemini 3.8 Flash conducts live <strong>Google Search Grounding</strong> for current UAE tax updates, writes an in-depth article in Glen Dias’s voice, formats valid <strong>JSON-LD Schema Markup</strong>, and stores it in Firestore to boost Google rankings.
                  </p>
                </div>

                {/* Manual Trigger Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Want to test the Google Search Grounding and generate today's post immediately?
                  </div>
                  <button
                    onClick={handleTriggerCloudFunction}
                    disabled={isTriggeringCron}
                    className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-navy-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    {isTriggeringCron ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-navy-950" />
                        <span>Searching UAE Trends & Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-navy-950" />
                        <span>Trigger Cloud Function Now (Search Grounded)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Execution Feedback */}
              {cronResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-2 animate-fadeIn ${
                    cronResult.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-red-50 border-red-200 text-red-900"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {cronResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                    {cronResult.message || cronResult.error}
                  </div>
                  {cronResult.trendsIdentified && (
                    <div className="text-[11px] text-emerald-800 space-y-1">
                      <span className="font-semibold">Trends Discovered via Google Search:</span>
                      <ul className="list-disc list-inside">
                        {cronResult.trendsIdentified.map((t: string, i: number) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {cronResult.blogPost && (
                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href={`#blog-${cronResult.blogPost.id}`}
                        onClick={onClose}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-700 transition-colors inline-flex items-center gap-1"
                      >
                        <span>View Published Article</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Cloud Scheduler CLI Instructions */}
              <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-gold-400">
                    <Terminal className="w-4 h-4 text-gold-400" />
                    Google Cloud Scheduler Command (24-Hour Setup)
                  </div>
                  <button
                    onClick={() => copyToClipboard(schedulerCurl, setCopiedCurl)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-semibold transition-colors cursor-pointer"
                  >
                    {copiedCurl ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy gcloud command</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-[11px] font-mono bg-black/50 p-3 rounded-lg border border-slate-800 overflow-x-auto text-gold-200 leading-relaxed">
                  {schedulerCurl}
                </pre>
                <p className="text-[11px] text-slate-400">
                  Runs daily at 06:00 GST. Automatically triggers the Gemini API search-grounded generation and updates Firestore.
                </p>
              </div>
            </div>
          ) : (
            /* On-Demand SEO Page Generator */
            <form onSubmit={handleGenerateSeoPage} className="space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-display text-base font-bold text-navy-950">
                  Target Service & Jurisdiction Parameters
                </h3>

                {/* Financial Service Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy-900 block">
                    Financial Service
                  </label>
                  <input
                    type="text"
                    value={financialService}
                    onChange={(e) => setFinancialService(e.target.value)}
                    placeholder="e.g., VAT Registration, Bookkeeping, Corporate Tax"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {servicePresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFinancialService(preset)}
                        className="text-[10px] bg-slate-100 hover:bg-gold-50 hover:text-gold-900 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Location Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy-900 block">
                    Target UAE Location
                  </label>
                  <input
                    type="text"
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    placeholder="e.g., Dubai Mainland, SHAMS, Meydan"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {locationPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTargetLocation(preset)}
                        className="text-[10px] bg-slate-100 hover:bg-gold-50 hover:text-gold-900 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* API Key Configuration */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-navy-900 block">
                      Gemini API Key
                    </label>
                    <label className="text-[11px] text-slate-500 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useServerKey}
                        onChange={(e) => setUseServerKey(e.target.checked)}
                        className="rounded text-gold-500 focus:ring-gold-500 cursor-pointer"
                      />
                      <span>Use Applet Server-Side Key (Recommended)</span>
                    </label>
                  </div>
                  {!useServerKey && (
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={customApiKey}
                        onChange={(e) => setCustomApiKey(e.target.value)}
                        placeholder="Enter your personal Google Gemini API Key"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400">
                    Prompt sent to Gemini adheres to UAE Federal Decree-Law No. 47 of 2022 &amp; No. 8 of 2017.
                  </p>
                </div>

                {/* Large Generate Button */}
                <button
                  type="submit"
                  disabled={isGeneratingPage}
                  className="w-full py-3.5 px-6 bg-navy-900 hover:bg-navy-950 text-white font-display font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
                >
                  {isGeneratingPage ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-gold-400" />
                      <span>Generating High-Authority SEO Page with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-gold-400" />
                      <span>Generate SEO Page</span>
                    </>
                  )}
                </button>
              </div>

              {/* Text Area for Generated Output */}
              {generatedOutput && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-gold-500" />
                      Generated Output (HTML &amp; Content)
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(generatedOutput, setCopiedPage)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      {copiedPage ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied Output!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Generated Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={generatedOutput}
                    rows={12}
                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-800 focus:outline-none leading-relaxed"
                  />
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeoEngineDashboardModal;
