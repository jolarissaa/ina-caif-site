// Standar dan aspek etik resmi dari "Pedoman dan Standar Etik Penelitian
// dan Pengembangan Kesehatan Nasional" (Komite Etik Penelitian dan
// Pengembangan Kesehatan Nasional / KEPPKN, Kementerian Kesehatan RI,
// 2021) — dirangkum dan disesuaikan di sini untuk pengembang produk
// kesehatan berbasis AI, bukan dikutip langsung dari buku pedoman (teks
// aslinya berbasis protokol penelitian klinis/subjek manusia yang jauh
// lebih panjang). Dipakai sebagai daftar penilaian mandiri yang
// disertakan dalam Ekspor untuk Komite Etik, supaya komite etik melihat
// produk ini sudah dinilai terhadap kerangka standar yang sama yang
// mereka pakai menelaah protokol penelitian lain — bukan daftar buatan
// sendiri yang asing bagi mereka.
//
// Catatan cakupan (penting): pedoman KEPPKN aslinya ditujukan untuk
// penelitian kesehatan yang melibatkan subjek manusia secara langsung
// (desain uji klinik, randomisasi, plasebo, biobank/bahan biologik
// tersimpan, hewan coba, dsb). INA-CAIF adalah produk perangkat lunak/AI,
// bukan studi semacam itu, sehingga Daftar Tilik (Standar) versi lengkap
// berikut sub-indikatornya yang sangat rinci untuk desain uji klinik
// tidak disalin ke sini. Yang disertakan adalah (a) Standar Kelaikan Etik
// inti yang menurut pedoman tersebut berlaku universal untuk semua
// penelitian/pengembangan kesehatan, dan (b) Aspek Etik Penelitian
// Kecerdasan Buatan (AI) Kesehatan dari Bab V.B.4 pedoman — bagian yang
// secara eksplisit membahas AI dan karenanya paling relevan untuk produk
// ini.

export type EthicsAssessmentStatus = "ya" | "tidak" | "na" | null;

export type EthicsStandardDef = {
  id: string;
  label: string;
  helper: string;
};

// Enam Standar Kelaikan Etik Penelitian inti (lihat Daftar Tilik Standar,
// KEPPKN 2021) — kriteria dasar yang dipakai komite etik untuk menilai
// kelayakan sebuah usulan penelitian/pengembangan kesehatan, dirumuskan
// ulang dengan bahasa produk perangkat lunak alih-alih protokol uji
// klinik.
export const CORE_ETHICS_STANDARDS: EthicsStandardDef[] = [
  {
    id: "nilai-sosial-klinis",
    label: "Nilai Sosial/Klinis",
    helper:
      "Produk ini memberi nilai atau manfaat nyata bagi pelayanan kesehatan, bukan sekadar nilai teknis atau komersial semata.",
  },
  {
    id: "nilai-ilmiah",
    label: "Nilai Ilmiah",
    helper:
      "Metode pengembangan dan validasi produk (desain, data, pengukuran kinerja) mengikuti kaidah ilmiah yang dapat dipertanggungjawabkan.",
  },
  {
    id: "pemerataan-beban-manfaat",
    label: "Pemerataan Beban dan Manfaat",
    helper:
      "Potensi manfaat produk ini sebanding atau lebih besar dari risikonya, dan risiko tersebut sudah diminimalkan sampai tingkat yang wajar.",
  },
  {
    id: "bujukan-eksploitasi",
    label: "Bujukan/Eksploitasi/Inducement",
    helper:
      "Tidak ada unsur bujukan, insentif tidak wajar, atau eksploitasi terhadap pengguna/pasien dalam cara produk ini ditawarkan atau digunakan.",
  },
  {
    id: "rahasia-privasi",
    label: "Rahasia dan Privasi",
    helper:
      "Data pasien yang diproses dijaga kerahasiaannya dan privasinya dilindungi sesuai aturan yang berlaku.",
  },
  {
    id: "informed-consent",
    label: "Informed Consent",
    helper:
      "Ada mekanisme yang jelas untuk memberi tahu dan meminta persetujuan pasien atas penggunaan data mereka oleh sistem ini, sejauh relevan.",
  },
];

// Aspek Etik Penelitian Kecerdasan Buatan (AI) Kesehatan — dirangkum dari
// Bab V.B.4 pedoman KEPPKN 2021, bagian yang membahas AI secara khusus
// (privasi & keamanan data, keandalan, keadilan/inklusivitas,
// transparansi & akuntabilitas, dan peran dewan peninjau/IRB).
export const AI_ETHICS_ASPECTS: EthicsStandardDef[] = [
  {
    id: "privasi-keamanan-data",
    label: "Privasi dan Keamanan Data",
    helper:
      "Data kesehatan yang dipakai sistem AI ini dilindungi secara teknis (mis. enkripsi, de-identifikasi) maupun secara kebijakan, sesuai hukum perlindungan data yang berlaku.",
  },
  {
    id: "persetujuan-penggunaan-data",
    label: "Persetujuan Penggunaan Data untuk AI",
    helper:
      "Ada dasar persetujuan yang jelas bila data pasien dipakai untuk melatih atau mengembangkan model AI, termasuk kemungkinan pemanfaatan lebih lanjut di masa depan.",
  },
  {
    id: "keandalan-keamanan-sistem",
    label: "Keandalan dan Keamanan Sistem",
    helper:
      "Kinerja dan keamanan sistem AI sudah diuji sebelum dipakai pada kondisi nyata, terutama untuk aplikasi yang kritis atau sensitif waktu.",
  },
  {
    id: "keadilan-inklusivitas",
    label: "Keadilan dan Inklusivitas",
    helper:
      "Sistem dirancang dan diuji untuk tidak memperlakukan kelompok pasien tertentu secara tidak adil atau bias (lihat juga kategori Etika & GMLP di checklist utama untuk analisis teknisnya).",
  },
  {
    id: "transparansi-akuntabilitas",
    label: "Transparansi dan Akuntabilitas",
    helper:
      "Cara sistem mengambil atau membantu keputusan dapat dijelaskan secara wajar kepada dokter dan pasien, dan ada pihak yang bertanggung jawab atas keputusan tersebut.",
  },
  {
    id: "pengawasan-etik",
    label: "Pengawasan Etik (Tinjauan Komite)",
    helper:
      "Pengembangan sistem ini sudah, atau akan, ditinjau oleh komite etik/IRB yang relevan — meskipun anggotanya belum tentu ahli AI, mereka tetap dapat memberi pengawasan dan arahan.",
  },
];

export const ETHICS_STATUS_LABEL: Record<Exclude<EthicsAssessmentStatus, null>, string> = {
  ya: "Ya",
  tidak: "Tidak",
  na: "Tidak Berlaku",
};
