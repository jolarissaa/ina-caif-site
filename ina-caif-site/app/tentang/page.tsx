import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TentangPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-content px-6 py-12">
        <h1 className="font-display text-2xl font-bold text-ink">Tentang INA-CAIF</h1>

        <div className="mt-6 max-w-2xl space-y-5 text-[15px] leading-[24px] text-ink-muted">
          <p>
            INA-CAIF (Indonesia Clinical AI Audit &amp; Governance Framework) disusun untuk
            membantu dokter, engineer, maupun tenaga lain yang terlibat dalam pengembangan
            software kesehatan berbasis AI memahami persyaratan izin edar, manajemen risiko,
            validasi klinis, dokumentasi teknis, dan perlindungan data yang berlaku di Indonesia.
          </p>
          <p>
            Indonesia saat ini mendorong kemajuan teknologi kesehatan, namun masih banyak dokter,
            engineer, maupun tenaga lain yang terlibat di dalamnya yang belum memahami secara
            pasti bagaimana prosesnya atau aspek apa saja yang perlu diperhatikan. INA-CAIF
            berangkat dari hipotesis tersebut dan berfokus pada
            pemahaman mengenai kualifikasi izin edar, bukan pada pemahaman teknis AI itu sendiri,
            karena penerjemahan persyaratan normatif menjadi langkah teknis masih menjadi
            pembahasan yang terus berkembang, termasuk di tingkat internasional seperti WHO.
          </p>
          <p>
            Checklist pada situs ini merangkum rujukan dari regulasi Kemenkes, standar
            internasional seperti ISO dan IEC, serta panduan WHO dan FDA. Setiap butir checklist
            disertai sumber rujukannya sehingga dapat ditelusuri lebih lanjut.
          </p>
          <p>
            Proyek ini merupakan Personal Leadership Project di bawah Young Leaders for Indonesia
            (YLI), dikembangkan oleh Josephine Larissa Rachmadiana.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
