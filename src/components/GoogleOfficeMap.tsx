import React from "react";
import { Navigation, Star } from "lucide-react";

interface GoogleOfficeMapProps {
  language?: "en" | "ar";
}

const GOOGLE_MAPS_PLACE_URL =
  "https://www.google.com/maps/place/?q=place_id:ChIJlyGuqVdDXz4R2AwMpM1O1SE";
const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJlyGuqVdDXz4R2AwMpM1O1SE";

export default function GoogleOfficeMap({ language = "en" }: GoogleOfficeMapProps) {
  const isAr = language === "ar";

  return (
    <div className="space-y-3.5">
      <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-[#c5a059]/60 bg-[#070d19] shadow-lg">
        <iframe
          title="DiasUAE — Dias Accounting and Tax Consulting LLC Office Location"
          src="/office-map.html"
          width="100%"
          height="450"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-[450px] border-0 block"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href={GOOGLE_MAPS_PLACE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-3 rounded-xl bg-[#070d19] hover:bg-[#0d1b2a] border border-[#c5a059]/70 text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <Navigation className="w-4 h-4 text-[#c5a059] shrink-0" />
          <span>{isAr ? "الحصول على الاتجاهات" : "Get Directions"}</span>
        </a>

        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-3 rounded-xl bg-[#c5a059] hover:bg-[#b58f48] border border-[#c5a059] text-[#070d19] text-sm font-bold transition-colors shadow-xs"
        >
          <Star className="w-4 h-4 fill-[#070d19] text-[#070d19] shrink-0" />
          <span>{isAr ? "اترك تقييم 5★ على Google" : "Leave a 5★ Google Review"}</span>
        </a>
      </div>
    </div>
  );
}
