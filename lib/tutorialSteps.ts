// The guided "Mode Tutorial" walkthrough Jo asked for: a short, game-like
// tour (dimmed overlay + spotlight on one element at a time) shown on
// request via the trigger button in the top-right of the header, rather
// than a wall of onboarding text. See components/TutorialOverlay.tsx for
// the rendering/highlighting mechanics and lib/useTutorial.ts for the
// active/step-index state that survives navigation between the steps below.
//
// Deliberately anchored only to elements that are ALWAYS rendered — the
// homepage's hero/regulation breakdown and the header nav — rather than to
// checklist items, which depend on a product existing and the qualifying
// questionnaire's answers. That keeps the tour reliable for any visitor at
// any point, instead of silently breaking for someone with zero products.
export type TutorialStep = {
  id: string;
  // Exact pathname (as next/navigation's usePathname() returns it) this
  // step's target lives on. The overlay auto-navigates here when a step
  // starts on a different page than the visitor is currently on.
  path: string;
  // CSS selector for the element to spotlight. Matched against
  // data-tutorial="..." attributes placed deliberately on a handful of
  // stable elements, not against any element's own styling classes (those
  // can change without this list needing to follow along).
  selector: string;
  title: string;
  body: string;
  // "click" steps ask the visitor to click the spotlighted element itself
  // to continue (the overlay never intercepts that click — it just detects
  // it and advances) — used for the one step that's a real "klik ini"
  // moment. Every other step shows a "Lanjut" button instead.
  advance: "click" | "button";
  // Where the instruction card sits relative to the spotlighted element.
  placement: "bottom" | "top";
};

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "header-logo",
    path: "/",
    selector: '[data-tutorial="header-logo"]',
    title: "Mulai dari sini",
    body: "INA-CAIF selalu bisa Anda kembali ke sini — halaman utama menjelaskan apa yang dicek checklist ini dan dari regulasi mana asalnya.",
    advance: "button",
    placement: "bottom",
  },
  {
    id: "home-headline",
    path: "/",
    selector: '[data-tutorial="home-headline"]',
    title: "Ini intinya",
    body: "Headline ini merangkum apa yang checklist lakukan: menerjemahkan satu regulasi Kemenkes menjadi langkah-langkah teknis yang bisa Anda tindaklanjuti satu per satu.",
    advance: "button",
    placement: "bottom",
  },
  {
    id: "breakdown-source",
    path: "/",
    selector: '[data-tutorial="breakdown-source"]',
    title: "Satu sumber regulasi",
    body: "Seluruh checklist berasal dari satu dokumen ini — KMK No. HK.01.07/MENKES/951/2026 — bukan dari beberapa sumber yang tersebar.",
    advance: "button",
    placement: "bottom",
  },
  {
    id: "breakdown-segment",
    path: "/",
    selector: '[data-tutorial="breakdown-segment"]',
    title: "Setiap bagian punya rujukan tambahan",
    body: "Badge kecil ini (WHO, FDA, ISO, dst.) menunjukkan lembaga/standar lain yang juga dirujuk kategori ini — warna yang sama muncul lagi di setiap butir checklist dan di Pustaka Regulasi.",
    advance: "button",
    placement: "bottom",
  },
  {
    id: "nav-pustaka",
    path: "/",
    selector: '[data-tutorial="nav-pustaka"]',
    title: "Klik ini",
    body: "Setiap kotak sumber pada checklist bisa dibuka — klik \"Pustaka Regulasi\" di sini untuk melihat ke mana semua rujukan itu sebenarnya membawa Anda.",
    advance: "click",
    placement: "bottom",
  },
  {
    id: "pustaka-who",
    path: "/regulasi",
    selector: '[data-tutorial="pustaka-who"]',
    title: "Dikelompokkan per lembaga",
    body: "Pustaka Regulasi mengelompokkan setiap rujukan per lembaga/standar penerbit — WHO, FDA, IMDRF, dan seterusnya — warnanya sama seperti badge yang Anda lihat di checklist. Scroll ke bawah untuk melihat kelompok lainnya.",
    advance: "button",
    placement: "bottom",
  },
  {
    id: "pustaka-paywalled",
    path: "/regulasi",
    selector: '[data-tutorial="pustaka-paywalled"]',
    title: "Arti label \"Berbayar\"",
    body: "Standar seperti ISO dan IEC tidak bisa dibaca gratis — label ini menandakan Anda perlu membeli dokumen resminya dari penerbit. Checklist tetap menjelaskan apa isinya secara teknis, meski tidak bisa mengutip teks lengkapnya.",
    advance: "button",
    placement: "top",
  },
];
