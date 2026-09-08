import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface LanguageToggleProps {
  variant?: "desktop" | "mobile" | "compact";
  className?: string;
}

export default function LanguageToggle({ variant = "desktop", className = "" }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold ${className}`}
        role="group"
        aria-label="Language selector"
      >
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
            language === "en"
              ? "bg-white text-navy-950 shadow-xs font-bold"
              : "text-slate-500 hover:text-navy-900"
          }`}
          aria-pressed={language === "en"}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage("ar")}
          className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
            language === "ar"
              ? "bg-white text-navy-950 shadow-xs font-bold"
              : "text-slate-500 hover:text-navy-900"
          }`}
          aria-pressed={language === "ar"}
        >
          عربي
        </button>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className={`flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 ${className}`}>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Globe className="w-4 h-4 text-gold-600" />
          <span>Language / اللغة</span>
        </div>
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-xs gap-1">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-lg transition-all cursor-pointer flex items-center justify-center ${
              language === "en"
                ? "bg-navy-900 text-white shadow-xs"
                : "text-slate-600 hover:text-navy-900 active:bg-slate-100"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage("ar")}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-lg transition-all cursor-pointer flex items-center justify-center ${
              language === "ar"
                ? "bg-navy-900 text-white shadow-xs"
                : "text-slate-600 hover:text-navy-900 active:bg-slate-100"
            }`}
          >
            العربية
          </button>
        </div>
      </div>
    );
  }

  // Desktop default toggle
  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200/80 transition-all ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <Globe className="w-3.5 h-3.5 text-slate-500 mx-1.5 shrink-0" />
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer ${
          language === "en"
            ? "bg-white text-navy-950 shadow-xs font-bold"
            : "text-slate-600 hover:text-navy-900 font-medium"
        }`}
        aria-pressed={language === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("ar")}
        className={`px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer ${
          language === "ar"
            ? "bg-white text-navy-950 shadow-xs font-bold"
            : "text-slate-600 hover:text-navy-900 font-medium"
        }`}
        aria-pressed={language === "ar"}
      >
        عربي
      </button>
    </div>
  );
}
