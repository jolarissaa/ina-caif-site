// Compact, FLI/EU-AI-Act-style footer: one short organizational line over a
// dark band, instead of the old two paragraphs of project description +
// legal disclaimer. Per Jo: keep the footer organizational only — her name
// + LinkedIn already live in the homepage's "Tentang proyek ini" section,
// so this doesn't repeat it. No © mark either, since the project isn't
// copyrighted. bg-brand-dark is the placeholder — the same spot a
// background photo (with this gradient scrim kept on top for text
// legibility) can drop into later with no other change needed. Image
// sizing guidance for that photo was sent to Jo in chat, not kept here as a
// code comment.
export default function Footer() {
  return (
    <footer className="no-print relative isolate overflow-hidden bg-brand-dark">
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-content px-6 py-9">
        <p className="text-xs leading-[18px] text-white/80">
          INA-CAIF, 2026 · Dibangun di bawah Young Leaders for Indonesia.
        </p>
      </div>
    </footer>
  );
}
