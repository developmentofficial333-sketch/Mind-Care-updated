import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/ui/Logo";
import { signIn, logOut } from "../../firebase/auth";
import { getAuthErrorMessage } from "../../firebase/authErrors";
import { getAdminProfile } from "../../firebase/adminAccess";

function ShieldGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

const BRAND_POINTS = [
  "Review credentials submitted through the provider application form.",
  "Approve or reject applicants with a full audit trail.",
  "Access is granted by MindCare's team, not self-serve.",
];

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const credential = await signIn(email, password);

      // Checked directly here (rather than waiting on AuthProvider's own
      // admin-profile fetch) so a non-admin account is rejected immediately
      // on this same submit, instead of briefly landing on /admin first.
      const adminProfile = await getAdminProfile(credential.user.uid).catch(() => null);
      if (adminProfile?.role !== "admin") {
        await logOut();
        setError("This account doesn't have admin access.");
        return;
      }

      navigate("/admin");
    } catch (err) {
      console.error("Admin login failed:", err);
      setError(getAuthErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel — hidden on small screens, the form alone is enough there */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink px-12 py-12 text-white lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-orange/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-brand-blue/25 blur-3xl"
        />

        <Logo light />

        <div className="relative">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10">
            <ShieldGlyph />
          </span>
          <h1 className="mt-6 max-w-sm text-3xl font-semibold leading-tight tracking-tight">
            Provider verification, in one place.
          </h1>
          <ul className="mt-8 flex flex-col gap-4">
            {BRAND_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-white/70">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">MindCare &middot; Internal admin tools</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-ink">Admin sign in</h2>
          <p className="mt-2 text-sm text-gray-500">Sign in with your MindCare admin account.</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-ink">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink focus:ring-1 focus:ring-ink"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink focus:ring-1 focus:ring-ink"
              />
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-lg bg-ink px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-cta-bg-hover disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
