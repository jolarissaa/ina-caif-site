// The guided "Mode Tutorial" walkthrough, redesigned per Jo to live on
// /checklist instead of the homepage — it now walks through an actual
// product's checklist (progress panel, a sample item's controls, an
// expanded item's detail, the Form Regalkes badges, and the technical
// breakdown) rather than the homepage's always-rendered marketing
// elements. See components/TutorialOverlay.tsx for the rendering/
// highlighting mechanics and lib/useTutorial.ts for the active/step-index
// state that survives navigation between steps.
//
// Every selector below is matched against a data-tutorial="..." attribute
// placed deliberately on one specific checklist item (klasifikasi-2,
// klasifikasi-3, or dasar-1 — see components/ChecklistItem.tsx) chosen as
// a stable worked example, exactly like Jo walked through in her own
// screenshots. The tour requires a product with its qualifying
// questionnaire already answered (so these items are actually visible and
// in their default order) — see components/TutorialTrigger.tsx for how a
// visitor with no product yet is routed to /produk first instead.
export type TutorialStep = {
  id: string;
  // Exact pathname (as next/navigation's usePathname() returns it) this
  // step's target lives on. The overlay auto-navigates here when a step
  // starts on a different page than the visitor is currently on.
  path: string;
  // CSS selector for the element to spotlight, or null for a step with no
  // target — rendered as a centered intro card instead of a spotlight ring
  // (used only by "form-explainer" below, which has nothing on the page to
  // point at yet).
  selector: string | null;
  title: string;
  // May contain the token {KLASIFIKASI} — replaced at render time with the
  // visitor's own product classification ("SiMD"/"SaMD") when known, or a
  // generic fallback otherwise. See TutorialOverlay.
  body: string;
  // "click" steps ask the visitor to click the spotlighted element itself
  // to continue (the overlay never intercepts that click — it just detects
  // it and advances). Every other step shows a "Lanjut" button instead.
  advance: "click" | "button";
  // Where the instruction card sits relative to the spotlighted element.
  placement: "bottom" | "top";
};

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "form-explainer",
    path: "/checklist",
    selector: null,
    title: "Sebelum mulai: kenalan dengan Form A–E Regalkes",
    body: "Saat benar-benar mengajukan izin edar, Anda akan mengisi formulir resmi di e-Regalkes Kemenkes: Form A sampai E, masing-masing diisi online dan dilengkapi dengan berkas yang diunggah lewat tombol \"Pilih File\". Sebagai pengaju {KLASIFIKASI}, Anda akan diminta memberi informasi tentang AI yang juga perlu masuk ke dokumen-dokumen itu. Checklist di halaman ini memakai label \"Form A/B/C/D/E Regalkes\" yang sama persis — menunjukkan dokumen checklist ini nanti dipakai di formulir resmi yang mana.",
    advance: "button",
    placement: "bottom",
  },
  {
    id: "category-progress",
    path: "/checklist",
    selector: '[data-tutorial="category-progress-panel"]',
    title: "Tahapan yang perlu diperhatikan",
    body: "Berdasarkan regulasi Kemenkes, ada beberapa tahap yang harus diperhatikan sebelum mengajukan izin edar. Panel ini melacak progres Anda di tiap tahap — klik salah satu untuk melihat daftar butirnya.",
    advance: "button",
    placement: "bottom",
  },
  {
    id: "item-main-text",
    path: "/checklist",
    selector: '[data-tutorial="item-main-text"]',
    title: "Ini yang perlu Anda perhatikan",
    body: "Setiap butir checklist dimulai dari kalimat seperti ini, menjelaskan satu hal konkret yang perlu disiapkan atau dipenuhi.",
    advance: "button",
    placement: "bottom",
  },
  {
    id: "item-status-control",
    path: "/checklist",
    selector: '[data-tutorial="item-status-control"]',
    title: "Tandai progresnya di sini",
    body: "Ubah status jadi \"Sedang Berjalan\" atau \"Selesai\" sesuai kondisi Anda saat ini. Status ini yang dihitung di panel progres sebelumnya.",
    advance: "button",
    placement: "bottom",
  },
  {
    id: "item-expand-button",
    path: "/checklist",
    selector: '[data-tutorial="item-expand-button"]',
    title: "Klik untuk membuka detailnya",
    body: "Coba klik butir ini (contoh: TKT 9) untuk melihat penjelasan lengkap dan sumber rujukannya.",
    advance: "click",
    placement: "bottom",
  },
  {
    id: "item-tkt9-detail",
    path: "/checklist",
    selector: '[data-tutorial="item-tkt9-detail"]',
    title: "Penjelasan, rujukan, dan tautan tambahan",
    body: "Begini isi satu butir setelah dibuka: penjelasan singkat, rujukan regulasinya, lalu beberapa tautan tambahan di bagian \"Kunjungi tautan berikut\" kalau Anda ingin membaca lebih dalam. Semua tautan ini bisa diklik langsung.",
    advance: "button",
    placement: "top",
  },
  {
    id: "item-dasar1-expand-button",
    path: "/checklist",
    selector: '[data-tutorial="item-dasar1-expand-button"]',
    title: "Sekarang coba butir ini",
    body: "Geser ke kategori \"Dasar Perangkat Lunak\", lalu klik butir pertamanya (sistem manajemen mutu) untuk lihat satu contoh lagi.",
    advance: "click",
    placement: "bottom",
  },
  {
    id: "item-dasar1-citation",
    path: "/checklist",
    selector: '[data-tutorial="item-dasar1-citation"]',
    title: "Klik untuk lihat lokasinya di regulasi lengkap",
    body: "Kutipan seperti ini bisa diklik — Anda akan dibawa langsung ke bagian itu di teks lengkap Pustaka Regulasi, bukan cuma ke nama babnya saja.",
    advance: "button",
    placement: "bottom",
  },
  {
    id: "item-form-badge",
    path: "/checklist",
    selector: '[data-tutorial="item-form-badge"]',
    title: "\"Form A\" di sini bukan satu file yang sama",
    body: "Beberapa butir checklist lain juga berlabel \"Form A Regalkes\" — artinya semua butir itu nanti bermuara ke formulir resmi yang sama di e-Regalkes, bukan berarti template dokumennya identik. Tombol \"Simpan Template\" di tiap butir tetap mengarah ke file yang berbeda-beda, sesuai isinya masing-masing.",
    advance: "button",
    placement: "bottom",
  },
  {
    id: "item-rincian-teknis",
    path: "/checklist",
    selector: '[data-tutorial="item-rincian-teknis"]',
    title: "Pelacak isi dokumen",
    body: "\"Rincian teknis\" memecah satu butir jadi bagian-bagian yang lebih kecil — centang tiap bagian yang sudah Anda tuliskan di dokumen aslinya, supaya progresnya tetap akurat meski dokumennya belum sepenuhnya selesai.",
    advance: "button",
    placement: "bottom",
  },
  {
    id: "item-iso-badge",
    path: "/checklist",
    selector: '[data-tutorial="item-iso-badge"]',
    title: "Standar berbayar, tetap bisa dibuka",
    body: "Badge seperti ini bisa diklik untuk melihat atau membeli standarnya langsung dari penerbit resmi (ISO/IEC) — checklist tetap menjelaskan isinya secara teknis, meski tidak bisa mengutip teks lengkapnya.",
    advance: "button",
    placement: "top",
  },
];
