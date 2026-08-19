import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { saveMemberNeeds } from "../firebase/memberNeeds";

const NEED_OPTIONS = [
  { id: "anxiety", label: "Stress & anxiety" },
  { id: "mood", label: "Low mood" },
  { id: "sleep", label: "Sleep difficulties" },
  { id: "relationships", label: "Relationship concerns" },
  { id: "grief", label: "Grief & loss" },
  { id: "work", label: "Work / study pressure" },
  { id: "other", label: "Something else" },
];

export default function IdentifyNeedPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(new Set(["anxiety"]));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleContinue() {
    setSaving(true);
    setError("");
    try {
      await saveMemberNeeds(user.uid, [...selected]);
      navigate("/app/care");
    } catch (err) {
      console.error("Saving needs failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-9">
      <span className="text-xs font-bold text-clinical-teal-dark">STEP 1 OF 2</span>
      <h1 className="font-clinical-heading mt-1.5 text-2xl font-bold text-clinical-ink">
        What brings you here today?
      </h1>
      <p className="mt-2 text-sm text-clinical-ink-soft">
        Pick as many as apply — this helps us point you to the right support. You can change this
        anytime.
      </p>

      <div className="mt-5 flex flex-wrap gap-2.5">
        {NEED_OPTIONS.map((need) => {
          const isSelected = selected.has(need.id);
          return (
            <button
              key={need.id}
              type="button"
              onClick={() => toggle(need.id)}
              className={`rounded-full border-[1.5px] px-4 py-2.5 text-sm font-semibold ${
                isSelected
                  ? "border-clinical-teal bg-clinical-teal text-white"
                  : "border-clinical-border bg-clinical-surface text-clinical-ink"
              }`}
            >
              {need.label}
            </button>
          );
        })}
      </div>

      <Link
        to="/app/care"
        className="mt-6 block text-center text-sm font-semibold text-clinical-ink-soft"
      >
        Skip for now
      </Link>
      {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={handleContinue}
        disabled={saving}
        className="font-clinical-heading mt-3.5 w-full rounded-full bg-clinical-amber px-5 py-3.5 text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark disabled:opacity-60"
      >
        {saving ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}
