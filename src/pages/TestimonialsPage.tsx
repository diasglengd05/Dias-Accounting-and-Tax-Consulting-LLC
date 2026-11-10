import React, { useEffect } from "react";
import {
  Star,
  ChevronRight,
  Quote,
  Building,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { GOOGLE_BUSINESS_URL } from "../data/staticData";

interface TestimonialsPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  useEffect(() => {
    document.title = "Client Testimonials & Case Studies | Dias Accounting Dubai & Sharjah";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const sampleTestimonials = [
    {
      id: "t1",
      quote: "Dias Accounting has transformed our compliance process. Their Corporate Tax filing service was fast, thorough, and completely stress-free. Glen and his team identified reliefs we were completely unaware of, saving us substantial corporate tax legally.",
      clientName: "Tareq Al-Mansoori",
      companyName: "Apex Tech Ventures LLC",
      industry: "Enterprise Software & Tech Investments (Business Bay, Dubai)",
      rating: 5,
    },
    {
      id: "t2",
      quote: "The backlog accounting package saved us thousands in penalties. Our previous accountant left a massive 14-month backlog right before the UAE Corporate Tax deadline. Dias reconstructed all ledgers, reconciled multi-currency bank accounts, and filed our returns on time without a single error.",
      clientName: "Sarah Jenkins",
      companyName: "Vogue Retail Group",
      industry: "Retail & E-Commerce (Downtown Dubai)",
      rating: 5,
    },
    {
      id: "t3",
      quote: "As a foreign business owner expanding into Dubai Free Zone (DMCC), VAT registration and corporate regulations felt overwhelming. Dias Accounting managed the entire FTA registration, tax group structuring, and quarterly VAT returns seamlessly.",
      clientName: "Kenji Sato",
      companyName: "Pacific Rim Import-Export FZ-LLC",
      industry: "International Trade & Logistics (DMCC Free Zone)",
      rating: 5,
    },
    {
      id: "t4",
      quote: "Outstanding financial advisory and bookkeeping. Their team is extremely prompt, communicative, and detail-oriented. The monthly P&L and Balance Sheet reports give our board complete clarity on margins and cash flows. 5 stars all the way!",
      clientName: "Elena Rostova",
      companyName: "Helios Global Logistics",
      industry: "Freight Forwarding & Supply Chain (SHAMS & Dubai)",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950">
      <PageNavigation
        currentPath="/testimonials"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-24 border-b border-gold-500/20 overflow-hidden">
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-4">
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:underline cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">Client Testimonials</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                <span>Verified Client Reviews &amp; Case Studies</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                What UAE Founders &amp; Business Owners Say About Dias
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                Read how our FTA Registered Tax Agency helps Dubai and Sharjah SMEs, startups, and international businesses eliminate accounting stress, reduce tax liabilities legally, and stay 100% penalty-free.
              </p>

              {/* Action Buttons: Leave a review & Consultation */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={GOOGLE_BUSINESS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-gold-500/20 flex items-center gap-2.5 cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-navy-950" />
                  <span>Leave a Review on Google (5.0 ★)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-navy-950" />
                </a>

                <a
                  href={`https://wa.me/971529226958?text=${encodeURIComponent(
                    "Hello Dias Accounting, I reviewed your client testimonials and would like to book a free consultation for my UAE business."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display font-bold px-6 py-3.5 rounded-xl text-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Book Free Consultation</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Written Testimonials Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-gold-600 uppercase tracking-wider">
              CLIENT EXPERIENCES
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1 mb-2">
              Trusted Across Multiple UAE Sectors
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Authentic feedback from businesses that rely on Dias for their financial compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sampleTestimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col justify-between hover:border-gold-400 transition-all"
              >
                <div>
                  <div className="flex items-center gap-1 text-gold-500 mb-4">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-slate-200 mb-3" />
                  <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                  {/* Generic Client / Business Avatar Badge */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy-900 to-navy-950 text-gold-400 border border-gold-500/20 flex items-center justify-center shrink-0 font-display font-bold text-xs shadow-xs">
                    <span>
                      {item.clientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-navy-950">
                      {item.clientName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {item.companyName}
                    </p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px]">
                      {item.industry}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <PageFooter
        onNavigate={onNavigate}
        onOpenPrivacy={onOpenPrivacy}
        onOpenGooglePreferred={onOpenGooglePreferred}
      />
    </div>
  );
};

export default TestimonialsPage;
