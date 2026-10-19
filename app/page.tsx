import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import RegulationBreakdown from "@/components/RegulationBreakdown";
import HowItWorksSection from "@/components/HowItWorksSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-content px-6 pt-12 pb-8">
          <h1
            data-tutorial="home-headline"
            className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl"
          >
            INA-CAIF
          </h1>
          <p className="mt-2 text-base font-medium text-ink-muted sm:text-lg">
            Indonesia Clinical AI Audit &amp; Governance Framework
          </p>
          <p className="mt-3 max-w-xl text-sm leading-[22px] text-ink-muted">
            Menerjemahkan regulasi kesehatan jadi langkah teknis yang jelas, termasuk kesiapan
            dokumen sebelum{" "}
            <a
              href="https://regalkes.kemkes.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand hover:underline"
            >
              mengajukan izin edar lewat Regalkes Kemenkes
            </a>
            .
          </p>
        </section>

        <section className="mx-auto max-w-content px-6 pb-16">
          <div className="grid items-stretch gap-6 sm:grid-cols-2">
            <FeatureCard
              href="/produk"
              title="Compliance Checker"
              description="Susuri persyaratan izin edar, manajemen risiko, hingga etika AI sebagai butir-butir yang bisa ditandai, lengkap dengan sitasi ke regulasi aslinya. Lacak lebih dari satu produk AI sekaligus, masing-masing dengan checklist-nya sendiri."
              linkLabel="Lihat produk saya"
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
          <div className="mx-auto max-w-content px-6 py-14">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Cara kerja INA-CAIF
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink">
              Dari tujuan Anda sampai siap diajukan
            </h2>
            <div className="mt-8 overflow-x-auto pb-2">
              <HowItWorksSection />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-content px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Dua tujuan, satu checklist
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink">
            Izin edar atau komite etik, Anda yang pilih
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-[22px] text-ink-muted">
            Checklist yang sama bisa dipakai untuk dua hal: menyiapkan dokumen izin edar, atau
            menyiapkan ringkasan untuk komite etik kalau produk Anda masih tahap penelitian atau
            uji coba. Saat mulai checklist, Anda tinggal pilih salah satu, sisanya menyesuaikan
            dengan sendirinya.
          </p>
        </section>

        <section className="border-y border-border-subtle bg-surface-alt">
          <div className="mx-auto max-w-content px-6 py-12">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Dari mana checklist ini berasal
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink">
              Satu regulasi, dipecah menjadi tahapan yang bisa diikuti
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-[22px] text-ink-muted">
              INA-CAIF menerjemahkan KMK No. HK.01.07/MENKES/951/2026 menjadi tahapan-tahapan di
              Compliance Checker. Setiap tahap juga merujuk pada standar internasional yang
              relevan, bukan sebagai dasar hukum tersendiri, tapi sebagai rujukan teknis yang
              memperjelas cara memenuhinya.
            </p>
            <div className="mt-6 max-w-xl">
              <RegulationBreakdown />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-content px-6 py-16">
          <div className="rounded-lg border border-brand/20 bg-brand/[0.04] p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              Perlu diketahui
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink">
              Alat bantu persiapan, bukan pengganti proses resmi
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-[22px] text-ink-muted">
              INA-CAIF membantu Anda memahami, langkah demi langkah, dokumen dan bukti apa yang
              diminta sebelum mengajukan izin edar perangkat lunak kesehatan berbasis AI,
              sekaligus jadi alat untuk melacak progres kesiapan tim Anda sendiri. Checklist ini
              tidak menggantikan proses resmi: keputusan klasifikasi, evaluasi bukti klinis, dan
              persetujuan tetap ada pada Kementerian Kesehatan dan komite etik penelitian
              kesehatan. Untuk proses pengajuan yang sebenarnya, rujuk selalu ke{" "}
              <a
                href="https://regalkes.kemkes.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand hover:underline"
              >
                Regalkes Kemenkes
              </a>{" "}
              dan teks lengkap regulasinya di{" "}
              <a href="/regulasi" className="font-medium text-brand hover:underline">
                Pustaka Regulasi
              </a>
              .
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-content px-6 py-16">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-border-subtle bg-surface-alt p-8">
              <h2 className="font-display text-xl font-semibold text-ink">
                Bantu kami memetakan kesulitan yang dialami
              </h2>
              <p className="mt-3 text-sm leading-[22px] text-ink-muted">
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

            <div className="rounded-lg border border-border-subtle bg-surface p-8">
              <h2 className="font-display text-base font-semibold text-ink">
                Masukan untuk situs ini sendiri
              </h2>
              <p className="mt-3 text-sm leading-[22px] text-ink-muted">
                Bukan tentang regulasinya, tapi tentang INA-CAIF sebagai situs: ada yang
                membingungkan, kurang jelas, atau bisa diperbaiki? Masukan singkat sangat
                membantu.
              </p>
              <a
                href="https://forms.gle/c5r2ZZi9A9D2sBfLA"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                Beri Masukan untuk Situs Ini
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
