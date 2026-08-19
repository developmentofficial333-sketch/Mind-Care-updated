import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import BusinessNavDropdown from "./BusinessNavDropdown";
import { businessNavLinks } from "../../data/businessNav";

export default function BusinessHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" aria-label="Home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Business">
          {businessNavLinks.map((link, index) => (
            <BusinessNavDropdown
              key={link.label}
              label={link.label}
              items={link.items}
              align={index >= businessNavLinks.length - 2 ? "right" : "left"}
            />
          ))}
        </nav>

        <Button as={Link} to="/request-demo" variant="blue" className="hidden lg:inline-flex">
          Request a demo
        </Button>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="relative block h-4 w-5">
            <span className="absolute left-0 top-0 h-0.5 w-5 bg-ink" />
            <span className="absolute left-0 top-1.5 h-0.5 w-5 bg-ink" />
            <span className="absolute left-0 top-3 h-0.5 w-5 bg-ink" />
          </span>
        </button>
      </Container>

      {menuOpen && (
        <div className="border-t border-border bg-white lg:hidden">
          <Container className="flex flex-col gap-4 py-4">
            {businessNavLinks.map((link) => (
              <a key={link.label} href="#" className="text-sm font-medium text-ink">
                {link.label}
              </a>
            ))}
            <Button as={Link} to="/request-demo" variant="blue" className="w-full">
              Request a demo
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
