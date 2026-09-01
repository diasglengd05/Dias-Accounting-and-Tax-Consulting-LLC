import React, { useState, useEffect } from "react";
import { GoogleLogo } from "./GoogleReviewsSection";
import { Check } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface AddToPreferredSourcesProps {
  className?: string;
  onClick?: () => void;
  variant?: "light" | "dark" | "pill";
}

export const AddToPreferredSources: React.FC<AddToPreferredSourcesProps> = ({
  className = "",
  onClick,
  variant = "pill",
}) => {
  const { language } = useLanguage();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dias_google_preferred_source");
      if (saved === "true") {
        setIsAdded(true);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      id="btn-add-preferred-sources"
      className={`inline-flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-slate-800 hover:text-slate-900 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer ${className}`}
      title={
        language === "ar"
          ? "إضافة دياز للمحاسبة إلى المصادر المفضلة على Google"
          : "Add Dias Accounting to Preferred Sources on Google"
      }
      aria-label="Add to Preferred Sources on Google"
    >
      <GoogleLogo className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
      <span className="font-semibold text-xs sm:text-sm tracking-tight text-slate-800 select-none">
        {isAdded ? (
          <span className="inline-flex items-center gap-1.5 text-emerald-700">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            {language === "ar" ? "مضاف في المصادر المفضلة" : "Preferred Source Added"}
          </span>
        ) : (
          <span>
            {language === "ar" ? "إضافة إلى المصادر المفضلة" : "Add to Preferred Sources"}
          </span>
        )}
      </span>
    </button>
  );
};

export default AddToPreferredSources;
