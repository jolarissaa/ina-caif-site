"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProducts } from "@/lib/useProducts";
import { getProductProgress } from "@/lib/productProgress";
import { presetProductPurpose } from "@/lib/useQualifyingAnswers";
import { useTutorial } from "@/lib/useTutorial";

type Progress = { done: number; total: number };

// The landing point for "Produk Saya" in the header nav, and now also the
// landing point right after the homepage's "Izin Edar" / "Komite Etik"
// entry cards (see app/page.tsx) — a list of every AI product being
// tracked in this browser, each with its own Compliance Checker progress.
// No login: products are just named slices of localStorage (see
// lib/useProducts.ts). Opening one sets it as the active product and sends
// the visitor to /checklist, which reads whichever product is active.
//
// Wrapped in <Suspense> because useSearchParams() requires it under the
// App Router (same pattern as app/checklist/cetak/page.tsx).
export default function ProdukPage() {
  return (
    <Suspense fallback={null}>
      <ProdukPageContent />
    </Suspense>
  );
}

function ProdukPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Set when the visitor arrived via one of the homepage's two entry
  // cards — carries straight through to the next product they add, so
  // /checklist's questionnaire never asks "izin edar atau etik" a second
  // time. Not applied to EXISTING products (opening one via "Buka" keeps
  // whatever purpose it already has) — only to a product created in this
  // same visit, which is what "purposeParam" below is for.
  const purposeParam = searchParams.get("purpose");
  const presetPurpose: "izin-edar" | "etik" | null =
    purposeParam === "izin-edar" || purposeParam === "etik" ? purposeParam : null;

  const {
    products,
    setActiveProductId,
    addProduct,
    renameProduct,
    removeProduct,
    hydrated,
  } = useProducts();
  const { start: startTutorial } = useTutorial();
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [newName, setNewName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    const next: Record<string, Progress> = {};
    for (const product of products) {
      next[product.id] = getProductProgress(product.id);
    }
    setProgress(next);
  }, [hydrated, products]);

  function handleOpen(id: string) {
    setActiveProductId(id);
    router.push("/checklist");
  }

  // Every new product automatically starts the guided tour — per Jo: "tiap
  // ada produk baru, itu automatically pasti lgsg ke tutorial". Visiting
  // an EXISTING product via "Buka" above does not re-trigger it; this is
  // only for the moment a product is actually created.
  function handleAdd() {
    if (!newName.trim()) return;
    const id = addProduct(newName);
    if (presetPurpose) {
      presetProductPurpose(id, presetPurpose);
    }
    setNewName("");
    setActiveProductId(id);
    router.push("/checklist");
    startTutorial();
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-content px-6 py-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Produk Saya</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">Daftar Produk AI</h1>
          <p className="mt-2 max-w-xl text-sm leading-[22px] text-ink-muted">
            Setiap produk punya Compliance Checker dan progresnya sendiri — cocok jika Anda
            sedang membangun atau mengurus izin edar lebih dari satu sistem AI kesehatan
            sekaligus. Tidak perlu login; semua tersimpan di browser ini.
          </p>
          {presetPurpose ? (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-medium text-brand">
              Produk baru yang Anda tambahkan akan langsung diarahkan untuk{" "}
              {presetPurpose === "etik" ? "komite etik" : "izin edar"} — tidak perlu memilih lagi
              di langkah berikutnya.
            </p>
          ) : null}
        </div>

        {/* Kept at the top, above the list, on purpose — per Jo: with the
            add-product box below the list, it kept drifting further down
            the page as products piled up. Pinned here it stays reachable
            no matter how many products exist, and new products appear
            below it instead of pushing it around. */}
        <div className="mt-8 rounded-lg border border-dashed border-border-subtle p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Tambah produk baru
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nama produk, misal: Deteksi Retinopati v2"
              className="min-w-[240px] flex-1 rounded-md border border-border-subtle px-3 py-2 text-sm text-ink"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
            />
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand hover:bg-brand-dark"
            >
              Tambah &amp; Mulai Checklist
            </button>
          </div>
        </div>

        {hydrated && products.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-border-subtle p-6 text-center">
            <p className="text-sm text-ink-muted">
              Belum ada produk. Tambahkan satu di atas untuk mulai Compliance Checker-nya.
            </p>
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          {products.map((product) => {
            const p = progress[product.id];
            const isRenaming = renamingId === product.id;
            return (
              <div
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border-subtle bg-surface p-4"
              >
                <div className="min-w-0 flex-1">
                  {isRenaming ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        className="w-full max-w-xs rounded-md border border-border-subtle px-2 py-1 text-sm text-ink"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          renameProduct(product.id, renameValue);
                          setRenamingId(null);
                        }}
                        className="text-xs font-semibold text-brand"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => setRenamingId(null)}
                        className="text-xs text-ink-muted"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {hydrated && p ? `${p.done} / ${p.total} butir selesai` : "Memuat..."}
                      </p>
                    </>
                  )}
                </div>
                {!isRenaming ? (
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRenamingId(product.id);
                        setRenameValue(product.name);
                      }}
                      className="rounded-md border border-border-subtle px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-brand hover:text-brand"
                    >
                      Ubah nama
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Hapus "${product.name}" beserta seluruh progresnya? Tindakan ini tidak bisa dibatalkan.`
                          )
                        ) {
                          removeProduct(product.id);
                        }
                      }}
                      className="rounded-md border border-border-subtle px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-red-400 hover:text-red-500"
                    >
                      Hapus
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpen(product.id)}
                      className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-on-brand hover:bg-brand-dark"
                    >
                      Buka
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
