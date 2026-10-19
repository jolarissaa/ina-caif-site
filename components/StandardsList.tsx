type Standard = {
  number: string;
  title: string;
  url: string;
  // Set for a standard KMK 951/2026 cites that IEC has not actually
  // published yet — still in development, no purchasable page exists. The
  // link below points at the best public tracking page available instead
  // of a fabricated webstore URL, and the item is labeled so a reader
  // doesn't try to buy something that isn't for sale.
  inDevelopment?: boolean;
};

// The ten standards KMK 951/2026 itself lists (Bab III.B) as references for
// building a software medical device's quality management system — each
// verified against the standards body's own site (ISO/IEC) rather than a
// reseller mirror, per Jo: real clickable links, not just names in a list.
// Two (63450, 63521) are still in development at IEC with no published
// edition yet; those link to IEC's own project-tracking page instead and
// say so, rather than linking to nothing or to a edition that doesn't exist.
const STANDARDS: Standard[] = [
  {
    number: "1.",
    title: "ISO 13485 — Medical devices: Quality management systems — Requirements for regulatory purposes",
    url: "https://www.iso.org/standard/59752.html",
  },
  {
    number: "2.",
    title: "ISO 14971 — Medical devices: Application of risk management to medical devices",
    url: "https://www.iso.org/standard/72704.html",
  },
  {
    number: "3.",
    title: "IEC 60601-1 — Medical electrical equipment, Part 1: General requirements for basic safety and essential performance",
    url: "https://webstore.iec.ch/publication/67107",
  },
  {
    number: "4.",
    title: "IEC 61010-1 — Safety requirements for electrical equipment for measurement, control and laboratory use",
    url: "https://webstore.iec.ch/en/publication/59769",
  },
  {
    number: "5.",
    title: "IEC 62366-1 — Medical devices, Part 1: Application of usability engineering to medical devices",
    url: "https://webstore.iec.ch/en/publication/21863",
  },
  {
    number: "6.",
    title: "IEC 62304 — Medical device software: Software life cycle processes",
    url: "https://webstore.iec.ch/publication/22794",
  },
  {
    number: "7.",
    title: "IEC 82304-1 — Health software, Part 1: General requirements for product safety",
    url: "https://webstore.iec.ch/publication/26120",
  },
  {
    number: "8.",
    title: "IEC 63450 — Testing of Artificial Intelligence/Machine Learning-enabled Medical Devices",
    url: "https://genorma.com/en/standards/iec-63450-ed1",
    inDevelopment: true,
  },
  {
    number: "9.",
    title: "IEC 63521 — Machine Learning-enabled Medical Device: Performance Evaluation Process",
    url: "https://genorma.com/en/standards/iec-63521-ed1",
    inDevelopment: true,
  },
  {
    number: "10.",
    title: "ISO/IEC 27001 — Information Security Management System",
    url: "https://www.iso.org/standard/27001",
  },
];

export default function StandardsList() {
  return (
    <ul className="mt-3 space-y-2">
      {STANDARDS.map((std) => (
        <li key={std.number} className="flex gap-2 text-sm leading-[22px] text-ink">
          <span className="flex-shrink-0 text-ink-muted">{std.number}</span>
          <span>
            <a
              href={std.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand hover:underline"
            >
              {std.title}
            </a>
            {std.inDevelopment ? (
              <span className="ml-1.5 text-xs text-ink-muted">
                (belum diterbitkan — masih dalam pengembangan di IEC)
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
