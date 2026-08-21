import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { useAuth } from "../../hooks/useAuth";
import { logOut } from "../../firebase/auth";

function dashboardPathFor({ isAdmin, isApprovedProvider }) {
  if (isAdmin) return "/admin";
  if (isApprovedProvider) return "/provider/dashboard";
  return "/dashboard";
}

function AccountMenu({ user, isAdmin, isApprovedProvider }) {
  const navigate = useNavigate();
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
    navigate("/app");
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
        className="flex h-9 w-9 items-center justify-center rounded-full bg-clinical-teal text-sm font-extrabold text-white hover:bg-clinical-teal-dark"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-52 rounded-xl border border-clinical-border bg-clinical-surface p-2 shadow-card">
          <p className="truncate px-3 py-1.5 text-xs text-clinical-ink-soft">{user.email}</p>
          <Link
            to={dashboardPathFor({ isAdmin, isApprovedProvider })}
            onClick={() => setOpen(false)}
            className="font-clinical-body block rounded-lg px-3 py-2 text-sm font-semibold text-clinical-ink hover:bg-clinical-teal-soft"
          >
            My Dashboard
          </Link>
          <button
            type="button"
            onClick={handleLogOut}
            className="font-clinical-body block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-clinical-ink hover:bg-clinical-teal-soft"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function ClinicalHeader() {
  const { language, setLanguage } = useLanguage();
  const { user, isAdmin, isApprovedProvider } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-clinical-border bg-clinical-surface px-4 py-3.5">
      <Link to="/app" className="flex items-center gap-2" aria-label="MindCare home">
        <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
          <circle cx="13" cy="13" r="13" className="fill-clinical-teal" />
          <path
            d="M8 14c1.5-4 3-4 4.5 0s3 4 4.5 0"
            stroke="white"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-clinical-heading text-base font-bold text-clinical-ink">
          MindCare
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex rounded-full bg-clinical-teal-soft p-0.5">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            aria-pressed={language === "en"}
            className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
              language === "en"
                ? "bg-clinical-surface text-clinical-teal-dark"
                : "text-clinical-ink-soft"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage("ur")}
            aria-pressed={language === "ur"}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              language === "ur"
                ? "bg-clinical-surface font-bold text-clinical-teal-dark"
                : "text-clinical-ink-soft"
            }`}
          >
            اردو
          </button>
        </div>

        {user ? (
          <AccountMenu user={user} isAdmin={isAdmin} isApprovedProvider={isApprovedProvider} />
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/app/login"
              className="font-clinical-body text-sm font-semibold text-clinical-ink-soft hover:text-clinical-ink"
            >
              Log in
            </Link>
            <Link
              to="/app/register"
              className="font-clinical-heading rounded-full bg-clinical-amber px-4 py-2 text-xs font-bold text-clinical-ink hover:bg-clinical-amber-dark"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
