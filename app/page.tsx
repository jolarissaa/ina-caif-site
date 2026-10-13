import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";

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
        <section className="mx-auto max-w-content px-6 pt-12 pb-8">
          <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
            INA-CAIF
          </h1>
          <p className="mt-2 text-base font-medium text-ink-muted sm:text-lg">
            Indonesia Clinical AI Audit &amp; Governance Framework
          </p>
          <p className="mt-3 max-w-xl text-sm leading-[22px] text-ink-muted">
            Menerjemahkan regulasi kesehatan menjadi langkah teknis yang jelas.
          </p>
        </section>

        <section className="mx-auto max-w-content px-6 pb-16">
          <div className="grid gap-6 sm:grid-cols-2">
            <FeatureCard
              href="/checklist"
              title="Compliance Checker"
              description="Susuri persyaratan izin edar, manajemen risiko, hingga etika AI sebagai butir-butir yang bisa ditandai, lengkap dengan sitasi ke regulasi aslinya."
              linkLabel="Mulai Compliance Checker"
              imageSrc="/images/checklist-preview.png"
              imageAlt="Pratinjau halaman Compliance Checker INA-CAIF"
              accent="brand"
            />
            <FeatureCard
              href="/regulasi"
              title="Pustaka Regulasi"
              description="Telusuri regulasi dan standar yang menjadi dasar checklist, termasuk teks lengkap KMK 951/2026 beserta sumber lain yang relevan."
              linkLabel="Buka pustaka"
              imageSrc="/images/pustaka-preview.png"
              imageAlt="Pratinjau halaman Pustaka Regulasi INA-CAIF"
              accent="accent"
            />
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
