import Container from "../ui/Container";
import Logo from "../ui/Logo";
import { footerColumns, socialLinks } from "../../data/footerLinks";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <Container className="grid gap-10 py-16 md:grid-cols-[1.2fr_repeat(4,1fr)]">
        <div className="flex flex-col gap-4">
          <Logo light />
          <p className="max-w-xs text-sm text-white/60">
            Mental health support and tools for everyday life.
          </p>
          <div className="flex gap-3">
            <span className="rounded-lg border border-white/20 px-4 py-2 text-xs font-medium">
              App Store
            </span>
            <span className="rounded-lg border border-white/20 px-4 py-2 text-xs font-medium">
              Google Play
            </span>
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.heading} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white">{column.heading}</h3>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/60 hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <Container className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-white/50 sm:flex-row">
        <p>© {year} mindcare Inc. All rights reserved.</p>

        <div className="flex gap-4">
          {socialLinks.map((social) => (
            <a key={social.label} href={social.href} className="hover:text-white">
              {social.label}
            </a>
          ))}
        </div>

        <span>English</span>
      </Container>
    </footer>
  );
}
