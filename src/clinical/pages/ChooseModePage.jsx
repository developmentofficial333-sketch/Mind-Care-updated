import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { providers } from "../data/providers";

const MODES = [
  { id: "online", label: "Online", description: "Secure video or audio session" },
  { id: "inperson", label: "In-person", description: "Visit the provider's practice location" },
  { id: "either", label: "Either", description: "Show me the earliest available option" },
];

export default function ChooseModePage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const provider = providers.find((p) => p.id === providerId);
  const [mode, setMode] = useState("online");

  if (!provider) return <Navigate to="/app/care" replace />;

  return (
    <div className="mx-auto max-w-lg px-6 py-9">
      <span className="text-xs font-bold text-clinical-teal-dark">STEP 2 OF 2</span>
      <h1 className="font-clinical-heading mt-1.5 text-2xl font-bold text-clinical-ink">
        How would you like to meet?
      </h1>

      <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-clinical-teal-soft p-3">
        <div className="font-clinical-heading flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-clinical-surface text-xs font-extrabold text-clinical-teal-dark">
          {provider.initials}
        </div>
        <div>
          <p className="text-sm font-bold text-clinical-ink">{provider.name}</p>
          <p className="text-[11px] text-clinical-ink-soft">
            {provider.credentials} &middot; Fee may vary by modality
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {MODES.map((option) => {
          const isSelected = mode === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setMode(option.id)}
              className={`flex items-center gap-3.5 rounded-2xl border-2 p-4 text-left ${
                isSelected
                  ? "border-clinical-teal bg-clinical-teal-soft"
                  : "border-clinical-border bg-clinical-surface"
              }`}
            >
              <div className="flex-1">
                <h3 className="font-clinical-heading text-sm font-bold text-clinical-ink">
                  {option.label}
                </h3>
                <p className="mt-0.5 text-xs text-clinical-ink-soft">{option.description}</p>
              </div>
              {isSelected && <span className="text-lg font-extrabold text-clinical-teal-dark">&#10003;</span>}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => navigate(`/app/book/${provider.id}/${mode}`)}
        className="font-clinical-heading mt-6 w-full rounded-full bg-clinical-amber px-5 py-3.5 text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark"
      >
        Continue to booking
      </button>
    </div>
  );
}
