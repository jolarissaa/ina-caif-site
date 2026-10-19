// Small inline-SVG icon set used in place of the old text-pill labels on
// checklist items (outputKind, Regalkes form, template button) — per Jo:
// keep the card scannable with icons instead of walls of label text, while
// staying professional rather than decorative. Each icon is purely
// decorative on its own (aria-hidden); the parent element carries the
// accessible label via aria-label/title.
type IconProps = { className?: string };

export function DocumentIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path
        d="M6 2.5h5.5L16 7v10a.5.5 0 0 1-.5.5h-9A.5.5 0 0 1 6 17V3a.5.5 0 0 1 .5-.5Z"
        strokeLinejoin="round"
      />
      <path d="M11.5 2.5V7H16" strokeLinejoin="round" />
      <path d="M8.5 10.5h3M8.5 13h3" strokeLinecap="round" />
    </svg>
  );
}

export function AlertIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path d="M10 2.5 18 16.5H2L10 2.5Z" strokeLinejoin="round" />
      <path d="M10 8v3.5" strokeLinecap="round" />
      <circle cx="10" cy="14" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BookmarkDownloadIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path d="M5.5 2.5h9a.5.5 0 0 1 .5.5v14.5l-5-3-5 3V3a.5.5 0 0 1 .5-.5Z" strokeLinejoin="round" />
      <path d="M8 8.5 10 10.5 12.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FormFileIcon({ className = "h-3 w-3" }: IconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
    >
      <path d="M6 2.5h5.5L16 7v10a.5.5 0 0 1-.5.5h-9A.5.5 0 0 1 6 17V3a.5.5 0 0 1 .5-.5Z" strokeLinejoin="round" />
      <path d="M11.5 2.5V7H16" strokeLinejoin="round" />
    </svg>
  );
}

// Used on the questionnaire's pre-start narration (QualifyingQuestionnaire)
// to represent the "izin edar" path — a stamp/seal standing in for
// regulatory approval, next to EthicsIcon's "komite etik" path.
export function StampIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <circle cx="10" cy="7.5" r="4.5" strokeLinejoin="round" />
      <path d="M7.3 10.8 6 17.5l4-2 4 2-1.3-6.7" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M8 7.5 9.3 9 12 6.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// "komite etik" path on the same screen — a small group, standing in for a
// review committee (RS pendidikan / KEPKN) rather than a single regulator.
export function EthicsIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <circle cx="7" cy="6.5" r="2.25" strokeLinejoin="round" />
      <circle cx="13.5" cy="7.5" r="1.75" strokeLinejoin="round" />
      <path d="M2.75 16c.4-2.8 2.2-4.5 4.25-4.5s3.85 1.7 4.25 4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12.3c1.65.25 2.9 1.6 3.25 3.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
