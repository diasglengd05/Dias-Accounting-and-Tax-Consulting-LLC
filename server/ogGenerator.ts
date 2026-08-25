/**
 * Dynamic Open Graph (OG) SVG Image Generator
 * Generates high-resolution 1200x630 Open Graph card images on the fly for social sharing.
 */

export interface OgPayload {
  title?: string;
  author?: string;
  role?: string;
  tag?: string;
  date?: string;
  readTime?: string;
  summary?: string;
  id?: string;
}

// Built-in blog metadata fallback mapping
const BLOG_PRESETS: Record<string, OgPayload> = {
  "uae-corporate-tax-guide": {
    title: "Understanding UAE Corporate Tax: A Comprehensive Guide for SMEs",
    author: "Glen Dias",
    role: "FTA Registered Tax Agent & Managing Director",
    tag: "Corporate Tax",
    date: "July 2, 2026",
    readTime: "5 min read",
    summary: "Master the 9% corporate tax regime, AED 375,000 threshold, exemptions & Small Business Relief.",
  },
  "vat-compliance-checklist": {
    title: "The Ultimate VAT Compliance Checklist for UAE Businesses",
    author: "Glen Dias",
    role: "Senior Tax Consultant",
    tag: "VAT Compliance",
    date: "June 18, 2026",
    readTime: "4 min read",
    summary: "Avoid severe FTA fines. Review our actionable checklist covering tax invoices, output & input VAT.",
  },
  "choosing-uae-jurisdiction": {
    title: "Choosing the Right Business Jurisdiction: Mainland vs. Free Zone",
    author: "Michael Chen",
    role: "Corporate Services Director",
    tag: "Incorporation",
    date: "May 29, 2026",
    readTime: "6 min read",
    summary: "Evaluating corporate tax implications, 0% Qualifying Free Zone rules & ownership flexibility.",
  },
};

function escapeXml(unsafe: string): string {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

function wrapText(text: string, maxCharsPerLine = 38, maxLines = 3): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      if (lines.length >= maxLines - 1) break;
    }
  }
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  // If there are still remaining words on the last line, append ellipsis
  if (lines.length === maxLines && words.length > lines.join(" ").split(/\s+/).length) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:!?]+$/, "") + "...";
  }

  return lines.length > 0 ? lines : [text];
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "GD";
}

/**
 * Generate 1200x630 SVG Image for Open Graph / Social Media sharing
 */
export function generateOgSvg(params: OgPayload): string {
  const preset = params.id && BLOG_PRESETS[params.id] ? BLOG_PRESETS[params.id] : {};

  const titleRaw = params.title || preset.title || "Corporate Tax, VAT & Bookkeeping Experts Dubai UAE";
  const authorRaw = params.author || preset.author || "Glen Dias";
  const roleRaw = params.role || preset.role || "FTA Registered Tax Agent & Senior Advisor";
  const tagRaw = params.tag || preset.tag || "UAE Tax Compliance";
  const dateRaw = params.date || preset.date || "2025/2026 Edition";
  const readTimeRaw = params.readTime || preset.readTime || "5 min read";
  const summaryRaw = params.summary || preset.summary || "Premier FTA-certified tax consultants in Dubai. Expert 9% Corporate Tax, VAT compliance & Bookkeeping.";

  const titleLines = wrapText(titleRaw, 36, 3);
  const initials = getInitials(authorRaw);

  const titleYStart = titleLines.length === 1 ? 275 : titleLines.length === 2 ? 245 : 215;
  const lineHeight = 58;

  const titleSvgSpans = titleLines
    .map((line, idx) => {
      const y = titleYStart + idx * lineHeight;
      return `<text x="90" y="${y}" font-family="'Playfair Display', Georgia, serif" font-size="46" font-weight="700" fill="#FFFFFF" letter-spacing="-0.02em">${escapeXml(line)}</text>`;
    })
    .join("\n    ");

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGradient" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#040914" />
      <stop offset="50%" stop-color="#091426" />
      <stop offset="100%" stop-color="#0e1d33" />
    </linearGradient>
    
    <radialGradient id="goldGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1050 120) rotate(135) scale(450 350)">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.22" />
      <stop offset="50%" stop-color="#d97706" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#040914" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="emeraldGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(150 550) rotate(45) scale(400 300)">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.18" />
      <stop offset="60%" stop-color="#059669" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#040914" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="goldLinear" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>

    <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02" />
    </linearGradient>

    <!-- Clip Paths & Filters -->
    <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)" />
  <rect width="1200" height="630" fill="url(#goldGlow)" />
  <rect width="1200" height="630" fill="url(#emeraldGlow)" />

  <!-- Subtle Architectural Grid Pattern -->
  <g opacity="0.04" stroke="#ffffff" stroke-width="1">
    <line x1="0" y1="90" x2="1200" y2="90" />
    <line x1="0" y1="180" x2="1200" y2="180" />
    <line x1="0" y1="270" x2="1200" y2="270" />
    <line x1="0" y1="360" x2="1200" y2="360" />
    <line x1="0" y1="450" x2="1200" y2="450" />
    <line x1="0" y1="540" x2="1200" y2="540" />
    <line x1="200" y1="0" x2="200" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="800" y1="0" x2="800" y2="630" />
    <line x1="1000" y1="0" x2="1000" y2="630" />
  </g>

  <!-- Decorative Accent Border / Outer Frame -->
  <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5" />
  <rect x="28" y="28" width="1144" height="574" rx="24" fill="none" stroke="url(#goldLinear)" stroke-opacity="0.25" stroke-width="1" />

  <!-- TOP BAR: Brand Identity & Regulatory Badge -->
  <g transform="translate(90, 68)">
    <!-- Dias Logo Emblem -->
    <rect x="0" y="0" width="46" height="46" rx="12" fill="#0d1b2a" stroke="#d97706" stroke-width="1.5" />
    <text x="23" y="32" font-family="'Space Grotesk', Inter, sans-serif" font-size="24" font-weight="800" fill="#fbbf24" text-anchor="middle">D</text>
    
    <!-- Brand Name -->
    <text x="60" y="24" font-family="'Space Grotesk', Inter, sans-serif" font-size="19" font-weight="800" fill="#FFFFFF" letter-spacing="0.06em">DIAS ACCOUNTING</text>
    <text x="60" y="42" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#d97706" letter-spacing="0.12em">TAX CONSULTING LLC • DUBAI, UAE</text>

    <!-- Category Pill Badge (Right aligned) -->
    <g transform="translate(760, 2)">
      <rect x="0" y="0" width="260" height="42" rx="21" fill="#0d1f36" stroke="#fbbf24" stroke-opacity="0.4" stroke-width="1.5" />
      <!-- Small Sparkle / Star Icon -->
      <circle cx="24" cy="21" r="5" fill="#fbbf24" />
      <text x="40" y="26" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#fbbf24" letter-spacing="0.04em">${escapeXml(tagRaw.toUpperCase())}</text>
    </g>
  </g>

  <!-- Gold Divider Accent Line -->
  <line x1="90" y1="142" x2="1110" y2="142" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
  <line x1="90" y1="142" x2="280" y2="142" stroke="url(#goldLinear)" stroke-width="2.5" stroke-linecap="round" />

  <!-- ARTICLE TITLE (Dynamic multi-line typography) -->
  <g>
    ${titleSvgSpans}
  </g>

  <!-- SUMMARY / KEY TAKEAWAY -->
  <g transform="translate(90, ${titleYStart + titleLines.length * lineHeight + 8})">
    <text x="0" y="16" font-family="Inter, sans-serif" font-size="17" font-weight="400" fill="#94a3b8" letter-spacing="-0.01em">
      ${escapeXml(summaryRaw.length > 95 ? summaryRaw.slice(0, 95) + "..." : summaryRaw)}
    </text>
  </g>

  <!-- BOTTOM CARD: Author Profile, Trust Badges & Metadata -->
  <g transform="translate(90, 470)">
    <!-- Container Card -->
    <rect x="0" y="0" width="1020" height="96" rx="20" fill="url(#cardGrad)" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" filter="url(#subtleShadow)" />
    
    <!-- Author Avatar Circle with Initials -->
    <g transform="translate(24, 18)">
      <circle cx="30" cy="30" r="30" fill="#0b1728" stroke="url(#goldLinear)" stroke-width="2" />
      <text x="30" y="38" font-family="'Space Grotesk', Inter, sans-serif" font-size="18" font-weight="800" fill="#fbbf24" text-anchor="middle">
        ${escapeXml(initials)}
      </text>
    </g>

    <!-- Author Details -->
    <g transform="translate(100, 36)">
      <text x="0" y="0" font-family="'Space Grotesk', Inter, sans-serif" font-size="18" font-weight="700" fill="#FFFFFF">
        ${escapeXml(authorRaw)}
      </text>
      <text x="0" y="22" font-family="Inter, sans-serif" font-size="13" font-weight="500" fill="#cbd5e1">
        ${escapeXml(roleRaw)}
      </text>
    </g>

    <!-- Meta Details: Date & Read Time -->
    <g transform="translate(480, 48)">
      <circle cx="0" cy="-4" r="3" fill="#fbbf24" />
      <text x="14" y="0" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#94a3b8">
        ${escapeXml(dateRaw)}
      </text>
      <circle cx="150" cy="-4" r="3" fill="#64748b" />
      <text x="164" y="0" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#94a3b8">
        ${escapeXml(readTimeRaw)}
      </text>
    </g>

    <!-- Right-Hand Trust Badge: FTA Tax Agent Certified -->
    <g transform="translate(770, 24)">
      <rect x="0" y="0" width="226" height="48" rx="14" fill="#051b14" stroke="#10b981" stroke-opacity="0.5" stroke-width="1.5" />
      <!-- Green Check Circle -->
      <circle cx="24" cy="24" r="10" fill="#10b981" />
      <path d="M19 24L22.5 27.5L29 20.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <text x="44" y="22" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#34d399" letter-spacing="0.04em">FTA REGISTERED</text>
      <text x="44" y="37" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#a7f3d0">Zero-Penalty Guarantee</text>
    </g>
  </g>
</svg>`;
}
