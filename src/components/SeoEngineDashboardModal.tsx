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
  Layers,
  Calendar,
  Plus,
  Trash2,
  AlertCircle,
  Tag,
  BookOpen,
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
  const [activeTab, setActiveTab] = useState<"queue" | "cloud-function" | "on-demand">("queue");

  // Tab 1: Editorial Queue (Tuesday & Friday Pipeline)
  const [queueItems, setQueueItems] = useState<any[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);
  const [isPublishingQueue, setIsPublishingQueue] = useState(false);
  const [queueFeedback, setQueueFeedback] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDraft, setNewDraft] = useState({
    title: "",
    summary: "",
    content: "",
    tag: "Corporate Tax",
    targetDay: "Tuesday",
    priority: 1,
    readTime: "6 min read",
    keywords: "UAE Corporate Tax, FTA Compliance, Glen Dias",
  });

  // Tab 2: On-Demand SEO Page Generator
  const [financialService, setFinancialService] = useState("VAT Registration & Compliance");
  const [targetLocation, setTargetLocation] = useState("Dubai Mainland");
  const [customApiKey, setCustomApiKey] = useState("");
  const [useServerKey, setUseServerKey] = useState(true);
  const [isGeneratingPage, setIsGeneratingPage] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState("");
  const [copiedPage, setCopiedPage] = useState(false);

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

  // Tab 3: 24-Hour Cloud Function & Google Search Grounding Monitor
  const [cronStatus, setCronStatus] = useState<any>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isTriggeringCron, setIsTriggeringCron] = useState(false);
  const [cronResult, setCronResult] = useState<any>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Fetch Queue Items
  const fetchQueue = async () => {
    setIsLoadingQueue(true);
    try {
      const res = await fetch("/api/queue");
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setQueueItems(data.items);
      }
    } catch (err) {
      console.warn("Failed to fetch queue items:", err);
    } finally {
      setIsLoadingQueue(false);
    }
  };

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
      fetchQueue();
    }
  }, [isOpen]);

  // Handler: Publish Queued Draft
  const handlePublishQueue = async (id?: string) => {
    setIsPublishingQueue(true);
    setQueueFeedback(null);
    try {
      const res = await fetch("/api/queue/publish-next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          force: true,
          id,
        }),
      });
      const data = await res.json();
      setQueueFeedback(data);
      if (data.success && data.blogPost && onPostPublished) {
        onPostPublished(data.blogPost);
      }
      fetchQueue();
      fetchStatus();
    } catch (err: any) {
      setQueueFeedback({
        success: false,
        error: err.message || "Failed to publish queued draft.",
      });
    } finally {
      setIsPublishingQueue(false);
    }
  };

  // Handler: Delete Queue Draft
  const handleDeleteQueue = async (id: string) => {
    if (!confirm("Are you sure you want to remove this draft from the publishing queue?")) return;
    try {
      await fetch(`/api/queue/${id}`, { method: "DELETE" });
      fetchQueue();
      fetchStatus();
    } catch (err) {
      console.error("Failed to delete queue item:", err);
    }
  };

  // Handler: Add New Draft to Queue
  const handleAddDraftToQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDraft.title.trim() || !newDraft.content.trim()) return;

    try {
      const keywordsArray = newDraft.keywords.split(",").map((k) => k.trim()).filter(Boolean);
      await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newDraft.title.trim(),
          summary: newDraft.summary.trim() || newDraft.title.trim(),
          content: newDraft.content.trim(),
          tag: newDraft.tag,
          targetDay: newDraft.targetDay,
          priority: Number(newDraft.priority) || 1,
          readTime: newDraft.readTime || "6 min read",
          keywords: keywordsArray,
          status: "pending",
        }),
      });
      setShowAddForm(false);
      setNewDraft({
        title: "",
        summary: "",
        content: "",
        tag: "Corporate Tax",
        targetDay: "Tuesday",
        priority: 1,
        readTime: "6 min read",
        keywords: "UAE Corporate Tax, FTA Compliance, Glen Dias",
      });
      fetchQueue();
      fetchStatus();
    } catch (err) {
      console.error("Failed to add draft to queue:", err);
    }
  };

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
  const schedulerCurl = `gcloud scheduler jobs create http uae-biweekly-blog-cron \\
  --schedule="0 6 * * 2,5" \\
  --time-zone="Asia/Dubai" \\
  --uri="${appHost}/api/cloud-functions/daily-blog-generator" \\
  --http-method=POST \\
  --headers="Content-Type=application/json"`;

  const queueSchedulerCurl = `gcloud scheduler jobs create http uae-queue-publisher-cron \\
  --schedule="0 6 * * 2,5" \\
  --time-zone="Asia/Dubai" \\
  --uri="${appHost}/api/cloud-functions/publish-queue-article" \\
  --http-method=POST \\
  --headers="Content-Type=application/json"`;

  const cliScriptCommand = `npx tsx scripts/publish-scheduled-queue.ts`;

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
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "queue"
                ? "bg-navy-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-gold-400" />
            <span>Editorial Queue</span>
            {queueItems.filter((i) => i.status === "pending").length > 0 && (
              <span className="bg-gold-400 text-navy-950 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold">
                {queueItems.filter((i) => i.status === "pending").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("cloud-function")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "cloud-function"
                ? "bg-navy-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            <span>Semi-Weekly Automation (Tue & Fri)</span>
          </button>
          <button
            onClick={() => setActiveTab("on-demand")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "on-demand"
                ? "bg-navy-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-gold-400" />
            <span>On-Demand SEO Engine</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
          {activeTab === "queue" ? (
            /* Tab 1: Editorial Publishing Queue */
            <div className="space-y-6">
              {/* Queue Overview Header & Metrics */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Editorial Pipeline
                    </span>
                    <h3 className="font-display text-lg font-bold text-navy-950 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-gold-500" />
                      Pending Content Queue
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchQueue}
                      disabled={isLoadingQueue}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingQueue ? "animate-spin" : ""}`} />
                      Refresh
                    </button>
                    <button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 hover:bg-navy-950 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-gold-400" />
                      {showAddForm ? "Hide Form" : "Add Article to Queue"}
                    </button>
                  </div>
                </div>

                {/* Queue Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 font-medium block mb-1">Pending in Queue</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-navy-950 text-xl">
                        {queueItems.filter((i) => i.status === "pending").length}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        of {queueItems.length} total drafts
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 font-medium block mb-1">Next Publication Cadence</span>
                    <span className="font-bold text-navy-950 text-sm block truncate">
                      {cronStatus?.nextScheduledRun?.dayName || "Tuesday/Friday"} at 06:00 GST
                    </span>
                    <span className="text-[11px] text-amber-600 font-semibold block mt-0.5">
                      {cronStatus?.nextScheduledRun?.countdownText || "Upcoming"}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 font-medium block mb-1">Autonomous Fallback</span>
                    <span className="font-bold text-emerald-700 text-sm block">
                      Gemini 3.8 Flash
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Triggers if queue is empty
                    </span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    Process the pending queue now regardless of day/time:
                  </div>
                  <button
                    onClick={() => handlePublishQueue()}
                    disabled={isPublishingQueue}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-navy-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[42px]"
                  >
                    {isPublishingQueue ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-navy-950" />
                        <span>Publishing Next Queued Article...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-navy-950" />
                        <span>Publish Next in Queue (Force Run)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Feedback Banner */}
              {queueFeedback && (
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-2 animate-fadeIn ${
                    queueFeedback.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-red-50 border-red-200 text-red-900"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {queueFeedback.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    {queueFeedback.message || queueFeedback.error}
                  </div>
                  {queueFeedback.blogPost && (
                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-slate-600">Article:</span>
                      <strong className="text-navy-950 font-semibold">{queueFeedback.blogPost.title}</strong>
                      <a
                        href={`#blog-${queueFeedback.blogPost.id}`}
                        onClick={onClose}
                        className="ml-auto px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-700 transition-colors inline-flex items-center gap-1"
                      >
                        <span>View Live</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Expandable Add Article Form */}
              {showAddForm && (
                <form
                  onSubmit={handleAddDraftToQueue}
                  className="bg-white rounded-2xl p-5 border border-gold-300 shadow-sm space-y-4 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-display text-sm font-bold text-navy-950 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-gold-500" />
                      Draft New Article for Queue
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Auto-assigned to Glen Dias (FTA Tax Agent)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-navy-900">Article Title *</label>
                      <input
                        type="text"
                        required
                        value={newDraft.title}
                        onChange={(e) => setNewDraft({ ...newDraft, title: e.target.value })}
                        placeholder="e.g., UAE Corporate Tax Grouping Criteria & Article 40"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-900">Target Publishing Day</label>
                      <select
                        value={newDraft.targetDay}
                        onChange={(e) => setNewDraft({ ...newDraft, targetDay: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
                      >
                        <option value="Tuesday">Tuesday</option>
                        <option value="Friday">Friday</option>
                        <option value="Any">Any (Next available Tuesday or Friday)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-900">Priority Order</label>
                      <select
                        value={newDraft.priority}
                        onChange={(e) => setNewDraft({ ...newDraft, priority: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
                      >
                        <option value="1">Priority 1 (Next in Line)</option>
                        <option value="2">Priority 2</option>
                        <option value="3">Priority 3</option>
                        <option value="4">Priority 4</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-900">Tax Category / Tag</label>
                      <input
                        type="text"
                        value={newDraft.tag}
                        onChange={(e) => setNewDraft({ ...newDraft, tag: e.target.value })}
                        placeholder="e.g., Corporate Tax, VAT, Transfer Pricing"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-900">Estimated Read Time</label>
                      <input
                        type="text"
                        value={newDraft.readTime}
                        onChange={(e) => setNewDraft({ ...newDraft, readTime: e.target.value })}
                        placeholder="e.g., 6 min read"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-navy-900">Executive Summary</label>
                      <textarea
                        rows={2}
                        value={newDraft.summary}
                        onChange={(e) => setNewDraft({ ...newDraft, summary: e.target.value })}
                        placeholder="Short executive summary for search preview cards..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-navy-900">Full Article Content (Markdown or HTML) *</label>
                      <textarea
                        rows={6}
                        required
                        value={newDraft.content}
                        onChange={(e) => setNewDraft({ ...newDraft, content: e.target.value })}
                        placeholder="## 1. Executive Summary&#10;&#10;Technical statutory analysis under Federal Decree-Law No. 47 of 2022..."
                        className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-navy-900">SEO Keywords (comma-separated)</label>
                      <input
                        type="text"
                        value={newDraft.keywords}
                        onChange={(e) => setNewDraft({ ...newDraft, keywords: e.target.value })}
                        placeholder="UAE Corporate Tax, FTA Compliance, Glen Dias"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-navy-900 hover:bg-navy-950 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Save to Publishing Queue
                    </button>
                  </div>
                </form>
              )}

              {/* Queue Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                  <span>QUEUED ARTICLES ({queueItems.length})</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    Sorted by priority &amp; target publication day
                  </span>
                </div>

                {isLoadingQueue ? (
                  <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-gold-500" />
                    <span>Loading queue items from database...</span>
                  </div>
                ) : queueItems.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300 space-y-2">
                    <Layers className="w-8 h-8 mx-auto text-slate-300" />
                    <h5 className="font-bold text-navy-900 text-sm">Publishing Queue is Empty</h5>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      No pending drafts in the queue. On Tuesday and Friday at 06:00 GST, the autonomous generator will automatically synthesize fresh, search-grounded tax advisory articles via Gemini 3.8 Flash.
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-gold-400" />
                      Add First Article to Queue
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {queueItems.map((item, index) => {
                      const isPending = item.status === "pending";
                      return (
                        <div
                          key={item.id || index}
                          className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
                            isPending
                              ? "border-slate-200 hover:border-gold-300 shadow-sm"
                              : "border-slate-100 opacity-60 bg-slate-50/60"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                    isPending
                                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                                      : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                  }`}
                                >
                                  {isPending ? "Pending in Queue" : "Published"}
                                </span>
                                {item.targetDay && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-navy-50 text-navy-800 border border-navy-200 flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-gold-500" />
                                    Target: {item.targetDay}
                                  </span>
                                )}
                                {item.priority && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                    P{item.priority}
                                  </span>
                                )}
                                {item.tag && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
                                    {item.tag}
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400">{item.readTime}</span>
                              </div>

                              <h4 className="font-display font-bold text-navy-950 text-sm sm:text-base leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                                {item.summary}
                              </p>

                              {item.publishedAt && (
                                <div className="text-[10px] text-emerald-700 font-semibold pt-1">
                                  Published on: {new Date(item.publishedAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                              {isPending ? (
                                <button
                                  onClick={() => handlePublishQueue(item.id)}
                                  disabled={isPublishingQueue}
                                  className="w-full sm:w-auto px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Publish Now</span>
                                </button>
                              ) : (
                                <a
                                  href={`#blog-${item.id}`}
                                  onClick={onClose}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                                >
                                  <span>View Post</span>
                                  <ArrowRight className="w-3 h-3" />
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteQueue(item.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                                title="Remove from queue"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === "cloud-function" ? (
            /* Tab 2: Semi-Weekly Tuesday & Friday Cloud Function Dashboard */
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
                      Semi-Weekly Publisher Active (Tuesday & Friday)
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

                {/* Day of Week Visual Tracker */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                  <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-between">
                    <span>WEEKLY PUBLISHING CALENDAR (2 ARTICLES / WEEK)</span>
                    <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-semibold">
                      06:00 GST Target
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {[
                      { name: "Sun", day: 0, active: false },
                      { name: "Mon", day: 1, active: false },
                      { name: "Tue", day: 2, active: true, title: "Tuesday Tax Advisory" },
                      { name: "Wed", day: 3, active: false },
                      { name: "Thu", day: 4, active: false },
                      { name: "Fri", day: 5, active: true, title: "Friday Compliance Digest" },
                      { name: "Sat", day: 6, active: false },
                    ].map((d) => {
                      const isToday = cronStatus?.todayDayName?.toLowerCase().startsWith(d.name.toLowerCase());
                      return (
                        <div
                          key={d.name}
                          className={`p-2 rounded-lg border transition-all ${
                            d.active
                              ? isToday
                                ? "bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-400/40"
                                : "bg-emerald-50 text-emerald-950 border-emerald-300 font-bold"
                              : isToday
                              ? "bg-slate-200 text-slate-900 border-slate-400 font-bold"
                              : "bg-white text-slate-400 border-slate-100 font-normal"
                          }`}
                        >
                          <div className="text-xs font-bold uppercase">{d.name}</div>
                          <div className="text-[10px] mt-0.5">
                            {d.active ? (
                              <span className={d.active && !isToday ? "text-emerald-700 font-bold" : ""}>
                                ★ Publish
                              </span>
                            ) : (
                              <span className="text-slate-400">Off-cycle</span>
                            )}
                          </div>
                          {isToday && (
                            <div className="text-[9px] font-extrabold uppercase mt-1 px-1 rounded bg-black/10">
                              Today
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block mb-1">Execution Cadence</span>
                    <span className="font-bold text-navy-900 text-sm">2 Articles / Week</span>
                    <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                      Tuesday & Friday at 06:00 GST
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block mb-1">Next Scheduled Run</span>
                    <span className="font-bold text-navy-900 text-sm truncate block">
                      {cronStatus?.nextScheduledRun?.dayName || "Friday"} at 06:00 GST
                    </span>
                    <span className="text-[11px] text-amber-600 font-semibold block mt-0.5">
                      {cronStatus?.nextScheduledRun?.countdownText || "Upcoming"}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block mb-1">Current UAE Time</span>
                    <span className="font-bold text-navy-900 text-sm">
                      {cronStatus?.uaeTime || "Gulf Standard Time (GST)"}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Asia/Dubai Zone (UTC+4)</span>
                  </div>
                </div>

                {/* Grounding Technology Highlights */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    How the Semi-Weekly Tuesday & Friday Pipeline Works:
                  </div>
                  <p className="text-emerald-800 leading-relaxed text-[11px]">
                    Every <strong>Tuesday and Friday at 06:00 GST</strong>, our autonomous server cron and Google Cloud Scheduler trigger the publication pipeline. Gemini 3.8 Flash conducts live <strong>Google Search Grounding</strong> for current UAE tax decisions, writes an in-depth article in Glen Dias’s voice, formats valid <strong>JSON-LD Schema Markup</strong>, and publishes directly to the live blog feed.
                  </p>
                </div>

                {/* Manual Trigger Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Want to test the Google Search Grounding and generate an article immediately?
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
                        <span>Trigger AI Article Generation Now (Force Run)</span>
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
                    Google Cloud Scheduler Command (Tuesday & Friday Setup)
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
                  {queueSchedulerCurl}
                </pre>
                <p className="text-[11px] text-slate-400">
                  Runs every Tuesday and Friday at 06:00 GST (cron: <code className="text-gold-300">0 6 * * 2,5</code>). Checks the queue for pending drafts first (matching Tuesday/Friday target or priority); if empty, automatically triggers Gemini 3.8 Flash live search grounding.
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    Standalone CLI Script Runner:
                  </div>
                  <button
                    onClick={() => copyToClipboard(cliScriptCommand, setCopiedScript)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-semibold transition-colors cursor-pointer"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy CLI command</span>
                      </>
                    )}
                  </button>
                </div>
                <code className="block text-[11px] font-mono bg-black/40 p-2.5 rounded border border-slate-800 text-emerald-300">
                  {cliScriptCommand}
                </code>
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
