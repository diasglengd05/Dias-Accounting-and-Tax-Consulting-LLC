import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  CheckCircle2,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  ThumbsUp,
  Filter,
  Quote,
  Sparkles,
  MapPin,
  ChevronDown
} from "lucide-react";
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
  const isAr = language === "ar";
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [expandedResponses, setExpandedResponses] = useState<Record<string, boolean>>({});
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, boolean>>({});

  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];

  const filterCategories = isAr
    ? [
        { id: "all", label: "جميع التقييمات (6)" },
        { id: "Corporate Tax", label: "ضريبة الشركات" },
        { id: "VAT", label: "القيمة المضافة والمناطق الحرة" },
        { id: "Backlog", label: "مسك الدفاتر المتراكمة" },
        { id: "Incorporation", label: "تأسيس الشركات" },
      ]
    : [
        { id: "all", label: "All Reviews (6)" },
        { id: "Corporate Tax", label: "Corporate Tax" },
        { id: "VAT", label: "VAT & Freezone" },
        { id: "Backlog", label: "Backlog Accounting" },
        { id: "Incorporation", label: "Incorporation" },
      ];

  const filteredReviews = safeTestimonials.filter((item) => {
    if (!item) return false;
    if (selectedFilter === "all") return true;
    if (selectedFilter === "Corporate Tax")
      return (
        item.serviceTag?.includes("Corporate") ||
        item.serviceTag?.includes("الشركات") ||
        item.quote?.toLowerCase().includes("corporate tax") ||
        item.quote?.includes("ضريبة الشركات")
      );
    if (selectedFilter === "VAT")
      return (
        item.serviceTag?.includes("VAT") ||
        item.serviceTag?.includes("المضافة") ||
        item.quote?.toLowerCase().includes("vat") ||
        item.quote?.includes("القيمة المضافة")
      );
    if (selectedFilter === "Backlog")
      return (
        item.serviceTag?.includes("Backlog") ||
        item.serviceTag?.includes("المتراكمة") ||
        item.quote?.toLowerCase().includes("backlog") ||
        item.quote?.includes("الدفاتر")
      );
    if (selectedFilter === "Incorporation")
      return (
        item.serviceTag?.includes("Incorporation") ||
        item.serviceTag?.includes("التأسيس") ||
        item.quote?.toLowerCase().includes("incorporation") ||
        item.quote?.includes("تأسيس")
      );
    return true;
  });

  const toggleResponse = (id: string) => {
    setExpandedResponses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHelpful = (id: string) => {
    setHelpfulReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="testimonials"
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200/80 relative overflow-hidden scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-navy-950">
            <GoogleLogo className="w-3.5 h-3.5" />
            <span>{t.testimonials.verifiedGoogleBadge}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-950 tracking-tight">
            {t.testimonials.title}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Google Reviews Trust Scorecard Banner */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-sm transition-all">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            
            {/* Google Rating Overview */}
            <div className="md:col-span-4 flex items-center gap-3.5 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-5 rtl:md:border-r-0 rtl:md:border-l rtl:md:pr-0 rtl:md:pl-5">
              <div className="w-13 h-13 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2.5 shadow-2xs shrink-0">
                <GoogleLogo className="w-8 h-8" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl sm:text-3xl font-black text-navy-950 leading-none">5.0</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-800">
                  {isAr ? "تقييم استثنائي" : "EXCELLENT"} <span className="text-slate-500 font-normal">• {isAr ? "48 تقييم على Google" : "48 Google Reviews"}</span>
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? "وكلاء ضريبيون معتمدون لدى الهيئة" : "100% FTA Certified Tax Agents"}</span>
                </div>
              </div>
            </div>

            {/* Middle Feature Metrics */}
            <div className="md:col-span-5 grid grid-cols-3 gap-2 sm:gap-3 text-center sm:text-left rtl:sm:text-right">
              <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
                <span className="block text-base sm:text-lg font-bold font-display text-navy-950">5.0 / 5.0</span>
                <span className="text-[10.5px] text-slate-500 leading-tight block truncate">
                  {isAr ? "تقييم كامل" : "Google Score"}
                </span>
              </div>
              <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
                <span className="block text-base sm:text-lg font-bold font-display text-emerald-600">
                  {isAr ? "0 غرامات" : "0 Fines"}
                </span>
                <span className="text-[10.5px] text-slate-500 leading-tight block truncate">
                  {isAr ? "سجل امتثال" : "Compliance Record"}
                </span>
              </div>
              <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
                <span className="block text-base sm:text-lg font-bold font-display text-gold-600">
                  &lt; 15 min
                </span>
                <span className="text-[10.5px] text-slate-500 leading-tight block truncate">
                  {isAr ? "سرعة الرد" : "Response Time"}
                </span>
              </div>
            </div>

            {/* Action Buttons: Direct Google Reviews Links */}
            <div className="md:col-span-3 flex flex-col sm:flex-row md:flex-col gap-2 justify-center">
              <a
                href={GOOGLE_BUSINESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-navy-950 hover:bg-navy-900 text-white font-medium text-xs py-2.5 px-3 rounded-xl transition-all shadow-xs hover:shadow group cursor-pointer"
                title="Write a Google review for Dias Accounting"
              >
                <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
                <span>{isAr ? "اكتب تقييماً على Google" : "Write a Google Review"}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={GOOGLE_BUSINESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer"
                title="View Dias Accounting on Google Maps"
              >
                <GoogleLogo className="w-3.5 h-3.5" />
                <span>{t.testimonials.viewOnGoogle}</span>
              </a>
            </div>

          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>{isAr ? "تصفية التقييمات حسب الخدمة:" : "Filter reviews by service:"}</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer select-none ${
                  selectedFilter === cat.id
                    ? "bg-navy-950 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Google Reviews "Card Deck" Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((item, idx) => {
              const hasOwnerResponse = Boolean(item.ownerResponse);
              const isResponseOpen = Boolean(expandedResponses[item.id]);
              const isHelpful = Boolean(helpfulReviews[item.id]);

              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.22, delay: idx * 0.04 }}
                  whileHover={{ y: -4, transition: { duration: 0.16 } }}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-gold-400 p-5 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative text-left rtl:text-right"
                >
                  {/* Watermark Quote Icon in Corner */}
                  <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
                    <Quote className="w-12 h-12 text-navy-950" />
                  </div>

                  <div>
                    {/* Card Header: Reviewer Profile + Google Verified Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.avatarUrl ? (
                          <img
                            src={item.avatarUrl}
                            alt={item.authorName}
                            width={44}
                            height={44}
                            loading="lazy"
                            decoding="async"
                            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0 ring-1 ring-slate-200/80"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-navy-900 to-slate-800 text-gold-400 font-display font-bold flex items-center justify-center text-sm shrink-0 shadow-xs ring-1 ring-slate-200">
                            {item.authorName.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <h3 className="font-display text-sm font-bold text-navy-950 truncate">
                              {item.authorName}
                            </h3>
                            <span title="Verified UAE Business Client">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            </span>
                          </div>
                          
                          {(item.authorRole || item.authorCompany) && (
                            <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                              {item.authorRole && <span>{item.authorRole}, </span>}
                              <span className="font-semibold text-slate-700">{item.authorCompany}</span>
                            </p>
                          )}

                          {item.location && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                              <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span className="truncate">{item.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Google G Link Button */}
                      <a
                        href={GOOGLE_BUSINESS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-500 hover:text-navy-950 transition-colors shrink-0 shadow-2xs group/glink"
                        title="Verified on Google Reviews"
                      >
                        <GoogleLogo className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Rating & Service Chip Row */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 mb-3 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {[...Array(Math.max(0, Math.min(5, Math.floor(item.rating || 5))))].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        {item.relativeTime && (
                          <span className="text-[10.5px] text-slate-400 font-medium">
                            • {item.relativeTime}
                          </span>
                        )}
                      </div>

                      {item.serviceTag && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold-500/15 border border-gold-500/30 text-[10px] font-bold text-gold-800 uppercase tracking-wide font-mono">
                          <Sparkles className="w-2.5 h-2.5 text-gold-600" />
                          <span>{item.serviceTag}</span>
                        </span>
                      )}
                    </div>

                    {/* Review Quote Body */}
                    <blockquote className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
                      "{item.quote}"
                    </blockquote>
                  </div>

                  {/* Card Bottom Area: Owner Response & Helpful Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    
                    {/* Owner Response Accordion Card */}
                    {hasOwnerResponse && item.ownerResponse && (
                      <div className="bg-slate-50/90 rounded-xl border border-slate-200/70 p-2.5 transition-all">
                        <button
                          onClick={() => toggleResponse(item.id)}
                          className="w-full flex items-center justify-between text-[11px] font-semibold text-gold-800 hover:text-gold-900 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3 text-gold-600 shrink-0" />
                            <span>{isAr ? "رد المستشار غلين دياز (المالك)" : "Response from Glen Dias (Owner)"}</span>
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                              isResponseOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isResponseOpen && (
                          <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                              <span className="font-semibold text-navy-950">{item.ownerResponse.author}</span>
                              <span>{item.ownerResponse.date}</span>
                            </div>
                            <p className="text-slate-600 italic leading-relaxed text-[11px]">
                              "{item.ownerResponse.text}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Footer: Helpful counter & EmaraTax tag */}
                    <div className="flex items-center justify-between pt-1 text-[10.5px]">
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{isAr ? "عميل موثق في الإمارات" : "Verified UAE Client"}</span>
                      </span>

                      <button
                        onClick={() => toggleHelpful(item.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10.5px] font-medium transition-all cursor-pointer ${
                          isHelpful
                            ? "bg-gold-500/20 text-gold-900 border border-gold-400/50"
                            : "text-slate-500 hover:text-navy-900 hover:bg-slate-100"
                        }`}
                        title="Mark review as helpful"
                      >
                        <ThumbsUp className={`w-3 h-3 ${isHelpful ? "text-gold-600 fill-gold-500" : ""}`} />
                        <span>{isHelpful ? (isAr ? "مفيد (1)" : "Helpful (1)") : (isAr ? "مفيد" : "Helpful")}</span>
                      </button>
                    </div>

                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom CTA Card for Google Review */}
        <div className="bg-gradient-to-r from-navy-950 to-slate-900 rounded-2xl p-5 sm:p-7 text-center text-white space-y-3.5 shadow-md">
          <div className="max-w-xl mx-auto space-y-1.5">
            <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white">
              {isAr
                ? "هل سبق لك التعامل مع دياز للمحاسبة والاستشارات الضريبية؟"
                : "Have you worked with Dias Accounting & Tax Consulting?"}
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              {isAr
                ? "تقييمك الصادق يساعد رواد الأعمال في الإمارات على اختيار خدمات محاسبية وضريبية معتمدة وموثوقة."
                : "Your feedback helps fellow UAE business owners find trusted corporate tax and bookkeeping solutions."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
            <a
              href={GOOGLE_BUSINESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 font-display font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <GoogleLogo className="w-3.5 h-3.5" />
              <span>{isAr ? "اترك تقييماً 5 نجوم على Google" : "Leave a 5-Star Review on Google"}</span>
              <ExternalLink className="w-3 h-3 text-navy-900" />
            </a>

            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-xs py-2.5 px-5 rounded-xl transition-all active:scale-95"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-gold-400" />
              <span>{isAr ? "احجز استشارتك الضريبية" : "Book Your Consultation"}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

