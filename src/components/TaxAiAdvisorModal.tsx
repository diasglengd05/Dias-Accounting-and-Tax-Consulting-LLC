import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Search, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  X, 
  ArrowRight, 
  Copy, 
  Check, 
  AlertCircle, 
  MessageSquare, 
  BookOpen, 
  ShieldCheck, 
  RefreshCw,
  Building2,
  FileText,
  Calculator
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export interface TaxAiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialCategory?: string;
  onOpenScheduler?: () => void;
}

interface SourceCitation {
  title: string;
  uri: string;
}

interface QueryResult {
  answer: string;
  sources: SourceCitation[];
  searchQueries: string[];
  grounded: boolean;
  model: string;
  timestamp?: string;
}

const PRESET_QUERIES = [
  {
    category: "corporate-tax",
    title: {
      en: "2025/2026 Corporate Tax Filing Deadlines",
      ar: "المواعيد النهائية لتقديم إقرارات ضريبة الشركات 2025/2026",
    },
    query: {
      en: "What are the latest UAE Corporate Tax registration and return filing deadlines and penalty schedules from the FTA?",
      ar: "ما هي المواعيد النهائية الرسمية للتسجيل وتقديم الإقرارات في ضريبة الشركات الإماراتية وفق قرارات الهيئة الاتحادية للضرائب؟",
    },
    icon: Clock,
  },
  {
    category: "freezone",
    title: {
      en: "Free Zone 0% Qualifying Income Conditions",
      ar: "شروط الدخل المؤهل لنسبة 0% في المناطق الحرة",
    },
    query: {
      en: "What are the latest requirements for a UAE Free Zone person (QFZP) to qualify for the 0% Corporate Tax rate on qualifying activities?",
      ar: "ما هي المتطلبات والشروط المحدثة لتأهل شركة المنطقة الحرة (QFZP) لنسبة 0% كشخص مؤهل في ضريبة الشركات؟",
    },
    icon: Building2,
  },
  {
    category: "sbr",
    title: {
      en: "Small Business Relief (AED 3M Threshold)",
      ar: "تسهيلات الأعمال الصغيرة (إيرادات حتى 3 ملايين درهم)",
    },
    query: {
      en: "How does UAE Small Business Relief (SBR) work under the AED 3,000,000 revenue cap, and who is eligible?",
      ar: "كيف يتم تطبيق تسهيلات الأعمال الصغيرة (SBR) للشركات ذات الإيرادات الأقل من 3 ملايين درهم وما هي الشروط؟",
    },
    icon: Calculator,
  },
  {
    category: "vat",
    title: {
      en: "Input VAT Recovery & FTA Audit Defenses",
      ar: "استرداد ضريبة المدخلات والجاهزية لتدقيق الهيئة",
    },
    query: {
      en: "What are the latest FTA rules on tax invoices, electronic records, and recovering 100% of input VAT?",
      ar: "ما هي أحدث متطلبات الهيئة الاتحادية للضرائب بشأن الفواتير الضريبية واسترداد ضريبة المدخلات بشكل صحيح؟",
    },
    icon: FileText,
  },
  {
    category: "deductions",
    title: {
      en: "Owner Salary & Expense Deductibility",
      ar: "خصم رواتب الملاك والمصروفات الإدارية",
    },
    query: {
      en: "Are owner and director salaries or commercial entertainment expenses fully deductible under UAE Corporate Tax law?",
      ar: "هل تعتبر رواتب الشركاء والمديرين ومصاريف الترفيه التجاري قابلة للخصم الضريبي بموجب قانون ضريبة الشركات؟",
    },
    icon: ShieldCheck,
  },
];

export default function TaxAiAdvisorModal({
  isOpen,
  onClose,
  initialQuery,
  initialCategory = "corporate-tax",
  onOpenScheduler,
}: TaxAiAdvisorModalProps) {
  const { language, isRTL } = useLanguage();
  const [query, setQuery] = useState(initialQuery || "");
  const [category, setCategory] = useState(initialCategory);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchStep, setSearchStep] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initial query if supplied
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const handleSearch = async (overrideQuery?: string) => {
    const activeQuery = (overrideQuery !== undefined ? overrideQuery : query).trim();
    if (!activeQuery) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    // Search step simulation messages for delightful user feedback
    const steps = isRTL
      ? [
          "جاري البحث عبر محرك بحث Google عن أحدث القرارات الوزارية والتعاميم...",
          "التحقق من قرارات الهيئة الاتحادية للضرائب (FTA) وقوانين ضريبة الشركات...",
          "تحليل وتنسيق التوجيهات الضريبية الموثوقة من قبل مستشاري دياس...",
        ]
      : [
          "Querying Google Search for live FTA public clarifications & ministerial decisions...",
          "Grounding with UAE Corporate Tax Decree-Law & Cabinet Decisions...",
          "Synthesizing actionable executive guidance with Dias Accounting expertise...",
        ];

    setSearchStep(steps[0]);
    const stepTimer1 = setTimeout(() => setSearchStep(steps[1]), 1200);
    const stepTimer2 = setTimeout(() => setSearchStep(steps[2]), 2400);

    try {
      const response = await fetch("/api/gemini/tax-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: activeQuery,
          category,
          language,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || "Failed to retrieve search-grounded guidance.");
      }

      const data: QueryResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error("[Tax AI Advisor] Search failed:", err);
      setError(
        err.message ||
          (isRTL
            ? "تعذر إتمام البحث اللحظي. يرجى المحاولة مرة أخرى أو التواصل المباشر مع مستشار الضرائب."
            : "Search grounding encountered an issue. Please retry or connect directly with our tax advisory desk.")
      );
    } finally {
      setIsLoading(false);
      setSearchStep("");
    }
  };

  const handleCopy = () => {
    if (!result?.answer) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppEscalation = () => {
    const phoneNumber = "971529226958";
    const topic = query || "UAE Tax Regulatory Guidance";
    const text = isRTL
      ? `مرحباً أستاذ غلين، قمت بالبحث عبر مساعد الذكاء الاصطناعي لموقع دياس حول "${topic}" وأود الحصول على استشارة مخصصة لشركتنا.`
      : `Hi Glen, I was searching UAE Tax Regulations regarding "${topic}" via your AI Intelligence assistant and would like a dedicated consultation.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/80 backdrop-blur-md animate-fade-in"
      dir={isRTL ? "rtl" : "ltr"}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 p-5 sm:p-6 text-white border-b border-white/10 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-gold-500/20 to-emerald-500/20 border border-gold-500/30 flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles className="w-6 h-6 text-gold-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                    {language === "ar" ? "مستشار الذكاء الضريبي الإماراتي" : "UAE Regulatory Tax AI Intelligence"}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    <Globe className="w-3 h-3 text-blue-400" />
                    <span>Google Search Grounded</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {language === "ar"
                    ? "بحث مباشر مدعوم بـ Gemini 3.5 Flash ومحرك Google Search للحصول على أحدث قرارات وتعاميم الهيئة الاتحادية للضرائب"
                    : "Real-time regulatory retrieval grounded by Gemini 3.5 Flash & Google Search for official FTA and Ministry of Finance decisions."}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50/60">
          {/* Search Input Bar */}
          <div className="bg-white p-2 sm:p-3 rounded-2xl border border-slate-200/90 shadow-sm focus-within:ring-2 focus-within:ring-gold-500 focus-within:border-transparent transition-all">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex items-center gap-2"
            >
              <div className="p-2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  language === "ar"
                    ? "ابحث عن أي قانون، موعد نهائي، شروط المنطقة الحرة 0%، أو ضريبة القيمة المضافة..."
                    : "Ask any UAE tax query (e.g. Free Zone 0% QFZP rules, SBR AED 3M, penalties, or VAT deadlines)..."
                }
                className="flex-1 text-sm sm:text-base bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 font-medium"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="bg-navy-950 hover:bg-navy-900 disabled:opacity-50 text-gold-400 font-bold px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow transition-all cursor-pointer shrink-0"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-gold-400" />
                    <span>{language === "ar" ? "جاري البحث..." : "Searching..."}</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>{language === "ar" ? "بحث فوري" : "Search Live"}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Preset Suggested Questions */}
          {!result && !isLoading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  <span>{language === "ar" ? "مواضيع تنظيمية شائعة وفورية:" : "Popular Grounded Inquiries:"}</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {language === "ar" ? "انقر للبحث المباشر عبر جوجل" : "Click to execute live search"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {PRESET_QUERIES.map((preset, idx) => {
                  const Icon = preset.icon;
                  const title = preset.title[language] || preset.title.en;
                  const queryText = preset.query[language] || preset.query.en;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(queryText);
                        setCategory(preset.category);
                        handleSearch(queryText);
                      }}
                      className="text-left bg-white hover:bg-emerald-50/50 hover:border-emerald-300 p-3.5 rounded-xl border border-slate-200/80 shadow-2xs transition-all flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-700 flex items-center justify-center shrink-0 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-950 transition-colors">
                          {title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {queryText}
                        </p>
                      </div>
                      <ArrowRight className={`w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0 mt-1 ${isRTL ? "rotate-180" : ""}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Loading Animation with Step Feed */}
          {isLoading && (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-4 animate-fade-in">
              <div className="relative inline-block">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-50 to-emerald-50 border border-blue-200 flex items-center justify-center mx-auto shadow-inner">
                  <Globe className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px]">
                  ✓
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  {language === "ar" ? "جاري استرجاع البيانات واللوائح الضريبية..." : "Querying Live Regulatory Sources..."}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto animate-pulse font-medium">
                  {searchStep || (language === "ar" ? "البحث جاري عبر مصادر الهيئة الرسمية..." : "Scanning official FTA publications & Gazette circulars...")}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-[11px] text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Model: <strong>gemini-3.7-flash</strong> with <strong>googleSearch</strong> tool</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3 text-red-800 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">
                <p className="font-bold">{language === "ar" ? "تنبيه في البحث" : "Search Issue"}</p>
                <p className="mt-0.5 text-red-700">{error}</p>
                <button
                  onClick={() => handleSearch()}
                  className="mt-2.5 px-3 py-1 bg-red-600 text-white rounded-lg font-bold text-xs hover:bg-red-700 transition cursor-pointer"
                >
                  {language === "ar" ? "إعادة المحاولة" : "Try Again"}
                </button>
              </div>
            </div>
          )}

          {/* Search-Grounded Result Display */}
          {result && !isLoading && (
            <div className="space-y-5 animate-fade-in">
              {/* Grounding Source Attribution Bar */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-950 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {language === "ar"
                      ? "تم التحقق وتأكيد المحتوى عبر بيانات Google Search الحية"
                      : "Verified & Grounded with Real-Time Google Search Data"}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-navy-950 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">{language === "ar" ? "تم النسخ" : "Copied"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>{language === "ar" ? "نسخ الإجابة" : "Copy"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Formatted Content Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="prose prose-slate max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed space-y-3 whitespace-pre-line">
                  {result.answer}
                </div>

                {/* Sources & Citations */}
                {result.sources && result.sources.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      <span>{language === "ar" ? "المصادر والمراجع الرسمية المستخدمة:" : "Authoritative Sources Cited:"}</span>
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {result.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-900 text-xs font-medium transition-all group"
                        >
                          <span className="truncate max-w-[240px] sm:max-w-xs">{src.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Next Step Advisory CTA Banner */}
              <div className="bg-gradient-to-r from-navy-950 to-slate-900 text-white rounded-2xl p-5 border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">
                      {language === "ar" ? "هل تحتاج لمراجعة وضع شركتك مع مستشار ضرائب معتمد؟" : "Need Glen Dias to audit your firm's specific compliance?"}
                    </h5>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {language === "ar"
                        ? "احصل على استشارة مخصصة تضمن الاستفادة من كافة الإعفاءات وتفادي الغرامات."
                        : "Receive a tailored 1:1 assessment on qualifying tax relief and statutory filing."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                  <button
                    onClick={handleWhatsAppEscalation}
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{language === "ar" ? "تواصل عبر واتساب" : "Discuss on WhatsApp"}</span>
                  </button>

                  {onOpenScheduler && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenScheduler();
                      }}
                      className="flex-1 sm:flex-none bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{language === "ar" ? "حجز استشارة" : "Book 1:1 Call"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{language === "ar" ? "محرك الذكاء الاصطناعي الضريبي نشط" : "Tax Intelligence Grounding Engine Active"}</span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer"
          >
            {language === "ar" ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
