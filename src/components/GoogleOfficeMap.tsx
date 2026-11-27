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
      <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] shadow-xs">
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
          className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-3 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#1B4332]/50 text-[#0D1B2A] text-sm font-semibold transition-colors shadow-xs"
        >
          <Navigation className="w-4 h-4 text-[#1B4332] shrink-0" />
          <span>{isAr ? "الحصول على الاتجاهات" : "Get Directions"}</span>
        </a>

        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-3 rounded-xl bg-[#1B4332] hover:bg-[#143326] border border-[#1B4332] text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <Star className="w-4 h-4 fill-[#C5A059] text-[#C5A059] shrink-0" />
          <span>{isAr ? "اترك تقييم 5★ على Google" : "Leave a 5★ Google Review"}</span>
        </a>
      </div>
    </div>
  );
}
