import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import NavDropdown from "./NavDropdown";
import { useAuth } from "../../hooks/useAuth";
import { primaryNavLinks, utilityNavLinks } from "../../data/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" aria-label="Home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {primaryNavLinks.map((link) =>
            link.submenu ? (
              <NavDropdown key={link.label} label={link.label} submenu={link.submenu} />
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-ink-soft hover:text-ink"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          {utilityNavLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-medium text-ink-soft hover:text-ink">
              {link.label}
            </a>
          ))}

          {user ? (
            <Button as={Link} to="/account" variant="primary">
              My account
            </Button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink-soft hover:text-ink">
                Log In
              </Link>
              <Button as={Link} to="/signup" variant="primary">
                Try for free
              </Button>
            </>
          )}
        </div>

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
            {primaryNavLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-ink">
                {link.label}
              </a>
            ))}
            {utilityNavLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-ink">
                {link.label}
              </a>
            ))}

            {user ? (
              <Button as={Link} to="/account" variant="primary" className="w-full">
                My account
              </Button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-ink">
                  Log In
                </Link>
                <Button as={Link} to="/signup" variant="primary" className="w-full">
                  Try for free
                </Button>
              </>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
