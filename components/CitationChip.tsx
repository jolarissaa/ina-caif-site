import { CitationType } from "@/lib/checklistData";

type Props = {
  label: string;
  type: CitationType;
  url: string;
};

// Free sources (Kemenkes, WHO, FDA, Indonesian statutes) can be linked
// directly. Paywalled standards (ISO) are cited by name and linked only to
// the catalog/search page, never to a mirrored copy of the clause text.
export default function CitationChip({ label, type, url }: Props) {
  const isInternal = url.startsWith("/");
  return (
    <a
      href={url}
      {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-alt px-2.5 py-1 text-[12px] font-medium text-ink-muted hover:border-brand hover:text-brand"
    >
      <span>{label}</span>
      {type === "paywalled" ? (
        <span className="rounded-sm bg-surface px-1 text-[10px] font-semibold text-ink-muted">
          berbayar
        </span>
      ) : null}
    </a>
  );
}
