import React, { useEffect } from "react";
import { X, ExternalLink, Sparkles, Globe, CheckCircle2, PhoneCall } from "lucide-react";
import { BlogPost } from "../types";
import { ArticleContentRenderer } from "./ArticleContentRenderer";

interface BlogModalProps {
  blog: BlogPost | null;
  onClose: () => void;
  onContact?: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ blog, onClose, onContact }) => {
  // Generate fallback schema if none stored
  const schemaJson = blog?.schemaMarkup || (blog ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": typeof window !== "undefined" ? `${window.location.origin}/#blog-${blog.id}` : `https://diasuae.ae/#blog-${blog.id}`
    },
    "headline": blog.title,
    "description": blog.summary,
    "datePublished": blog.date,
    "author": {
      "@type": "Person",
      "name": blog.author?.name || "Glen Dias",
      "jobTitle": blog.author?.role || "Managing Director & Tax Agent",
      "worksFor": {
        "@type": "Organization",
        "name": "Dias Accounting & Tax Consulting LLC"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Dias Accounting & Tax Consulting LLC",
      "url": "https://diasuae.ae",
      "logo": {
        "@type": "ImageObject",
        "url": "https://diasuae.ae/icon-192.png"
      }
    }
  }, null, 2) : "");

  // Dynamically inject schema into document head for Googlebot & client crawlers
  useEffect(() => {
    if (!blog || !schemaJson) return;
    const scriptId = `schema-blog-${blog.id}`;
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.id = scriptId;
      scriptEl.type = "application/ld+json";
      scriptEl.text = schemaJson;
      document.head.appendChild(scriptEl);
    }
    return () => {
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [blog?.id, schemaJson]);

  if (!blog) return null;

  const standaloneBlogUrl = typeof window !== "undefined"
    ? `${window.location.origin}/blog.html#${blog.id}`
    : `https://diasuae.ae/blog.html#${blog.id}`;

  const handleContactClick = () => {
    if (onContact) {
      onContact();
    } else {
      onClose();
      setTimeout(() => {
        const contactEl = document.getElementById("contact");
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.hash = "contact";
        }
      }, 100);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-modal-title"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[92vh] md:max-h-[88vh] animate-scaleUp scroll-smooth">
        {/* Header (Scrolls together with article content) */}
        <div className="bg-navy-900 text-white relative">
          {/* Top Sticky Bar with Contact Now & Navigation */}
          <div className="sticky top-0 z-30 bg-navy-900/95 backdrop-blur-md px-5 sm:px-6 md:px-8 py-3.5 border-b border-navy-800/80 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] bg-gold-400 text-navy-950 font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shrink-0">
                {blog.tag}
              </span>
              <span className="text-xs text-slate-300 font-medium truncate hidden sm:inline">
                {blog.title}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* High-Converting Contact Now Button on Top While Reading */}
              <button
                onClick={handleContactClick}
                className="px-3.5 py-1.5 text-xs font-bold text-navy-950 bg-gradient-to-r from-gold-400 via-amber-300 to-gold-400 hover:from-gold-300 hover:to-amber-200 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-1.5 cursor-pointer min-h-[34px] border border-gold-300/40"
                title="Contact Glen Dias & our tax consulting desk"
                aria-label="Contact Now"
              >
                <PhoneCall className="w-3.5 h-3.5 text-navy-950" />
                <span>Contact Now</span>
              </button>

              <a
                href={standaloneBlogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer min-h-[34px] items-center gap-1.5 active:scale-95"
                title="Open full article in a new browser tab"
                aria-label="Open article in a new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>New Tab</span>
              </a>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer min-w-[34px] min-h-[34px] flex items-center justify-center"
                aria-label="Close article modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Header Title & Article Metadata */}
          <div className="p-5 sm:p-6 md:p-8 pt-4 sm:pt-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {blog.isAiGenerated && (
                <span className="text-[9px] bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                  24-Hour Gemini AI Briefing (Google Search Grounded)
                </span>
              )}
              <span className="text-[9px] bg-blue-950/80 text-blue-300 border border-blue-500/30 font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-blue-400" />
                Google Schema (JSON-LD) Active
              </span>
            </div>
            <h3 id="blog-modal-title" className="font-display text-lg sm:text-xl md:text-3xl font-bold tracking-tight">
              {blog.title}
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-slate-400 font-medium">
              <span>Published: {blog.date}</span>
              <span>•</span>
              <span>Read time: {blog.readTime}</span>
              <span>•</span>
              <span>Author: {blog.author.name} ({blog.author.role})</span>
            </div>
          </div>
        </div>

        {/* Article Content (Scrolls together seamlessly with the header) */}
        <div className="p-5 sm:p-6 md:p-8 bg-white prose prose-slate max-w-none text-slate-700">
          {/* Grounded Trends Banner if AI Generated */}
          {blog.sourceTrends && blog.sourceTrends.length > 0 && (
            <div className="mb-6 bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-navy-950">
                  Current UAE Regulatory Trends Grounded via Google Search:
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                {blog.sourceTrends.map((trend, idx) => (
                  <li key={idx} className="leading-normal">{trend}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-sm sm:text-base leading-relaxed text-slate-700">
            <ArticleContentRenderer content={blog.content} />
          </div>

          {/* Keywords Pill List */}
          {blog.keywords && blog.keywords.length > 0 && (
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Target SEO Keywords:</span>
              {blog.keywords.map((kw, i) => (
                <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium border border-slate-200/60">
                  {kw.replace(/^[#*]+/, "")}
                </span>
              ))}
            </div>
          )}

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left space-y-1">
              <span className="font-display font-bold text-navy-950 text-sm">Need regulatory support?</span>
              <p className="text-slate-500 text-xs">Our senior team helps companies avoid hefty administrative penalties.</p>
            </div>
            <a
              href="#contact"
              onClick={onClose}
              className="bg-navy-900 hover:bg-navy-950 text-white font-display font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-colors min-h-[44px] flex items-center justify-center cursor-pointer"
            >
              Book Professional Assessment
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
