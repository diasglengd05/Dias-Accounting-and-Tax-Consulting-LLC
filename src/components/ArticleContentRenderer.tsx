import React from "react";

/**
 * Strips raw markdown syntax characters (*, #) and converts inline formatting
 * (bold, italic, links, inline code) into clean, accessible React elements.
 */
export function renderFormattedInline(
  text: string,
  onNavigate?: (path: string) => void
): React.ReactNode {
  if (!text) return null;

  const cleanedText = text.replace(/^[*#]+\s*/, "");
  const regex = /(\[[^\]]+\]\([^)]+\)|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = cleanedText.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1].replace(/[*#]/g, "");
      const rawUrl = linkMatch[2].trim();
      const internalMatch = rawUrl.match(/^https?:\/\/(?:www\.)?diasuae\.ae(\/.*)?$/i);
      const isInternal = rawUrl.startsWith("/") || Boolean(internalMatch);
      const resolvedHref = internalMatch ? internalMatch[1] || "/" : rawUrl;

      if (isInternal) {
        return (
          <a
            key={index}
            href={resolvedHref}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(resolvedHref);
              }
            }}
            className="text-[#1B4332] hover:text-[#0D1B2A] underline underline-offset-2 font-semibold transition-colors"
          >
            {linkText}
          </a>
        );
      }

      return (
        <a
          key={index}
          href={rawUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1B4332] hover:text-[#0D1B2A] underline underline-offset-2 font-medium transition-colors"
        >
          {linkText}
        </a>
      );
    }

    const boldItalicMatch = part.match(/^\*\*\*([^*]+)\*\*\*$/);
    if (boldItalicMatch) {
      const content = boldItalicMatch[1].replace(/[*#]/g, "");
      return (
        <strong key={index} className="font-semibold text-[#0D1B2A]">
          <em>{content}</em>
        </strong>
      );
    }

    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      const content = boldMatch[1].replace(/[*#]/g, "");
      return (
        <strong key={index} className="font-semibold text-[#0D1B2A]">
          {content}
        </strong>
      );
    }

    const italicMatch = part.match(/^\*([^*]+)\*$/);
    if (italicMatch) {
      const content = italicMatch[1].replace(/[*#]/g, "");
      return (
        <em key={index} className="italic text-[#334155]">
          {content}
        </em>
      );
    }

    const codeMatch = part.match(/^`([^`]+)`$/);
    if (codeMatch) {
      return (
        <code key={index} className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#0D1B2A] text-xs px-1.5 py-0.5 rounded font-mono">
          {codeMatch[1]}
        </code>
      );
    }

    const sanitized = part.replace(/[*#]/g, "");
    return <React.Fragment key={index}>{sanitized}</React.Fragment>;
  });
}

interface ArticleContentRendererProps {
  content: string;
  onNavigate?: (path: string) => void;
}

/**
 * Transforms raw markdown articles into executive editorial typography
 * with zebra-striped compliance tables and subtle gold-accent callout boxes.
 */
export const ArticleContentRenderer: React.FC<ArticleContentRendererProps> = ({
  content,
  onNavigate,
}) => {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      elements.push(<hr key={`hr-${i}`} className="my-8 border-[#E2E8F0]" />);
      i++;
      continue;
    }

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerCells = tableLines[0]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        const isSeparator = /^\|(\s*:?-+:?\s*\|)+$/.test(tableLines[1]);
        const bodyLines = isSeparator ? tableLines.slice(2) : tableLines.slice(1);

        elements.push(
          <div
            key={`table-${i}`}
            className="my-8 overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-[0_6px_24px_-16px_rgba(13,27,42,0.06)]"
          >
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#0D1B2A] border-b border-[#E2E8F0]">
                  {headerCells.map((cell, cIdx) => (
                    <th key={cIdx} className="px-4 py-3.5 font-semibold text-xs sm:text-sm tracking-tight">
                      {renderFormattedInline(cell, onNavigate)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[#475569]">
                {bodyLines.map((rowLine, rIdx) => {
                  const cells = rowLine
                    .split("|")
                    .slice(1, -1)
                    .map((c) => c.trim());
                  return (
                    <tr key={rIdx} className="odd:bg-[#FFFFFF] even:bg-[#F8FAFC]">
                      {cells.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`px-4 py-3.5 align-top leading-relaxed tabular-nums ${
                            cIdx === 0 ? "font-semibold text-[#0D1B2A]" : "text-[#475569]"
                          }`}
                        >
                          {renderFormattedInline(cell, onNavigate)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    if (/^#\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^#\s+/, "");
      elements.push(
        <h2 key={`h1-${i}`} className="font-display text-2xl sm:text-[1.65rem] font-bold text-[#0D1B2A] mt-10 mb-4 tracking-tight leading-snug">
          {renderFormattedInline(headingText, onNavigate)}
        </h2>
      );
      i++;
      continue;
    }

    if (/^##\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^##\s+/, "");
      elements.push(
        <h2 key={`h2-${i}`} className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] mt-10 mb-3.5 tracking-tight leading-snug">
          {renderFormattedInline(headingText, onNavigate)}
        </h2>
      );
      i++;
      continue;
    }

    if (/^###\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^###\s+/, "");
      elements.push(
        <h3 key={`h3-${i}`} className="font-display text-lg sm:text-xl font-bold text-[#0D1B2A] mt-7 mb-2.5 leading-snug">
          {renderFormattedInline(headingText, onNavigate)}
        </h3>
      );
      i++;
      continue;
    }

    if (/^#{4,}\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^#{4,}\s+/, "");
      elements.push(
        <h4 key={`h4-${i}`} className="font-display text-base font-bold text-[#0D1B2A] mt-6 mb-2">
          {renderFormattedInline(headingText, onNavigate)}
        </h4>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] border-l-[3px] border-l-[#C5A059] p-5 sm:p-6 text-[#334155] text-sm sm:text-[15.5px] leading-[1.65]"
        >
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx} className={qIdx > 0 ? "mt-2.5" : ""}>
              {renderFormattedInline(ql, onNavigate)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    if (/^(\*|-|\+|\•)\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^(\*|-|\+|\•)\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^(\*|-|\+|\•)\s+/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-5 space-y-2.5 list-none pl-0">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx} className="flex items-start gap-3 text-[15px] sm:text-base leading-[1.65] text-[#475569]">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" aria-hidden="true" />
              <div className="flex-1">{renderFormattedInline(item, onNavigate)}</div>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: { num: string; text: string }[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const m = lines[i].trim().match(/^(\d+)\.\s+(.*)$/);
        if (m) {
          listItems.push({ num: m[1], text: m[2] });
        }
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-5 space-y-3 list-none pl-0">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx} className="flex items-start gap-3 text-[15px] sm:text-base leading-[1.65] text-[#475569]">
              <span className="font-semibold text-xs text-[#0D1B2A] mt-1 shrink-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2 py-0.5 min-w-[26px] text-center tabular-nums">
                {item.num}
              </span>
              <div className="flex-1">{renderFormattedInline(item.text, onNavigate)}</div>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(\#{1,6}\s+|---|\*{3,}|_{3,}|\||>|\*|-|\+|\•|\d+\.)/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i].trim());
      i++;
    }

    if (paragraphLines.length > 0) {
      elements.push(
        <p key={`p-${i}`} className="text-[15px] sm:text-base leading-[1.7] text-[#475569] mb-4">
          {renderFormattedInline(paragraphLines.join(" "), onNavigate)}
        </p>
      );
    } else {
      i++;
    }
  }

  return <div className="article-body">{elements}</div>;
};

export default ArticleContentRenderer;
