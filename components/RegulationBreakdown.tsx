"use client";

import { useEffect, useRef, useState } from "react";
import { SourceKind } from "@/lib/checklistData";

// Small color-only badge for a reference body — reuses the same kind/color
// mapping as components/SourceBadge.tsx (so "WHO" always looks the same
// shade of blue everywhere on the site) but without the Link wrapper, since
// these are a quick "this segment also draws on X" visual, not individual
// citations to click through.
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

type Segment = {
  name: string;
  href: string;
  refs: SourceKind[];
};

// The categories a reader actually works through in the Compliance Checker
// (lib/checklistData.ts's `categories`), each paired with which outside
// body/bodies its items draw on beyond KMK 951/2026 itself — read straight
// off the SOURCES actually cited in lib/checklistData.ts for that category,
// not invented for this visual.
const SEGMENTS: Segment[] = [
  {
    name: "Dasar Perangkat Lunak",
    href: "/produk",
    refs: ["kemenkes", "iso", "iec"],
  },
  {
    name: "Kecerdasan Buatan",
    href: "/produk",
    refs: ["kemenkes", "who"],
  },
  {
    name: "Pembelajaran Berkelanjutan & Model Generatif",
    href: "/produk",
    refs: ["kemenkes", "fda"],
  },
  {
    name: "Bukti & Validasi Klinis",
    href: "/produk",
    refs: ["kemenkes", "who", "imdrf"],
  },
  {
    name: "Etika & Good Machine Learning Practice",
    href: "/produk",
    refs: ["kemenkes", "who"],
  },
  {
    name: "Interoperabilitas & Perlindungan Data",
    href: "/produk",
    refs: ["kemenkes", "uu"],
  },
];

// One row of the breakdown: fades/slides into place the first time it
// scrolls into view (and stays — this never re-hides on scroll back up),
// mirroring the reveal-as-you-scroll treatment on the EU AI Act site's
// homepage. Falls back to simply visible for anyone with
// prefers-reduced-motion or if IntersectionObserver isn't available.
function RevealRow({ index, children }: { index: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      style={{ transitionDelay: visible ? `${index * 90}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

// The homepage's "what this actually is" visual: KMK 951/2026 at the top,
// branching down into the categories the Compliance Checker breaks it
// into, each tagged with which outside body/bodies its requirements also
// draw on. Replaces the flat "Disusun berdasarkan: Kemenkes, WHO, FDA..."
// tag row — same underlying information, but shown as a structure instead
// of a list of names, revealed as the reader scrolls past it.
export default function RegulationBreakdown() {
  return (
    <div className="relative">
      <div
        data-tutorial="breakdown-source"
        className="rounded-lg border border-border-subtle bg-surface px-5 py-4 shadow-sm"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Sumber tunggal</p>
        <p className="mt-1 font-display text-base font-semibold text-ink">
          KMK No. HK.01.07/MENKES/951/2026
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Pedoman Izin Edar Alat Kesehatan Berbasis Perangkat Lunak
        </p>
      </div>

      <div className="relative mt-2 pl-6">
        {/* The vertical spine every segment branches off of. */}
        <div
          aria-hidden
          className="absolute bottom-6 left-[11px] top-0 w-px bg-border-subtle"
        />
        <div className="space-y-4 py-4">
          {SEGMENTS.map((segment, i) => (
            <RevealRow key={segment.name} index={i}>
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute -left-6 top-[18px] h-px w-5 bg-border-subtle"
                />
                <span
                  aria-hidden
                  className="absolute -left-[27px] top-[13px] h-2.5 w-2.5 rounded-full border-2 border-brand bg-surface"
                />
                <a
                  href={segment.href}
                  data-tutorial={i === 0 ? "breakdown-segment" : undefined}
                  className="block rounded-md border border-border-subtle bg-surface px-4 py-3 hover:border-brand"
                >
                  <p className="text-sm font-semibold text-ink">{segment.name}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {segment.refs.map((kind) => (
                      <span
                        key={kind}
                        className={`rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold ${KIND_STYLES[kind]}`}
                      >
                        {KIND_LABEL[kind]}
                      </span>
                    ))}
                  </div>
                </a>
              </div>
            </RevealRow>
          ))}
        </div>
      </div>
    </div>
  );
}
