import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../../firebase/auth";
import { getAuthErrorMessage } from "../../firebase/authErrors";
import { getProviderProfile } from "../firebase/providerProfiles";

export default function ClinicalLoginPage() {
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
      // providerProfile fetch) so an approved provider lands on their
      // dashboard immediately on this same login, not one render late.
      const providerProfile = await getProviderProfile(credential.user.uid).catch(() => null);
      const isApprovedProvider = providerProfile?.role === "provider" && providerProfile?.status === "approved";
      navigate(isApprovedProvider ? "/provider/dashboard" : "/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(getAuthErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-9">
      <h1 className="font-clinical-heading text-2xl font-bold text-clinical-ink">Log in</h1>
      <p className="mt-1.5 text-sm text-clinical-ink-soft">Welcome back to MindCare.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-clinical-ink">Email address</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-clinical-border bg-clinical-surface px-3 py-2.5 text-sm outline-none focus:border-clinical-teal"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-clinical-ink">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-clinical-border bg-clinical-surface px-3 py-2.5 text-sm outline-none focus:border-clinical-teal"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="font-clinical-heading mt-1 rounded-full bg-clinical-amber px-5 py-3.5 text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-3.5 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/app/register" className="font-semibold text-clinical-teal-dark">
          Create one
        </Link>
      </p>
    </div>
  );
}
