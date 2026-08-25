import React, { useState, useEffect, useMemo } from "react";
import { MessageSquare, X, Send, Sparkles, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { Service, BlogPost } from "../types";

export interface WhatsAppWidgetProps {
  activeSection?: string;
  selectedService?: Service | null;
  selectedBlog?: BlogPost | null;
  customContext?: string | null;
}

interface ContextPreset {
  badge: { en: string; ar: string };
  defaultMessage: { en: string; ar: string };
  quickOptions: Array<{
    label: { en: string; ar: string };
    query: { en: string; ar: string };
    icon: string;
  }>;
}

const CONTEXT_PRESETS: Record<string, ContextPreset> = {
  "corporate-tax": {
    badge: {
      en: "Corporate Tax Advisory",
      ar: "استشارات ضريبة الشركات",
    },
    defaultMessage: {
      en: "Hi Glen, I'm reviewing Dias Accounting's Corporate Tax Advisory services and would like guidance on our UAE 9% tax registration and EmaraTax filing.",
      ar: "مرحباً أستاذ غلين، اطلعت على خدمات استشارات ضريبة الشركات (9%) وأود الحصول على استشارة حول تسجيل شركتنا عبر منصة إمارات تاكس والامتثال الضريبي.",
    },
    quickOptions: [
      {
        icon: "📝",
        label: { en: "Corporate Tax Registration", ar: "التسجيل في ضريبة الشركات" },
        query: { en: "Register our business for UAE Corporate Tax on EmaraTax", ar: "تسجيل شركتنا في ضريبة الشركات الإماراتية عبر إمارات تاكس" },
      },
      {
        icon: "🛡️",
        label: { en: "Free Zone 0% Qualifying Check", ar: "فحص أهلية نسبة 0% للمناطق الحرة" },
        query: { en: "Check if our Free Zone entity qualifies for 0% Corporate Tax rate", ar: "فحص مدى أهلية شركتنا في المنطقة الحرة لنسبة 0% كشخص مؤهل" },
      },
      {
        icon: "📑",
        label: { en: "Small Business Relief (AED 3M)", ar: "تسهيلات الأعمال الصغيرة (3 مليون درهم)" },
        query: { en: "Inquire about Small Business Relief eligibility under AED 3,000,000 threshold", ar: "الاستفسار عن أهلية الإعفاء ضمن تسهيلات الأعمال الصغيرة" },
      },
    ],
  },
  "vat-compliance": {
    badge: {
      en: "VAT Compliance & FTA Defense",
      ar: "الامتثال لضريبة القيمة المضافة",
    },
    defaultMessage: {
      en: "Hi Glen, I would like assistance with our UAE VAT quarterly return filing and input tax optimization.",
      ar: "مرحباً أستاذ غلين، أود المساعدة في تقديم إقرارات ضريبة القيمة المضافة الربع سنوية واسترداد ضريبة المدخلات لشركتنا.",
    },
    quickOptions: [
      {
        icon: "📈",
        label: { en: "Quarterly VAT Return Filing", ar: "تقديم إقرار ضريبة القيمة المضافة" },
        query: { en: "Help us prepare and file our quarterly VAT return with the FTA", ar: "مساعدتنا في إعداد وتقديم إقرار ضريبة القيمة المضافة للهيئة" },
      },
      {
        icon: "🔍",
        label: { en: "Input VAT Recovery Audit", ar: "تدقيق استرداد ضريبة المدخلات" },
        query: { en: "Audit our historical invoices to recover unclaimed input VAT", ar: "تدقيق فواتيرنا السابقة لاسترداد مبالغ ضريبة المدخلات غير المطالب بها" },
      },
      {
        icon: "⚡",
        label: { en: "FTA Audit & Penalty Mitigation", ar: "التعامل مع تدقيق الهيئة والغرامات" },
        query: { en: "Help resolve an FTA VAT inquiry or penalty notice", ar: "المساعدة في حل استفسار أو إشعار غرامة من الهيئة الاتحادية للضرائب" },
      },
    ],
  },
  "accounting-bookkeeping": {
    badge: {
      en: "Accounting & Bookkeeping",
      ar: "مسك الدفاتر والمحاسبة",
    },
    defaultMessage: {
      en: "Hi Glen, I'm looking for professional monthly bookkeeping & IFRS financial statements for our UAE business.",
      ar: "مرحباً أستاذ غلين، أبحث عن خدمات مسك دفاتر شهرية وإعداد قوائم مالية متوافقة مع معايير IFRS لشركتنا في الإمارات.",
    },
    quickOptions: [
      {
        icon: "📊",
        label: { en: "Monthly Bookkeeping Quotation", ar: "عرض سعر مسك الدفاتر الشهري" },
        query: { en: "Provide a customized monthly bookkeeping quote for our transaction volume", ar: "تقديم عرض سعر مخصص لمسك الدفاتر بناءً على حجم معاملاتنا" },
      },
      {
        icon: "📑",
        label: { en: "Past Backlog Accounting Cleanup", ar: "تسوية الحسابات المتراكمة السابقة" },
        query: { en: "Help catch up and organize our historical backlog accounting records", ar: "تنظيم وتسوية السجلات المحاسبية المتراكمة عن الفترات السابقة" },
      },
      {
        icon: "💼",
        label: { en: "Audit-Ready Financial Statements", ar: "قوائم مالية جاهزة للتدقيق" },
        query: { en: "Prepare annual IFRS balance sheet & P&L ready for statutory audit", ar: "إعداد ميزانية عمومية وقوائم أرباح وخسائر جاهزة للتدقيق القانوني" },
      },
    ],
  },
  "cfo-advisory": {
    badge: {
      en: "Fractional CFO Advisory",
      ar: "استشارات CFO التنفيذية",
    },
    defaultMessage: {
      en: "Hi Glen, I was reviewing your Service Comparison matrix and would like to explore Fractional CFO Advisory, cash flow runway forecasting, and executive board reviews.",
      ar: "مرحباً أستاذ غلين، اطلعت على مصفوفة مقارنة الخدمات وأود استكشاف خدمات الإدارة المالية التنفيذية (CFO) وإدارة السيولة النقدية والاجتماعات الاستراتيجية.",
    },
    quickOptions: [
      {
        icon: "✨",
        label: { en: "Book 1:1 CFO Discovery Call", ar: "حجز جلسة استكشافية مع CFO" },
        query: { en: "Schedule a 30-minute discovery call to evaluate Fractional CFO leadership", ar: "حجز جلسة استكشافية لتقييم خدمات الإدارة المالية التنفيذية" },
      },
      {
        icon: "📈",
        label: { en: "13-Week Cash Flow Forecast Model", ar: "نموذج توقعات السيولة لـ 13 أسبوعاً" },
        query: { en: "Implement a dynamic 13-week rolling cash runway model for our business", ar: "تطبيق نموذج ديناميكي لتوقعات التدفقات النقدية والسيولة لشركتنا" },
      },
      {
        icon: "🏛️",
        label: { en: "Budget vs. Actual Variance System", ar: "نظام تحليل انحراف الميزانية" },
        query: { en: "Setup monthly executive KPI dashboards and budget variance reporting", ar: "إنشاء لوحات مؤشرات الأداء التنفيذية وتقارير انحراف الميزانية" },
      },
    ],
  },
  "calculator": {
    badge: {
      en: "UAE Tax Calculator",
      ar: "حاسبة ضريبة الشركات",
    },
    defaultMessage: {
      en: "Hi Glen, I just used the UAE Corporate Tax Estimator on your website and would like to review our calculated liability and available relief options.",
      ar: "مرحباً أستاذ غلين، قمت بحساب الضريبة عبر حاسبة ضريبة الشركات في موقعكم وأود مراجعة الالتزام الضريبي وتسهيلات الإعفاء المتاحة لشركتنا.",
    },
    quickOptions: [
      {
        icon: "🧮",
        label: { en: "Discuss My Tax Calculation", ar: "مناقشة نتيجة حساب الضريبة" },
        query: { en: "Review our estimated Corporate Tax calculation and optimize expenses", ar: "مراجعة تقدير ضريبة الشركات وتحسين المصروفات القابلة للخصم" },
      },
      {
        icon: "🏢",
        label: { en: "Free Zone 0% Qualification", ar: "تأهيل المنطقة الحرة لنسبة 0%" },
        query: { en: "Structure our Free Zone revenue to qualify for 0% Qualifying Income status", ar: "هيكلة إيرادات المنطقة الحرة للتأهل لنسبة 0% كدخل مؤهل" },
      },
      {
        icon: "🛡️",
        label: { en: "Small Business Relief Application", ar: "تطبيق تسهيلات الأعمال الصغيرة" },
        query: { en: "Confirm if we are eligible for the 0% Small Business Relief under AED 3M", ar: "التأكد من أهليتنا لتسهيلات الأعمال الصغيرة تحت 3 مليون درهم" },
      },
    ],
  },
  "business-incorporation": {
    badge: {
      en: "Business Incorporation",
      ar: "تأسيس وترخيص الشركات",
    },
    defaultMessage: {
      en: "Hi Glen, I'm looking for expert advisory on setting up a new business in the UAE (Mainland / Free Zone) and opening a corporate bank account.",
      ar: "مرحباً أستاذ غلين، أود الحصول على استشارة حول تأسيس شركة جديدة في دولة الإمارات (منطقة حرة / البر الرئيسي) وفتح حساب بنكي للشركات.",
    },
    quickOptions: [
      {
        icon: "🏢",
        label: { en: "Free Zone vs Mainland Guidance", ar: "المقارنة بين المنطقة الحرة والبر الرئيسي" },
        query: { en: "Advise on the best jurisdiction (Free Zone vs Mainland) for our business activity", ar: "تحديد أفضل بيئة ترخيص (منطقة حرة أو بر رئيسي) لنشاطنا" },
      },
      {
        icon: "💳",
        label: { en: "Corporate Bank Account Opening", ar: "فتح حساب بنكي للشركات" },
        query: { en: "Assist with documentation and corporate bank account opening in top UAE banks", ar: "المساعدة في توثيق وفتح الحساب البنكي لدى البنوك الإماراتية" },
      },
      {
        icon: "📋",
        label: { en: "Tax-Compliant Corporate Structure", ar: "هيكلة قانونية متوافقة ضريبياً" },
        query: { en: "Design a corporate structure compliant with UAE Corporate Tax & ESR laws", ar: "تصميم هيكل تجاري متوافق مع ضريبة الشركات ولوائح الأنشطة الاقتصادية" },
      },
    ],
  },
  "pricing": {
    badge: {
      en: "Accounting Packages",
      ar: "باقات وأسعار الخدمات",
    },
    defaultMessage: {
      en: "Hi Glen, I'm reviewing your monthly accounting and tax packages and would like to confirm the best plan for our transaction volume.",
      ar: "مرحباً أستاذ غلين، اطلعت على باقات المحاسبة والضرائب وأود تحديد الباقة الأنسب لحجم فواتير ومعاملات شركتنا.",
    },
    quickOptions: [
      {
        icon: "🏷️",
        label: { en: "Request Custom Tier Pricing", ar: "طلب تسعير مخصص للباقة" },
        query: { en: "Get a customized quote for our specific monthly invoice volume", ar: "الحصول على عرض تسعير مخصص لعدد فواتيرنا ومعاملاتنا الشهرية" },
      },
      {
        icon: "⚡",
        label: { en: "Fast-Track Onboarding Process", ar: "إجراءات بدء الخدمة السريعة" },
        query: { en: "How quickly can Dias Accounting take over our bookkeeping and tax records?", ar: "ما هي خطوات وسرعة استلامكم لملفاتنا المحاسبية والضريبية؟" },
      },
      {
        icon: "📅",
        label: { en: "Book Free Discovery Session", ar: "حجز جلسة استكشافية مجانية" },
        query: { en: "Schedule a 30-minute free consultation to review our exact accounting needs", ar: "حجز استشارة مجانية مدتها 30 دقيقة لمراجعة متطلباتنا المحاسبية" },
      },
    ],
  },
  "reviews": {
    badge: {
      en: "5.0 Verified Reviews",
      ar: "تقييمات العملاء المعتمدة",
    },
    defaultMessage: {
      en: "Hi Glen, I read your 5.0 Google client reviews and would like to schedule a 30-minute consultation for our UAE business.",
      ar: "مرحباً أستاذ غلين، اطلعت على تقييماتكم المتميزة على جوجل وأود حجز استشارة لمدة 30 دقيقة لمناقشة متطلبات شركتنا.",
    },
    quickOptions: [
      {
        icon: "⭐",
        label: { en: "Book 30-Min Consultation", ar: "حجز استشارة 30 دقيقة" },
        query: { en: "Book a complimentary 30-minute consultation with Glen Dias", ar: "حجز جلسة استشارية مجانية مع الأستاذ غلين دياس" },
      },
      {
        icon: "💬",
        label: { en: "Ask a Specific Tax Question", ar: "طرح سؤال ضريبي محدد" },
        query: { en: "I have a specific question regarding UAE tax law and compliance", ar: "لدي استفسار محدد بخصوص قانون الضرائب والامتثال في الإمارات" },
      },
    ],
  },
  "general": {
    badge: {
      en: "Dias Accounting Direct Line",
      ar: "الخط المباشر لدياس للمحاسبة",
    },
    defaultMessage: {
      en: "Hi Glen, I visited Dias Accounting & Tax Consulting and would like to consult with a senior tax advisor.",
      ar: "مرحباً أستاذ غلين، زرت موقع دياس للاستشارات المحاسبية والضريبية وأود التحدث مع مستشار ضريبي معتمد.",
    },
    quickOptions: [
      {
        icon: "📝",
        label: { en: "Corporate Tax Registration", ar: "التسجيل في ضريبة الشركات" },
        query: { en: "Register our UAE company for Corporate Tax on EmaraTax", ar: "تسجيل شركتنا في ضريبة الشركات عبر منصة إمارات تاكس" },
      },
      {
        icon: "📊",
        label: { en: "Monthly Bookkeeping Quote", ar: "عرض سعر مسك الدفاتر" },
        query: { en: "Inquire about monthly bookkeeping and financial statements", ar: "الاستفسار عن خدمات مسك الدفاتر وإعداد القوائم المالية" },
      },
      {
        icon: "📈",
        label: { en: "VAT Return Filing Support", ar: "تقديم إقرارات ضريبة القيمة المضافة" },
        query: { en: "Assistance with quarterly VAT return filing and compliance", ar: "المساعدة في تقديم إقرارات ضريبة القيمة المضافة الربع سنوية" },
      },
    ],
  },
};

export default function WhatsAppWidget({
  activeSection,
  selectedService,
  selectedBlog,
  customContext,
}: WhatsAppWidgetProps) {
  const { language, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [hasManuallyEdited, setHasManuallyEdited] = useState(false);
  const [lastTrackedKey, setLastTrackedKey] = useState<string>("general");

  // Determine current active context key based on user behavior & navigation
  const currentContextKey = useMemo(() => {
    if (customContext && CONTEXT_PRESETS[customContext]) {
      return customContext;
    }

    if (selectedService) {
      if (selectedService.id.includes("tax")) return "corporate-tax";
      if (selectedService.id.includes("vat")) return "vat-compliance";
      if (selectedService.id.includes("incorporation") || selectedService.id.includes("business")) return "business-incorporation";
      if (selectedService.id.includes("accounting") || selectedService.id.includes("bookkeeping")) return "accounting-bookkeeping";
    }

    if (selectedBlog) {
      if (selectedBlog.id.includes("corporate-tax") || selectedBlog.id.includes("tax")) return "corporate-tax";
      if (selectedBlog.id.includes("vat")) return "vat-compliance";
    }

    if (activeSection) {
      if (activeSection === "calculator") return "calculator";
      if (activeSection === "service-comparison") return "cfo-advisory";
      if (activeSection === "pricing") return "pricing";
      if (activeSection === "reviews" || activeSection === "testimonials") return "reviews";
      if (activeSection === "services") return "corporate-tax";
    }

    return "general";
  }, [customContext, selectedService, selectedBlog, activeSection]);

  const activePreset = CONTEXT_PRESETS[currentContextKey] || CONTEXT_PRESETS["general"];

  // Update default message whenever context changes, unless user typed custom message
  useEffect(() => {
    if (currentContextKey !== lastTrackedKey) {
      setLastTrackedKey(currentContextKey);
      if (!hasManuallyEdited) {
        const text = activePreset.defaultMessage[language] || activePreset.defaultMessage.en;
        setMessage(text);
      }
    }
  }, [currentContextKey, lastTrackedKey, hasManuallyEdited, language, activePreset]);

  // Update language when user toggles language if they haven't written custom message
  useEffect(() => {
    if (!hasManuallyEdited) {
      const text = activePreset.defaultMessage[language] || activePreset.defaultMessage.en;
      setMessage(text);
    }
  }, [language, activePreset, hasManuallyEdited]);

  const resetToContextDefault = () => {
    const text = activePreset.defaultMessage[language] || activePreset.defaultMessage.en;
    setMessage(text);
    setHasManuallyEdited(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const phoneNumber = "971529226958"; // Dias Accounting direct WhatsApp
    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const selectQuickQuery = (queryText: string) => {
    const phoneNumber = "971529226958";
    const greeting = language === "ar" ? "مرحباً أستاذ غلين، أود الاستفسار عن:" : "Hi Dias Accounting! I would like to inquire about:";
    const text = `${greeting} ${queryText}.`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className={`fixed bottom-6 ${isRTL ? "left-6" : "right-6"} z-40 flex flex-col ${isRTL ? "items-start" : "items-end"}`}>
      {/* Chat Window Popup */}
      {isOpen && (
        <div 
          className={`w-[340px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden mb-4 transition-all duration-300 scale-100 ${
            isRTL ? "origin-bottom-left" : "origin-bottom-right"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-800 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120"
                  alt="Glen Dias - Senior Tax Consultant"
                  width={42}
                  height={42}
                  loading="lazy"
                  decoding="async"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="font-display font-bold text-sm leading-tight text-white">Glen Dias</h5>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white/20 text-emerald-100">FTA Partner</span>
                </div>
                <span className="text-[10.5px] text-emerald-100 font-medium">
                  {language === "ar" ? "مستشار ضرائب أول معتمد" : "Senior Tax & Accounting Advisor"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/15 p-1.5 rounded-full transition-colors cursor-pointer"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Context Header Bar */}
          <div className="bg-emerald-50/90 border-b border-emerald-100 px-3.5 py-2 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-900 font-medium truncate">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                {language === "ar" ? "الموضوع المتصفح حالياً:" : "Current Topic:"}{" "}
                <strong className="text-emerald-950 font-bold">{activePreset.badge[language] || activePreset.badge.en}</strong>
              </span>
            </div>
            {hasManuallyEdited && (
              <button
                type="button"
                onClick={resetToContextDefault}
                className="text-emerald-700 hover:text-emerald-950 text-[10px] font-bold underline flex items-center gap-0.5 shrink-0 ml-1 cursor-pointer"
                title="Reset to contextual message"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>{language === "ar" ? "إعادة تعيين" : "Reset"}</span>
              </button>
            )}
          </div>

          {/* Conversation Area */}
          <div className="p-4 bg-slate-50 space-y-3 max-h-[240px] overflow-y-auto text-xs">
            {/* Advisor Message Bubble */}
            <div className="bg-white text-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200/80 shadow-sm max-w-[95%] leading-relaxed space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[10.5px] text-emerald-700">Glen • Dias Accounting</span>
                <span className="text-[9px] text-slate-400">Online</span>
              </div>
              <p className="text-[11.5px] text-slate-700">
                {language === "ar" ? (
                  <>
                    أهلاً بك! 👋 لاحظت أنك تستكشف{" "}
                    <strong className="text-navy-950 underline decoration-emerald-400">
                      {activePreset.badge.ar}
                    </strong>
                    . كيف يمكنني مساعدتك في تخفيض التزاماتك الضريبية وتنظيم دفاتر حساباتك اليوم؟
                  </>
                ) : (
                  <>
                    Hi there! 👋 I noticed you&apos;re exploring{" "}
                    <strong className="text-navy-950 underline decoration-emerald-400">
                      {activePreset.badge.en}
                    </strong>
                    . How can I assist you with your UAE corporate compliance or tax optimization today?
                  </>
                )}
              </p>
            </div>

            {/* Quick Contextual Actions */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {language === "ar" ? "استفسارات سريعة مخصصة:" : "Suggested Quick Queries:"}
              </span>
              {activePreset.quickOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => selectQuickQuery(opt.query[language] || opt.query.en)}
                  className="w-full text-left bg-white hover:bg-emerald-50/80 hover:border-emerald-300 text-slate-700 hover:text-emerald-950 px-3 py-2 rounded-xl border border-slate-200/70 transition-all font-medium text-[11px] flex items-center justify-between group shadow-2xs cursor-pointer"
                >
                  <span className="flex items-center gap-2 truncate pr-1">
                    <span>{opt.icon}</span>
                    <span className="truncate">{opt.label[language] || opt.label.en}</span>
                  </span>
                  <ArrowRight className={`w-3 h-3 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0 ${isRTL ? "rotate-180" : ""}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Input Form with Pre-Filled Context */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white space-y-2">
            <div className="relative">
              <textarea
                rows={2}
                required
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setHasManuallyEdited(true);
                }}
                placeholder={
                  language === "ar"
                    ? "اكتب استفسارك الضريبي أو المحاسبي هنا..."
                    : "Type your tax or accounting inquiry here..."
                }
                className="w-full text-xs p-2.5 pr-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-800 bg-slate-50/50 resize-none"
              />
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{language === "ar" ? "رد فوري عبر واتساب" : "Direct response on WhatsApp"}</span>
              </span>

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                aria-label="Send WhatsApp message"
              >
                <span>{language === "ar" ? "إرسال عبر واتساب" : "Send to WhatsApp"}</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none relative group cursor-pointer border-2 border-white/20"
        aria-label="Chat with Glen Dias on WhatsApp"
        title="Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow animate-bounce">
          1
        </span>
        <MessageSquare className="w-7 h-7" />
        
        {/* Dynamic Hover Tooltip */}
        <span 
          className={`hidden md:block absolute ${
            isRTL ? "left-16 origin-left" : "right-16 origin-right"
          } bg-navy-950 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap border border-white/10`}
        >
          {language === "ar"
            ? `استفسر عن ${activePreset.badge.ar} عبر واتساب 💬`
            : `Consult on ${activePreset.badge.en} on WhatsApp 💬`}
        </span>
      </button>
    </div>
  );
}
