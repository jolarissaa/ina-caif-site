import { KEMENKES_SUBMISSION_GUIDE_URL } from "./checklistData";

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
  // (used by "oss-explainer", "form-explainer", and "template-preview"
  // below, none of which have anything on the page yet to point at).
  selector: string | null;
  title: string;
  // May contain the token {KLASIFIKASI} — replaced at render time with the
  // visitor's own product classification ("SiMD"/"SaMD") when known, or a
  // generic fallback otherwise. See TutorialOverlay.
  body: string;
  // "click" steps ask the visitor to click the spotlighted element itself
  // to continue. The overlay never intercepts that click — it just detects
  // it and advances — but it ALSO renders a guaranteed "Buka Sekarang"
  // button that programmatically clicks the real target and advances, so
  // the step never gets stuck on a pixel-perfect click landing exactly
  // on the live-measured target (see TutorialOverlay's handleForceAdvance).
  // Every other step shows a plain "Lanjut" button instead.
  advance: "click" | "button";
  // Where the instruction card sits relative to the spotlighted element.
  // Unused (centered) for selector: null steps.
  placement: "bottom" | "top";
  // Illustration for a selector: null step — a real screenshot plus
  // caption, shown above the body text. Optional highlightBox/
  // highlightArrow draw a pulsing red ring + arrow over a specific area of
  // the image (percentage-positioned so they track the image at any
  // display width) — used only by "form-explainer" to point at the Form
  // A–E tab row; "oss-explainer" and "template-preview" just show a plain
  // screenshot with no overlay.
  image?: {
    src: string;
    alt: string;
    caption: string;
    highlightBox?: { left: string; top: string; width: string; height: string };
    highlightArrow?: { left: string; top: string };
  };
  // Optional "read more" link shown under the body text of a selector:
  // null step.
  externalLink?: { url: string; label: string };
};

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "oss-explainer",
    path: "/checklist",
    selector: null,
    title: "Sebelum mulai: alur OSS RBA dan Regalkes",
    body: "Sejak Februari 2022, pengajuan izin edar alat kesehatan dimulai dari OSS RBA (oss.go.id) lebih dulu — lewat akun OSS milik perusahaan Anda — baru kemudian diteruskan ke sistem Regalkes Kemenkes untuk Form A–E-nya. Checklist di INA-CAIF ini membantu Anda menyiapkan dokumen untuk tahap Regalkes; tahap OSS RBA sendiri tetap perlu dilakukan terpisah, sebelum atau sambil jalan dengan checklist ini.",
    image: {
      src: "/images/oss-rba-flow.png",
      alt: "Alur perizinan: Pelaku Usaha mengajukan lewat OSS, diteruskan ke Regalkes, lalu disetujui atau ditolak",
      caption: "Alur resmi: OSS RBA lebih dulu, lalu diteruskan ke Regalkes Kemenkes untuk Form A–E.",
    },
    externalLink: { url: "/docs/tata-cara-oss-rba.pdf", label: "Lihat alurnya lewat OSS RBA →" },
    advance: "button",
    placement: "bottom",
  },
  {
    id: "form-explainer",
    path: "/checklist",
    selector: null,
    title: "Lanjut: kenalan dengan Form A–E Regalkes",
    body: "Setelah tahap OSS, Anda akan mengisi formulir resmi di e-Regalkes Kemenkes: Form A sampai E, masing-masing diisi online dan dilengkapi dengan berkas yang diunggah lewat tombol \"Pilih File\". Sebagai pengaju {KLASIFIKASI}, Anda akan diminta memberi informasi tentang AI yang juga perlu masuk ke dokumen-dokumen itu. Checklist di halaman ini memakai label \"Form A/B/C/D/E Regalkes\" yang sama persis — menunjukkan dokumen checklist ini nanti dipakai di formulir resmi yang mana.",
    image: {
      src: "/images/form-a-e-screenshot.png",
      alt: "Tangkapan layar e-Regalkes menunjukkan tab Form A, B, C, D, E",
      caption:
        "Tangkapan layar asli dari pedoman Kemenkes — tab Form A–E inilah yang dirujuk badge \"Form A/B/C/D/E Regalkes\" di checklist ini.",
      highlightBox: { left: "12%", top: "56.5%", width: "29%", height: "10%" },
      highlightArrow: { left: "26.5%", top: "41%" },
    },
    externalLink: {
      url: KEMENKES_SUBMISSION_GUIDE_URL,
      label: "Lihat contoh tangkapan layar asli di pedoman Kemenkes →",
    },
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
    id: "template-preview",
    path: "/checklist",
    selector: null,
    title: "Begini isinya kalau Anda klik \"Simpan Template\"",
    body: "Tombol \"Simpan Template\" membuka dokumen contoh di Google Drive — biasanya langsung bisa dibuka dan diedit lewat Google Docs. Kotak kuning di dalamnya menandai bagian yang perlu Anda lengkapi sendiri (tangkapan layar, tabel, bukti teknis lain) — strukturnya sudah disiapkan, tinggal Anda isi. Buat salinannya ke Drive Anda sendiri dulu (File → Buat salinan) sebelum mulai mengisi, supaya versi aslinya tetap bersih untuk dipakai ulang nanti.",
    image: {
      src: "/images/template-preview.png",
      alt: "Contoh template Google Docs dengan kotak kuning berisi instruksi yang perlu dilengkapi",
      caption:
        "Contoh isi salah satu template — kotak kuning bertanda ✎ menandai bagian yang perlu Anda lengkapi sendiri.",
    },
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
