import React, { useState, useEffect } from "react";
import { X, Check, Copy, Share2, ExternalLink, Image as ImageIcon, Code, Sparkles, Globe, CheckCircle2 } from "lucide-react";
import { BlogPost } from "../types";
import { getBlogOgImageUrl, getSocialShareUrls } from "../lib/ogImage";

interface BlogModalProps {
  blog: BlogPost | null;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ blog, onClose }) => {
  const [copiedBlogLink, setCopiedBlogLink] = useState(false);
  const [showOgPreview, setShowOgPreview] = useState(false);
  const [showSchemaPreview, setShowSchemaPreview] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

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

  const blogUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}#blog-${blog.id}`
    : `https://diasuae.ae/#blog-${blog.id}`;

  const dynamicOgUrl = getBlogOgImageUrl({
    id: blog.id,
    title: blog.title,
    authorName: blog.author?.name,
    authorRole: blog.author?.role,
    tag: blog.tag,
    date: blog.date,
    readTime: blog.readTime,
    summary: blog.summary,
  });

  const shareLinks = getSocialShareUrls(blogUrl, blog.title, blog.summary);

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(blogUrl);
      setCopiedBlogLink(true);
      setTimeout(() => setCopiedBlogLink(false), 2500);
    }
  };

  const handleCopySchema = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(schemaJson);
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-modal-title"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] md:max-h-[85vh] animate-scaleUp">
        {/* Header */}
        <div className="bg-navy-900 p-5 sm:p-6 md:p-8 text-white relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <a
              href={standaloneBlogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-bold text-navy-950 hover:text-navy-900 bg-gold-400 hover:bg-gold-300 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 cursor-pointer min-h-[36px] flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Open full article in a new browser tab"
              aria-label="Open article in a new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-navy-950" />
              <span>Open in New Tab</span>
            </a>
            <button
              onClick={() => {
                onClose();
                setShowOgPreview(false);
              }}
              className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Close article modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[9px] bg-gold-400 text-navy-950 font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-block">
              {blog.tag}
            </span>
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
          <h3 id="blog-modal-title" className="font-display text-lg sm:text-xl md:text-3xl font-bold tracking-tight mb-2 pr-8">
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

        {/* Dynamic OG Social Share Bar */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Share2 className="w-3.5 h-3.5 text-gold-600" />
            <span className="font-semibold text-navy-950">Share with unique OG Card:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* WhatsApp */}
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-[11px] transition-colors min-h-[36px]"
              title="Share on WhatsApp with customized preview"
            >
              WhatsApp
            </a>

            {/* LinkedIn */}
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0077b5] hover:bg-[#006097] text-white rounded-lg font-medium text-[11px] transition-colors min-h-[36px]"
              title="Share to LinkedIn network"
            >
              LinkedIn
            </a>

            {/* Twitter / X */}
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-slate-800 text-white rounded-lg font-medium text-[11px] transition-colors min-h-[36px]"
              title="Share to X (Twitter)"
            >
              X (Twitter)
            </a>

            {/* Open in New Tab */}
            <a
              href={standaloneBlogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-navy-900 to-navy-950 hover:from-navy-800 hover:to-navy-900 text-gold-300 hover:text-gold-200 border border-gold-400/20 rounded-lg font-semibold text-[11px] transition-all shadow-sm min-h-[36px]"
              title="Open full blog in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
              <span>Open in New Tab</span>
            </a>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg font-medium text-[11px] transition-colors cursor-pointer min-h-[36px]"
            >
              {copiedBlogLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            {/* Preview Dynamic Social Image Button */}
            <button
              onClick={() => setShowOgPreview(!showOgPreview)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-[11px] transition-colors cursor-pointer min-h-[36px] ${
                showOgPreview
                  ? "bg-gold-500 text-navy-950 font-bold"
                  : "bg-gold-50 border border-gold-200 text-gold-800 hover:bg-gold-100"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{showOgPreview ? "Hide Preview" : "Preview OG Image"}</span>
            </button>

            {/* Inspect Google Schema (JSON-LD) Button */}
            <button
              onClick={() => setShowSchemaPreview(!showSchemaPreview)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-[11px] transition-colors cursor-pointer min-h-[36px] ${
                showSchemaPreview
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-blue-50 border border-blue-200 text-blue-900 hover:bg-blue-100"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showSchemaPreview ? "Hide Schema" : "Inspect Schema (JSON-LD)"}</span>
            </button>
          </div>
        </div>

        {/* Optional Dynamic OG Image Preview Drawer */}
        {showOgPreview && (
          <div className="bg-navy-950 p-4 border-b border-navy-800 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                  Dynamic 1200x630 Open Graph Image (Live Render)
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  (Generated on the fly based on title &amp; author)
                </span>
              </div>
              <a
                href={dynamicOgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-gold-300 hover:text-gold-200 underline flex items-center gap-1"
              >
                <span>Open SVG Card</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="rounded-xl overflow-hidden border border-gold-500/30 bg-navy-900 shadow-inner max-h-56 flex items-center justify-center">
              <img
                src={dynamicOgUrl}
                alt={`Open Graph Card for ${blog.title}`}
                className="w-full h-auto max-h-56 object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        )}

        {/* Optional Google Schema Markup Drawer */}
        {showSchemaPreview && (
          <div className="bg-slate-900 p-4 border-b border-slate-800 animate-fadeIn text-slate-200">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  Google Search Schema (JSON-LD) • Schema.org/BlogPosting
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://search.google.com/test/rich-results"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-slate-300 hover:text-white underline flex items-center gap-1"
                >
                  <span>Google Rich Results Test</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <button
                  onClick={handleCopySchema}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-semibold cursor-pointer transition-colors"
                >
                  {copiedSchema ? (
                    <>
                      <Check className="w-3 h-3 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-white" />
                      <span>Copy JSON-LD</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre className="text-[11px] font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto text-emerald-300 max-h-48 leading-relaxed">
              {schemaJson}
            </pre>
          </div>
        )}

        {/* Article Content */}
        <div className="flex-grow overflow-y-auto p-5 sm:p-6 md:p-8 bg-white prose prose-slate max-w-none text-slate-700">
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

          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed space-y-4">
            {blog.content}
          </div>

          {/* Keywords Pill List */}
          {blog.keywords && blog.keywords.length > 0 && (
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Target SEO Keywords:</span>
              {blog.keywords.map((kw, i) => (
                <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                  #{kw}
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
