import React from "react";
import { MapPin, Navigation, ExternalLink, Building2, CheckCircle2 } from "lucide-react";
import { GoogleLogo } from "./GoogleLogo";

interface GoogleOfficeMapProps {
  language?: "en" | "ar";
}

const SHARJAH_HQ = {
  label: {
    en: "Sharjah HQ (Shams Free Zone)",
    ar: "المقر الرئيسي (مدينة الشارقة للإعلام - شمس)",
  },
  badge: {
    en: "Registered Tax Office",
    ar: "مكتب استشارات ضريبية معتمد",
  },
  address: {
    en: "Sharjah Media City (Shams Free Zone), Al Messaned, Sharjah, UAE",
    ar: "مدينة الشارقة للإعلام (منطقة شمس الحرة)، المسند، الشارقة، الإمارات العربية المتحدة",
  },
  coords: "25.3214° N, 55.5126° E",
  lat: 25.3214,
  lng: 55.5126,
  query: "Sharjah+Media+City+(Shams)+Sharjah+UAE",
};

export default function GoogleOfficeMap({ language = "en" }: GoogleOfficeMapProps) {
  const mapsApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;

  // Build the embed URL adhering to Google Maps Platform guidelines
  // Includes usage attribution ID: solution_id=gmp_mcp_codeassist_v1_aistudio
  const embedUrl = mapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${SHARJAH_HQ.query}&center=${SHARJAH_HQ.lat},${SHARJAH_HQ.lng}&zoom=14&solution_id=gmp_mcp_codeassist_v1_aistudio`
    : `https://maps.google.com/maps?q=${SHARJAH_HQ.query}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${SHARJAH_HQ.query}&utm_campaign=gmp_mcp_codeassist_v1_aistudio`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${SHARJAH_HQ.lat},${SHARJAH_HQ.lng}&utm_campaign=gmp_mcp_codeassist_v1_aistudio`;

  return (
    <div className="bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-700/60 shadow-xl flex flex-col relative group">
      {/* Top Header Bar with Google Maps Branding and Verified Sharjah HQ status */}
      <div className="bg-slate-950/95 border-b border-slate-800 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center p-1.5 shrink-0 border border-white/10">
            <GoogleLogo className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                {SHARJAH_HQ.label[language]}
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {SHARJAH_HQ.badge[language]}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-sm sm:max-w-md pt-0.5">
              {SHARJAH_HQ.address[language]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-gold-400 font-semibold bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg self-start sm:self-auto shrink-0">
          <MapPin className="w-3.5 h-3.5 text-gold-400" />
          <span>{language === "ar" ? "المقر الحصري" : "Headquarters"}</span>
        </div>
      </div>

      {/* Interactive Google Map Iframe */}
      <div className="relative w-full h-64 sm:h-72 bg-slate-950 overflow-hidden">
        <iframe
          title="Dias Accounting Sharjah HQ Google Maps Location"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full filter saturate-105 contrast-105 opacity-90 group-hover:opacity-100 transition-opacity"
        />

        {/* Floating Interactive Badge Over Map */}
        <div className="absolute top-3 left-3 pointer-events-none z-10 hidden sm:flex items-center gap-2 bg-navy-950/90 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-xl shadow-lg">
          <div className="w-2 h-2 rounded-full bg-gold-400"></div>
          <span className="text-[10px] font-bold text-slate-200">
            {SHARJAH_HQ.badge[language]}
          </span>
        </div>

        {/* Directions & Open in Google Maps overlay buttons */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-navy-950/90 hover:bg-navy-900 border border-white/15 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md transition-all hover:scale-105"
          >
            <Navigation className="w-3 h-3 text-gold-400" />
            <span>{language === "ar" ? "الاتجاهات" : "Directions"}</span>
          </a>
          <a
            href={directMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <ExternalLink className="w-3 h-3" />
            <span>{language === "ar" ? "خرائط Google" : "Open in Maps"}</span>
          </a>
        </div>
      </div>

      {/* Bottom Footer Information Strip */}
      <div className="bg-slate-950/90 border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-gold-400" />
          <span className="font-mono">{SHARJAH_HQ.coords}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 font-medium">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>{language === "ar" ? "خدمات معتمدة لجميع أنحاء الإمارات" : "Serving Clients Across All UAE Emirates"}</span>
        </div>
      </div>
    </div>
  );
}
