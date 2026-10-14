"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProducts } from "@/lib/useProducts";
import { getProductProgress } from "@/lib/productProgress";

type Progress = { done: number; total: number };

// The landing point for "Produk Saya" in the header nav — a list of every
// AI product being tracked in this browser, each with its own Compliance
// Checker progress. No login: products are just named slices of
// localStorage (see lib/useProducts.ts). Opening one sets it as the active
// product and sends the visitor to /checklist, which reads whichever
// product is active.
export default function ProdukPage() {
  const router = useRouter();
  const {
    products,
    setActiveProductId,
    addProduct,
    renameProduct,
    removeProduct,
    hydrated,
  } = useProducts();
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

  function handleAdd() {
    if (!newName.trim()) return;
    const id = addProduct(newName);
    setNewName("");
    setActiveProductId(id);
    router.push("/checklist");
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
        </div>

        <div className="mt-8 space-y-3">
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
                    {products.length > 1 && product.id !== "default" ? (
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
                    ) : null}
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
      </main>
      <Footer />
    </>
  );
}
