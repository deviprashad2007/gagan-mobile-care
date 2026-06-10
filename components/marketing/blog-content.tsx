import Link from "next/link";
import type { ReactNode } from "react";

// Renders a small, safe subset of Markdown used in blog post bodies:
// ## / ### headings, "- " bullet lists, **bold**, and [text](url) links.
// Internal links (starting with "/") use next/link for client-side nav.
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      parts.push(<strong key={`${keyPrefix}-${i++}`}>{match[1]}</strong>);
    } else {
      const [, , linkText, href] = match;
      if (href.startsWith("/")) {
        parts.push(
          <Link key={`${keyPrefix}-${i++}`} href={href} className="underline underline-offset-2 hover:text-[var(--color-ink)]">
            {linkText}
          </Link>
        );
      } else {
        parts.push(
          <a
            key={`${keyPrefix}-${i++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--color-ink)]"
          >
            {linkText}
          </a>
        );
      }
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function BlogContent({ content }: { content: string }) {
  const blocks = content.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim());

        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="list-disc pl-5 flex flex-col gap-1.5 text-[15px] text-[var(--color-ink-2)] leading-relaxed">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.slice(2), `${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }

        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className="text-xl font-semibold text-[var(--color-ink)] mt-2" style={{ fontFamily: "var(--font-display)" }}>
              {renderInline(block.slice(4), `${i}`)}
            </h3>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="text-2xl font-semibold text-[var(--color-ink)] mt-4" style={{ fontFamily: "var(--font-display)" }}>
              {renderInline(block.slice(3), `${i}`)}
            </h2>
          );
        }

        return (
          <p key={i} className="text-[15px] text-[var(--color-ink-2)] leading-relaxed">
            {renderInline(block, `${i}`)}
          </p>
        );
      })}
    </div>
  );
}
