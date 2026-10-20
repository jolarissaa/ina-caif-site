import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Source = {
  name: string;
  description: string;
  url: string;
  free: boolean;
};

// Every external source the checklist branches out to (per item citations
// and the breakdown steps in lib/checklistData.ts), gathered in one place
// so a reader can download or open any of them directly — not a search
// page — without having to find the right checklist item first. Grouped
// by body, matching the colour-coded SourceBadge kinds used elsewhere.
const SOURCE_GROUPS: { heading: string; sources: Source[] }[] = [
  {
    heading: "Regulasi & Undang-Undang Indonesia",
    sources: [
      {
        name: "Permenkes No. 24 Tahun 2022",
        description: "Pengelolaan rekam medis, termasuk rekam medis elektronik.",
        url: "https://jdih.kemkes.go.id/common/dokumen/2022permenkes024.pdf",
        free: true,
      },
      {
        name: "UU No. 27 Tahun 2022",
        description:
          "Pelindungan Data Pribadi — dasar hukum pemrosesan data pasien, termasuk 6 dasar pemrosesan yang sah dan hak subjek data.",
        url: "https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022",
        free: true,
      },
    ],
  },
  {
    heading: "WHO",
    sources: [
      {
        name: "WHO — Generating Evidence for AI-Based Medical Devices (2021)",
        description:
          "Kerangka bukti klinis dan evaluasi untuk perangkat medis berbasis AI — dipakai sebagai rujukan tambahan untuk memahami Dokumen Bukti Klinis.",
        url: "https://www.who.int/publications/i/item/9789240038462",
        free: true,
      },
      {
        name: "WHO — Ethics and Governance of AI for Health: Large Multi-Modal Models",
        description: "Panduan etika WHO untuk model AI generatif/LMM di bidang kesehatan.",
        url: "https://www.who.int/publications-detail-redirect/9789240084759",
        free: true,
      },
    ],
  },
  {
    heading: "FDA (Amerika Serikat)",
    sources: [
      {
        name: "FDA — Predetermined Change Control Plan (Final Guidance, Des 2024)",
        description:
          "Struktur dokumentasi perubahan model AI pascapenerapan — rujukan tambahan untuk continuous machine learning.",
        url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial",
        free: true,
      },
      {
        name: "FDA — AI-Enabled Device Software Functions: Lifecycle Management (Draft Guidance)",
        description: "Rekomendasi siklus hidup dan pengajuan pemasaran untuk software berbasis AI.",
        url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/artificial-intelligence-enabled-device-software-functions-lifecycle-management-and-marketing",
        free: true,
      },
      {
        name: "FDA — Considerations for the Regulation of Generative AI-Enabled Medical Devices",
        description: "Discussion paper FDA tentang risiko khas model generatif/LLM, termasuk halusinasi.",
        url: "https://www.fda.gov/medical-devices/digital-health-center-excellence/considerations-regulation-generative-ai-enabled-medical-devices-discussion-paper-and-request",
        free: true,
      },
    ],
  },
  {
    heading: "IMDRF",
    sources: [
      {
        name: "IMDRF N12 — SaMD: Possible Framework for Risk Categorization",
        description:
          "Contoh terpandu untuk mengkategorikan risiko SaMD — bantu mengisi kekosongan Tabel 3.2 KMK yang tak diberi contoh.",
        url: "https://imdrf.org/sites/default/files/docs/imdrf/final/technical/imdrf-tech-140918-samd-framework-risk-categorization-141013.pdf",
        free: true,
      },
    ],
  },
  {
    heading: "Pedoman Etik Penelitian Kesehatan",
    sources: [
      {
        name: "KEPKN — Buku Pedoman dan Standar Etik Penelitian dan Pengembangan Kesehatan Nasional",
        description: "Pedoman etik penelitian kesehatan nasional dari Kemenkes, relevan untuk konteks tim etik.",
        url: "https://kepkn.kemkes.go.id/assets/img/keppkn/file/BUKU_PEDOMAN_DAN_STANDAR_ETIK_PENELITIAN_DAN_PENGEMBANGAN_KESEHATAN_NASIONAL(KEPKN).pdf",
        free: true,
      },
      {
        name: "CIOMS — International Ethical Guidelines for Health-related Research (2016)",
        description: "Pedoman etik penelitian kesehatan internasional yang banyak dirujuk KEPK di Indonesia.",
        url: "https://www.paho.org/en/documents/international-ethical-guidelines-health-related-research-involving-humans",
        free: true,
      },
    ],
  },
  {
    heading: "Standar ISO / IEC (berbayar)",
    sources: [
      {
        name: "ISO 14971:2019",
        description: "Standar manajemen risiko untuk perangkat medis sepanjang siklus hidupnya.",
        url: "https://www.iso.org/standard/72704.html",
        free: false,
      },
      {
        name: "IEC 62304:2006+AMD1:2015",
        description: "Standar siklus hidup perangkat lunak untuk perangkat medis.",
        url: "https://webstore.iec.ch/publication/22794",
        free: false,
      },
      {
        name: "ISO 13485:2016",
        description: "Standar sistem manajemen mutu untuk perangkat medis.",
        url: "https://www.iso.org/standard/59752.html",
        free: false,
      },
    ],
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

        <a
          href="https://drive.google.com/file/d/12sykagQ3pXe2F9imIN2LMfupEjh15Fj9/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-accent bg-accent/5 p-6 hover:bg-accent/10"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Tabel Pemetaan
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-ink">
              Dokumen Checklist → Form Regalkes
            </p>
            <p className="mt-1 max-w-xl text-sm leading-[20px] text-ink-muted">
              Tabel ringkas yang memetakan setiap dokumen template di checklist ke Form A–E
              Regalkes Kemenkes mana ia akan digunakan.
            </p>
          </div>
          <span aria-hidden className="flex-shrink-0 text-xl text-accent">
            ↗
          </span>
        </a>

        <p className="mt-10 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Sumber Lain
        </p>
        <p className="mt-1 max-w-xl text-sm leading-[20px] text-ink-muted">
          Sumber di bawah dikelompokkan per lembaga/standar, sesuai badge warna yang muncul di
          setiap butir checklist yang merujuknya.
        </p>

        <div className="mt-4 space-y-6">
          {SOURCE_GROUPS.map((group) => (
            <div
              key={group.heading}
              data-tutorial={
                group.heading === "WHO"
                  ? "pustaka-who"
                  : group.heading === "Standar ISO / IEC (berbayar)"
                  ? "pustaka-paywalled"
                  : undefined
              }
            >
              <p className="text-xs font-semibold text-ink">{group.heading}</p>
              <div className="mt-2 divide-y divide-border-subtle rounded-lg border border-border-subtle bg-surface">
                {group.sources.map((source) => (
                  <a
                    key={source.name}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start justify-between gap-4 p-5 hover:bg-surface-alt"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{source.name}</p>
                      <p className="mt-1 text-sm leading-[20px] text-ink-muted">
                        {source.description}
                      </p>
                    </div>
                    <span className="mt-1 flex-shrink-0 rounded-sm bg-surface-alt px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
                      {source.free ? "Bebas diakses" : "Berbayar"}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
