import React from "react";

interface DiasEmblemLogoProps {
  className?: string;
  size?: number | string;
}

export const DiasEmblemLogo: React.FC<DiasEmblemLogoProps> = ({
  className = "w-24 h-24",
  size,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_10px_20px_rgba(180,130,40,0.25)]"
      >
        <defs>
          {/* Main 3D Gold Gradient */}
          <linearGradient id="dias-gold-face" x1="40" y1="50" x2="280" y2="270" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fae19c" />
            <stop offset="18%" stopColor="#f3ca65" />
            <stop offset="38%" stopColor="#c59332" />
            <stop offset="55%" stopColor="#fff2c2" />
            <stop offset="75%" stopColor="#b88328" />
            <stop offset="92%" stopColor="#785012" />
            <stop offset="100%" stopColor="#5a3805" />
          </linearGradient>

          {/* Gold Bevel Highlights */}
          <linearGradient id="dias-gold-bevel" x1="30" y1="40" x2="160" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff8e1" />
            <stop offset="25%" stopColor="#ffd978" />
            <stop offset="50%" stopColor="#8d601b" />
            <stop offset="75%" stopColor="#dca842" />
            <stop offset="100%" stopColor="#3d2203" />
          </linearGradient>

          {/* Gold Dark Stroke/Shadow for 3D Depth */}
          <linearGradient id="dias-gold-dark" x1="0" y1="0" x2="0" y2="100%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4a2e05" />
            <stop offset="50%" stopColor="#825a17" />
            <stop offset="100%" stopColor="#2c1a02" />
          </linearGradient>

          {/* Emerald Green Front Face */}
          <linearGradient id="dias-green-front" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="45%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>

          {/* Emerald Green Top/Side 3D Bevel */}
          <linearGradient id="dias-green-light" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="dias-green-dark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#022c22" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>

          {/* Gold Swoosh Gradient */}
          <linearGradient id="dias-swoosh-grad" x1="45" y1="245" x2="210" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e5ba55" />
            <stop offset="30%" stopColor="#ffea9f" />
            <stop offset="60%" stopColor="#c5912d" />
            <stop offset="90%" stopColor="#8a5a12" />
            <stop offset="100%" stopColor="#ffe28a" />
          </linearGradient>

          {/* Drop filter */}
          <filter id="soft-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#916a18" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 1. Outer 3D Gold "D" Base & Extrusions */}
        <g filter="url(#soft-glow)">
          {/* Main Golden D Body (Serif Elegant Capital) */}
          <path
            d="M 64,74 
               C 64,70 68,68 76,68 
               L 160,68 
               C 215,68 262,102 262,160 
               C 262,216 215,250 156,250 
               L 152,250 
               C 152,252 178,246 200,230 
               C 240,198 244,142 220,105 
               C 200,75 160,74 126,74 
               L 126,170 
               L 96,170 
               L 96,74 
               L 76,74 
               C 68,74 64,72 64,74 
               Z"
            fill="url(#dias-gold-bevel)"
          />

          {/* True 3D Outer D Shell */}
          <path
            d="M 88,72 
               L 156,72 
               C 212,72 256,104 256,160 
               C 256,212 212,246 156,246 
               L 88,246 
               C 84,246 80,244 80,240 
               L 80,78 
               C 80,74 84,72 88,72 
               Z
               M 116,98 
               L 116,220 
               L 148,220 
               C 188,220 226,196 226,160 
               C 226,124 188,98 148,98 
               L 116,98 
               Z"
            fill="url(#dias-gold-face)"
            stroke="url(#dias-gold-dark)"
            strokeWidth="1.5"
          />

          {/* Left Serif Bracket of the D */}
          <path
            d="M 66,74 
               L 116,74 
               L 116,84 
               C 106,84 100,90 100,100 
               L 100,218 
               C 100,228 106,234 116,234 
               L 116,244 
               L 66,244 
               L 66,234 
               C 76,234 82,228 82,218 
               L 82,100 
               C 82,90 76,84 66,84 
               Z"
            fill="url(#dias-gold-bevel)"
            stroke="url(#dias-gold-dark)"
            strokeWidth="1"
          />

          {/* Highlight Chamfer on Spine */}
          <path
            d="M 86,96 L 90,96 L 90,222 L 86,222 Z"
            fill="#fff8d6"
            opacity="0.85"
          />

          {/* Top Arc Specular Sheen */}
          <path
            d="M 120,74 
               C 160,74 238,82 248,138 
               C 236,94 175,82 130,82 
               Z"
            fill="#ffffff"
            opacity="0.5"
          />

          {/* Bottom Arc Gold Reflection */}
          <path
            d="M 248,182 
               C 238,230 178,244 140,244 
               C 182,240 230,226 242,188 
               Z"
            fill="#ffe899"
            opacity="0.6"
          />
        </g>

        {/* 2. 3D Emerald Green Growth Bars (Inside the D) */}
        <g id="green-growth-bars">
          {/* Bar 1 (Left / Shortest) */}
          {/* Main Front Face */}
          <rect
            x="94"
            y="188"
            width="22"
            height="56"
            rx="2"
            fill="url(#dias-green-front)"
            stroke="#022c22"
            strokeWidth="0.8"
          />
          {/* Top Beveled Cap */}
          <polygon
            points="94,188 99,183 121,183 116,188"
            fill="url(#dias-green-light)"
          />
          {/* Right Shadow Bevel */}
          <polygon
            points="116,188 121,183 121,239 116,244"
            fill="url(#dias-green-dark)"
          />

          {/* Bar 2 (Middle / Medium) */}
          {/* Main Front Face */}
          <rect
            x="122"
            y="162"
            width="22"
            height="82"
            rx="2"
            fill="url(#dias-green-front)"
            stroke="#022c22"
            strokeWidth="0.8"
          />
          {/* Top Beveled Cap */}
          <polygon
            points="122,162 127,157 149,157 144,162"
            fill="url(#dias-green-light)"
          />
          {/* Right Shadow Bevel */}
          <polygon
            points="144,162 149,157 149,239 144,244"
            fill="url(#dias-green-dark)"
          />

          {/* Bar 3 (Right / Tallest) */}
          {/* Main Front Face */}
          <rect
            x="151"
            y="134"
            width="24"
            height="110"
            rx="2"
            fill="url(#dias-green-front)"
            stroke="#022c22"
            strokeWidth="0.8"
          />
          {/* Top Beveled Cap */}
          <polygon
            points="151,134 157,128 181,128 175,134"
            fill="url(#dias-green-light)"
          />
          {/* Right Shadow Bevel */}
          <polygon
            points="175,134 181,128 181,238 175,244"
            fill="url(#dias-green-dark)"
          />

          {/* Top Ascending Accent / Pip */}
          <path
            d="M 127,148 L 138,142 L 142,146 L 131,152 Z"
            fill="#e2f5ea"
            opacity="0.9"
          />
        </g>

        {/* 3. Golden Dynamic Growth Swoosh (Sweeping across from bottom-left to top-right) */}
        <g id="gold-swoosh" filter="url(#soft-glow)">
          {/* Bottom shadow of the swoosh */}
          <path
            d="M 52,240 
               C 92,238 140,224 178,188 
               C 192,174 200,160 200,160 
               C 194,180 168,212 130,230 
               C 90,248 52,240 52,240 
               Z"
            fill="#3a2003"
            opacity="0.4"
          />

          {/* Main Golden Swoosh Body */}
          <path
            d="M 50,238 
               C 96,236 148,220 182,178 
               C 198,158 200,154 200,154 
               C 196,178 165,214 125,232 
               C 85,246 50,238 50,238 
               Z"
            fill="url(#dias-swoosh-grad)"
            stroke="url(#dias-gold-bevel)"
            strokeWidth="1.2"
          />

          {/* Top Crisp Specular Ridge */}
          <path
            d="M 58,236 
               C 100,234 148,218 182,178 
               C 194,164 198,156 198,156 
               C 192,168 152,208 116,226 
               C 88,234 58,236 58,236 
               Z"
            fill="#ffffff"
            opacity="0.65"
          />
        </g>
      </svg>
    </div>
  );
};

export default DiasEmblemLogo;
