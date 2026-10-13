"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChecklistItemRow from "@/components/ChecklistItem";
import { categories, checklistItems } from "@/lib/checklistData";
import { useChecklistState } from "@/lib/useChecklistState";
import { RINGKASAN_MAX_LENGTH, useEthicsContext } from "@/lib/useEthicsContext";

const ALL_CATEGORY = "semua";

export default function ChecklistPage() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);
  const { statusMap, setStatus, resetAll, hydrated } = useChecklistState();
  const { context, updateField } = useEthicsContext();

  const visibleItems = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return checklistItems;
    return checklistItems.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory]);

  const progress = useMemo(() => {
    const total = checklistItems.length;
    const done = checklistItems.filter((item) => statusMap[item.id] === "selesai").length;
    return { total, done };
  }, [statusMap]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-content px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Checklist Kepatuhan</h1>
            <p className="mt-2 max-w-xl text-sm leading-[22px] text-ink-muted">
              Tandai setiap butir sesuai kondisi sistem Anda saat ini. Buka setiap butir untuk
              membaca penjelasan dan sumber rujukannya.
            </p>
          </div>
          <div className="no-print flex flex-col items-end gap-2">
            <p className="font-mono text-sm text-ink-muted">
              {hydrated ? `${progress.done} / ${progress.total} selesai` : "Memuat..."}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetAll}
                className="rounded-md border border-border-subtle px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-brand hover:text-brand"
              >
                Atur Ulang
              </button>
              <Link
                href="/checklist/cetak"
                className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-on-brand hover:bg-brand-dark"
              >
                Ekspor PDF
              </Link>
            </div>
          </div>
        </div>

        <div className="no-print mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(ALL_CATEGORY)}
            className={`rounded-pill px-4 py-1.5 text-sm font-medium ${
              activeCategory === ALL_CATEGORY
                ? "bg-brand text-on-brand"
                : "border border-border-subtle text-ink-muted hover:border-brand hover:text-brand"
            }`}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-pill px-4 py-1.5 text-sm font-medium ${
                activeCategory === category.id
                  ? "bg-brand text-on-brand"
                  : "border border-border-subtle text-ink-muted hover:border-brand hover:text-brand"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {visibleItems.map((item) => (
            <ChecklistItemRow
              key={item.id}
              item={item}
              status={statusMap[item.id] ?? item.defaultStatus}
              onStatusChange={(status) => setStatus(item.id, status)}
            />
          ))}
        </div>

        <section className="no-print mt-16 rounded-lg border border-border-subtle bg-surface-alt p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Konteks untuk Tim Etik</h2>
          <p className="mt-2 max-w-2xl text-sm leading-[22px] text-ink-muted">
            Isian berikut bersifat opsional dan hanya sebagai pelengkap ringkas. Isian ini tidak
            menggantikan protokol penelitian resmi yang diajukan ke komite etik (KEPKN).
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              label="Judul Proyek atau Sistem"
              value={context.judulProyek}
              onChange={(v) => updateField("judulProyek", v)}
            />
            <Field
              label="Institusi"
              value={context.institusi}
              onChange={(v) => updateField("institusi", v)}
            />
            <Field
              label="Nama Peneliti Utama"
              value={context.namaPenelitiUtama}
              onChange={(v) => updateField("namaPenelitiUtama", v)}
            />
            <Field
              label="Lokasi"
              value={context.lokasi}
              onChange={(v) => updateField("lokasi", v)}
            />
            <Field
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
              placeholder="Jelaskan secara singkat tujuan dan cara kerja sistem dalam dua hingga tiga kalimat."
            />
            <p className="mt-1 text-right text-xs text-ink-muted">
              {context.ringkasan.length} / {RINGKASAN_MAX_LENGTH}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Field({
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
