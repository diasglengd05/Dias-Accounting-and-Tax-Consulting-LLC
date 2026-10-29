import React, { useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  MessageCircle,
  Shield,
  Calendar,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import Scheduler from "../components/Scheduler";
import GoogleOfficeMap from "../components/GoogleOfficeMap";

interface ContactPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  useEffect(() => {
    document.title = "Contact Dias Accounting & Tax | Book Tax Consultation Dubai";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <PageNavigation
        currentPath="/contact"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-20 border-b border-white/10">
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
              <span className="text-white">Book Consultation &amp; Office Desk</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Confidential Tax Consultation · FTA Registered</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                Schedule Your UAE Tax &amp; Accounting Consultation
              </h1>
              <p className="text-slate-300 text-base leading-relaxed">
                Connect directly with Glen Dias, FTA Registered Tax Agent. Whether you need corporate tax assessment, VAT compliance, multi-year backlog reconstruction, or company formation, our senior advisory team is ready to assist.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Desk & Form Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Direct Contact Info & Map */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-navy-950 mb-3">
                  Direct Advisory Desk
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Fast response times across phone, WhatsApp, email, and scheduled virtual or in-person meetings.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <a
                  href="tel:+971529226958"
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4 hover:border-gold-400 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                      Direct Advisory Phone
                    </span>
                    <span className="font-display text-base font-bold text-navy-950">
                      +971 52 922 6958
                    </span>
                  </div>
                </a>

                <a
                  href="https://wa.me/971529226958"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 shadow-xs flex items-center gap-4 hover:border-emerald-400 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-emerald-700 uppercase font-bold tracking-wider block">
                      Direct WhatsApp Channel
                    </span>
                    <span className="font-display text-base font-bold text-emerald-950">
                      +971 52 922 6958
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:info@diasuae.ae"
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4 hover:border-gold-400 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                      Official Client Desk Email
                    </span>
                    <span className="font-display text-base font-bold text-navy-950">
                      info@diasuae.ae
                    </span>
                  </div>
                </a>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider block mb-1">
                      Office Address
                    </span>
                    <p className="font-bold text-navy-950 mb-0.5">
                      Business Center, Sharjah Media City (SHAMS)
                    </p>
                    <p className="text-slate-500">
                      Al Messaned, Sharjah &amp; Dubai, United Arab Emirates
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                      Operating Hours (GST)
                    </span>
                    <span className="font-bold text-navy-950">
                      Monday – Saturday: 9:00 AM – 6:00 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Office Map */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                <GoogleOfficeMap />
              </div>
            </div>

            {/* Right Column: Interactive Consultation Booking Engine */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg">
                <div className="mb-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-gold-50 text-gold-700 font-mono text-[11px] font-bold uppercase mb-2">
                    Free Initial Consultation
                  </div>
                  <h3 className="font-display text-2xl font-bold text-navy-950 mb-1">
                    Book Your Strategy Session
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Fill out the quick form below. Our team reviews your requirements and contacts you within 2 business hours.
                  </p>
                </div>

                <Scheduler />
              </div>
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

export default ContactPage;
