"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RINGKASAN_MAX_LENGTH, useEthicsContext } from "@/lib/useEthicsContext";

type Props = {
  open: boolean;
  onClose: () => void;
  productId?: string;
};

// Shown when the visitor clicks "Siapkan Ringkasan untuk Komite Etik" on
// /checklist. First asks whether the export is headed to an ethics
// committee; only if so does it collect the short "Konteks untuk Tim Etik"
// fields, then forwards to the printable view with ?etik=1 so that page
// knows to include that section. productId scopes the context fields to
// whichever product is active, so exporting product A never pulls in
// product B's title/institution/etc.
export default function ExportEthicsDialog({ open, onClose, productId = "default" }: Props) {
  const router = useRouter();
  const { context, updateField } = useEthicsContext(productId);
  const [step, setStep] = useState<"tanya" | "formulir">("tanya");

  if (!open) return null;

  function handleTidak() {
    onClose();
    setStep("tanya");
    router.push("/checklist/cetak");
  }

  function handleLanjutkan() {
    onClose();
    setStep("tanya");
    router.push("/checklist/cetak?etik=1");
  }

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-surface p-6 shadow-lg">
        {step === "tanya" ? (
          <>
            <h2 className="font-display text-lg font-semibold text-ink">
              Apakah ringkasan ini akan dikirim ke komite etik (KEPKN)?
            </h2>
            <p className="mt-2 text-sm leading-[22px] text-ink-muted">
              Jika ya, ringkasan yang diekspor akan dipersempit — hanya butir yang relevan bagi
              penilaian etik (Bab IV.A, Etika & GMLP) yang disertakan, bukan seluruh checklist
              administratif izin edar. Anda juga bisa melengkapi beberapa informasi singkat
              terlebih dahulu agar komite etik memiliki konteks sebelum membaca ringkasannya.
            </p>
            <p className="mt-3 text-xs text-ink-muted">
              Ringkasan ini melengkapi, bukan menggantikan, protokol penelitian resmi yang
              diajukan ke komite etik institusi Anda atau melalui{" "}
              <a
                href="https://kepkn.kemkes.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand hover:underline"
              >
                portal KEPKN
              </a>
              .
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={handleTidak}
                className="rounded-md border border-border-subtle px-4 py-2 text-sm font-medium text-ink-muted hover:border-brand hover:text-brand"
              >
                Tidak, lanjutkan saja
              </button>
              <button
                type="button"
                onClick={() => setStep("formulir")}
                className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand hover:bg-brand-dark"
              >
                Ya, lengkapi konteks
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="font-display text-lg font-semibold text-ink">
              Konteks untuk Tim Etik
            </h2>
            <p className="mt-2 text-sm leading-[22px] text-ink-muted">
              Isian ini bersifat pelengkap ringkas dan tidak menggantikan protokol penelitian
              resmi yang diajukan ke komite etik (KEPKN).
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                onChange={(e) =>
                  updateField("ringkasan", e.target.value.slice(0, RINGKASAN_MAX_LENGTH))
                }
                rows={3}
                className="mt-1.5 w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-sm text-ink"
                placeholder="Jelaskan secara singkat tujuan dan cara kerja sistem dalam dua hingga tiga kalimat."
              />
              <p className="mt-1 text-right text-xs text-ink-muted">
                {context.ringkasan.length} / {RINGKASAN_MAX_LENGTH}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setStep("tanya");
                }}
                className="rounded-md border border-border-subtle px-4 py-2 text-sm font-medium text-ink-muted hover:border-brand hover:text-brand"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLanjutkan}
                className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand hover:bg-brand-dark"
              >
                Lanjutkan ke Ekspor
              </button>
            </div>
          </>
        )}
      </div>
    </div>
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
