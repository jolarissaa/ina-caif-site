import { CompassIcon, EthicsIcon, GearIcon, ListStepsIcon, TargetIcon } from "./icons";
import { DocumentIcon } from "./icons";

// Visual, icon-based walkthrough of INA-CAIF's user flow for the homepage
// (Jo: "kasih tau, in a visual manner, pake icon, pake animation cara kerja
// ina caif dan user flownya"). Six steps in a responsive grid (3 columns on
// desktop, 2 on tablet, 1 on mobile — always a complete grid, 6 being
// divisible by both 2 and 3), each card fading in on load (see
// .how-it-works-step in globals.css). Per Jo: the earlier flex-wrap +
// connecting-arrow layout left the 6th step stranded alone on its own row
// at common widths — a plain grid can't do that, so the numbered badge
// replaces the arrows as the "this is a sequence" cue instead.
const STEPS: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }[] = [
  {
    icon: TargetIcon,
    title: "Mulai dari tujuan Anda",
    body: "Produk AI kesehatan yang sedang disiapkan untuk izin edar.",
  },
  {
    icon: CompassIcon,
    title: "Lihat regulasi yang berlaku",
    body: "Tahu pasal mana yang relevan dan tepatnya di mana dalam KMK 951/2026.",
  },
  {
    icon: ListStepsIcon,
    title: "Ikuti langkah demi langkah",
    body: "Persyaratan dipecah jadi tahapan yang bisa dicek satu per satu.",
  },
  {
    icon: DocumentIcon,
    title: "Tahu dokumen yang diperlukan",
    body: "Tiap butir terhubung ke template dan Form Regalkes yang sesuai.",
  },
  {
    icon: GearIcon,
    title: "Pahami detail teknisnya",
    body: "Penjelasan teknis per butir, lengkap dengan standar dan sumber rujukannya.",
  },
  {
    icon: EthicsIcon,
    title: "Ringkas untuk komite etik",
    body: "Kalau produk masih tahap uji coba atau penelitian, siapkan ringkasannya dalam satu langkah.",
  },
];

export default function HowItWorksSection() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        return (
          <div
            key={step.title}
            className="how-it-works-step rounded-lg border border-border-subtle bg-surface p-4"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Langkah {i + 1}
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold leading-[18px] text-ink">{step.title}</p>
            <p className="mt-1.5 text-xs leading-[17px] text-ink-muted">{step.body}</p>
          </div>
        );
      })}
    </div>
  );
}
