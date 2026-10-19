import Link from "next/link";
import { CategoryQuote } from "@/lib/checklistData";

// Mirrors the EU AI Act's highlighted "Source: Article X" quote box: a
// verbatim excerpt from the regulation shown directly above a category's
// items, with a direct "Sumber: ..." citation underneath — no dropdown,
// no paraphrase.
export default function RegulationQuote({ quote, sourceLabel, sourceUrl }: CategoryQuote) {
  return (
    <blockquote className="mt-4 rounded-md border-l-4 border-brand bg-brand/5 px-4 py-3">
      <p className="text-sm italic leading-[22px] text-ink">&ldquo;{quote}&rdquo;</p>
      <footer className="mt-2">
        <Link href={sourceUrl} className="text-xs font-semibold text-brand hover:underline">
          Sumber: {sourceLabel}
        </Link>
      </footer>
    </blockquote>
  );
}
