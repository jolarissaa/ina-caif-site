import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { kmk9512026, KMK_951_2026_SOURCE_URL, RegulationPart } from "@/lib/regulationText";
import { formatRegulationParagraphs } from "@/lib/formatRegulationText";
import ClassificationFlowchart from "@/components/ClassificationFlowchart";
import EvidenceTierTable from "@/components/EvidenceTierTable";

// Parts whose run-on text includes a reference to a diagram/table the
// original PDF renders as an image — Gambar 2.1 (p.9) and Tabel 3.2
// (p.23-24) — get the real, readable version injected right after their
// text instead of leaving the reader to picture a diagram from a sentence
// naming it.
const DIAGRAM_AFTER_PART: Record<string, React.ReactNode> = {
  "bab-2-3": <ClassificationFlowchart />,
};
const TABLE_AFTER_PART: Record<string, React.ReactNode> = {
  "bab-3-9": <EvidenceTierTable />,
};

const BAB_LABEL: Record<string, string> = {
  "bab-1": "Bab I",
  "bab-2": "Bab II",
  "bab-3": "Bab III",
  "bab-4": "Bab IV",
  "bab-5": "Bab V",
  "bab-6": "Bab VI",
};

export default function Kmk9512026ExplorerPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-content px-6 py-12">
        <div className="border-b border-border-subtle pb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            Pustaka Regulasi
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">
            KMK No. HK.01.07/MENKES/951/2026
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-[22px] text-ink-muted">
            Pedoman Izin Edar Alat Kesehatan Berbasis Perangkat Lunak. Teks lengkap di bawah
            disusun ulang secara otomatis dari dokumen resmi agar mudah dibaca dan dinavigasi;
            untuk keperluan hukum, rujuk dokumen resmi melalui tautan berikut.
          </p>
          <a
            href={KMK_951_2026_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border-subtle px-4 py-2 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
          >
            Lihat dokumen resmi di JDIH Kemenkes
          </a>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
          <nav className="no-print h-max lg:sticky lg:top-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Daftar Isi
            </p>
            <ul className="mt-3 space-y-4">
              {kmk9512026.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-sm font-semibold text-ink hover:text-brand"
                  >
                    {section.bab ? `${section.bab}` : "Pembuka"}
                    {section.bab ? (
                      <span className="block text-xs font-normal text-ink-muted">
                        {section.title}
                      </span>
                    ) : null}
                  </a>
                  {section.parts.length > 0 ? (
                    <ul className="mt-1.5 space-y-1 border-l border-border-subtle pl-3">
                      {section.parts.map((part) => (
                        <li key={part.id}>
                          <a
                            href={`#${part.id}`}
                            className="block text-xs leading-[18px] text-ink-muted hover:text-brand"
                          >
                            {part.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-12">
            {kmk9512026.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-8">
                {section.bab ? (
                  <h2 className="font-display text-xl font-bold text-ink">
                    {section.bab} — {section.title}
                  </h2>
                ) : null}
                <div className="mt-4 space-y-8">
                  {section.parts.map((part) => (
                    <PartBlock key={part.id} part={part} babLabel={BAB_LABEL[section.id]} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function PartBlock({ part, babLabel }: { part: RegulationPart; babLabel?: string }) {
  const paragraphs = formatRegulationParagraphs(part.text);
  return (
    <div id={part.id} className="scroll-mt-8">
      <div className="space-y-3">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="text-sm leading-[24px] text-ink">
            {paragraph}
          </p>
        ))}
      </div>
      {DIAGRAM_AFTER_PART[part.id] ? (
        <div className="mt-4">{DIAGRAM_AFTER_PART[part.id]}</div>
      ) : null}
      {TABLE_AFTER_PART[part.id] ? <div className="mt-4">{TABLE_AFTER_PART[part.id]}</div> : null}
      {babLabel ? (
        <p className="mt-2 text-xs text-ink-muted">
          Sumber: {babLabel}
        </p>
      ) : null}
      {part.subParts && part.subParts.length > 0 ? (
        <div className="mt-4 space-y-6 border-l border-border-subtle pl-5">
          {part.subParts.map((sub) => (
            <PartBlock key={sub.id} part={sub} babLabel={babLabel} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
