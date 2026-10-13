import Link from "next/link";
import { SourceRef, SourceKind } from "@/lib/checklistData";

// One visual style per source body, so a reader can tell at a glance which
// kind of document a citation points to before even reading the label —
// this is the "jelas pemisahnya dimana" Jo asked for when a checklist item
// branches out from Kemenkes's own text to WHO, FDA, ISO/IEC, IMDRF, UU, or
// ethics guidance. Classes are written out in full (never built from a
// template string) so Tailwind's content scan picks every one of them up.
const KIND_STYLES: Record<SourceKind, string> = {
  kemenkes: "border-brand/30 bg-brand/10 text-brand-dark",
  who: "border-sky-200 bg-sky-50 text-sky-800",
  fda: "border-indigo-200 bg-indigo-50 text-indigo-800",
  iso: "border-amber-200 bg-amber-50 text-amber-900",
  iec: "border-orange-200 bg-orange-50 text-orange-900",
  imdrf: "border-slate-300 bg-slate-100 text-slate-800",
  uu: "border-green-200 bg-green-50 text-green-800",
  ethics: "border-rose-200 bg-rose-50 text-rose-800",
};

const KIND_LABEL: Record<SourceKind, string> = {
  kemenkes: "Kemenkes",
  who: "WHO",
  fda: "FDA",
  iso: "ISO",
  iec: "IEC",
  imdrf: "IMDRF",
  uu: "UU/Permenkes",
  ethics: "Etik",
};

type Props = SourceRef & { className?: string };

// A small, clickable chip: a kind tag (so sources of the same body always
// look the same across the whole site) plus the specific document label.
// Internal links (Kemenkes anchors into /regulasi) navigate in-app; every
// external source opens in a new tab and links straight to the document —
// never to a generic search page — per Jo's "kasih link untuk mereka klik
// dan bakal dibawa kesana".
export default function SourceBadge({ label, kind, type, url, className }: Props) {
  const isInternal = url.startsWith("/");
  return (
    <Link
      href={url}
      {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium hover:opacity-80 ${KIND_STYLES[kind]} ${className ?? ""}`}
    >
      <span className="rounded-sm bg-black/5 px-1 font-semibold">{KIND_LABEL[kind]}</span>
      <span>{label}</span>
      {type === "paywalled" ? <span className="text-[10px] opacity-70">(berbayar)</span> : null}
    </Link>
  );
}
