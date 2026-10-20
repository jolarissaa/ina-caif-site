"use client";

import { useState } from "react";
import {
  AI_ETHICS_ASPECTS,
  CORE_ETHICS_STANDARDS,
  ETHICS_STATUS_LABEL,
  type EthicsAssessmentStatus,
  type EthicsStandardDef,
} from "@/lib/ethicsStandards";
import { useEthicsAssessment } from "@/lib/useEthicsAssessment";

type Props = {
  productId: string;
};

// Self-assessment against the two official KEPPKN 2021 standard sets (see
// lib/ethicsStandards.ts) — only shown once the visitor has chosen the
// "Komite Etik" purpose for this product (per Jo: the ethics export should
// comply with everything the real national ethics pedoman asks for, not
// just general reasoning about what seems useful). Filled in here once,
// then printed read-only in the "Ekspor untuk Komite Etik" view
// (app/checklist/cetak/page.tsx) via the same storage.
export default function EthicsStandardsPanel({ productId }: Props) {
  const [open, setOpen] = useState(false);
  const { getValue, setValue, hydrated } = useEthicsAssessment(productId);

  const answeredCount =
    CORE_ETHICS_STANDARDS.length +
    AI_ETHICS_ASPECTS.length -
    [...CORE_ETHICS_STANDARDS, ...AI_ETHICS_ASPECTS].filter(
      (def) => getValue(def.id).status === null
    ).length;
  const totalCount = CORE_ETHICS_STANDARDS.length + AI_ETHICS_ASPECTS.length;

  return (
    <div className="no-print mt-5 rounded-lg border border-border-subtle bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div>
          <p className="font-display text-sm font-semibold text-ink">
            Penilaian Mandiri: Standar Etik KEPPKN 2021
          </p>
          <p className="mt-0.5 text-xs text-ink-muted">
            Dirangkum dari Pedoman dan Standar Etik Penelitian dan Pengembangan Kesehatan
            Nasional (KEPPKN, Kemenkes RI, 2021) — disertakan dalam ekspor untuk komite etik.
            {hydrated ? ` ${answeredCount}/${totalCount} terisi.` : ""}
          </p>
        </div>
        <span className="flex-shrink-0 text-ink-muted">{open ? "▲" : "▼"}</span>
      </button>
      {open ? (
        <div className="border-t border-border-subtle px-4 py-4">
          <StandardGroup
            title="Standar Kelaikan Etik Penelitian"
            defs={CORE_ETHICS_STANDARDS}
            getValue={getValue}
            setValue={setValue}
          />
          <div className="mt-6">
            <StandardGroup
              title="Aspek Etik Penelitian Kecerdasan Buatan (AI) Kesehatan"
              defs={AI_ETHICS_ASPECTS}
              getValue={getValue}
              setValue={setValue}
            />
          </div>
          <p className="mt-4 text-xs italic leading-[18px] text-ink-muted">
            Penilaian ini melengkapi, bukan menggantikan, telaah resmi komite etik. Kerangka ini
            disesuaikan untuk produk perangkat lunak/AI — sejumlah standar dalam pedoman asli
            yang khusus untuk desain uji klinik dengan subjek manusia langsung (mis. randomisasi,
            plasebo, bahan biologik tersimpan) tidak disertakan karena tidak relevan di sini.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function StandardGroup({
  title,
  defs,
  getValue,
  setValue,
}: {
  title: string;
  defs: EthicsStandardDef[];
  getValue: (id: string) => { status: EthicsAssessmentStatus; note: string };
  setValue: (id: string, value: { status: EthicsAssessmentStatus; note: string }) => void;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{title}</h3>
      <div className="mt-2 space-y-4">
        {defs.map((def) => {
          const value = getValue(def.id);
          return (
            <div key={def.id} className="rounded-md border border-border-subtle p-3">
              <p className="text-sm font-medium text-ink">{def.label}</p>
              <p className="mt-0.5 text-xs leading-[18px] text-ink-muted">{def.helper}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["ya", "tidak", "na"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setValue(def.id, { ...value, status })}
                    className={`rounded-pill border px-3 py-1 text-xs font-medium ${
                      value.status === status
                        ? "border-brand bg-brand text-on-brand"
                        : "border-border-subtle text-ink-muted hover:border-brand hover:text-brand"
                    }`}
                  >
                    {ETHICS_STATUS_LABEL[status]}
                  </button>
                ))}
              </div>
              <textarea
                value={value.note}
                onChange={(e) => setValue(def.id, { ...value, note: e.target.value })}
                rows={2}
                placeholder="Catatan singkat (opsional) — misalnya bukti atau alasan singkat."
                className="mt-2 w-full rounded-md border border-border-subtle bg-surface px-2.5 py-1.5 text-xs text-ink"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
