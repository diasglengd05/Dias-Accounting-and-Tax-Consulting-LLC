import React, { useEffect } from "react";
import {
  Star,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Quote,
  Building,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import GoogleReviewsSection from "../components/GoogleReviewsSection";
import { GOOGLE_BUSINESS_URL, GOOGLE_RATING_STATS, testimonialsData } from "../data/staticData";
import { GoogleLogo } from "../components/GoogleLogo";

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
    document.title = "Client Reviews & Testimonials | Dias Accounting Dubai";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <PageNavigation
        currentPath="/testimonials"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-24 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-4">
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:underline cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">Client Reviews &amp; Testimonials</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                <span>5.0★ Google Verified Business Reviews</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                Trusted by 500+ UAE Founders, CFOs &amp; Enterprise Leaders
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                Discover why leading mainland LLCs and free zone startups entrust their Corporate Tax compliance, VAT filing, and monthly bookkeeping to Dias Accounting.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={GOOGLE_BUSINESS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-navy-950 hover:bg-slate-100 font-display font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg flex items-center gap-2.5"
                >
                  <GoogleLogo className="w-4 h-4" />
                  <span>Verify on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate("/contact")}
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-6 py-3.5 rounded-xl text-sm transition-all cursor-pointer"
                >
                  Schedule Your Consultation
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Google Reviews Live Component */}
        <section className="py-16">
          <GoogleReviewsSection testimonials={testimonialsData} />
        </section>

        {/* Detailed Client Quotes Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950 mb-3">
              Sector Experience &amp; Success Stories
            </h2>
            <p className="text-slate-600 text-sm">
              From e-commerce to heavy engineering and international holding groups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsData.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-slate-200 p-7 shadow-xs flex flex-col justify-between hover:border-gold-400 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 italic">
                    "{review.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-700 font-bold flex items-center justify-center font-display text-xs shrink-0">
                    {(review.authorName || "CL").substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xs text-navy-950">
                      {review.authorName}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {review.authorRole || "Client"} · {review.authorCompany || "UAE Business"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-navy-950 text-white py-14 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Join Hundreds of Compliant UAE Businesses
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Get in touch today for an initial risk assessment and penalty-free compliance setup.
            </p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate("/contact")}
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-7 py-3.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg"
              >
                Book 1-on-1 Consultation
              </button>
            </div>
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
