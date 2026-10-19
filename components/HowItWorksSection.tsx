import { CompassIcon, EthicsIcon, GearIcon, ListStepsIcon, TargetIcon } from "./icons";
import { DocumentIcon } from "./icons";

// Visual, icon-based walkthrough of INA-CAIF's user flow for the homepage
// (Jo: "kasih tau, in a visual manner, pake icon, pake animation cara kerja
// ina caif dan user flownya"). Six steps connected by arrows, each card
// fading in on load (see .how-it-works-step / .how-it-works-arrow in
// globals.css) so the section feels a bit more alive than a plain list,
// without pulling in an animation library for six CSS keyframes.
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
    <div className="flex flex-wrap items-stretch justify-center gap-x-2 gap-y-6">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        return (
          <div key={step.title} className="flex items-center">
            <div
              className="how-it-works-step w-[168px] rounded-lg border border-border-subtle bg-surface p-4"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <p className="mt-3 text-sm font-semibold leading-[18px] text-ink">{step.title}</p>
              <p className="mt-1.5 text-xs leading-[17px] text-ink-muted">{step.body}</p>
            </div>
            {i < STEPS.length - 1 ? (
              <span
                aria-hidden
                className="how-it-works-arrow mx-1.5 hidden flex-shrink-0 text-lg text-brand/60 sm:inline-block"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                →
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
