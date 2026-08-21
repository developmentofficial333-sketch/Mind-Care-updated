import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import NavDropdown from "./NavDropdown";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { logOut } from "../../firebase/auth";
import { primaryNavLinks, utilityNavLinks } from "../../data/navigation";

// Nav labels that have a translation wired up — everything else in
// primaryNavLinks/utilityNavLinks renders as-is regardless of language.
const NAV_LABEL_KEYS = { "For You": "nav.forYou", Resources: "nav.resources" };

// Real internal routes (href starting with "/") get SPA navigation; the
// still-unbuilt placeholder links ("#") stay as plain anchors.
function NavLink({ href, className, children }) {
  return href.startsWith("/") ? (
    <Link to={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function navLabel(link, t) {
  const key = NAV_LABEL_KEYS[link.label];
  return key ? t(key) : link.label;
}

function LanguageToggle({ className = "" }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center rounded-pill border border-border bg-white p-0.5 text-xs font-semibold ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`rounded-pill px-2.5 py-1 transition-colors ${
          language === "en" ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("ur")}
        aria-pressed={language === "ur"}
        className={`rounded-pill px-2.5 py-1 transition-colors ${
          language === "ur" ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
        }`}
      >
        اردو
      </button>
    </div>
  );
}

function dashboardPathFor({ isAdmin, isApprovedProvider }) {
  if (isAdmin) return "/admin";
  if (isApprovedProvider) return "/provider/dashboard";
  return "/dashboard";
}

function AccountMenu({ user, isAdmin, isApprovedProvider }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleLogOut() {
    setOpen(false);
    try {
      await logOut();
    } catch (err) {
      console.error("Log out failed:", err);
    }
    navigate("/");
  }

  const initial = (user.displayName || user.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-white hover:bg-brand-blue-dark"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-48 rounded-lg border border-border bg-white p-2 shadow-card">
          <p className="truncate px-3 py-1.5 text-xs text-ink-soft">{user.email}</p>
          <Link
            to={dashboardPathFor({ isAdmin, isApprovedProvider })}
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-surface"
          >
            {t("nav.myDashboard")}
          </Link>
          <button
            type="button"
            onClick={handleLogOut}
            className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-ink hover:bg-surface"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin, isApprovedProvider } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const dashboardPath = dashboardPathFor({ isAdmin, isApprovedProvider });

  async function handleMobileLogOut() {
    setMenuOpen(false);
    try {
      await logOut();
    } catch (err) {
      console.error("Log out failed:", err);
    }
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" aria-label="Home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {primaryNavLinks.map((link) =>
            link.submenu ? (
              <NavDropdown key={link.label} label={link.label} href={link.href} submenu={link.submenu} />
            ) : (
              <NavLink
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-ink-soft hover:text-ink"
              >
                {navLabel(link, t)}
              </NavLink>
            )
          )}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          {utilityNavLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-medium text-ink-soft hover:text-ink">
              {link.label}
            </a>
          ))}

          <LanguageToggle />

          {user ? (
            <div className="flex items-center gap-3">
              <Button as={Link} to={dashboardPath} variant="primary">
                {t("nav.myDashboard")}
              </Button>
              <AccountMenu user={user} isAdmin={isAdmin} isApprovedProvider={isApprovedProvider} />
            </div>
          ) : (
            <>
              <Link to="/app/login" className="text-sm font-medium text-ink-soft hover:text-ink">
                {t("nav.logIn")}
              </Link>
              <Button as={Link} to="/app/register" variant="primary">
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
              <NavLink key={link.label} href={link.href} className="text-sm font-medium text-ink">
                {navLabel(link, t)}
              </NavLink>
            ))}
            {utilityNavLinks.map((link) => (
              <NavLink key={link.label} href={link.href} className="text-sm font-medium text-ink">
                {link.label}
              </NavLink>
            ))}

            <LanguageToggle className="self-start" />

            {user ? (
              <>
                <Button as={Link} to={dashboardPath} variant="primary" className="w-full">
                  {t("nav.myDashboard")}
                </Button>
                <button
                  type="button"
                  onClick={handleMobileLogOut}
                  className="text-left text-sm font-medium text-ink"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/app/login" className="text-sm font-medium text-ink">
                  {t("nav.logIn")}
                </Link>
                <Button as={Link} to="/app/register" variant="primary" className="w-full">
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
