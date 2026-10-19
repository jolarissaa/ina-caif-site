// Pure derivation logic for the product classification (Gambar 2.1) and
// clinical evidence tier (Tabel 3.2) from KMK No. HK.01.07/MENKES/951/2026.
// Kept separate from useQualifyingAnswers.ts (a client hook with
// localStorage/useState) so this plain logic can be unit-reasoned-about and
// imported anywhere, mirroring the QualifyingAnswersLike pattern already
// used in lib/checklistData.ts for the same reason.
//
// Both functions are read straight off the actual diagram/table in the
// regulation (pages 9 and 23-24 of the KMK PDF), not paraphrased from a
// summary:
//
// Gambar 2.1 is a 5-gate sequential decision tree — each gate either exits
// with a verdict or falls through to the next gate:
//   1. "Apakah perangkat lunak ... berfungsi untuk mengontrol kinerja atau
//      memberikan fungsi tertentu pada alat kesehatan?" Ya -> SiMD.
//   2. (if Tidak) "Apakah perangkat lunak melakukan tindakan pada data [di
//      luar penyimpanan/pengarsipan/komunikasi/pencarian
//      sederhana/lossless compression], ditujukan spesifik untuk pasien
//      per individu?" Tidak -> Bukan Alat Kesehatan.
//   3. (if Ya) "Apakah ... memperoleh, memproses, atau menganalisis [sinyal
//      akuisisi / IVD / MRI / NGS / CGM / CADe-CADx]?" Ya -> SaMD.
//   4. (if Tidak) "Apakah ... menampilkan, menganalisis, atau mencetak
//      [sinyal/pola berkelanjutan / gambar medis / EKG / pengambilan
//      sampel berkelanjutan]?" Ya -> SaMD.
//   5. (if Tidak) "Apakah ... dapat memberikan [skor risiko / probabilitas
//      penyakit / output kritis terhadap waktu]?" Ya -> SaMD, Tidak -> Bukan
//      Alat Kesehatan.
//
// Tabel 3.2 cross-references severity (Kritis/Serius/Tidak Serius) against
// the significance of the software's output (Menangani dan mendiagnosis /
// Mendorong Manajemen Klinis / Memberikan informasi manajemen klinis). Read
// directly off the table: all three severity rows carry an identical
// pattern — severity does not change the evidence burden here, only the
// column does. "Menangani dan mendiagnosis" needs all three evidence types
// (a. kajian literatur + b. perbandingan produk sejenis + c. uji klinik);
// the other two columns need only a+b.

export type SoftwareClassification = "SaMD" | "SiMD" | "bukan-alkes";
export type SeverityLevel = "kritis" | "serius" | "tidak-serius";
export type InformationRole =
  | "menangani-mendiagnosis"
  | "mendorong-manajemen"
  | "memberikan-informasi";

export type ClassificationAnswersLike = {
  controlsDeviceFunction: boolean | null;
  actsOnIndividualPatientData: boolean | null;
  acquiresOrAnalyzesSignals: boolean | null;
  displaysContinuousSignals: boolean | null;
  providesRiskScoreOrTimeCritical: boolean | null;
};

// Returns null while the gates needed to reach a verdict haven't all been
// answered yet. The questionnaire only ever asks the gate that's actually
// reachable given earlier answers, so a null result always means "still in
// progress," never "unknown/ambiguous."
export function deriveClassification(
  answers: ClassificationAnswersLike
): SoftwareClassification | null {
  const {
    controlsDeviceFunction,
    actsOnIndividualPatientData,
    acquiresOrAnalyzesSignals,
    displaysContinuousSignals,
    providesRiskScoreOrTimeCritical,
  } = answers;

  if (controlsDeviceFunction === null) return null;
  if (controlsDeviceFunction) return "SiMD";

  if (actsOnIndividualPatientData === null) return null;
  if (!actsOnIndividualPatientData) return "bukan-alkes";

  if (acquiresOrAnalyzesSignals === null) return null;
  if (acquiresOrAnalyzesSignals) return "SaMD";

  if (displaysContinuousSignals === null) return null;
  if (displaysContinuousSignals) return "SaMD";

  if (providesRiskScoreOrTimeCritical === null) return null;
  return providesRiskScoreOrTimeCritical ? "SaMD" : "bukan-alkes";
}

export const CLASSIFICATION_LABEL: Record<SoftwareClassification, string> = {
  SaMD: "SaMD — Software as a Medical Device",
  SiMD: "SiMD — Software in a Medical Device",
  "bukan-alkes": "Bukan Alat Kesehatan",
};

export const CLASSIFICATION_RESULT_TEXT: Record<SoftwareClassification, string> = {
  SaMD: "Software Anda berdiri sendiri sebagai alat kesehatan (SaMD). Seluruh persyaratan izin edar pada checklist ini — siklus hidup software, manajemen risiko, bukti klinis, hingga penandaan — berlaku untuk produk Anda.",
  SiMD: "Software Anda menyatu dengan dan mengendalikan fungsi sebuah alat kesehatan fisik (SiMD). Software didaftarkan sebagai aksesoris alat kesehatan utama — persyaratan dan kelas risikonya mengikuti alat kesehatan utama tersebut, bukan jalur SaMD mandiri.",
  "bukan-alkes": "Berdasarkan jawaban Anda, software ini belum memenuhi kriteria sebagai alat kesehatan menurut diagram alir Kemenkes. Sebagian besar persyaratan izin edar pada checklist ini kemungkinan tidak berlaku untuk produk Anda — namun Anda tetap bisa menjelajahi checklist ini sebagai referensi.",
};

export type EvidenceTier = {
  literature: boolean;
  clinical: boolean;
  trial: boolean;
};

// Tabel 3.2 — see the file header note: severity doesn't change this
// particular requirement, only the significance column does.
export function deriveEvidenceTier(informationRole: InformationRole | null): EvidenceTier | null {
  if (!informationRole) return null;
  return {
    literature: true,
    clinical: true,
    trial: informationRole === "menangani-mendiagnosis",
  };
}

export const SEVERITY_LABEL: Record<SeverityLevel, string> = {
  kritis: "Kritis",
  serius: "Serius",
  "tidak-serius": "Tidak Serius",
};

export const INFORMATION_ROLE_LABEL: Record<InformationRole, string> = {
  "menangani-mendiagnosis": "Menangani dan mendiagnosis",
  "mendorong-manajemen": "Mendorong manajemen klinis",
  "memberikan-informasi": "Memberikan informasi manajemen klinis",
};
