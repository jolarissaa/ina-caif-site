import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Source = {
  name: string;
  description: string;
  url: string;
  free: boolean;
};

const SOURCES: Source[] = [
  {
    name: "Permenkes No. 24 Tahun 2022",
    description: "Pengelolaan rekam medis, termasuk rekam medis elektronik.",
    url: "https://jdih.kemkes.go.id/search?q=Permenkes%2024%20Tahun%202022",
    free: true,
  },
  {
    name: "UU No. 27 Tahun 2022",
    description: "Pelindungan Data Pribadi, menjadi dasar hukum pemrosesan data pasien.",
    url: "https://jdih.kemkes.go.id/search?q=UU%2027%20Tahun%202022",
    free: true,
  },
  {
    name: "WHO — Generating Evidence for AI-Based Medical Devices (2021)",
    description: "Panduan WHO mengenai bukti klinis dan evaluasi untuk perangkat medis berbasis AI.",
    url: "https://www.who.int/publications/i/item/9789240029200",
    free: true,
  },
  {
    name: "FDA — Predetermined Change Control Plan Guidance (2025)",
    description: "Panduan FDA untuk perencanaan perubahan model AI yang terkendali dan dapat diaudit.",
    url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents",
    free: true,
  },
  {
    name: "ISO 14971:2019",
    description: "Standar manajemen risiko untuk perangkat medis sepanjang siklus hidupnya.",
    url: "https://www.iso.org/search.html?q=ISO%2014971",
    free: false,
  },
  {
    name: "IEC 62304:2006+AMD1:2015",
    description: "Standar siklus hidup perangkat lunak untuk perangkat medis.",
    url: "https://www.iso.org/search.html?q=IEC%2062304",
    free: false,
  },
  {
    name: "ISO 13485:2016",
    description: "Standar sistem manajemen mutu untuk perangkat medis.",
    url: "https://www.iso.org/search.html?q=ISO%2013485",
    free: false,
  },
];

export default function RegulasiPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-content px-6 py-12">
        <h1 className="font-display text-2xl font-bold text-ink">Pustaka Regulasi</h1>
        <p className="mt-2 max-w-xl text-sm leading-[22px] text-ink-muted">
          Sumber yang tersedia secara bebas dapat dibuka langsung. Standar ISO bersifat berbayar
          dan hanya dapat ditautkan ke halaman pencarian resmi ISO, bukan ke isi klausulnya.
        </p>

        <Link
          href="/regulasi/kmk-951-2026"
          className="mt-8 flex items-center justify-between gap-4 rounded-lg border border-brand bg-brand/5 p-6 hover:bg-brand/10"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              Teks Lengkap
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-ink">
              KMK No. HK.01.07/MENKES/951/2026
            </p>
            <p className="mt-1 max-w-xl text-sm leading-[20px] text-ink-muted">
              Pedoman Izin Edar Alat Kesehatan Berbasis Perangkat Lunak, teks lengkap per Bab
              dengan navigasi cepat — tidak perlu membuka dokumen lain.
            </p>
          </div>
          <span aria-hidden className="flex-shrink-0 text-xl text-brand">
            →
          </span>
        </Link>

        <p className="mt-10 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Sumber Lain
        </p>
        <div className="mt-3 divide-y divide-border-subtle rounded-lg border border-border-subtle bg-surface">
          {SOURCES.map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-4 p-5 hover:bg-surface-alt"
            >
              <div>
                <p className="text-sm font-semibold text-ink">{source.name}</p>
                <p className="mt-1 text-sm leading-[20px] text-ink-muted">{source.description}</p>
              </div>
              <span className="mt-1 flex-shrink-0 rounded-sm bg-surface-alt px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
                {source.free ? "Bebas diakses" : "Berbayar"}
              </span>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
