import { RegalkesForm, REGALKES_FORM_INFO } from "@/lib/checklistData";
import { FormFileIcon } from "./icons";

// "This becomes part of Form X at Regalkes" — a small icon badge instead of
// a paragraph explaining it, so switching between INA-CAIF and the actual
// Kemenkes submission system reads as one continuous flow rather than two
// disconnected tools. The exact wording ("biasanya") and the hover/long
// label both say plainly this is INA-CAIF's own best-fit read of Regalkes'
// generic form sections, not a mapping Kemenkes itself confirmed — Regalkes
// has no software-specific fields to map to precisely.
export default function FormBadge({ form }: { form: RegalkesForm }) {
  const info = REGALKES_FORM_INFO[form];
  return (
    <span
      title={info.hint}
      className="inline-flex items-center gap-1 rounded-sm border border-border-subtle bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted"
    >
      <FormFileIcon className="h-3 w-3 text-ink-muted" />
      Form {form} Regalkes
    </span>
  );
}
