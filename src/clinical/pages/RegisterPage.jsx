import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../firebase/auth";
import { getAuthErrorMessage } from "../../firebase/authErrors";
import { createMemberProfile } from "../firebase/memberProfiles";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!agreed) {
      setError("Please agree to the Privacy Policy and Terms to continue.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const credential = await signUp(email, password);
      await createMemberProfile(credential.user.uid, {
        fullName,
        email,
        preferredLanguage: language,
      });
      navigate("/app/identify-need");
    } catch (err) {
      console.error("Registration failed:", err);
      setError(getAuthErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-9">
      <h1 className="font-clinical-heading text-2xl font-bold text-clinical-ink">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-clinical-ink-soft">
        Choose the language you're most comfortable with — you can change this anytime.
      </p>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`flex-1 rounded-2xl border-2 p-4 text-center ${
            language === "en"
              ? "border-clinical-teal bg-clinical-teal-soft"
              : "border-clinical-border bg-clinical-surface"
          }`}
        >
          <span className="font-clinical-heading text-xl font-extrabold text-clinical-ink">
            English
          </span>
          {language === "en" && (
            <p className="mt-2 text-[11px] font-bold text-clinical-teal-dark">&#10003; Selected</p>
          )}
        </button>
        <button
          type="button"
          onClick={() => setLanguage("ur")}
          className={`flex-1 rounded-2xl border-2 p-4 text-center ${
            language === "ur"
              ? "border-clinical-teal bg-clinical-teal-soft"
              : "border-clinical-border bg-clinical-surface"
          }`}
        >
          <span className="font-clinical-heading text-xl font-extrabold text-clinical-ink">
            اردو
          </span>
          {language === "ur" && (
            <p className="mt-2 text-[11px] font-bold text-clinical-teal-dark">&#10003; Selected</p>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-clinical-ink">Full name</span>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ayesha Khan"
            className="rounded-lg border border-clinical-border bg-clinical-surface px-3 py-2.5 text-sm outline-none focus:border-clinical-teal"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-clinical-ink">Email address</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ayesha@example.com"
            className="rounded-lg border border-clinical-border bg-clinical-surface px-3 py-2.5 text-sm outline-none focus:border-clinical-teal"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-clinical-ink">Password</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-clinical-border bg-clinical-surface px-3 py-2.5 text-sm outline-none focus:border-clinical-teal"
          />
        </label>

        <label className="flex items-start gap-2 text-xs text-clinical-ink-soft">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5"
          />
          I agree to the{" "}
          <Link to="/app/privacy" target="_blank" className="font-semibold underline">
            Privacy Policy and Terms &amp; Conditions
          </Link>
          , including how my identity and clinical data are stored and protected.
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="font-clinical-heading mt-1 rounded-full bg-clinical-amber px-5 py-3.5 text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Continue"}
        </button>
      </form>

      <p className="mt-3.5 text-center text-sm">
        Already have an account?{" "}
        <Link to="/app/login" className="font-semibold text-clinical-teal-dark">
          Log in
        </Link>
      </p>
    </div>
  );
}
