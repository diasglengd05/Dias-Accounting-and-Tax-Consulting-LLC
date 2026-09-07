import React, { useState } from "react";
import { X, Check, Copy, Share2, ExternalLink, Image as ImageIcon } from "lucide-react";
import { BlogPost } from "../types";
import { getBlogOgImageUrl, getSocialShareUrls } from "../lib/ogImage";

interface BlogModalProps {
  blog: BlogPost | null;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ blog, onClose }) => {
  const [copiedBlogLink, setCopiedBlogLink] = useState(false);
  const [showOgPreview, setShowOgPreview] = useState(false);

  if (!blog) return null;

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
          <button
            onClick={() => {
              onClose();
              setShowOgPreview(false);
            }}
            className="absolute top-4 right-4 p-2.5 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close article modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[9px] bg-gold-400 text-navy-950 font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-block">
              {blog.tag}
            </span>
            <span className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Dynamic OG Meta Active
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

        {/* Article Content */}
        <div className="flex-grow overflow-y-auto p-5 sm:p-6 md:p-8 bg-white prose prose-slate max-w-none text-slate-700">
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed space-y-4">
            {blog.content}
          </div>

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
