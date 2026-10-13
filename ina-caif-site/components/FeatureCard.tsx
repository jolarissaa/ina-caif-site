"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  href: string;
  title: string;
  description: string;
  linkLabel: string;
  imageSrc: string;
  imageAlt: string;
  accent: "brand" | "accent";
};

// Large feature card modeled on the EU AI Act homepage's "Explorer" /
// "Compliance Checker" cards: a title link, a short description, and a big
// image area below. `imageSrc` always points at a fixed path under
// public/images/ (see the README there) — drop a file in with that exact
// name and it appears automatically, no code change needed. Until a file
// exists there, the <img> fails to load and this falls back to a tidy
// placeholder slot in the card's accent color, so the layout never looks
// broken.
export default function FeatureCard({
  href,
  title,
  description,
  linkLabel,
  imageSrc,
  imageAlt,
  accent,
}: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const isbrand = accent === "brand";

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-surface">
      <div className="p-6 pb-0 sm:p-8 sm:pb-0">
        <Link
          href={href}
          className={`font-display text-xl font-semibold underline decoration-2 underline-offset-4 hover:opacity-80 sm:text-2xl ${
            isbrand ? "text-brand decoration-brand/40" : "text-ink decoration-accent"
          }`}
        >
          {title}
        </Link>
        <p className="mt-3 max-w-md text-sm leading-[22px] text-ink-muted">{description}</p>
        <Link
          href={href}
          className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${
            isbrand ? "text-brand" : "text-ink"
          } hover:opacity-80`}
        >
          {linkLabel}
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="mt-6 aspect-[16/10] w-full sm:mt-8">
        {!imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center border-t border-border-subtle ${
              isbrand ? "bg-brand/8" : "bg-accent/15"
            }`}
          >
            <div className="flex flex-col items-center gap-2 px-6 text-center">
              <PlaceholderIcon isbrand={isbrand} />
              <p className="text-xs text-ink-muted">
                Letakkan gambar di <code className="text-[11px]">public{imageSrc}</code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlaceholderIcon({ isbrand }: { isbrand: boolean }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={isbrand ? "text-brand" : "text-ink"}
    >
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 15l-5-4-4 3-3-2-6 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
