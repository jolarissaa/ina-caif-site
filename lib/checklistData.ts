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
const UU_PDP_URL = "https://jdih.kemkes.go.id/search?q=UU%2027%20Tahun%202022";
const PERMENKES_REKAM_MEDIS_URL =
  "https://jdih.kemkes.go.id/search?q=Permenkes%2024%20Tahun%202022";
const ISO_14971_URL = "https://www.iso.org/search.html?q=ISO%2014971";
const IEC_62304_URL = "https://www.iso.org/search.html?q=IEC%2062304";

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
      "SMM sekurang-kurangnya mencakup tiga komponen: struktur kepemimpinan dan organisasi; enam proses pendukung siklus hidup (perencanaan produk, manajemen risiko, pengendalian dokumen, pengendalian konfigurasi, pengukuran dan analisis, pengelolaan alih daya); dan tujuh tahap proses pengembangan dari penetapan kebutuhan hingga penonaktifan.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab II.E",
    citationType: "free",
    citationUrl: KMK_BAB2,
    defaultStatus: "belum",
  },
  {
    id: "dasar-2",
    categoryId: "dasar-perangkat-lunak",
    title: "Susun Dokumen Verifikasi dan Validasi Perangkat Lunak dengan lima komponen wajib.",
    explanation:
      "Kelima komponen minimum: informasi versi perangkat lunak, ketertelusuran, pengendalian perubahan, interoperabilitas, dan keamanan siber. Disusun berdasarkan siklus hidup perangkat lunak per IEC 62304 atau standar setara.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.C.1–2",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
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
      "Empat tahap wajib: identifikasi bahaya, estimasi dan evaluasi risiko, penerapan langkah pengendalian risiko, dan pemantauan efektivitas pengendalian. Evaluasi ini harus diulang setiap kali ada perubahan pada perangkat lunak.",
    citationLabel: "ISO 14971:2019 (dirujuk di Bab III.E)",
    citationType: "paywalled",
    citationUrl: ISO_14971_URL,
    defaultStatus: "belum",
  },
  {
    id: "dasar-5",
    categoryId: "dasar-perangkat-lunak",
    title: "Pastikan siklus hidup pengembangan perangkat lunak mengacu pada IEC 62304 atau standar internasional setara.",
    explanation:
      "IEC 62304 adalah standar acuan utama yang dirujuk berulang kali di seluruh regulasi ini untuk proses siklus hidup software alat kesehatan.",
    citationLabel: "IEC 62304:2006+AMD1:2015 (dirujuk di Bab III.B)",
    citationType: "paywalled",
    citationUrl: IEC_62304_URL,
    defaultStatus: "belum",
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
      "Mencakup alur proses, frekuensi pembaruan, dan parameter yang berubah selama masa penerapan.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.C.9(a)",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
    condition: "continuousLearning",
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
  },

  // Bukti & Validasi Klinis
  {
    id: "klinis-1",
    categoryId: "bukti-validasi-klinis",
    title: "Tentukan tingkat keparahan klinis dan peran keluaran software dalam keputusan klinis menggunakan Tabel 3.2.",
    explanation:
      "Kombinasi tingkat keparahan (Kritis/Serius/Tidak Serius) dan peran software (menangani & mendiagnosis/mendorong manajemen klinis/memberi informasi) menentukan kombinasi bukti klinis yang wajib dipenuhi.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Tabel 3.2",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
  },
  {
    id: "klinis-2",
    categoryId: "bukti-validasi-klinis",
    title: "Susun Dokumen Bukti Klinis sesuai kombinasi yang disyaratkan: kajian literatur, perbandingan produk sejenis, dan/atau uji klinik.",
    explanation:
      "Regulasi tidak mencantumkan jumlah pasien atau formula besar sampel untuk uji klinik — rujuk ke Pedoman Uji Klinik Alat Kesehatan terpisah atau praktik statistik uji klinis standar untuk menentukan besar sampel.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab III.E",
    citationType: "free",
    citationUrl: KMK_BAB3,
    defaultStatus: "belum",
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
      "Untuk alat kesehatan berbasis AI, prinsip ini secara khusus mencakup pencegahan rasisme dan perlakuan merugikan lainnya. Regulasi tidak memberikan metode baku untuk membuktikan hal ini, dan caranya berbeda untuk model generatif dibanding model diagnostik — ini adalah area yang paling membutuhkan interpretasi tambahan dari pengembang.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab IV.A.1 (prinsip Inklusivitas)",
    citationType: "free",
    citationUrl: KMK_BAB4,
    defaultStatus: "belum",
    condition: "ai",
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
      "Sepuluh prinsip: tujuan penggunaan & keahlian multidisiplin, praktik rekayasa & mutu, representativitas data, independensi dataset, standar referensi & evaluasi bias, desain & pemilihan model, evaluasi kolaborasi manusia-AI, pengujian dalam kondisi klinis relevan, transparansi informasi kepada pengguna, dan pemantauan pascapemasaran.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026, Bab IV.A.2 (Gambar 4.1)",
    citationType: "free",
    citationUrl: KMK_BAB4,
    defaultStatus: "belum",
    condition: "ai",
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
    explanation: "Mencakup dasar hukum pemrosesan, hak subjek data, dan langkah keamanan data selama sistem digunakan.",
    citationLabel: "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi",
    citationType: "free",
    citationUrl: UU_PDP_URL,
    defaultStatus: "belum",
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
