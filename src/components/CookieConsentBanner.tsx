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
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 bg-white/98 backdrop-blur-md border border-[#E2E8F0] text-[#0D1B2A] rounded-2xl p-4 sm:p-5 shadow-[0_18px_40px_-14px_rgba(13,27,42,0.18)] animate-slideUp text-xs"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#1B4332] shrink-0 mt-0.5">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-sm text-[#0D1B2A]">
              {language === "ar" ? "ملفات تعريف الارتباط والخصوصية" : "Cookie & Privacy Preferences"}
            </span>
            <button
              onClick={acceptEssential}
              className="text-[#64748B] hover:text-[#0D1B2A] p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Close cookie banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[#475569] text-[11px] leading-relaxed">
            {language === "ar"
              ? "نستخدم ملفات تعريف الارتباط الأساسية لضمان عمل حاسبة الضرائب والنماذج والتحليلات وفقاً لقانون حماية البيانات الشخصية في الإمارات (PDPL)."
              : "We use essential cookies and analytics to ensure our tax planners, inquiry forms, and compliance calculators work securely in accordance with UAE PDPL."}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={acceptAll}
              className="px-3.5 py-1.5 bg-[#1B4332] hover:bg-[#143326] text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              {language === "ar" ? "قبول الكل" : "Accept All"}
            </button>
            <button
              onClick={acceptEssential}
              className="px-3 py-1.5 bg-white hover:bg-[#F8FAFC] text-[#0D1B2A] border border-[#CBD5E1] rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              {language === "ar" ? "الأساسية فقط" : "Essential Only"}
            </button>
            <button
              onClick={() => {
                if (onOpenPrivacy) onOpenPrivacy();
                else if (onNavigate) onNavigate("/privacy-policy");
              }}
              className="text-[11px] font-semibold text-[#856422] hover:underline cursor-pointer ml-auto"
            >
              {language === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
