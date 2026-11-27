import React from "react";

interface DiasLogoProps {
  className?: string;
  showText?: boolean;
  showSubLabel?: boolean;
  textSize?: string;
  textColor?: string;
  subLabelColor?: string;
  isLoading?: boolean;
}

export default function DiasLogo({
  className = "h-9 md:h-10 w-auto",
  showText = true,
  showSubLabel = false,
  textSize = "text-xl",
  textColor = "text-navy-950",
  subLabelColor = "text-slate-500",
  isLoading = false,
}: DiasLogoProps) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 select-none">
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="DiasUAE — Dias Accounting and Tax Consulting LLC"
          decoding="async"
          className={`object-contain shrink-0 transition-transform duration-300 ${className} ${
            isLoading ? "brand-emblem-loading" : ""
          }`}
        />
      </div>
      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className={`${textSize} font-display font-extrabold tracking-tight whitespace-nowrap ${textColor}`}
          >
            DiasUAE
            <span className="text-[#c5a059] font-semibold text-[0.82em] tracking-normal">
              .ae
            </span>
          </span>
          {showSubLabel && (
            <span
              className={`hidden sm:block text-[10px] font-medium tracking-[0.06em] mt-0.5 whitespace-nowrap ${subLabelColor}`}
            >
              Accounting &amp; Tax · UAE
            </span>
          )}
        </span>
      )}
    </div>
  );
}
