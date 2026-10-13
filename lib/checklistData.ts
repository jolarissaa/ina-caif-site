// Example checklist content. This is illustrative only, meant to show the
// structure the real content will follow (step 4 of the build roadmap:
// mapping every item to its exact clause with a verified source link).
// Search-page URLs are used as safe placeholders for the ISO standards,
// which are paywalled and have no free deep link to a specific clause.
// Replace every `url` below with the exact, verified source before this
// goes live.

export type CitationType = "free" | "paywalled";

export type ChecklistStatus = "selesai" | "berjalan" | "belum";

export type ChecklistItem = {
  id: string;
  categoryId: string;
  title: string;
  explanation: string;
  citationLabel: string;
  citationType: CitationType;
  citationUrl: string;
  defaultStatus: ChecklistStatus;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};

// Builds a short, plain-language line listing which categories still have
// items that are "Sedang Berjalan" or "Belum Dimulai", for the auto-generated
// ethical-issues line on the printable ethics-context summary. Categories
// where every item is "Selesai" are left out.
export function getOpenIssuesSummary(
  statusMap: Record<string, ChecklistStatus>
): string {
  const openCategoryNames: string[] = [];

  for (const category of categories) {
    const itemsInCategory = checklistItems.filter(
      (item) => item.categoryId === category.id
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

export const categories: Category[] = [
  {
    id: "izin-edar",
    name: "Izin Edar",
    description:
      "Langkah untuk memperoleh persetujuan resmi Kemenkes sebelum perangkat digunakan di lingkungan klinis.",
  },
  {
    id: "manajemen-risiko",
    name: "Manajemen Risiko",
    description: "Identifikasi, penilaian, dan mitigasi risiko sistem AI secara terstruktur.",
  },
  {
    id: "validasi-klinis",
    name: "Validasi Klinis",
    description: "Bukti bahwa sistem AI aman dan berfungsi sesuai tujuan klinisnya.",
  },
  {
    id: "dokumentasi-teknis",
    name: "Dokumentasi Teknis",
    description: "Berkas yang menjelaskan desain, pengembangan, dan pengujian sistem secara teknis.",
  },
  {
    id: "perlindungan-data",
    name: "Perlindungan Data",
    description: "Kepatuhan terhadap aturan data pribadi dan rekam medis pasien.",
  },
];

export const checklistItems: ChecklistItem[] = [
  {
    id: "izin-edar-1",
    categoryId: "izin-edar",
    title: "Tentukan kelas risiko perangkat sesuai klasifikasi Kemenkes untuk software berbasis AI.",
    explanation:
      "Kelas risiko menentukan jalur dan tingkat kelengkapan dokumen yang diminta saat pengajuan izin edar.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026",
    citationType: "free",
    citationUrl: "https://jdih.kemkes.go.id/search?q=HK.01.07%2FMENKES%2F951%2F2026",
    defaultStatus: "selesai",
  },
  {
    id: "izin-edar-2",
    categoryId: "izin-edar",
    title: "Siapkan berkas permohonan sesuai alur registrasi alat kesehatan elektronik Kemenkes.",
    explanation:
      "Berkas ini diajukan melalui sistem registrasi resmi Kemenkes sebelum perangkat dapat dipasarkan atau digunakan.",
    citationLabel: "KMK No. HK.01.07/MENKES/951/2026",
    citationType: "free",
    citationUrl: "https://jdih.kemkes.go.id/search?q=HK.01.07%2FMENKES%2F951%2F2026",
    defaultStatus: "berjalan",
  },
  {
    id: "manajemen-risiko-1",
    categoryId: "manajemen-risiko",
    title: "Susun proses manajemen risiko untuk seluruh siklus hidup sistem, bukan hanya saat peluncuran.",
    explanation:
      "Mencakup identifikasi bahaya, estimasi risiko, evaluasi, dan kontrol risiko yang didokumentasikan dan ditinjau ulang secara berkala.",
    citationLabel: "ISO 14971:2019, klausul 4",
    citationType: "paywalled",
    citationUrl: "https://www.iso.org/search.html?q=ISO%2014971",
    defaultStatus: "berjalan",
  },
  {
    id: "manajemen-risiko-2",
    categoryId: "manajemen-risiko",
    title: "Identifikasi potensi bias dan dampaknya terhadap kelompok pasien tertentu.",
    explanation:
      "Sistem AI perlu diuji terhadap performa yang tidak merata antar kelompok pasien, bukan hanya akurasi rata-rata.",
    citationLabel: "WHO, Generating Evidence for AI-Based Medical Devices (2021)",
    citationType: "free",
    citationUrl: "https://www.who.int/publications/i/item/9789240029200",
    defaultStatus: "belum",
  },
  {
    id: "validasi-klinis-1",
    categoryId: "validasi-klinis",
    title: "Validasi performa model pada data yang berasal dari luar set data pelatihan.",
    explanation:
      "Validasi hanya pada data pelatihan sendiri tidak cukup untuk menunjukkan performa di dunia nyata.",
    citationLabel: "IEC 62304:2006+AMD1:2015, klausul 5.7",
    citationType: "paywalled",
    citationUrl: "https://www.iso.org/search.html?q=IEC%2062304",
    defaultStatus: "belum",
  },
  {
    id: "validasi-klinis-2",
    categoryId: "validasi-klinis",
    title: "Rencanakan pemantauan performa pasca-penggunaan, termasuk kondisi untuk melatih ulang model.",
    explanation:
      "Mencakup rencana perubahan terkendali (PCCP) agar pembaruan model tetap dapat ditelusuri dan diaudit.",
    citationLabel: "FDA, Predetermined Change Control Plan Guidance (2025)",
    citationType: "free",
    citationUrl: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents",
    defaultStatus: "belum",
  },
  {
    id: "dokumentasi-teknis-1",
    categoryId: "dokumentasi-teknis",
    title: "Dokumentasikan arsitektur sistem, sumber data pelatihan, dan batasan penggunaan yang dimaksud.",
    explanation:
      "Dokumen ini menjadi rujukan utama saat tim etik atau regulator meninjau bagaimana sistem bekerja.",
    citationLabel: "IEC 62304:2006+AMD1:2015, klausul 5.1",
    citationType: "paywalled",
    citationUrl: "https://www.iso.org/search.html?q=IEC%2062304",
    defaultStatus: "berjalan",
  },
  {
    id: "dokumentasi-teknis-2",
    categoryId: "dokumentasi-teknis",
    title: "Siapkan sistem manajemen mutu yang mencakup pengembangan dan pemeliharaan perangkat lunak.",
    explanation:
      "Menunjukkan bahwa proses pengembangan, bukan hanya hasil akhirnya, berjalan secara terstruktur dan terdokumentasi.",
    citationLabel: "ISO 13485:2016",
    citationType: "paywalled",
    citationUrl: "https://www.iso.org/search.html?q=ISO%2013485",
    defaultStatus: "belum",
  },
  {
    id: "perlindungan-data-1",
    categoryId: "perlindungan-data",
    title: "Pastikan data rekam medis yang dipakai melalui proses anonimisasi atau persetujuan yang sah.",
    explanation:
      "Berlaku untuk data yang dipakai saat pengembangan maupun saat sistem sudah digunakan di lingkungan klinis.",
    citationLabel: "Permenkes No. 24 Tahun 2022 tentang Rekam Medis",
    citationType: "free",
    citationUrl: "https://jdih.kemkes.go.id/search?q=Permenkes%2024%20Tahun%202022",
    defaultStatus: "selesai",
  },
  {
    id: "perlindungan-data-2",
    categoryId: "perlindungan-data",
    title: "Terapkan dasar pemrosesan data pribadi yang sah sesuai UU Pelindungan Data Pribadi.",
    explanation:
      "Mencakup dasar hukum pemrosesan, hak subjek data, dan langkah keamanan data selama sistem digunakan.",
    citationLabel: "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi",
    citationType: "free",
    citationUrl: "https://jdih.kemkes.go.id/search?q=UU%2027%20Tahun%202022",
    defaultStatus: "belum",
  },
];
