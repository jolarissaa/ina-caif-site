import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const STANDARDS = [
  "Kemenkes",
  "WHO",
  "FDA",
  "ISO 14971",
  "IEC 62304",
  "ISO 13485",
  "UU PDP",
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-content px-6 py-20">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            Indonesia Clinical AI Audit &amp; Governance Framework
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight text-ink">
            Menerjemahkan regulasi kesehatan menjadi langkah teknis yang jelas.
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[26px] text-ink-muted">
            Indonesia saat ini mendorong kemajuan teknologi kesehatan, namun masih banyak dokter,
            engineer, maupun tenaga lain yang terlibat dalam pengembangan software kesehatan
            berbasis AI yang belum memahami secara pasti bagaimana prosesnya atau aspek apa saja
            yang perlu diperhatikan, terutama dalam memenuhi persyaratan untuk mendapatkan izin
            edar. INA-CAIF menyusun persyaratan tersebut menjadi checklist yang bisa langsung
            digunakan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/checklist"
              className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-on-brand hover:bg-brand-dark"
            >
              Mulai Checklist
            </Link>
            <Link
              href="/regulasi"
              className="rounded-md border border-border-subtle bg-surface px-5 py-3 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
            >
              Lihat Pustaka Regulasi
            </Link>
          </div>
        </section>

        <section className="border-y border-border-subtle bg-surface-alt">
          <div className="mx-auto max-w-content px-6 py-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Disusun berdasarkan
            </p>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
              {STANDARDS.map((name) => (
                <span key={name} className="text-sm font-medium text-ink-muted">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-content px-6 py-16">
          <div className="rounded-lg border border-border-subtle bg-surface-alt p-8">
            <h2 className="font-display text-xl font-semibold text-ink">
              Bantu kami memetakan kesulitan yang dialami
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-[22px] text-ink-muted">
              Survei singkat untuk dokter, engineer, maupun tenaga lain yang pernah membangun
              atau terlibat dalam software berbasis AI di bidang kesehatan.
            </p>
            <a
              href="https://its.id/m/INACAIF"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-md bg-accent px-5 py-3 text-sm font-semibold text-on-accent hover:opacity-90"
            >
              Isi Survei
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
