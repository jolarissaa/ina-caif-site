import Link from "next/link";
import TutorialTrigger from "./TutorialTrigger";

const NAV_LINKS = [
  { href: "/produk", label: "Produk Saya" },
  { href: "/regulasi", label: "Pustaka Regulasi" },
  { href: "/tentang", label: "Tentang INA-CAIF" },
];

export default function Header() {
  return (
    <header className="no-print border-b border-border-subtle bg-surface">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link
          href="/"
          data-tutorial="header-logo"
          className="font-display text-lg font-bold text-brand-dark"
        >
          INA-CAIF
        </Link>
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-tutorial={link.href === "/regulasi" ? "nav-pustaka" : undefined}
              className="text-sm font-medium text-ink-muted hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
          <TutorialTrigger />
        </nav>
      </div>
    </header>
  );
}
