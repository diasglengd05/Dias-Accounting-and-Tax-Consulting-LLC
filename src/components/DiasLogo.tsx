import React from "react";

interface DiasLogoProps {
  className?: string;
  showText?: boolean;
  textSize?: string;
  textColor?: string;
}

export default function DiasLogo({
  className = "w-10 h-10",
  showText = true,
  textSize = "text-xl",
  textColor = "text-navy-950",
}: DiasLogoProps) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative ${className}`}>
        <svg
          viewBox="0 0 250 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-sm"
        >
          {/* Definitions for Gradients */}
          <defs>
            {/* Elegant Gold Gradient */}
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFBA5F" />
              <stop offset="30%" stopColor="#F5E39C" />
              <stop offset="50%" stopColor="#C49B31" />
              <stop offset="70%" stopColor="#F1DA84" />
              <stop offset="100%" stopColor="#96701B" />
            </linearGradient>

            {/* Premium Emerald Green Gradient */}
            <linearGradient id="green-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Darker Green Gradient for Shadows */}
            <linearGradient id="dark-green-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#065F46" />
              <stop offset="100%" stopColor="#022C22" />
            </linearGradient>
          </defs>

          {/* Golden Letter "D" */}
          <path
            d="M 50,40 
               L 125,40 
               C 185,40 215,80 215,125 
               C 215,170 185,210 125,210 
               L 50,210 
               Z 
               M 80,68 
               L 115,68 
               C 155,68 182,90 182,125 
               C 182,160 155,182 115,182 
               L 80,182 
               Z"
            fill="url(#gold-gradient)"
          />

          {/* Green Bar Chart inside the D */}
          {/* Bar 1 (Left) */}
          <rect
            x="95"
            y="140"
            width="15"
            height="40"
            rx="3"
            fill="url(#green-gradient)"
          />
          {/* Bar 2 (Middle) */}
          <rect
            x="117"
            y="110"
            width="15"
            height="70"
            rx="3"
            fill="url(#green-gradient)"
          />
          {/* Bar 3 (Right) */}
          <rect
            x="139"
            y="85"
            width="15"
            height="95"
            rx="3"
            fill="url(#green-gradient)"
          />

          {/* Golden Swoosh representing Growth and Flight */}
          <path
            d="M 45,185 
               Q 115,205 185,125 
               Q 145,165 75,180 
               Z"
            fill="url(#gold-gradient)"
          />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${textSize} font-display font-bold tracking-tight ${textColor}`}>
            DIAS
          </span>
          <span className="text-[10px] font-sans font-semibold tracking-[0.2em] text-emerald-600 uppercase">
            ACCOUNTING
          </span>
        </div>
      )}
    </div>
  );
}
