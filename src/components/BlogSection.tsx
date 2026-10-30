import React, { useState, useMemo } from "react";
import { ArrowRight, BookOpen, Sparkles, Mail, CheckCircle2, ExternalLink, AlertCircle, Calendar } from "lucide-react";
import { BlogPost } from "../types";
import { isValidEmail } from "../lib/validation";

interface BlogSectionProps {
  blogs: BlogPost[];
  onSelectBlog: (blog: BlogPost) => void;
  onOpenSeoEngine?: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  blogs,
  onSelectBlog,
  onOpenSeoEngine,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Arrange all articles in strict chronological order as per date (most recent first)
  const sortedBlogs = useMemo(() => {
    return [...blogs].sort((a, b) => {
      const timeA = new Date(a.date).getTime() || 0;
      const timeB = new Date(b.date).getTime() || 0;
      return timeB - timeA;
    });
  }, [blogs]);

  const [newsletterEmailError, setNewsletterEmailError] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !isValidEmail(newsletterEmail)) {
      setNewsletterEmailError("Please enter a valid business email address.");
      return;
    }
    setNewsletterEmailError(null);
    setNewsletterSubscribed(true);
  };

  return (
    <section id="blogs" className="py-20 sm:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-gold-500" />
              <span className="text-[11px] font-mono text-gold-600 font-bold uppercase tracking-[0.18em]">
                UAE Corporate Finance &amp; Tax Intelligence
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
              Regulatory Insights &amp; Briefings
            </h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed max-w-md">
            Navigating UAE corporate finance, Federal Tax Authority compliance, VAT procedures, and Free Zone tax structures with executive clarity.
          </p>
        </div>

        {/* Layout Grid: 8 Columns Blog Grid + 4 Columns Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column: Blog Cards */}
          <div className="lg:col-span-8 space-y-6">
            
            {sortedBlogs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-3 shadow-xs">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-display text-lg font-bold text-navy-950">No articles available</h3>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                  New corporate tax briefings and FTA regulatory guides are being prepared by our chartered tax agents.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedBlogs.map((blog, idx) => {
                  const initials = blog.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <a
                      key={blog.id}
                      href={`/blog.html#${blog.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-white border ${
                        idx === 0
                          ? "border-gold-400 shadow-sm"
                          : "border-slate-200/80 shadow-xs"
                      } rounded-2xl overflow-hidden hover:shadow-md hover:border-gold-400 transition-all duration-200 flex flex-col group cursor-pointer text-left block no-underline`}
                    >
                      {/* Architectural Editorial Card Top */}
                      <div className="bg-navy-950 px-6 py-5 flex flex-col justify-between border-b border-slate-800 relative overflow-hidden">
                        <div className="flex items-center justify-between z-10 w-full mb-3">
                          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em]">
                            <span className="text-gold-400 font-bold">{blog.tag}</span>
                            {idx === 0 && (
                              <>
                                <span className="text-slate-600">·</span>
                                <span className="text-emerald-400 font-bold">Latest Briefing</span>
                              </>
                            )}
                          </div>

                          {/* Direct new tab shortcut indicator */}
                          <div
                            className="p-1.5 text-slate-400 group-hover:text-gold-400 rounded-lg transition-colors flex items-center justify-center"
                            title="Opens in a new browser tab"
                            aria-label="Opens in a new tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Date & Read Time */}
                        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 z-10">
                          <Calendar className="w-3 h-3 text-gold-400 shrink-0" />
                          <span>{blog.date}</span>
                          <span>·</span>
                          <span>{blog.readTime}</span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                        <div className="space-y-2.5">
                          <h3 className="font-display text-base sm:text-lg font-bold text-navy-950 group-hover:text-gold-600 transition-colors line-clamp-2 leading-snug">
                            {blog.title}
                          </h3>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                            {blog.summary}
                          </p>
                        </div>

                        {/* Author detail & Read More CTA */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-navy-950 border border-gold-500/30 text-gold-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                              {initials}
                            </div>
                            <div className="leading-tight">
                              <span className="block text-xs font-bold text-navy-950">{blog.author.name}</span>
                              <span className="text-[10px] text-slate-500 font-medium">{blog.author.role}</span>
                            </div>
                          </div>
                          <span
                            className="text-xs font-display font-bold text-navy-950 group-hover:text-gold-600 transition-all flex items-center gap-1.5 group-hover:translate-x-0.5"
                          >
                            <span>Read Article</span>
                            <ExternalLink className="w-3.5 h-3.5 text-gold-500" />
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar Column: 4 Columns */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Newsletter Subscription */}
            <div className="bg-gradient-to-br from-navy-950 to-navy-900 rounded-3xl border border-gold-500/30 p-6 text-white shadow-md space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest block">
                  Free Briefing
                </span>
                <h4 className="font-display text-base font-bold text-white">
                  UAE Tax &amp; Corporate Newsletter
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Join 2,500+ UAE business founders receiving monthly regulatory alerts, FTA deadline reminders, and tax mitigation strategies.
                </p>
              </div>

              {newsletterSubscribed ? (
                <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-semibold">
                    Subscribed! You'll receive our next corporate finance briefing.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} noValidate className="space-y-2.5">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      if (newsletterEmailError) setNewsletterEmailError(null);
                    }}
                    required
                    placeholder="Enter your corporate email"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none transition-all ${
                      newsletterEmailError
                        ? "bg-rose-950/30 border border-rose-400 focus:border-rose-400"
                        : "bg-white/10 border border-white/15 focus:border-gold-400"
                    }`}
                  />
                  {newsletterEmailError && (
                    <p className="text-[10px] text-rose-300 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{newsletterEmailError}</span>
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-display font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Subscribe Free</span>
                  </button>
                </form>
              )}
            </div>

          </aside>

        </div>

      </div>
    </section>
  );
};
export default BlogSection;
