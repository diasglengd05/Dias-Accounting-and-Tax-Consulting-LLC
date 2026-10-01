import React, { useState } from "react";
import { MessageSquare, PhoneCall, ShieldCheck, ArrowRight, X, CheckCircle2, Send, Phone, Calendar } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface ComplianceAlertBannerProps {
  onOpenAudit: () => void;
}

export default function ComplianceAlertBanner({ onOpenAudit }: ComplianceAlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showCallbackInput, setShowCallbackInput] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  const { language, isRTL } = useLanguage();
  const isAr = language === "ar";

  if (!isVisible) return null;

  const handleQuickCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Quick Callback Request (Top Banner)",
          email: "direct-inquiry@diasuae.ae",
          phone: callbackPhone.trim(),
          company: "Website Visitor (Urgent Callback)",
          serviceType: "Corporate Tax & VAT Consultation",
          message: "Requested urgent 5-minute callback via the top website banner.",
        }),
      });

      if (res.ok) {
        setCallbackSubmitted(true);
      } else {
        // Fallback open direct WhatsApp with the phone number pre-filled
        window.open(
          `https://wa.me/971529226958?text=Hello%20Dias%20Accounting,%20I%20requested%20a%20callback%20for%20my%20number:%20${encodeURIComponent(
            callbackPhone.trim()
          )}`,
          "_blank",
          "noopener,noreferrer"
        );
        setCallbackSubmitted(true);
      }
    } catch (err) {
      window.open(
        `https://wa.me/971529226958?text=Hello%20Dias%20Accounting,%20I%20requested%20a%20callback%20for%20my%20number:%20${encodeURIComponent(
          callbackPhone.trim()
        )}`,
        "_blank",
        "noopener,noreferrer"
      );
      setCallbackSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside
      aria-label={isAr ? "شريط استشارات الضرائب السريعة" : "Quick Tax Consultation Banner"}
      className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border-b border-gold-500/40 text-white px-3 sm:px-4 py-2.5 sm:py-2 relative z-50 text-xs shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2.5 lg:gap-4">
        
        {/* Left Side: Live Senior Advisor Status & Urgency Call */}
        <div className="flex items-center gap-2.5 text-center sm:text-start flex-wrap justify-center sm:justify-start">
          {/* Live Advisor Indicator */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[11px] font-bold shrink-0 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>{isAr ? "مستشارو الضرائب متاحون الآن" : "Live Tax Advisors Online"}</span>
          </div>

          {/* High-Impact Value Proposition */}
          <p className="text-slate-200 text-xs leading-tight sm:leading-normal">
            <span className="text-white font-bold">
              {isAr
                ? "تجنب غرامات الهيئة الاتحادية للضرائب (10,000+ درهم):"
                : "Avoid Mandatory FTA Fines (AED 10,000+):"}
            </span>{" "}
            <span className="text-slate-300">
              {isAr
                ? "احصل على استشارة مجانية لمدة 15 دقيقة وتدقيق مخاطر الغرامات مع خبرائنا المعتمدين."
                : "Get a Free 15-Min Tax Review & Penalty Risk Audit with certified advisors."}
            </span>
          </p>
        </div>

        {/* Right Side: High-Converting Contact Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center sm:justify-end shrink-0">
          
          {/* Action 1: Instant WhatsApp (Highest converting in UAE) */}
          <a
            href="https://wa.me/971529226958?text=Hello%20Dias%20Accounting,%20I%20would%20like%20to%20request%20a%20free%2015-minute%20tax%20and%20penalty%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
            title={isAr ? "تواصل فوري عبر واتساب" : "Chat on WhatsApp for instant reply in < 5 mins"}
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white shrink-0" />
            <span>{isAr ? "واتساب (رد فوري)" : "WhatsApp Us (Instant)"}</span>
          </a>

          {/* Action 2: Direct Click-to-Call */}
          <a
            href="tel:+971529226958"
            className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-white/15 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title={isAr ? "اتصل بمستشار الضرائب مباشرة" : "Call Senior Tax Advisor directly"}
          >
            <PhoneCall className="w-3 h-3 text-gold-400 shrink-0" />
            <span className="font-mono text-[11px]">+971 52 922 6958</span>
          </a>

          {/* Action 3: Free 60s Penalty Risk Audit Modal Trigger */}
          <button
            type="button"
            onClick={onOpenAudit}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-gold-400 to-amber-500 hover:from-amber-300 hover:to-gold-400 text-navy-950 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
            title={isAr ? "افحص مخاطر الغرامات فوراً" : "Instant automated tax penalty risk audit"}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{isAr ? "تدقيق الغرامات (مجاناً)" : "Free Penalty Audit"}</span>
            <ArrowRight className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`} />
          </button>

          {/* Action 4: Quick 5-Min Callback Toggle */}
          {!showCallbackInput ? (
            <button
              type="button"
              onClick={() => setShowCallbackInput(true)}
              className="inline-flex items-center gap-1 text-[11px] text-gold-300 hover:text-gold-200 underline underline-offset-2 px-1.5 py-1 rounded transition-colors"
            >
              <Phone className="w-3 h-3 text-gold-400" />
              <span>{isAr ? "طلب اتصال سريع" : "Request Callback"}</span>
            </button>
          ) : (
            <div className="relative inline-flex items-center">
              {callbackSubmitted ? (
                <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 px-3 py-1 rounded-lg text-[11px] font-bold animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? "تم الاستلام! سنتصل بك خلال 5 دقائق" : "Received! We'll call within 5 mins"}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCallbackInput(false);
                      setCallbackSubmitted(false);
                      setCallbackPhone("");
                    }}
                    className="ml-1 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickCallback} className="flex items-center gap-1.5 bg-navy-900 border border-gold-500/50 rounded-lg p-0.5 shadow-lg">
                  <input
                    type="tel"
                    value={callbackPhone}
                    onChange={(e) => setCallbackPhone(e.target.value)}
                    placeholder={isAr ? "رقم الهاتف / واتساب" : "Mobile / WhatsApp No."}
                    required
                    autoFocus
                    className="bg-transparent text-white placeholder-slate-400 text-[11px] px-2 py-1 outline-none w-32 sm:w-40"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gold-500 hover:bg-gold-400 text-navy-950 px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "..." : (
                      <>
                        <Send className="w-2.5 h-2.5" />
                        <span>{isAr ? "اتصل بي" : "Call Me"}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCallbackInput(false)}
                    className="px-1 text-slate-400 hover:text-white text-xs"
                    title="Close"
                  >
                    ✕
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Action 5: Book 30-Min Consultation */}
          <a
            href="#contact"
            className="hidden xl:inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-gold-300 transition-colors px-1"
          >
            <Calendar className="w-3 h-3 text-gold-400" />
            <span>{isAr ? "حجز موعد" : "Book Meeting"}</span>
          </a>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors ml-0.5 cursor-pointer"
            aria-label={isAr ? "إغلاق الشريط" : "Dismiss alert"}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
}
