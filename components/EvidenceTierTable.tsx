import {
  INFORMATION_ROLE_LABEL,
  InformationRole,
  SEVERITY_LABEL,
  SeverityLevel,
  deriveEvidenceTier,
} from "@/lib/classification";

const ROWS: SeverityLevel[] = ["kritis", "serius", "tidak-serius"];
const COLUMNS: InformationRole[] = [
  "menangani-mendiagnosis",
  "mendorong-manajemen",
  "memberikan-informasi",
];

// A real HTML rendering of Tabel 3.2 (KMK 951/2026, Bab III.E.4), instead of
// leaving readers to parse it out of the run-on extracted text. Cell
// content is computed from the same deriveEvidenceTier() the Compliance
// Checker itself uses, so the table and the live results card can never
// drift apart. Read directly off the source PDF: every severity row
// carries the identical pattern — only the significance column changes
// what's owed.
export default function EvidenceTierTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-subtle">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="bg-surface-alt text-left">
            <th className="border-b border-r border-border-subtle p-3 align-bottom font-semibold text-ink">
              Tingkat keparahan situasi/kondisi
            </th>
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="border-b border-border-subtle p-3 align-bottom font-semibold text-ink"
              >
                {INFORMATION_ROLE_LABEL[col]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row} className="odd:bg-surface even:bg-surface-alt/40">
              <td className="border-r border-border-subtle p-3 font-semibold text-ink">
                {SEVERITY_LABEL[row]}
              </td>
              {COLUMNS.map((col) => {
                const tier = deriveEvidenceTier(col)!;
                return (
                  <td key={col} className="p-3 align-top text-ink-muted">
                    <ul className="space-y-0.5">
                      {tier.literature ? <li>a. Kajian literatur ilmiah</li> : null}
                      {tier.clinical ? <li>b. Perbandingan produk sejenis</li> : null}
                      {tier.trial ? <li>c. Hasil uji klinik</li> : null}
                    </ul>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
