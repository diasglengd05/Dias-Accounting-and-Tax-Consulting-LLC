import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, Translations } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isRTL: boolean;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "dias_accounting_language";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
        if (stored === "en" || stored === "ar") {
          return stored;
        }
      } catch {
        // Fallback if localStorage access is denied
      }
      // Check browser language preferences
      try {
        const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || "";
        if (browserLang.startsWith("ar")) {
          return "ar";
        }
      } catch {
        // Safe fallback
      }
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      } catch {
        // Safe fallback
      }
    }
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === "en" ? "ar" : "en";
    setLanguage(nextLang);
  };

  const isRTL = language === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  // Sync document root direction, language, and font properties
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = dir;
      document.documentElement.lang = language;
      if (isRTL) {
        document.documentElement.classList.add("font-arabic");
      } else {
        document.documentElement.classList.remove("font-arabic");
      }
    }
  }, [language, dir, isRTL]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language],
    isRTL,
    dir,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
