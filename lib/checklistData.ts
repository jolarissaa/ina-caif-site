// Real checklist content, structured and cited directly from KMK No.
// HK.01.07/MENKES/951/2026 (Pedoman Izin Edar Alat Kesehatan Berbasis
// Perangkat Lunak), following the regulation's own layering: base
// software/SMM requirements that apply to everything, then AI/ML,
// continuous learning, and generative-model layers that only trigger
// conditionally, then clinical evidence, labeling, ethics/GMLP,
// interoperability/data protection, and post-market obligations.
//
// Citations to KMK 951/2026 link to the matching chapter (Bab) on the
// Pustaka "Explorer" page (/regulasi/kmk-951-2026), which embeds the
// regulation's full text — government regulations are public domain and
// can be freely mirrored, unlike paywalled ISO/IEC standards, which stay
// as external links to the standards body's own catalog/search page.

export type CitationType = "free" | "paywalled";

export type ChecklistStatus = "selesai" | "berjalan" | "belum";

// Qualifying conditions, answered once on a short questionnaire before the
// checklist is shown. An item that names one only applies when that
// condition is true for the product being assessed — e.g. items tagged
// "ai" stay hidden until the person confirms their product uses AI/ML, so
// the checklist narrows to what actually applies instead of showing all 33
// items to everyone regardless of product profile.
export type QualifyingCondition =
  | "ai"
  | "continuousLearning"
  | "generative"
  | "importLocalValidation";

// Which body/standard a source belongs to — used purely to pick the
// SourceBadge's colour/icon so a reader can tell at a glance, before even
// reading the label, whether a given breakdown step comes from Kemenkes
// itself or branches out to WHO/FDA/ISO/IEC/IMDRF/UU/ethics guidance.
export type SourceKind = "kemenkes" | "who" | "fda" | "iso" | "iec" | "imdrf" | "uu" | "ethics";

export type SourceRef = {
  label: string;
  kind: SourceKind;
  type: CitationType;
  url: string;
};

// One concrete, checkable sub-step under a checklist item — the "breakdown
// teknisnya mereka harus ngapain" Jo asked for: instead of an item just
// telling the reader to go look up IEC 62304 or ISO 14971 themselves, each
// breakdown step spells out the actual sub-requirement, and (when it comes
// from a specific standard rather than the item's own Kemenkes citation)
// carries its own SourceRef so the reader sees exactly which document that
// step is grounded in and can open it directly.
export type BreakdownStep = {
  text: string;
  source?: SourceRef;
  // Whether this step is itself a concrete, checkable task (default when
  // omitted: true). A few steps are supplementary context instead — a
  // cross-reference to another item, a classification definition you pick
  // one of rather than "complete", a caveat about what the regulation
  // doesn't specify — and those are marked false so they render as a plain
  // note rather than a checkbox that can never meaningfully be "done".
  actionable?: boolean;
};

export type ChecklistItem = {
  id: string;
  categoryId: string;
  title: string;
  explanation: string;
  citationLabel: string;
  citationType: CitationType;
  citationUrl: string;
  defaultStatus: ChecklistStatus;
  condition?: QualifyingCondition;
  // Optional concrete breakdown of the item into checkable sub-steps,
  // pulled from the actual standards KMK 951/2026 points to (IEC 62304,
  // ISO 14971, WHO, FDA, IMDRF, UU PDP, etc.) rather than leaving the
  // reader to go translate a normative cross-reference themselves.
  breakdown?: BreakdownStep[];
};

export type Category = {
  id: string;
  name: string;
  description: string;
};

// A short, verbatim excerpt from the regulation itself, shown directly
// above a category's items on the Compliance Checker (mirroring the EU AI
// Act's highlighted "Source: Article X" quote boxes) so each section of
// questions is visibly grounded in the actual clause it comes from before
// expanding into the items derived from it.
export type CategoryQuote = {
  quote: string;
  sourceLabel: string;
  sourceUrl: string;
};

const KMK_BAB2 = "/regulasi/kmk-951-2026#bab-2";
const KMK_BAB3 = "/regulasi/kmk-951-2026#bab-3";
const KMK_BAB4 = "/regulasi/kmk-951-2026#bab-4";
const KMK_BAB5 = "/regulasi/kmk-951-2026#bab-5";
const UU_PDP_URL = "https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022";
const PERMENKES_REKAM_MEDIS_URL = "https://jdih.kemkes.go.id/common/dokumen/2022permenkes024.pdf";
const ISO_14971_URL = "https://www.iso.org/standard/72704.html";
const IEC_62304_URL = "https://webstore.iec.ch/publication/22794";

// Verified, directly-clickable sources for every standard/body KMK 951/2026
// branches out to beyond its own text — each one checked against the
// publisher's own site so "Sumber" links go straight to the document, not a
// generic search page (per Jo: "kasih link untuk mereka klik dan bakal
// dibawa kesana"). Paywalled ISO/IEC standards still link only to the
// standards body's own catalogue entry for that exact edition, never to a
// mirrored copy of the clause text.
export const SOURCES = {
  isoManagement: {
    label: "ISO 13485:2016 — Sistem Manajemen Mutu Alat Kesehatan",
    kind: "iso",
    type: "paywalled",
    url: "https://www.iso.org/standard/59752.html",
  },
  isoRisk: {
    label: "ISO 14971:2019 — Manajemen Risiko Alat Kesehatan",
    kind: "iso",
    type: "paywalled",
    url: ISO_14971_URL,
  },
  iecSoftware: {
    label: "IEC 62304:2006+AMD1:2015 — Siklus Hidup Software Alat Kesehatan",
    kind: "iec",
    type: "paywalled",
    url: IEC_62304_URL,
  },
  whoEvidence: {
    label: "WHO (2021) — Generating Evidence for AI-Based Medical Devices",
    kind: "who",
    type: "free",
    url: "https://www.who.int/publications/i/item/9789240038462",
  },
  whoEthicsLmm: {
    label: "WHO — Ethics and Governance of AI for Health: Large Multi-Modal Models",
    kind: "who",
    type: "free",
    url: "https://www.who.int/publications-detail-redirect/9789240084759",
  },
  fdaPccp: {
    label: "FDA — Predetermined Change Control Plan (Final Guidance, Des 2024)",
    kind: "fda",
    type: "free",
    url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial",
  },
  fdaGenAi: {
    label: "FDA — Considerations for the Regulation of Generative AI-Enabled Medical Devices",
    kind: "fda",
    type: "free",
    url: "https://www.fda.gov/medical-devices/digital-health-center-excellence/considerations-regulation-generative-ai-enabled-medical-devices-discussion-paper-and-request",
  },
  imdrfN12: {
    label: "IMDRF N12 — SaMD: Possible Framework for Risk Categorization",
    kind: "imdrf",
    type: "free",
    url: "https://imdrf.org/sites/default/files/docs/imdrf/final/technical/imdrf-tech-140918-samd-framework-risk-categorization-141013.pdf",
  },
  uuPdp: {
    label: "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi",
    kind: "uu",
    type: "free",
    url: UU_PDP_URL,
  },
} satisfies Record<string, SourceRef>;

export const categories: Category[] = [
  {
    id: "klasifikasi-administrasi",
    name: "Klasifikasi & Administrasi",
    description:
      "Menentukan kategori produk (SaMD/SiMD) dan memenuhi syarat administratif dasar sebelum mengajukan izin edar.",
  },
  {
    id: "dasar-perangkat-lunak",
    name: "Dasar Perangkat Lunak",
    description:
      "Sistem manajemen mutu, verifikasi dan validasi, serta manajemen risiko yang berlaku untuk semua software alat kesehatan, AI maupun non-AI.",
  },
  {
    id: "kecerdasan-buatan",
    name: "Kecerdasan Buatan",
    description:
      "Dokumentasi dataset, model, evaluasi kinerja, dan deployment yang hanya berlaku jika produk menggunakan AI/ML.",
  },
  {
    id: "pembelajaran-berkelanjutan-generatif",
    name: "Pembelajaran Berkelanjutan & Model Generatif",
    description:
      "Persyaratan tambahan bagi model yang terus belajar pascapenerapan, atau bersifat generatif/LLM.",
  },
  {
    id: "bukti-validasi-klinis",
    name: "Bukti & Validasi Klinis",
    description:
      "Tingkat bukti klinis yang disyaratkan berdasarkan tingkat keparahan dan peran software dalam keputusan klinis.",
  },
  {
    id: "penandaan",
    name: "Penandaan",
    description: "Informasi identitas, keselamatan, dan penggunaan yang wajib dicantumkan pada produk.",
  },
  {
    id: "etika-gmlp",
    name: "Etika & Good Machine Learning Practice",
    description:
      "Prinsip etika penyelenggaraan dan sepuluh prinsip praktik pengembangan AI yang baik (GMLP).",
  },
  {
    id: "interoperabilitas-data",
    name: "Interoperabilitas & Perlindungan Data",
    description:
      "Kesiapan integrasi dengan ekosistem data kesehatan nasional dan kepatuhan pada aturan data pribadi.",
  },
  {
    id: "pasca-pemasaran",
    name: "Pasca-Pemasaran",
    description: "Kewajiban yang berlanjut setelah izin edar terbit, bukan hanya pada saat pengajuan.",
  },
];

// Verbatim excerpts, one per category, pulled directly from lib/regulationText.ts.
// Categories not listed here (klasifikasi-administrasi) still open straight
// into their items — not every section needs an introductory quote, only
// the ones where a short clause meaningfully frames what follows.
export const categoryQuotes: Record<string, CategoryQuote> = {
  "klasifikasi-administrasi": {
    quote:
      "Dalam menentukan kesesuaian klasifikasi perangkat lunak sebagai SaMD atau SiMD, penentuan dilakukan dengan menggunakan diagram alir sebagaimana tercantum dalam Gambar 2.1.",
    sourceLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab II.C",
    sourceUrl: KMK_BAB2,
  },
  "dasar-perangkat-lunak": {
    quote:
      "Manajemen puncak harus memastikan bahwa setiap personel yang terlibat dalam pengembangan dan pengelolaan perangkat lunak alat kesehatan memiliki kompetensi yang sesuai, serta didukung oleh keterampilan, pengalaman, dan pelatihan yang memadai.",
    sourceLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab II.E",
    sourceUrl: KMK_BAB2,
  },
  "kecerdasan-buatan": {
    quote:
      "Dokumen yang disampaikan dalam proses pendaftaran Alat Kesehatan dengan aplikasi Kecerdasan Buatan harus memuat informasi terkait desain, pengembangan, validasi, dan pengendalian sistem kecerdasan buatan sebagaimana dirangkum dalam Tabel 3.1.",
    sourceLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.C.7",
    sourceUrl: KMK_BAB3,
  },
  "pembelajaran-berkelanjutan-generatif": {
    quote:
      "Alat Kesehatan Berbasis Perangkat Lunak yang menerapkan continuous machine learning dapat mengalami perubahan perilaku setelah digunakan dalam pelayanan klinis. Dalam proses registrasi izin edar, pelaku usaha wajib menyampaikan dokumen yang menunjukkan mekanisme pengendalian continuous machine learning untuk menjamin bahwa perubahan model tidak memengaruhi keamanan, kinerja, dan tujuan penggunaan perangkat.",
    sourceLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.C.8",
    sourceUrl: KMK_BAB3,
  },
  "bukti-validasi-klinis": {
    quote:
      "Jenis bukti klinis yang digunakan dalam proses evaluasi permohonan izin edar alat kesehatan berbasis perangkat lunak dirangkum dalam tabel yang memuat rekomendasi bukti klinis sesuai dengan karakteristik perangkat lunak sebagaimana tercantum dalam Tabel 3.2.",
    sourceLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.E.4",
    sourceUrl: KMK_BAB3,
  },
  penandaan: {
    quote:
      "Penandaan pada alat kesehatan berbasis perangkat lunak harus memuat informasi yang memadai untuk mendukung identifikasi, keselamatan, serta penggunaan produk secara tepat.",
    sourceLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.F",
    sourceUrl: KMK_BAB3,
  },
  "etika-gmlp": {
    quote:
      "Dalam pengembangan alat kesehatan berbasis perangkat lunak dengan aplikasi kecerdasan buatan atau mesin pembelajaran (AI-ML MD), prinsip Good Machine Learning Practice (GMLP) wajib dilakukan untuk menjamin keamanan, kinerja klinis, mutu, dan efektivitas sepanjang siklus hidup produk.",
    sourceLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab IV.A.2",
    sourceUrl: KMK_BAB4,
  },
  "interoperabilitas-data": {
    quote:
      "Dalam hal alat kesehatan berbasis perangkat lunak akan diintegrasikan dengan Sistem Informasi Kesehatan Nasional, produk harus memenuhi persyaratan sebagai berikut: dirancang sebagai sistem terbuka; mendukung standar interoperabilitas yang berlaku; dan mampu terintegrasi dengan platform nasional pertukaran data kesehatan.",
    sourceLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab IV.A.4",
    sourceUrl: KMK_BAB4,
  },
  "pasca-pemasaran": {
    quote:
      "Pengawasan terhadap izin edar alat kesehatan berbasis perangkat lunak dilakukan oleh Menteri.",
    sourceLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab V",
    sourceUrl: KMK_BAB5,
  },
};

export const checklistItems: ChecklistItem[] = [
  // Klasifikasi & Administrasi
  {
    id: "klasifikasi-1",
    categoryId: "klasifikasi-administrasi",
    title: "Tentukan klasifikasi produk — SaMD, SiMD, atau bukan alat kesehatan — menggunakan alur klasifikasi resmi Kemenkes.",
    explanation:
      "Software yang menyatu dengan dan mengendalikan fungsi sebuah alat disebut SiMD. Software yang berdiri sendiri diuji lewat empat pemeriksaan fungsi sebelum dapat disebut SaMD. Klasifikasi ini menentukan jalur dan kelengkapan dokumen yang diminta selanjutnya.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab II (Gambar 2.1)",
    citationType: "free",
    citationUrl: KMK_BAB2,
    defaultStatus: "belum",
  },
  {
    id: "klasifikasi-2",
    categoryId: "klasifikasi-administrasi",
    title: "Siapkan izin usaha dengan kode KBLI yang sesuai, dan penuhi Cara Pembuatan/Distribusi yang Baik.",
    explanation:
      "Produsen memerlukan izin usaha dengan kode KBLI yang relevan serta memenuhi Cara Pembuatan yang Baik (CPB). Distributor memenuhi Cara Distribusi yang Baik (CDB) sebagai gantinya.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.A.1",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
  },
  {
    id: "klasifikasi-3",
    categoryId: "klasifikasi-administrasi",
    title: "Pastikan produk telah mencapai Tingkat Kesiapan Teknologi (TKT) 9 sebelum mengajukan izin edar.",
    explanation:
      "TKT 9 berarti sistem benar-benar teruji dan terbukti melalui keberhasilan pengoperasian pada kondisi nyata, bukan hanya tervalidasi di laboratorium. Ini adalah syarat mutlak untuk mengajukan izin edar.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab II (Tabel 2.2)",
    citationType: "free",
    citationUrl: KMK_BAB2,
    defaultStatus: "belum",
  },

  // Dasar Perangkat Lunak
  {
    id: "dasar-1",
    categoryId: "dasar-perangkat-lunak",
    title: "Bangun sistem manajemen mutu (SMM) yang mencakup struktur kepemimpinan, proses pendukung siklus hidup, dan proses pengembangan.",
    explanation:
      "SMM sekurang-kurangnya mencakup tiga komponen: struktur kepemimpinan dan organisasi; enam proses pendukung siklus hidup (perencanaan produk, manajemen risiko, pengendalian dokumen, pengendalian konfigurasi, pengukuran dan analisis, pengelolaan alih daya); dan tujuh tahap proses pengembangan dari penetapan kebutuhan hingga penonaktifan. Benchmark internasional untuk SMM ini ada di bawah.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab II.E",
    citationType: "free",
    citationUrl: KMK_BAB2,
    defaultStatus: "belum",
    breakdown: [
      {
        text:
          "Struktur kepemimpinan dan organisasi — manajemen puncak memastikan ketersediaan sumber daya (SDM, infrastruktur, lingkungan kerja) dan kompetensi setiap personel yang terlibat dalam pengembangan/pengelolaan software.",
      },
      {
        text:
          "Enam proses pendukung siklus hidup: (a) perencanaan produk yang dinamis dan diperbarui berkala, (b) manajemen risiko yang terintegrasi sepanjang siklus hidup, (c) pengendalian dokumen & rekaman, (d) manajemen & pengendalian konfigurasi, (e) pengukuran, analisis, dan peningkatan berbasis data pascapemasaran, (f) pengelolaan alih daya — termasuk komponen pihak ketiga (COTS), dengan tanggung jawab keselamatan tetap di pemilik produk.",
      },
      {
        text:
          "Tujuh tahap proses pengembangan: penetapan kebutuhan → desain & pengembangan → verifikasi & validasi → penerapan/implementasi → pemeliharaan & layanan → penonaktifan → (khusus SiMD) SMM mengacu ke alat kesehatan utamanya.",
      },
      {
        text:
          "Benchmark internasional untuk SMM software alat kesehatan secara keseluruhan: ISO 13485:2016. KMK juga merujuk ISO 60601-1/61010-1 (keselamatan listrik/umum), IEC 62366-1 (usability), dan ISO 27001 (keamanan informasi) sebagai standar pendukung lain yang relevan tergantung jenis produk.",
        source: SOURCES.isoManagement,
        actionable: false,
      },
    ],
  },
  {
    id: "dasar-2",
    categoryId: "dasar-perangkat-lunak",
    title: "Susun Dokumen Verifikasi dan Validasi Perangkat Lunak dengan lima komponen wajib.",
    explanation:
      "Kelima komponen minimum: informasi versi perangkat lunak, ketertelusuran, pengendalian perubahan, interoperabilitas, dan keamanan siber. Disusun berdasarkan siklus hidup perangkat lunak per IEC 62304 atau standar setara — rincian isi setiap komponen ada di bawah.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.C.1–2",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    breakdown: [
      {
        text:
          "Informasi versi perangkat lunak — nomor versi yang terdaftar harus tertulis jelas di dokumen dan tampil di label/antarmuka produk itu sendiri, bukan hanya di berkas internal.",
      },
      {
        text:
          "Ketertelusuran (traceability) — setiap kebutuhan (requirement) software harus bisa ditarik garis lurus ke desain, kode, dan hasil pengujian yang memenuhinya, sehingga satu perubahan bisa ditelusuri dampaknya ke seluruh lapisan.",
        source: SOURCES.iecSoftware,
      },
      {
        text:
          "Pengendalian perubahan (change control) — setiap revisi software dicatat, dinilai dampaknya terhadap keselamatan/kinerja, dan disetujui sebelum dirilis; jika versi yang diuji berbeda dari versi yang didaftarkan, wajib ada tabel perbandingan + justifikasi tertulis.",
      },
      {
        text:
          "Interoperabilitas — dokumentasi cara software bertukar data dengan sistem lain (format data, protokol, API) dan hasil pengujian kompatibilitasnya.",
      },
      {
        text:
          "Keamanan siber — identifikasi kerentanan, analisis risiko siber, langkah mitigasi, dan bukti verifikasi bahwa kontrol tersebut benar-benar berfungsi (bukan hanya dirancang di atas kertas).",
      },
      {
        text:
          "Struktur dokumen ini mengikuti siklus hidup software per IEC 62304: rencana pengembangan → analisis kebutuhan → desain arsitektur → desain rinci → implementasi & verifikasi unit → integrasi & pengujian integrasi → pengujian sistem → rilis. Lihat butir \"Pastikan siklus hidup pengembangan mengacu pada IEC 62304\" di bawah untuk rincian setiap tahap.",
        source: SOURCES.iecSoftware,
        actionable: false,
      },
    ],
  },
  {
    id: "dasar-3",
    categoryId: "dasar-perangkat-lunak",
    title: "Jika perangkat terhubung ke sistem, jaringan, atau internet lain, dokumentasikan mekanisme pertukaran data beserta analisis risikonya.",
    explanation:
      "Dokumentasi wajib mencakup kerahasiaan, integritas, dan ketersediaan data; identifikasi kerentanan; analisis risiko; langkah mitigasi; serta bukti verifikasi bahwa kontrol tersebut benar-benar berfungsi.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.C.5",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
  },
  {
    id: "dasar-4",
    categoryId: "dasar-perangkat-lunak",
    title: "Susun dokumen hasil analisis manajemen risiko mengikuti empat tahap: identifikasi hingga pemantauan efektivitas kontrol.",
    explanation:
      "KMK menyebut empat tahap wajib secara singkat. ISO 14971:2019 — standar yang dirujuk Kemenkes sendiri di Bab III.E — memecahnya menjadi langkah yang lebih teknis dan berurutan; rinciannya ada di bawah. Evaluasi ini harus diulang setiap kali ada perubahan pada perangkat lunak.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.E (ISO 14971:2019)",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    breakdown: [
      {
        text:
          "Identifikasi bahaya — mulai dari tujuan penggunaan & kesalahan pakai yang wajar diantisipasi (reasonably foreseeable misuse), lalu identifikasi karakteristik yang berkaitan dengan keselamatan, baru identifikasi hazard dan hazardous situation yang bisa timbul darinya.",
        source: SOURCES.isoRisk,
      },
      {
        text:
          "Estimasi risiko — untuk setiap hazardous situation, perkirakan kemungkinan terjadinya (probability) dan tingkat keparahan dampaknya (severity) jika benar terjadi.",
        source: SOURCES.isoRisk,
      },
      {
        text:
          "Evaluasi risiko — bandingkan hasil estimasi dengan kriteria keberterimaan risiko yang sudah ditetapkan di awal (dalam rencana manajemen risiko), untuk menentukan risiko mana yang perlu dikendalikan lebih lanjut.",
        source: SOURCES.isoRisk,
      },
      {
        text:
          "Pengendalian risiko — pilih opsi kontrol (urutan preferensi: desain yang inheren aman → fitur protektif/peringatan → informasi untuk keselamatan), terapkan, lalu evaluasi ulang risiko residual setelah kontrol diterapkan — termasuk risiko baru yang mungkin muncul akibat kontrol itu sendiri.",
        source: SOURCES.isoRisk,
      },
      {
        text:
          "Evaluasi risiko residual keseluruhan — setelah semua kontrol diterapkan, nilai total risiko yang tersisa secara keseluruhan (bukan satu per satu) dibandingkan manfaat penggunaan produk (benefit-risk analysis), dan dokumentasikan metode serta kriteria keberterimaannya di rencana manajemen risiko.",
        source: SOURCES.isoRisk,
      },
      {
        text:
          "Pemantauan pasca-produksi — kumpulkan dan tinjau informasi dari lapangan (keluhan, KTD, data pasca-pemasaran) secara berkelanjutan, bukan hanya satu kali saat pengajuan; jika ada temuan baru, risiko dievaluasi ulang dan rencana/kontrol diperbarui.",
        source: SOURCES.isoRisk,
      },
    ],
  },
  {
    id: "dasar-5",
    categoryId: "dasar-perangkat-lunak",
    title: "Pastikan siklus hidup pengembangan perangkat lunak mengacu pada IEC 62304 atau standar internasional setara.",
    explanation:
      "IEC 62304 adalah standar acuan utama yang dirujuk berulang kali di seluruh regulasi ini untuk proses siklus hidup software alat kesehatan. Dua hal konkret yang diatur standar ini: klasifikasi kelas keselamatan software, dan delapan tahap proses pengembangan — rinciannya ada di bawah.",
    citationLabel: "IEC 62304:2006+AMD1:2015 (dirujuk di Bab III.B)",
    citationType: "paywalled",
    citationUrl: IEC_62304_URL,
    defaultStatus: "belum",
    breakdown: [
      {
        text:
          "Kelas A — software tidak dapat menyebabkan atau berkontribusi pada hazardous situation apa pun; atau jika bisa, dampaknya tidak menimbulkan cedera atau kerusakan kesehatan.",
        source: SOURCES.iecSoftware,
        actionable: false,
      },
      {
        text:
          "Kelas B — software dapat berkontribusi pada hazardous situation yang berakibat cedera non-serius (non-serious injury).",
        source: SOURCES.iecSoftware,
        actionable: false,
      },
      {
        text:
          "Kelas C — software dapat berkontribusi pada hazardous situation yang berakibat kematian atau cedera serius (serious injury). Kelas ini menuntut kelengkapan proses paling tinggi dari standar; kelas bisa diturunkan dari C ke B, atau B ke A, hanya jika ada kontrol risiko di luar software (misalnya kontrol perangkat keras) yang terbukti menurunkan risiko tersebut ke tingkat yang dapat diterima.",
        source: SOURCES.iecSoftware,
        actionable: false,
      },
      {
        text:
          "Delapan tahap proses pengembangan yang wajib terdokumentasi, berurutan: (1) rencana pengembangan software, (2) analisis kebutuhan software, (3) desain arsitektur software, (4) desain rinci tiap unit software, (5) implementasi & verifikasi tiap unit, (6) integrasi unit & pengujian integrasi, (7) pengujian sistem software secara utuh, (8) rilis software — termasuk pendokumentasian anomali residual yang masih diketahui ada saat rilis.",
        source: SOURCES.iecSoftware,
      },
      {
        text:
          "Setelah rilis, IEC 62304 juga mengatur proses pemeliharaan software (penanganan masukan/feedback pengguna pasca-pemasaran) dan proses pengendalian konfigurasi serta penyelesaian masalah (problem resolution) sebagai proses yang berjalan terus, bukan sekali selesai.",
        source: SOURCES.iecSoftware,
      },
    ],
  },

  // Kecerdasan Buatan
  {
    id: "ai-1",
    categoryId: "kecerdasan-buatan",
    title: "Jelaskan jenis data input, kriteria pemilihan, dan metode pra-pemrosesan dataset.",
    explanation:
      "Dataset dapat berupa citra diagnostik, rekam medis, sinyal fisiologis, riwayat pengobatan, teks medis, atau sumber ilmiah lain. Jika data melalui pra-pemrosesan, metode dan rasional ilmiahnya harus dijelaskan.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Tabel 3.1.A.1",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    condition: "ai",
  },
  {
    id: "ai-2",
    categoryId: "kecerdasan-buatan",
    title: "Dokumentasikan sumber, ukuran, komposisi, dan pembagian dataset pelatihan/validasi/pengujian, termasuk mitigasi bias.",
    explanation:
      "Mencakup proses pelabelan, kurasi, anotasi, penanganan data hilang, konfirmasi tidak ada duplikasi antar pembagian dataset, serta justifikasi kecukupan dataset dan strategi mitigasi bias.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Tabel 3.1.A.2",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    condition: "ai",
  },
  {
    id: "ai-3",
    categoryId: "kecerdasan-buatan",
    title: "Jelaskan arsitektur model AI, kesesuaiannya dengan tujuan penggunaan, serta keterbatasan dan langkah mitigasinya.",
    explanation:
      "Termasuk model atau arsitektur dasar referensi yang dipakai. Evaluasi kinerja model wajib menggunakan dataset pengujian yang independen dari dataset pelatihan.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Tabel 3.1.B.3",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    condition: "ai",
  },
  {
    id: "ai-4",
    categoryId: "kecerdasan-buatan",
    title: "Sertakan hasil evaluasi kinerja model dengan metrik baku: akurasi, confusion matrix, kurva pembelajaran, dan AUC.",
    explanation:
      "Metrik ini wajib disertakan beserta hasil aktualnya, diuji pada dataset yang independen dari data pelatihan.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Tabel 3.1.B.3",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    condition: "ai",
  },
  {
    id: "ai-5",
    categoryId: "kecerdasan-buatan",
    title: "Susun protokol dan laporan pengujian verifikasi dan validasi, termasuk batas penerimaan dan deteksi anomali.",
    explanation:
      "Keterbatasan sistem yang teridentifikasi harus dikomunikasikan secara jelas pada penandaan atau petunjuk penggunaan.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Tabel 3.1.C.4",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    condition: "ai",
  },
  {
    id: "ai-6",
    categoryId: "kecerdasan-buatan",
    title: "Dokumentasikan alur kerja penggunaan, cara interpretasi keluaran, dan mekanisme intervensi manusia.",
    explanation:
      "Termasuk versi perangkat yang didaftarkan dan mekanisme pengelolaan versi untuk ketertelusuran pascapemasaran.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Tabel 3.1.D.7–9",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    condition: "ai",
  },

  // Pembelajaran Berkelanjutan & Model Generatif
  {
    id: "lanjutan-1",
    categoryId: "pembelajaran-berkelanjutan-generatif",
    title: "Jika model terus belajar pascapenerapan, dokumentasikan proses continuous machine learning secara lengkap.",
    explanation:
      "Mencakup alur proses, frekuensi pembaruan, dan parameter yang berubah selama masa penerapan. FDA menyebut dokumen sejenis ini sebagai Predetermined Change Control Plan (PCCP) — kerangkanya berguna sebagai contoh struktur dokumentasi yang lebih matang untuk poin KMK yang masih singkat ini.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.C.9(a)",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    condition: "continuousLearning",
    breakdown: [
      {
        text:
          "Deskripsi proses CML — alur pembaruan model, seberapa sering model diperbarui, dan parameter spesifik mana yang bisa berubah selama penerapan klinis.",
      },
      {
        text:
          "Sebagai referensi struktur yang lebih matang: PCCP FDA memecah dokumentasi perubahan AI menjadi tiga bagian — \"Description of Modifications\" (spesifikasi perubahan yang direncanakan), \"Modification Protocol\" (metode validasi perubahan tersebut, termasuk praktik manajemen data dan praktik pelatihan ulang), dan \"Impact Assessment\" (penilaian manfaat vs risiko dari perubahan). Memetakan dokumentasi CML Anda ke tiga bagian ini membuatnya lebih mudah diaudit.",
        source: SOURCES.fdaPccp,
        actionable: false,
      },
    ],
  },
  {
    id: "lanjutan-2",
    categoryId: "pembelajaran-berkelanjutan-generatif",
    title: "Sediakan mekanisme deteksi dan mitigasi anomali, termasuk kriteria baseline dan prosedur rollback ke versi sebelumnya.",
    explanation:
      "Rollback ke versi model sebelumnya wajib dijelaskan secara eksplisit sebagai bagian dari mekanisme keamanan ini.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.C.9(b)",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    condition: "continuousLearning",
    breakdown: [
      {
        text:
          "Kriteria baseline — tetapkan ambang kinerja (misalnya akurasi minimum) sebagai pembanding; penurunan di bawah ambang ini memicu status anomali.",
      },
      {
        text:
          "Mekanisme deteksi — pemantauan berkelanjutan terhadap keluaran/kinerja model dibandingkan baseline, bukan pemeriksaan satu kali.",
      },
      {
        text:
          "Prosedur rollback — langkah teknis konkret untuk mengembalikan sistem ke versi model sebelumnya yang masih tervalidasi, termasuk siapa yang berwenang memutuskan rollback dan dalam kondisi apa.",
      },
      {
        text:
          "FDA mensyaratkan \"re-training practices\" dan prosedur pembaruan (update procedures) didokumentasikan sebagai bagian dari Modification Protocol — termasuk kriteria penerimaan sebelum versi baru menggantikan versi lama di lingkungan produksi.",
        source: SOURCES.fdaPccp,
        actionable: false,
      },
    ],
  },
  {
    id: "lanjutan-3",
    categoryId: "pembelajaran-berkelanjutan-generatif",
    title: "Susun rencana pengelolaan data dunia nyata yang konsisten dengan karakteristik dataset pelatihan awal.",
    explanation:
      "Kriteria inklusi/eksklusi data baru harus konsisten dengan dataset pelatihan awal untuk meminimalkan bias.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.C.9(c)",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    condition: "continuousLearning",
  },
  {
    id: "lanjutan-4",
    categoryId: "pembelajaran-berkelanjutan-generatif",
    title: "Jika model bersifat generatif atau LLM, sediakan mekanisme pengendalian keluaran dan mitigasi risiko halusinasi.",
    explanation:
      "Dua elemen tambahan yang juga wajib: pembatasan ruang lingkup penggunaan yang jelas, dan metode evaluasi konsistensi serta akurasi informasi medis yang dihasilkan secara berkelanjutan, bukan hanya sekali saat pengajuan.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.C.10",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    condition: "generative",
    breakdown: [
      {
        text:
          "Mekanisme pengendalian keluaran — batasi/validasi apa yang bisa dikeluarkan model sebelum ditampilkan ke pengguna (misalnya memastikan jawaban hanya berasal dari sumber medis yang sudah diverifikasi, pola umum yang dikenal sebagai Retrieval-Augmented Generation/RAG, untuk mengurangi keluaran yang mengada-ada).",
      },
      {
        text:
          "Mitigasi halusinasi — FDA menyebut risiko ini sebagai \"confabulation (or hallucination)\": keluaran yang tampak otentik/meyakinkan tapi secara faktual salah. FDA juga menyoroti risiko terkait: ketidakjelasan batas tujuan penggunaan model generatif, dan keterbatasan visibilitas ke model fondasi pihak ketiga yang mendasarinya — dua hal yang relevan untuk didokumentasikan bersama mitigasi halusinasi.",
        source: SOURCES.fdaGenAi,
      },
      {
        text:
          "Pembatasan ruang lingkup penggunaan — nyatakan secara eksplisit apa yang TIDAK boleh dilakukan model (misalnya tidak untuk diagnosis definitif tanpa tinjauan dokter), bukan hanya apa yang bisa dilakukannya.",
      },
      {
        text:
          "Evaluasi berkelanjutan — metode untuk terus memeriksa konsistensi dan akurasi informasi medis yang dihasilkan sepanjang masa penggunaan, bukan satu kali validasi saat pengajuan izin edar.",
      },
    ],
  },

  // Bukti & Validasi Klinis
  {
    id: "klinis-1",
    categoryId: "bukti-validasi-klinis",
    title: "Tentukan tingkat keparahan klinis dan peran keluaran software dalam keputusan klinis menggunakan Tabel 3.2.",
    explanation:
      "Kombinasi tingkat keparahan (Kritis/Serius/Tidak Serius) dan peran software (menangani & mendiagnosis/mendorong manajemen klinis/memberi informasi) menentukan kombinasi bukti klinis yang wajib dipenuhi. KMK tidak menyediakan rubrik atau contoh terpandu untuk memutuskan baris/kolom mana yang berlaku untuk produk Anda — struktur tabel ini sangat mirip framework IMDRF N12 di bawah, yang menyediakan contoh kategorisasi yang bisa dipakai sebagai acuan tambahan.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Tabel 3.2",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    breakdown: [
      {
        text:
          "Sumbu pertama — tingkat keparahan kondisi klinis yang menjadi sasaran software: Kritis, Serius, atau Tidak Serius.",
        actionable: false,
      },
      {
        text:
          "Sumbu kedua — signifikansi keluaran software terhadap keputusan klinis: \"menangani dan mendiagnosis\" (paling tinggi, langsung mendiagnosis/mengobati), \"mendorong manajemen klinis\", atau \"memberikan informasi manajemen klinis\" (paling rendah, sekadar menginformasikan).",
        actionable: false,
      },
      {
        text:
          "KMK tidak memberi contoh cara memutuskan baris/kolom mana yang berlaku untuk produk Anda. IMDRF N12 menyediakan kerangka kategorisasi risiko SaMD dengan contoh terpandu yang bisa dipakai sebagai referensi tambahan untuk mengisi kekosongan ini — bukan pengganti Tabel 3.2 Kemenkes, melainkan bantuan untuk menafsirkannya.",
          source: SOURCES.imdrfN12,
          actionable: false,
      },
    ],
  },
  {
    id: "klinis-2",
    categoryId: "bukti-validasi-klinis",
    title: "Susun Dokumen Bukti Klinis sesuai kombinasi yang disyaratkan: kajian literatur, perbandingan produk sejenis, dan/atau uji klinik.",
    explanation:
      "Regulasi tidak mencantumkan jumlah pasien atau formula besar sampel untuk uji klinik — rujuk ke Pedoman Uji Klinik Alat Kesehatan terpisah, praktik statistik uji klinis standar, atau kerangka evaluasi WHO di bawah untuk memahami apa yang sebenarnya dibuktikan di setiap tahap.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.E",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    breakdown: [
      {
        text:
          "Kajian literatur ilmiah (a) — menjawab \"apakah ada penjelasan ilmiah yang masuk akal untuk use-case produk ini?\". WHO menyebut tahap ini sebagai valid clinical association, dibuktikan lewat tinjauan literatur ilmiah, bukan pengujian langsung pada produk.",
        source: SOURCES.whoEvidence,
      },
      {
        text:
          "Perbandingan dengan produk sejenis (b) — mendekati apa yang WHO sebut technical/analytical validation: menjawab \"apakah software berperilaku benar dalam kondisi pengujian?\", lewat pengujian verifikasi terhadap spesifikasi kinerja teknis, termasuk membandingkan dengan produk sejenis yang sudah di pasaran.",
        source: SOURCES.whoEvidence,
      },
      {
        text:
          "Hasil uji klinik (c) — setara dengan clinical validation menurut WHO: menjawab \"apakah software berperilaku benar dalam kondisi klinis nyata?\", dibuktikan lewat studi klinis (clinical investigation) dan/atau pemantauan klinis pasca-pemasaran (post-market clinical follow-up) — bukan hanya pengujian satu kali di laboratorium.",
        source: SOURCES.whoEvidence,
      },
      {
        text:
          "Besar sampel/jumlah pasien untuk uji klinik secara spesifik tidak diatur di KMK ini maupun di kerangka WHO di atas — tentukan lewat Pedoman Uji Klinik Alat Kesehatan Kemenkes (dokumen terpisah) atau kalkulasi power statistik standar berdasarkan outcome utama penelitian Anda.",
        actionable: false,
      },
    ],
  },
  {
    id: "klinis-3",
    categoryId: "bukti-validasi-klinis",
    title: "Jika produk impor dan memenuhi kriteria pemicu, siapkan validasi klinis lokal untuk populasi Indonesia.",
    explanation:
      "Dipicu jika produk dikembangkan atau dilatih ulang dengan data representasi populasi Indonesia, dan/atau menggunakan AI berisiko sedang–tinggi untuk diagnosis, skrining, atau keputusan klinis. Dapat dilakukan di rumah sakit, perguruan tinggi, laboratorium terakreditasi, atau unit teknis Kemenkes, dan hasilnya wajib diajukan dalam 1 tahun sejak izin edar terbit.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.D",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    condition: "importLocalValidation",
  },

  // Penandaan
  {
    id: "penandaan-1",
    categoryId: "penandaan",
    title: "Cantumkan identitas produk pada label: nama produk, nomor versi perangkat lunak, dan identitas pemilik produk.",
    explanation: "Informasi identitas ini wajib tampil pada label maupun antarmuka perangkat lunak itu sendiri.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.F.1 (Tabel 3.3)",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
  },
  {
    id: "penandaan-2",
    categoryId: "penandaan",
    title: "Sertakan informasi keselamatan dan penggunaan yang jelas dan mudah dipahami.",
    explanation:
      "Mencakup tujuan penggunaan, petunjuk penggunaan, informasi kinerja, dan peringatan keselamatan.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.F.2",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
  },
  {
    id: "penandaan-3",
    categoryId: "penandaan",
    title: "Jika produk tidak berbentuk fisik, sertakan tangkapan layar antarmuka beserta URL dan prosedur unduh, instalasi, dan penggunaan.",
    explanation:
      "Berlaku untuk produk yang diunduh atau berbasis web. Tangkapan layar harus menunjukkan elemen identifikasi termasuk nomor versi.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Tabel 3.3",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
  },

  // Etika & Good Machine Learning Practice
  {
    id: "etika-1",
    categoryId: "etika-gmlp",
    title: "Tunjukkan bagaimana sistem mencegah diskriminasi dan bias yang merugikan pengguna atau pasien.",
    explanation:
      "Untuk alat kesehatan berbasis AI, prinsip ini secara khusus mencakup pencegahan rasisme dan perlakuan merugikan lainnya. KMK tidak memberikan metode baku untuk membuktikan hal ini, dan caranya memang berbeda untuk model generatif dibanding model diagnostik — ini adalah area yang paling membutuhkan interpretasi tambahan dari pengembang. Beberapa cara konkret untuk membuktikannya, berdasarkan tipe model, ada di bawah.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab IV.A.1 (prinsip Inklusivitas)",
    citationType: "free",
    citationUrl: KMK_BAB4,
    defaultStatus: "belum",
    condition: "ai",
    breakdown: [
      {
        text:
          "Untuk model diagnostik/klasifikasi — lakukan analisis kinerja per subkelompok (subgroup performance analysis): bandingkan akurasi, sensitivitas, dan spesifisitas model di antara kelompok demografis berbeda (usia, jenis kelamin, wilayah geografis), bukan hanya akurasi rata-rata keseluruhan. Ini adalah bagian dari prinsip \"standar referensi dan evaluasi bias\" di GMLP (lihat butir GMLP di bawah).",
      },
      {
        text:
          "Untuk model generatif/LLM — bias bisa muncul sebagai bahasa yang stereotip atau rekomendasi yang berbeda kualitasnya antar kelompok pasien dalam jawaban yang dihasilkan; evaluasi memerlukan pengujian dengan skenario/prompt yang mewakili populasi beragam, dilakukan berkelanjutan (bukan sekali), sejalan dengan kewajiban evaluasi konsistensi keluaran generatif.",
      },
      {
        text:
          "WHO menekankan bahwa representativitas data pelatihan terhadap populasi sasaran, dan transparansi tentang populasi mana yang TIDAK terwakili dalam data, adalah langkah dasar sebelum klaim \"non-diskriminatif\" bisa dibuktikan.",
        source: SOURCES.whoEthicsLmm,
        actionable: false,
      },
    ],
  },
  {
    id: "etika-2",
    categoryId: "etika-gmlp",
    title: "Pastikan keamanan pengguna, pasien, dan data terjaga sepanjang siklus hidup produk.",
    explanation:
      "Mencakup keamanan siber sepanjang siklus hidup dan pengelolaan data sesuai prinsip keamanan informasi serta perlindungan data pribadi.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab IV.A.1 (prinsip Keamanan)",
    citationType: "free",
    citationUrl: KMK_BAB4,
    defaultStatus: "belum",
    condition: "ai",
  },
  {
    id: "etika-3",
    categoryId: "etika-gmlp",
    title: "Terapkan sepuluh prinsip Good Machine Learning Practice (GMLP), dari kejelasan tujuan penggunaan hingga pemantauan pascapemasaran.",
    explanation:
      "Kemenkes mengadaptasi \"10 Guiding Principles for GMLP\" yang juga dipakai FDA/Health Canada/MHRA, dikelompokkan dalam Gambar 4.1 ke 4 tema: About Process, About Data, About People, Continuous Monitoring. Kesepuluh prinsipnya (a–j), satu per satu, ada di bawah.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab IV.A.2 (Gambar 4.1)",
    citationType: "free",
    citationUrl: KMK_BAB4,
    defaultStatus: "belum",
    condition: "ai",
    breakdown: [
      { text: "(a) Tujuan Penggunaan & Keahlian Multidisiplin — tujuan penggunaan dipahami jelas sejak awal, dan keahlian multidisiplin (klinis + teknis) dilibatkan sepanjang siklus hidup produk." },
      { text: "(b) Praktik Rekayasa Perangkat Lunak dan Mutu — manajemen risiko, pengendalian desain, tata kelola data, dan perlindungan keamanan siber diterapkan sebagai satu kesatuan praktik rekayasa, bukan langkah terpisah-pisah." },
      { text: "(c) Representativitas Data dan Studi Klinis — peserta studi dan dataset mewakili populasi pasien yang dituju, agar hasil evaluasi bisa digeneralisasi dan bias diminimalkan." },
      { text: "(d) Independensi Dataset — pemisahan jelas antara dataset pelatihan, validasi, dan pengujian; tidak boleh ada kebocoran data antar ketiganya." },
      { text: "(e) Standar Referensi dan Evaluasi Bias — gunakan standar referensi yang relevan secara klinis, lakukan identifikasi/analisis/mitigasi bias secara sistematis, termasuk analisis performa per subkelompok (lihat butir pencegahan diskriminasi di atas)." },
      { text: "(f) Desain dan Pemilihan Model — model dipilih sesuai karakteristik data dan tujuan penggunaan; target kinerja bermakna secara klinis, bukan hanya metrik teknis, dan mempertimbangkan manfaat vs risiko." },
      { text: "(g) Evaluasi Kolaborasi Manusia dan AI — faktor manusia ikut dipertimbangkan, termasuk apakah pengguna benar-benar memahami arti keluaran model, bukan hanya sekadar \"ada mekanisme intervensi manusia\"." },
      { text: "(h) Pengujian dalam Kondisi Klinis Relevan — metodologi pengujian memadai untuk membuktikan perangkat aman dan efektif pada kondisi klinis nyata, bukan hanya kondisi laboratorium yang ideal." },
      { text: "(i) Transparansi Informasi kepada Pengguna — info jelas/akurat/esensial tentang tujuan penggunaan, kinerja, batasan model, kebutuhan input data, dan cara mengintegrasikannya ke alur kerja klinis." },
      { text: "(j) Pemantauan Pasca-Pemasaran dan Pengelolaan Perubahan — pemantauan kinerja model berkelanjutan setelah implementasi, plus mekanisme pengendalian perubahan termasuk risiko dari pembaruan/pelatihan ulang." },
    ],
  },
  {
    id: "etika-4",
    categoryId: "etika-gmlp",
    title: "Jaga independensi dan representativitas antar dataset pelatihan, validasi, dan pengujian.",
    explanation:
      "Peserta studi dan dataset harus mewakili populasi pasien yang dituju, dengan pemisahan jelas antara ketiga dataset untuk meminimalkan bias dan memastikan hasil evaluasi dapat digeneralisasi.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab IV.A.2, prinsip c–d",
    citationType: "free",
    citationUrl: KMK_BAB4,
    defaultStatus: "belum",
    condition: "ai",
  },

  // Interoperabilitas & Perlindungan Data
  {
    id: "data-1",
    categoryId: "interoperabilitas-data",
    title: "Rancang sistem sebagai sistem terbuka yang mendukung standar interoperabilitas seperti DICOM, HL7, atau FHIR.",
    explanation:
      "Berlaku jika keluaran alat kesehatan akan terhubung ke ekosistem data kesehatan nasional (SIKN/SATUSEHAT).",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab IV.A.4",
    citationType: "free",
    citationUrl: KMK_BAB4,
    defaultStatus: "belum",
  },
  {
    id: "data-2",
    categoryId: "interoperabilitas-data",
    title: "Pastikan sistem mampu terintegrasi dengan platform nasional pertukaran data kesehatan.",
    explanation: "Syarat ketiga dari integrasi SIKN-SATUSEHAT, setelah desain sistem terbuka dan dukungan standar interoperabilitas.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab IV.A.4",
    citationType: "free",
    citationUrl: KMK_BAB4,
    defaultStatus: "belum",
  },
  {
    id: "data-3",
    categoryId: "interoperabilitas-data",
    title: "Terapkan dasar hukum pemrosesan data pribadi yang sah sesuai UU Pelindungan Data Pribadi.",
    explanation:
      "UU PDP mewajibkan setiap Pengendali Data Pribadi punya dasar hukum yang sah sebelum memproses data — bukan cukup \"pengguna setuju\" secara umum. Data kesehatan pasien juga masuk kategori data pribadi spesifik yang mendapat perlindungan lebih tinggi. Rincian dasar hukum yang bisa dipakai, dan hak subjek data yang harus dipenuhi, ada di bawah.",
    citationLabel: "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, Pasal 4 & 20",
    citationType: "free",
    citationUrl: UU_PDP_URL,
    defaultStatus: "belum",
    breakdown: [
      {
        text:
          "Data kesehatan termasuk \"data pribadi yang bersifat spesifik\" (Pasal 4 ayat 2), bersama data biometrik dan data genetika — kategori ini wajib mendapat perlindungan lebih tinggi dibanding data pribadi umum (nama, jenis kelamin, dll).",
        source: SOURCES.uuPdp,
        actionable: false,
      },
      {
        text:
          "Pilih salah satu dari 6 dasar hukum pemrosesan yang sah (Pasal 20 ayat 2): (a) persetujuan eksplisit subjek data untuk tujuan tertentu; (b) pemenuhan kewajiban perjanjian; (c) pemenuhan kewajiban hukum pengendali data; (d) pelindungan kepentingan vital subjek data (mis. tindakan medis darurat); (e) pelaksanaan tugas kepentingan umum/pelayanan publik; atau (f) kepentingan sah lainnya yang telah mempertimbangkan keseimbangan hak subjek data.",
        source: SOURCES.uuPdp,
      },
      {
        text:
          "Jika dasar hukumnya adalah persetujuan (poin a), wajib disampaikan sebelum pemrosesan: legalitas pemrosesan, tujuan pemrosesan, jenis & relevansi data yang diproses, jangka waktu retensi, dan hak subjek data — dan persetujuan ini harus tertulis/terekam, bisa dibedakan jelas dari syarat & ketentuan lain, serta dalam bahasa yang sederhana.",
        source: SOURCES.uuPdp,
      },
      {
        text:
          "Pastikan subjek data (pasien) bisa menjalankan hak-haknya sesuai Bab IV UU PDP — termasuk hak mendapat informasi, hak mengakses dan memperbaiki datanya, dan hak menarik persetujuan — sebagai bagian dari desain sistem, bukan hanya proses manual di luar sistem.",
        source: SOURCES.uuPdp,
      },
    ],
  },
  {
    id: "data-4",
    categoryId: "interoperabilitas-data",
    title: "Pastikan pengelolaan rekam medis yang dipakai melalui proses anonimisasi atau persetujuan yang sah.",
    explanation: "Berlaku untuk data yang dipakai saat pengembangan maupun saat sistem sudah digunakan di lingkungan klinis.",
    citationLabel: "Permenkes No. 24 Tahun 2022 tentang Rekam Medis",
    citationType: "free",
    citationUrl: PERMENKES_REKAM_MEDIS_URL,
    defaultStatus: "belum",
  },

  // Pasca-Pemasaran
  {
    id: "pasca-1",
    categoryId: "pasca-pemasaran",
    title: "Siapkan proses penanganan keluhan: pengumpulan, pencatatan, evaluasi, dan tindak lanjut.",
    explanation: "Termasuk pelacakan kejadian tidak diinginkan (KTD) dan Field Safety Corrective Action (FSCA).",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab V.A.1(a)",
    citationType: "free",
    citationUrl: KMK_BAB5,
    defaultStatus: "belum",
  },
  {
    id: "pasca-2",
    categoryId: "pasca-pemasaran",
    title: "Jalankan proses pemantauan teknis berkelanjutan untuk kerentanan keamanan dan isu teknis.",
    explanation: "Mencakup isu yang memengaruhi keselamatan maupun kinerja perangkat setelah berada di pasaran.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab V.A.1(b)",
    citationType: "free",
    citationUrl: KMK_BAB5,
    defaultStatus: "belum",
  },
  {
    id: "pasca-3",
    categoryId: "pasca-pemasaran",
    title: "Lakukan validasi klinis pascapemasaran secara berkelanjutan menggunakan data dunia nyata.",
    explanation: "Bagian dari kewajiban yang terus berlanjut, bukan hanya dipenuhi sekali pada saat pengajuan izin edar.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab V.A.1(c)",
    citationType: "free",
    citationUrl: KMK_BAB5,
    defaultStatus: "belum",
  },
  {
    id: "pasca-4",
    categoryId: "pasca-pemasaran",
    title: "Penuhi kewajiban inspeksi lapangan rutin tahunan sesuai ketentuan Kemenkes.",
    explanation: "Kewajiban administratif tahunan yang berlaku selama produk masih beredar.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab V.A.2",
    citationType: "free",
    citationUrl: KMK_BAB5,
    defaultStatus: "belum",
  },
];

// Minimal shape needed to decide visibility — matches QualifyingAnswers in
// lib/useQualifyingAnswers.ts without importing a client-only hook file into
// this plain data module.
export type QualifyingAnswersLike = {
  usesAi: boolean | null;
  continuousLearning: boolean | null;
  generative: boolean | null;
  importLocalValidation: boolean | null;
};

// Whether an item applies to the product being assessed, given the
// qualifying-questionnaire answers. An item with no condition always
// applies (the baseline requirements every product goes through). An
// item whose condition hasn't been answered yet (null) is shown rather
// than hidden, so skipping the questionnaire falls back to "show
// everything" instead of silently hiding sections.
export function isItemVisible(
  item: ChecklistItem,
  answers: QualifyingAnswersLike
): boolean {
  if (!item.condition) return true;
  switch (item.condition) {
    case "ai":
      return answers.usesAi !== false;
    case "continuousLearning":
      return answers.usesAi !== false && answers.continuousLearning !== false;
    case "generative":
      return answers.usesAi !== false && answers.generative !== false;
    case "importLocalValidation":
      return answers.importLocalValidation !== false;
    default:
      return true;
  }
}

// Builds a short, plain-language line listing which categories still have
// visible items that are "Sedang Berjalan" or "Belum Dimulai", for the
// auto-generated ethical-issues line on the printable ethics-context
// summary. Categories with no visible items (filtered out by the
// qualifying answers) or where every visible item is "Selesai" are left out.
export function getOpenIssuesSummary(
  statusMap: Record<string, ChecklistStatus>,
  answers: QualifyingAnswersLike
): string {
  const openCategoryNames: string[] = [];

  for (const category of categories) {
    const itemsInCategory = checklistItems.filter(
      (item) => item.categoryId === category.id && isItemVisible(item, answers)
    );
    const hasOpenItem = itemsInCategory.some(
      (item) => statusMap[item.id] !== "selesai"
    );
    if (hasOpenItem) {
      openCategoryNames.push(category.name);
    }
  }

  if (openCategoryNames.length === 0) {
    return "Seluruh butir checklist pada kerangka ini telah ditandai selesai pada saat dokumen ini dibuat.";
  }

  return `Butir checklist pada kategori berikut masih berjalan atau belum dimulai pada saat dokumen ini dibuat: ${openCategoryNames.join(
    ", "
  )}.`;
}
