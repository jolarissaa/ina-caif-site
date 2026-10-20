"use client";

import { useState } from "react";
import { QualifyingAnswers } from "@/lib/useQualifyingAnswers";
import { RINGKASAN_MAX_LENGTH, useEthicsContext } from "@/lib/useEthicsContext";
import { categoryQuotes } from "@/lib/checklistData";
import RegulationQuote from "./RegulationQuote";
import { StampIcon, EthicsIcon } from "./icons";
import {
  CLASSIFICATION_LABEL,
  CLASSIFICATION_RESULT_TEXT,
  INFORMATION_ROLE_LABEL,
  InformationRole,
  SEVERITY_LABEL,
  SeverityLevel,
  deriveClassification,
  deriveEvidenceTier,
} from "@/lib/classification";

type Props = {
  initialAnswers: QualifyingAnswers;
  onSubmit: (answers: Partial<Omit<QualifyingAnswers, "completed">>) => void;
  onSkip: () => void;
  productId?: string;
};

type YesNoFieldProps = {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
};

// Unchanged from before this round — this is the exact card/pill pattern
// Jo said she loves, reused as-is for every new gate below rather than
// introducing a different look for the classification questions.
function YesNoField({ label, value, onChange }: YesNoFieldProps) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface p-4">
      <p className="text-sm leading-[22px] text-ink">{label}</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`rounded-pill px-4 py-1.5 text-sm font-medium ${
            value === true
              ? "bg-brand text-on-brand"
              : "border border-border-subtle text-ink-muted hover:border-brand hover:text-brand"
          }`}
        >
          Ya
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`rounded-pill px-4 py-1.5 text-sm font-medium ${
            value === false
              ? "bg-brand text-on-brand"
              : "border border-border-subtle text-ink-muted hover:border-brand hover:text-brand"
          }`}
        >
          Tidak
        </button>
      </div>
    </div>
  );
}

type ChoiceFieldProps<T extends string> = {
  label: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (value: T) => void;
};

// Same card as YesNoField, just more than two pill options — used for the
// Tabel 3.2 severity/role questions, which aren't yes/no.
function ChoiceField<T extends string>({ label, options, value, onChange }: ChoiceFieldProps<T>) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface p-4">
      <p className="text-sm leading-[22px] text-ink">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-pill px-4 py-1.5 text-left text-sm font-medium ${
              value === opt.value
                ? "bg-brand text-on-brand"
                : "border border-border-subtle text-ink-muted hover:border-brand hover:text-brand"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// A highlighted live-updating preview of what the answers so far resolve
// to — shown inline as soon as there's something to show, instead of only
// telling the person their classification/evidence tier after they finish
// the whole questionnaire (per Jo: "knp ga dikasihtau resultsnya apa?
// harusnya dikasihtau dong").
function ResultPreview({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border-l-4 border-brand bg-brand/5 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">
        Hasil sejauh ini
      </p>
      <div className="mt-1.5 text-sm leading-[20px] text-ink">{children}</div>
    </div>
  );
}

// Purpose picker shown before any gate is answered. The longer "dua tujuan
// sekaligus" framing now lives on the homepage — here it's just the
// explicit choice itself: pick one of the two cards to start. Choosing
// "Komite etik" is what makes the ethics-context fields appear later in
// this same flow (see EthicsContextFields below) instead of only showing
// up behind the export dialog on /checklist.
function PurposeStep({
  onChoose,
  onSkip,
}: {
  onChoose: (purpose: "izin-edar" | "etik") => void;
  onSkip: () => void;
}) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">
        Checklist ini untuk apa?
      </h2>
      <p className="mt-2 text-sm leading-[22px] text-ink-muted">
        Pilih salah satu untuk mulai. Pertanyaan di langkah berikutnya sama untuk keduanya, hanya
        hasil di akhirnya yang beda.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onChoose("izin-edar")}
          className="rounded-md border border-border-subtle bg-surface p-4 text-left hover:border-brand"
        >
          <div className="flex items-center gap-2 text-brand">
            <StampIcon className="h-5 w-5" />
            <p className="text-sm font-semibold text-ink">Menyiapkan izin edar</p>
          </div>
          <p className="mt-2 text-xs leading-[18px] text-ink-muted">
            Lacak dokumen dan bukti yang perlu disiapkan sebelum mengajukan izin edar lewat
            Regalkes Kemenkes.
          </p>
        </button>
        <button
          type="button"
          onClick={() => onChoose("etik")}
          className="rounded-md border border-border-subtle bg-surface p-4 text-left hover:border-brand"
        >
          <div className="flex items-center gap-2 text-brand">
            <EthicsIcon className="h-5 w-5" />
            <p className="text-sm font-semibold text-ink">Komite etik</p>
          </div>
          <p className="mt-2 text-xs leading-[18px] text-ink-muted">
            Untuk produk yang sedang diteliti di RS pendidikan. Anda akan diminta mengisi konteks
            singkat untuk tim etik sebelum masuk ke checklist.
          </p>
        </button>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-medium text-ink-muted hover:text-brand"
        >
          Lewati, tampilkan semua butir
        </button>
      </div>
    </div>
  );
}

// Shown as the last step of the questionnaire only when purpose === "etik"
// — the same "Konteks untuk Tim Etik" fields ExportEthicsDialog used to
// collect after the fact, moved here so they're filled in once, upfront,
// and export can be a single direct action afterward with nothing left to
// ask (see ExportEthicsDialog and the bottom CTA on /checklist).
function EthicsContextFields({ productId }: { productId?: string }) {
  const { context, updateField } = useEthicsContext(productId);
  return (
    <div className="mt-5 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
        Konteks untuk Tim Etik
      </p>
      <p className="text-sm leading-[22px] text-ink-muted">
        Isian ini melengkapi, bukan menggantikan, protokol penelitian resmi yang diajukan ke
        komite etik (KEPKN). Singkat saja, cukup untuk memberi orientasi awal.
      </p>
      <div className="rounded-md border border-border-subtle bg-surface p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <EthicsField
            label="Judul Proyek atau Sistem"
            value={context.judulProyek}
            onChange={(v) => updateField("judulProyek", v)}
          />
          <EthicsField
            label="Institusi"
            value={context.institusi}
            onChange={(v) => updateField("institusi", v)}
          />
          <EthicsField
            label="Nama Peneliti Utama"
            value={context.namaPenelitiUtama}
            onChange={(v) => updateField("namaPenelitiUtama", v)}
          />
          <EthicsField
            label="Lokasi"
            value={context.lokasi}
            onChange={(v) => updateField("lokasi", v)}
          />
          <EthicsField
            label="Perkiraan Waktu Pelaksanaan"
            value={context.perkiraanWaktu}
            onChange={(v) => updateField("perkiraanWaktu", v)}
          />
        </div>
        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Ringkasan Singkat (maksimal {RINGKASAN_MAX_LENGTH} karakter)
          </label>
          <textarea
            value={context.ringkasan}
            onChange={(e) => updateField("ringkasan", e.target.value.slice(0, RINGKASAN_MAX_LENGTH))}
            rows={3}
            className="mt-1.5 w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-sm text-ink"
            placeholder="Jelaskan tujuan dan cara kerja sistem dalam dua sampai tiga kalimat."
          />
          <p className="mt-1 text-right text-xs text-ink-muted">
            {context.ringkasan.length} / {RINGKASAN_MAX_LENGTH}
          </p>
        </div>
      </div>
    </div>
  );
}

function EthicsField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-sm text-ink"
      />
    </div>
  );
}

const SEVERITY_OPTIONS: { value: SeverityLevel; label: string }[] = [
  { value: "kritis", label: "Kritis" },
  { value: "serius", label: "Serius" },
  { value: "tidak-serius", label: "Tidak Serius" },
];

const INFORMATION_ROLE_OPTIONS: { value: InformationRole; label: string }[] = [
  { value: "menangani-mendiagnosis", label: "Menangani dan mendiagnosis" },
  { value: "mendorong-manajemen", label: "Mendorong manajemen klinis" },
  { value: "memberikan-informasi", label: "Memberikan informasi manajemen klinis" },
];

// A short qualifying step shown before the checklist itself: the answers
// decide which categories and items actually apply (e.g. the "Kecerdasan
// Buatan" category only matters if the product uses AI/ML at all), instead
// of presenting the full item list to every visitor regardless of what
// they're building — and, as of this round, walk through the actual
// Gambar 2.1 classification diagram and Tabel 3.2 evidence-tier matrix
// from KMK 951/2026 so the person is told their classification and
// required evidence tier directly, rather than being left to work out
// "klasifikasi-1"/"klinis-1" on their own with no feedback.
export default function QualifyingQuestionnaire({
  initialAnswers,
  onSubmit,
  onSkip,
  productId,
}: Props) {
  // Whether the visitor has picked a purpose and moved past PurposeStep.
  // Defaults to true once any gate already has an answer (e.g. they're
  // revisiting via "Ubah jawaban profil produk") — the picker is a one-time
  // choice, not something a returning visitor should have to click through
  // again to see their own in-progress answers.
  // Also treated as "started" when purpose is already pre-set (e.g. the
  // visitor arrived via one of the homepage's "Izin Edar"/"Komite Etik"
  // entry cards, which call presetProductPurpose() before /checklist ever
  // renders this questionnaire) — PurposeStep is a one-time choice, and if
  // it's already been made for them, asking it again here would be the
  // exact double-ask Jo flagged.
  const [started, setStarted] = useState<boolean>(
    initialAnswers.controlsDeviceFunction !== null ||
      initialAnswers.usesAi !== null ||
      initialAnswers.purpose !== null
  );
  const [purpose, setPurpose] = useState<"izin-edar" | "etik" | null>(initialAnswers.purpose);

  // Gambar 2.1 gates.
  const [controlsDeviceFunction, setControlsDeviceFunction] = useState<boolean | null>(
    initialAnswers.controlsDeviceFunction
  );
  const [actsOnIndividualPatientData, setActsOnIndividualPatientData] = useState<boolean | null>(
    initialAnswers.actsOnIndividualPatientData
  );
  const [acquiresOrAnalyzesSignals, setAcquiresOrAnalyzesSignals] = useState<boolean | null>(
    initialAnswers.acquiresOrAnalyzesSignals
  );
  const [displaysContinuousSignals, setDisplaysContinuousSignals] = useState<boolean | null>(
    initialAnswers.displaysContinuousSignals
  );
  const [providesRiskScoreOrTimeCritical, setProvidesRiskScoreOrTimeCritical] = useState<
    boolean | null
  >(initialAnswers.providesRiskScoreOrTimeCritical);

  // Tabel 3.2 axes.
  const [severityLevel, setSeverityLevel] = useState<SeverityLevel | null>(
    initialAnswers.severityLevel
  );
  const [informationRole, setInformationRole] = useState<InformationRole | null>(
    initialAnswers.informationRole
  );

  // AI/ML profiling — unchanged from before this round.
  const [usesAi, setUsesAi] = useState<boolean | null>(initialAnswers.usesAi);
  const [continuousLearning, setContinuousLearning] = useState<boolean | null>(
    initialAnswers.continuousLearning
  );
  const [generative, setGenerative] = useState<boolean | null>(initialAnswers.generative);
  const [importLocalValidation, setImportLocalValidation] = useState<boolean | null>(
    initialAnswers.importLocalValidation
  );

  const classification = deriveClassification({
    controlsDeviceFunction,
    actsOnIndividualPatientData,
    acquiresOrAnalyzesSignals,
    displaysContinuousSignals,
    providesRiskScoreOrTimeCritical,
  });
  const evidenceTier = classification === "SaMD" ? deriveEvidenceTier(informationRole) : null;

  const classificationAnswered = classification !== null;
  const evidenceAnswered = classification !== "SaMD" || evidenceTier !== null;
  const canSubmit =
    classificationAnswered && evidenceAnswered && usesAi !== null && importLocalValidation !== null;

  if (!started) {
    return (
      <div className="mt-8 max-w-2xl rounded-lg border border-border-subtle bg-surface-alt p-6">
        <PurposeStep
          onChoose={(value) => {
            setPurpose(value);
            setStarted(true);
          }}
          onSkip={onSkip}
        />
      </div>
    );
  }

  return (
    <div className="mt-8 max-w-2xl rounded-lg border border-border-subtle bg-surface-alt p-6">
      <h2 className="font-display text-lg font-semibold text-ink">
        Sebelum mulai, ceritakan tentang produk Anda
      </h2>
      <p className="mt-2 text-sm leading-[22px] text-ink-muted">
        Jawaban di bawah ini mengikuti diagram alir klasifikasi dan tabel bukti klinis resmi
        Kemenkes, lalu menyaring checklist supaya hanya menampilkan butir yang relevan untuk
        produk Anda — jawaban tersimpan di perangkat ini dan dapat diubah kapan saja.
      </p>

      <div className="mt-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Klasifikasi produk (Gambar 2.1)
        </p>

        <RegulationQuote {...categoryQuotes["klasifikasi-administrasi"]} />

        <YesNoField
          label="Apakah ada perangkat lunak di dalam alat kesehatan yang berfungsi untuk mengontrol kinerja atau memberikan fungsi tertentu pada alat kesehatan tersebut?"
          value={controlsDeviceFunction}
          onChange={(value) => {
            setControlsDeviceFunction(value);
            setActsOnIndividualPatientData(null);
            setAcquiresOrAnalyzesSignals(null);
            setDisplaysContinuousSignals(null);
            setProvidesRiskScoreOrTimeCritical(null);
          }}
        />

        {controlsDeviceFunction === false ? (
          <YesNoField
            label="Apakah perangkat lunak melakukan tindakan pada data di luar sekadar penyimpanan, pengarsipan, komunikasi, pencarian sederhana, atau kompresi lossless — dan tindakan tersebut ditujukan spesifik untuk pasien per individu?"
            value={actsOnIndividualPatientData}
            onChange={(value) => {
              setActsOnIndividualPatientData(value);
              setAcquiresOrAnalyzesSignals(null);
              setDisplaysContinuousSignals(null);
              setProvidesRiskScoreOrTimeCritical(null);
            }}
          />
        ) : null}

        {actsOnIndividualPatientData === true ? (
          <YesNoField
            label="Apakah perangkat lunak memperoleh, memproses, atau menganalisis data dari: sistem akuisisi sinyal, in vitro diagnostic, pencitraan resonansi magnetik (MRI), pengurutan generasi berikutnya (NGS), pemantauan glukosa berkelanjutan (CGM), atau deteksi/diagnosis berbantuan komputer (CADe/CADx)?"
            value={acquiresOrAnalyzesSignals}
            onChange={(value) => {
              setAcquiresOrAnalyzesSignals(value);
              setDisplaysContinuousSignals(null);
              setProvidesRiskScoreOrTimeCritical(null);
            }}
          />
        ) : null}

        {acquiresOrAnalyzesSignals === false ? (
          <YesNoField
            label="Apakah perangkat lunak berfungsi untuk menampilkan, menganalisis, atau mencetak: sinyal/pola berkelanjutan, gambar medis, bentuk gelombang (seperti EKG), atau pengambilan sampel yang lebih berkelanjutan?"
            value={displaysContinuousSignals}
            onChange={(value) => {
              setDisplaysContinuousSignals(value);
              setProvidesRiskScoreOrTimeCritical(null);
            }}
          />
        ) : null}

        {displaysContinuousSignals === false ? (
          <YesNoField
            label="Apakah perangkat lunak dapat memberikan: skor risiko penyakit atau kondisi, probabilitas penyakit atau kondisi, atau output yang bersifat kritis terhadap waktu?"
            value={providesRiskScoreOrTimeCritical}
            onChange={setProvidesRiskScoreOrTimeCritical}
          />
        ) : null}

        {classification ? (
          <ResultPreview>
            <p className="font-semibold">{CLASSIFICATION_LABEL[classification]}</p>
            <p className="mt-1 text-ink-muted">{CLASSIFICATION_RESULT_TEXT[classification]}</p>
          </ResultPreview>
        ) : null}
      </div>

      {classification === "SaMD" ? (
        <div className="mt-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Tingkat bukti klinis (Tabel 3.2)
          </p>

          <RegulationQuote {...categoryQuotes["bukti-validasi-klinis"]} />

          <ChoiceField
            label="Seberapa parah situasi atau kondisi klinis yang ditangani oleh perangkat lunak Anda?"
            options={SEVERITY_OPTIONS}
            value={severityLevel}
            onChange={setSeverityLevel}
          />
          <ChoiceField
            label="Apa peran keluaran perangkat lunak Anda dalam pengambilan keputusan pelayanan kesehatan?"
            options={INFORMATION_ROLE_OPTIONS}
            value={informationRole}
            onChange={setInformationRole}
          />

          {evidenceTier ? (
            <ResultPreview>
              <p>
                Tingkat keparahan: <strong>{SEVERITY_LABEL[severityLevel as SeverityLevel]}</strong>{" "}
                · Peran keluaran:{" "}
                <strong>{INFORMATION_ROLE_LABEL[informationRole as InformationRole]}</strong>
              </p>
              <p className="mt-1 text-ink-muted">
                Bukti klinis yang wajib dipenuhi: kajian literatur ilmiah + perbandingan produk
                sejenis{evidenceTier.trial ? " + hasil uji klinik" : ""}.
              </p>
            </ResultPreview>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Profil kecerdasan buatan
        </p>

        <YesNoField
          label="Apakah produk Anda menggunakan kecerdasan buatan / machine learning (termasuk model generatif atau LLM)?"
          value={usesAi}
          onChange={(value) => {
            setUsesAi(value);
            if (!value) {
              setContinuousLearning(null);
              setGenerative(null);
            }
          }}
        />

        {usesAi ? (
          <>
            <YesNoField
              label="Apakah model Anda terus belajar atau diperbarui setelah digunakan dalam pelayanan klinis (continuous machine learning)?"
              value={continuousLearning}
              onChange={setContinuousLearning}
            />
            <YesNoField
              label="Apakah model Anda bersifat generatif atau menggunakan Large Language Model (LLM)?"
              value={generative}
              onChange={setGenerative}
            />
          </>
        ) : null}

        <YesNoField
          label="Apakah produk Anda dikembangkan di luar Indonesia dan dilatih ulang dengan data populasi Indonesia, dan/atau menggunakan AI berisiko sedang–tinggi untuk diagnosis, skrining, atau keputusan klinis?"
          value={importLocalValidation}
          onChange={setImportLocalValidation}
        />
      </div>

      {purpose === "etik" ? <EthicsContextFields productId={productId} /> : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() =>
            onSubmit({
              controlsDeviceFunction,
              actsOnIndividualPatientData,
              acquiresOrAnalyzesSignals,
              displaysContinuousSignals,
              providesRiskScoreOrTimeCritical,
              severityLevel,
              informationRole,
              usesAi,
              continuousLearning,
              generative,
              importLocalValidation,
              purpose,
            })
          }
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Lihat Checklist
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-medium text-ink-muted hover:text-brand"
        >
          Lewati, tampilkan semua butir
        </button>
      </div>
    </div>
  );
}
