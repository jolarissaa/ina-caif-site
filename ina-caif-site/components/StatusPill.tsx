import { ChecklistStatus } from "@/lib/checklistData";

const STATUS_CONFIG: Record<
  ChecklistStatus,
  { label: string; bg: string; text: string }
> = {
  selesai: { label: "Selesai", bg: "bg-status-done-bg", text: "text-status-done-text" },
  berjalan: { label: "Sedang Berjalan", bg: "bg-status-ongoing-bg", text: "text-status-ongoing-text" },
  belum: { label: "Belum Dimulai", bg: "bg-status-notyet-bg", text: "text-status-notyet-text" },
};

export default function StatusPill({ status }: { status: ChecklistStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
