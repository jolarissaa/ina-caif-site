// Reflows a regulation part's text into readable paragraphs. The source
// text in lib/regulationText.ts was extracted from the official PDF with
// pdftotext, which flattens the document's own outline (A./B./C., 1./2./3.,
// a./b./c.) into one run-on paragraph with no line breaks — readable in a
// terminal, not on a web page. This inserts a paragraph break in front of
// each outline marker instead, so the rendered page mirrors the document's
// own structure.

// Two known pdftotext artifacts, fixed before paragraph-splitting runs:
// (1) a stray space inside a figure/table's own decimal number, e.g.
// "Tabel 3. 2" instead of "Tabel 3.2" (undetectable from text alone unless
// fixed first, since it otherwise looks exactly like a real "2. <Capital
// word>" list marker and would wrongly start a new paragraph mid-sentence);
// (2) runs of 2+ spaces left over from justified-text reconstruction.
function normalizeArtifacts(text: string): string {
  return text
    .replace(/\b((?:Tabel|Gambar)\s\d{1,2})\.\s(\d{1,2})\b/g, "$1.$2")
    .replace(/ {2,}/g, " ")
    .trim();
}

export function formatRegulationParagraphs(text: string): string[] {
  const normalized = normalizeArtifacts(text);
  // A paragraph break goes in front of a single-letter marker (A–J or a–j)
  // or a 1–2 digit number, each followed by ". " and a capitalized word —
  // the shape every outline marker in this document actually takes. Still
  // a heuristic (not a parser), kept deliberately narrow (capital-letter
  // lookahead, 1–2 digits only) to avoid firing on ordinary sentences,
  // decimal references, or standard names like "ISO 14971".
  const marked = normalized.replace(/\s(?=([A-J]\.|[a-j]\.|\d{1,2}\.)\s+[A-Z])/g, "\n\n");
  return marked
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}
