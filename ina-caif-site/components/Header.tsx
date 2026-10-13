import Link from "next/link";

const NAV_LINKS = [
  { href: "/checklist", label: "Compliance Checker" },
  { href: "/regulasi", label: "Pustaka Regulasi" },
  { href: "/tentang", label: "Tentang INA-CAIF" },
];

export default function Header() {
  return (
    <header className="no-print border-b border-border-subtle bg-surface">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold text-brand-dark">
          INA-CAIF
        </Link>
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-muted hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
