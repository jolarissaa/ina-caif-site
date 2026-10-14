type Props = {
  src: string;
  alt: string;
  caption: string;
};

// A real page image lifted straight from the source PDF (via
// lib/../public/images/regulasi), shown above the interactive
// recreation that follows it in app/regulasi/kmk-951-2026/page.tsx — so a
// reader sees the authentic figure exactly as Kemenkes published it, with
// the clickable/computed version right underneath for actually working
// through it. Plain <img>, not next/image: this is a static export-style
// site with no image loader configured.
export default function RegulationFigure({ src, alt, caption }: Props) {
  return (
    <figure className="overflow-hidden rounded-lg border border-border-subtle bg-surface">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full" />
      <figcaption className="border-t border-border-subtle bg-surface-alt px-4 py-2 text-xs leading-[18px] text-ink-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
