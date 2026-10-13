import Link from "next/link";
import {
  CLASSIFICATION_LABEL,
  CLASSIFICATION_RESULT_TEXT,
  EvidenceTier,
  INFORMATION_ROLE_LABEL,
  InformationRole,
  SEVERITY_LABEL,
  SeverityLevel,
  SoftwareClassification,
} from "@/lib/classification";

type Props = {
  classification: SoftwareClassification;
  severityLevel: SeverityLevel | null;
  informationRole: InformationRole | null;
  evidenceTier: EvidenceTier | null;
};

// The "results" screen Jo asked for: instead of only using the
// questionnaire's answers to silently filter which checklist items show,
// this surfaces what those answers actually resolved to — classification
// per Gambar 2.1, and (for SaMD) the required evidence tier per Tabel
// 3.2 — directly on /checklist, above the checklist itself.
export default function ClassificationSummary({
  classification,
  severityLevel,
  informationRole,
  evidenceTier,
}: Props) {
  return (
    <div className="no-print mt-6 rounded-lg border-l-4 border-brand bg-brand/5 px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">
        Hasil kuesioner profil produk
      </p>
      <p className="mt-1 text-base font-semibold text-ink">
        {CLASSIFICATION_LABEL[classification]}
      </p>
      <p className="mt-1 text-sm leading-[22px] text-ink-muted">
        {CLASSIFICATION_RESULT_TEXT[classification]}
      </p>

      {classification === "SaMD" && evidenceTier && severityLevel && informationRole ? (
        <div className="mt-3 border-t border-brand/20 pt-3">
          <p className="text-sm text-ink">
            Tingkat keparahan: <strong>{SEVERITY_LABEL[severityLevel]}</strong> · Peran keluaran:{" "}
            <strong>{INFORMATION_ROLE_LABEL[informationRole]}</strong>
          </p>
          <p className="mt-1 text-sm leading-[22px] text-ink-muted">
            Bukti klinis yang wajib dipenuhi: kajian literatur ilmiah + perbandingan produk
            sejenis{evidenceTier.trial ? " + hasil uji klinik" : ""}.
          </p>
        </div>
      ) : null}

      <p className="mt-3 text-xs text-ink-muted">
        Berdasarkan{" "}
        <Link href="/regulasi/kmk-951-2026#bab-2" className="font-medium text-brand hover:underline">
          Gambar 2.1
        </Link>
        {classification === "SaMD" ? (
          <>
            {" "}
            dan{" "}
            <Link
              href="/regulasi/kmk-951-2026#bab-3"
              className="font-medium text-brand hover:underline"
            >
              Tabel 3.2
            </Link>
          </>
        ) : null}
        , KMK No. HK.01.07/MENKES/951/2026. Jawaban keliru?{" "}
        <span className="font-medium">Gunakan &quot;Ubah jawaban profil produk&quot; di bawah.</span>
      </p>
    </div>
  );
}
