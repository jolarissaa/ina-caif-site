type Gate = {
  question: string;
  checklist?: string[];
  yes: { label: string; detail?: string; terminal?: boolean };
  no: { label: string; terminal?: boolean };
};

// Gambar 2.1 Diagram Alir Klasifikasi Alat Kesehatan Berbasis Perangkat
// Lunak (KMK 951/2026, Bab II.C, p.9) — read directly off the diagram
// image in the source PDF and reproduced here as a real sequence instead
// of a static picture, since that page in the original is mostly a
// watermark with small boxes. Each gate either exits with a verdict or
// falls through to the next gate; this is the exact logic
// lib/classification.ts's deriveClassification() runs, laid out so a
// reader can follow the same path by eye.
const GATES: Gate[] = [
  {
    question:
      "Apakah ada perangkat lunak di dalam alat kesehatan yang berfungsi untuk mengontrol kinerja atau memberikan fungsi tertentu pada alat kesehatan tersebut?",
    yes: {
      label: "SiMD",
      detail:
        "Daftar sebagai aksesoris alat kesehatan utama. Persyaratan dan kelas risiko mengikuti alat kesehatan utamanya.",
      terminal: true,
    },
    no: { label: "Lanjut ke gerbang berikutnya" },
  },
  {
    question:
      "Apakah perangkat lunak melakukan tindakan pada data di luar sekadar penyimpanan, pengarsipan, komunikasi, pencarian sederhana, atau kompresi lossless — dan tindakan tersebut ditujukan spesifik untuk pasien per individu?",
    yes: { label: "Lanjut ke gerbang berikutnya" },
    no: { label: "Bukan Alat Kesehatan", terminal: true },
  },
  {
    question: "Apakah perangkat lunak memperoleh, memproses, atau menganalisis:",
    checklist: [
      "Sistem akuisisi sinyal",
      "In Vitro Diagnostic",
      "Pencitraan Resonansi Magnetik (MRI)",
      "Pengurutan Generasi Berikutnya (NGS)",
      "Pemantauan Glukosa Berkelanjutan (CGM)",
      "Deteksi/diagnosis berbantuan komputer (CADe/CADx)",
    ],
    yes: { label: "SaMD", terminal: true },
    no: { label: "Lanjut ke gerbang berikutnya" },
  },
  {
    question: "Apakah software berfungsi untuk menampilkan, menganalisis, atau mencetak:",
    checklist: [
      "Sinyal/pola berkelanjutan",
      "Gambar medis",
      "Bentuk gelombang (seperti EKG)",
      "Pengambilan sampel yang lebih berkelanjutan",
    ],
    yes: { label: "SaMD", terminal: true },
    no: { label: "Lanjut ke gerbang berikutnya" },
  },
  {
    question: "Apakah perangkat lunak dapat memberikan:",
    checklist: [
      "Skor risiko penyakit atau kondisi",
      "Probabilitas penyakit atau kondisi",
      "Output yang bersifat kritis terhadap waktu",
    ],
    yes: { label: "SaMD", terminal: true },
    no: { label: "Bukan Alat Kesehatan", terminal: true },
  },
];

function OutcomeChip({ prefix, outcome }: { prefix: string; outcome: Gate["yes"] | Gate["no"] }) {
  const terminal = "terminal" in outcome && outcome.terminal;
  return (
    <div
      className={`flex items-start gap-2 rounded-md px-3 py-2 text-xs ${
        terminal ? "bg-brand/10 text-brand" : "bg-surface-alt text-ink-muted"
      }`}
    >
      <span className="flex-shrink-0 font-semibold">{prefix} →</span>
      <span>
        <span className="font-semibold">{outcome.label}</span>
        {"detail" in outcome && outcome.detail ? (
          <span className="block font-normal text-ink-muted">{outcome.detail}</span>
        ) : null}
      </span>
    </div>
  );
}

export default function ClassificationFlowchart() {
  return (
    <div className="space-y-3">
      {GATES.map((gate, i) => (
        <div key={i} className="rounded-md border border-border-subtle bg-surface p-4">
          <p className="text-xs font-semibold text-ink-muted">Gerbang {i + 1}</p>
          <p className="mt-1 text-sm leading-[22px] text-ink">{gate.question}</p>
          {gate.checklist ? (
            <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm leading-[20px] text-ink-muted">
              {gate.checklist.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          ) : null}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <OutcomeChip prefix="Ya" outcome={gate.yes} />
            <OutcomeChip prefix="Tidak" outcome={gate.no} />
          </div>
        </div>
      ))}
    </div>
  );
}
