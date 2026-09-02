import React, { useState } from "react";
import { Star, CheckCircle2, MessageSquare, ExternalLink, ShieldCheck, ThumbsUp, Filter } from "lucide-react";
import { Testimonial } from "../types";
import { GOOGLE_BUSINESS_URL } from "../data/staticData";
import { useLanguage } from "../i18n/LanguageContext";
import { GoogleLogo } from "./GoogleLogo";

export { GoogleLogo };

interface GoogleReviewsSectionProps {
  testimonials: Testimonial[];
}

export default function GoogleReviewsSection({ testimonials = [] }: GoogleReviewsSectionProps) {
  const { t, language } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [expandedResponses, setExpandedResponses] = useState<Record<string, boolean>>({});

  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];

  const filterCategories = language === "ar"
    ? [
        { id: "all", label: "جميع التقييمات" },
        { id: "Corporate Tax", label: "ضريبة الشركات" },
        { id: "VAT", label: "القيمة المضافة والمناطق الحرة" },
        { id: "Backlog", label: "مسك الدفاتر المتراكمة" },
        { id: "Incorporation", label: "تأسيس الشركات" },
      ]
    : [
        { id: "all", label: "All Reviews" },
        { id: "Corporate Tax", label: "Corporate Tax" },
        { id: "VAT", label: "VAT & Freezone" },
        { id: "Backlog", label: "Backlog Accounting" },
        { id: "Incorporation", label: "Incorporation" },
      ];

  const filteredReviews = safeTestimonials.filter((item) => {
    if (!item) return false;
    if (selectedFilter === "all") return true;
    if (selectedFilter === "Corporate Tax") return item.serviceTag?.includes("Corporate") || item.serviceTag?.includes("الشركات") || item.quote?.toLowerCase().includes("corporate tax") || item.quote?.includes("ضريبة الشركات");
    if (selectedFilter === "VAT") return item.serviceTag?.includes("VAT") || item.serviceTag?.includes("المضافة") || item.quote?.toLowerCase().includes("vat") || item.quote?.includes("القيمة المضافة");
    if (selectedFilter === "Backlog") return item.serviceTag?.includes("Backlog") || item.serviceTag?.includes("المتراكمة") || item.quote?.toLowerCase().includes("backlog") || item.quote?.includes("الدفاتر");
    if (selectedFilter === "Incorporation") return item.serviceTag?.includes("Incorporation") || item.serviceTag?.includes("التأسيس") || item.quote?.toLowerCase().includes("incorporation") || item.quote?.includes("تأسيس");
    return true;
  });

  const toggleResponse = (id: string) => {
    setExpandedResponses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-100 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-semibold text-navy-950">
            <GoogleLogo className="w-4 h-4" />
            <span>{t.testimonials.verifiedGoogleBadge}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-950 tracking-tight">
            {t.testimonials.title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Google Reviews Trust Scorecard Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Google Rating Overview */}
            <div className="md:col-span-4 flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3 shadow-xs shrink-0">
                <GoogleLogo className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-3xl font-extrabold text-navy-950 leading-none">5.0</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-700">
                  {language === "ar" ? "ممتاز" : "EXCELLENT"} <span className="text-slate-400 font-normal">• {language === "ar" ? "48 تقييم على Google" : "48 Google Reviews"}</span>
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === "ar" ? "خبراء ضرائب معتمدون 100%" : "100% Verified FTA Tax Experts"}</span>
                </div>
              </div>
            </div>

            {/* Middle Feature Metrics */}
            <div className="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div className="bg-slate-50/70 border border-slate-100/80 rounded-xl p-3">
                <span className="block text-lg font-bold font-display text-navy-950">100%</span>
                <span className="text-[11px] text-slate-500 leading-tight block">
                  {language === "ar" ? "تقييم 5 نجوم على Google" : "5-Star Google Rating"}
                </span>
              </div>
              <div className="bg-slate-50/70 border border-slate-100/80 rounded-xl p-3">
                <span className="block text-lg font-bold font-display text-emerald-600">
                  {language === "ar" ? "0 غرامات" : "0 Fines"}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight block">
                  {language === "ar" ? "سجل امتثال خالٍ من المخالفات" : "Audit Track Record"}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-slate-50/70 border border-slate-100/80 rounded-xl p-3">
                <span className="block text-lg font-bold font-display text-gold-600">
                  {language === "ar" ? "15 دقيقة" : "15 min"}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight block">
                  {language === "ar" ? "متوسط سرعة الاستجابة" : "Avg Response Time"}
                </span>
              </div>
            </div>

            {/* Action Buttons: Direct Google Reviews Links */}
            <div className="md:col-span-3 flex flex-col sm:flex-row md:flex-col gap-2.5 justify-center">
              <a
                href={GOOGLE_BUSINESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-navy-950 hover:bg-navy-900 text-white font-medium text-xs py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow group cursor-pointer"
                title="Write a Google review for Dias Accounting and Tax Consulting LLC"
              >
                <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
                <span>{language === "ar" ? "اكتب تقييماً على Google" : "Write a Google Review"}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={GOOGLE_BUSINESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                title="View Dias Accounting on Google Maps"
              >
                <GoogleLogo className="w-3.5 h-3.5" />
                <span>{t.testimonials.viewOnGoogle}</span>
              </a>
            </div>

          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === "ar" ? "تصفية حسب الموضوع:" : "Filter by topic:"}</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  selectedFilter === cat.id
                    ? "bg-navy-950 text-white shadow-xs"
                    : "bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials / Google Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((item) => {
            const hasOwnerResponse = Boolean(item.ownerResponse);
            const isResponseOpen = Boolean(expandedResponses[item.id]);

            return (
              <div 
                key={item.id} 
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:border-gold-500/40 relative"
              >
                {/* Google badge in corner */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(Math.max(0, Math.min(5, Math.floor(item.rating || 5))))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    {item.relativeTime && (
                      <span className="text-[11px] text-slate-400 ml-1.5">
                        • {item.relativeTime}
                      </span>
                    )}
                  </div>

                  <a 
                    href={GOOGLE_BUSINESS_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1 rounded-md hover:bg-slate-50 text-slate-400 hover:text-navy-900 transition-colors"
                    title="Verified Google Review"
                  >
                    <GoogleLogo className="w-4 h-4" />
                  </a>
                </div>

                {/* Service Tag */}
                {item.serviceTag && (
                  <div className="mb-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      {item.serviceTag}
                    </span>
                  </div>
                )}

                {/* Review Text */}
                <div className="space-y-3 grow">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    "{item.quote}"
                  </p>
                </div>

                {/* Owner Response Accordion if available */}
                {hasOwnerResponse && item.ownerResponse && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => toggleResponse(item.id)}
                      className="w-full flex items-center justify-between text-[11px] font-semibold text-gold-700 hover:text-gold-800 transition-colors py-1 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3 text-gold-600" />
                        {language === "ar" ? "رد من المستشار غلين دياز (المالك)" : "Response from Glen Dias (Owner)"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isResponseOpen ? (language === "ar" ? "إخفاء" : "Hide") : (language === "ar" ? "عرض الرد" : "View reply")}
                      </span>
                    </button>

                    {isResponseOpen && (
                      <div className="mt-2 bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] text-slate-600 space-y-1 animate-fadeIn">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-navy-950">{item.ownerResponse.author}</span>
                          <span>{item.ownerResponse.date}</span>
                        </div>
                        <p className="italic text-slate-600 leading-relaxed">
                          "{item.ownerResponse.text}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviewer Info */}
                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100">
                  {item.avatarUrl ? (
                    <img 
                      src={item.avatarUrl} 
                      alt={item.authorName}
                      width={40}
                      height={40}
                      loading="lazy"
                      decoding="async" 
                      className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-navy-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {item.authorName.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0 grow">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-display text-xs font-bold text-navy-950 truncate">
                        {item.authorName}
                      </h4>
                      <span title="Verified Customer">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </span>
                    </div>
                    
                    {(item.authorRole || item.authorCompany) && (
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {item.authorRole && <span>{item.authorRole}, </span>}
                        <span className="font-semibold text-slate-700">{item.authorCompany}</span>
                      </p>
                    )}

                    {item.location && (
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5 truncate">
                        📍 {item.location}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom CTA for Google Review */}
        <div className="bg-gradient-to-r from-navy-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-center text-white space-y-4 shadow-lg">
          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
              {language === "ar" ? "هل سبق لك التعامل مع دياز للمحاسبة والاستشارات الضريبية؟" : "Have you worked with Dias Accounting & Tax Consulting?"}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              {language === "ar" ? "تقييمك الصادق يساعد رواد الأعمال والشركات في الإمارات على اختيار خدمات محاسبية وضريبية معتمدة وموثوقة." : "Your honest feedback helps fellow business owners in the UAE find trusted corporate tax and bookkeeping solutions."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={GOOGLE_BUSINESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 font-display font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <GoogleLogo className="w-4 h-4" />
              <span>{language === "ar" ? "اترك تقييماً 5 نجوم على Google" : "Leave a 5-Star Review on Google"}</span>
              <ExternalLink className="w-3.5 h-3.5 text-navy-900" />
            </a>

            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs py-3 px-6 rounded-xl transition-all"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-gold-400" />
              <span>{language === "ar" ? "احجز استشارتك الضريبية" : "Book Your Consultation"}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
