import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo";
import { useAuth } from "../hooks/useAuth";
import { logOut } from "../firebase/auth";

function ApplicationsGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

function MenuGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function LogOutGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

const NAV_ITEMS = [{ label: "Applications", href: "/admin", icon: ApplicationsGlyph }];

function SidebarContent({ pathname, user, onLogOut }) {
  const initial = (user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5">
        <Logo />
        <span className="rounded-pill bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-ink text-white" : "text-gray-600 hover:bg-gray-100 hover:text-ink"
              }`}
            >
              <ItemIcon />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue text-xs font-semibold text-white">
            {initial}
          </div>
          <p className="min-w-0 flex-1 truncate text-xs font-medium text-gray-600">{user?.email}</p>
          <button
            type="button"
            onClick={onLogOut}
            aria-label="Log out"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-ink"
          >
            <LogOutGlyph />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  async function handleLogOut() {
    try {
      await logOut();
    } catch (err) {
      console.error("Log out failed:", err);
    }
    navigate("/admin/login");
  }

  // The login screen itself has no sidebar/shell — it's a standalone
  // full-page experience (see AdminLoginPage), so render it bare.
  if (!user) return <Outlet />;

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-gray-200 bg-white lg:block">
        <SidebarContent pathname={location.pathname} user={user} onLogOut={handleLogOut} />
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div className="relative h-full w-60 bg-white shadow-card">
            <SidebarContent pathname={location.pathname} user={user} onLogOut={handleLogOut} />
          </div>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-5 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
          >
            <MenuGlyph />
          </button>
          <Logo />
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
