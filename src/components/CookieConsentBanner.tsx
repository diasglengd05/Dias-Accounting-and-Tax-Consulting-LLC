import React, { useState, useEffect } from "react";
import { Cookie, X, ShieldCheck } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface CookieConsentBannerProps {
  onOpenPrivacy?: () => void;
  onNavigate?: (path: string) => void;
}

export default function CookieConsentBanner({
  onOpenPrivacy,
  onNavigate,
}: CookieConsentBannerProps) {
  const { language } = useLanguage();
  const [consentGiven, setConsentGiven] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("dias_cookie_consent");
      if (!stored) {
        setConsentGiven(false);
      }
    } catch {
      setConsentGiven(false);
    }
  }, []);

  const acceptAll = () => {
    try {
      localStorage.setItem("dias_cookie_consent", "accepted");
    } catch {
      // ignore
    }
    setConsentGiven(true);
  };

  const acceptEssential = () => {
    try {
      localStorage.setItem("dias_cookie_consent", "essential");
    } catch {
      // ignore
    }
    setConsentGiven(true);
  };

  if (consentGiven) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 bg-navy-950/95 backdrop-blur-md border border-gold-500/30 text-white rounded-2xl p-4 sm:p-5 shadow-2xl animate-slideUp text-xs"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-400/30 flex items-center justify-center text-gold-400 shrink-0 mt-0.5">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-sm text-white">
              {language === "ar" ? "ملفات تعريف الارتباط والخصوصية" : "Cookie & Privacy Preferences"}
            </span>
            <button
              onClick={acceptEssential}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Close cookie banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed">
            {language === "ar"
              ? "نستخدم ملفات تعريف الارتباط الأساسية لضمان عمل حاسبة الضرائب والنماذج والتحليلات وفقاً لقانون حماية البيانات الشخصية في الإمارات (PDPL)."
              : "We use essential cookies and analytics to ensure our tax planners, inquiry forms, and compliance calculators work securely in accordance with UAE PDPL."}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={acceptAll}
              className="px-3.5 py-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              {language === "ar" ? "قبول الكل" : "Accept All"}
            </button>
            <button
              onClick={acceptEssential}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 rounded-lg text-xs transition-colors cursor-pointer"
            >
              {language === "ar" ? "الأساسية فقط" : "Essential Only"}
            </button>
            <button
              onClick={() => {
                if (onOpenPrivacy) onOpenPrivacy();
                else if (onNavigate) onNavigate("/privacy-policy");
              }}
              className="text-[11px] text-gold-400 hover:underline cursor-pointer ml-auto"
            >
              {language === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
