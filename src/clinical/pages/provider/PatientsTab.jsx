import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProviderPatients } from "../../firebase/providerPatients";
import { Spinner } from "../../../components/ui/LoadingSpinner";

function formatLastVisit(timestamp) {
  if (!timestamp?.seconds) return "—";
  return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const AVATAR_TINTS = [
  "bg-clinical-mint text-clinical-emerald-dark",
  "bg-clinical-sky text-clinical-sky-dark",
  "bg-clinical-amber/25 text-clinical-amber-dark",
  "bg-clinical-teal-soft text-clinical-teal-dark",
];

function avatarTint(name) {
  const seed = (name || "?").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_TINTS[seed % AVATAR_TINTS.length];
}

export default function PatientsTab({ providerId }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listProviderPatients(providerId)
      .then((result) => {
        if (!cancelled) setPatients(result);
      })
      .catch((err) => {
        console.error("Failed to load patients:", err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [providerId]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="sm" label="Loading patients" />
      </div>
    );
  }
  if (error) {
    return (
      <p className="py-6 text-center text-sm text-clinical-ink-soft">
        Couldn&apos;t load your patients right now — please try again shortly.
      </p>
    );
  }
  if (!patients.length) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-clinical-border bg-clinical-surface/60 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-clinical-mint text-xl">👥</span>
        <p className="mt-1 text-sm font-bold text-clinical-ink">No patients yet</p>
        <p className="max-w-xs text-xs text-clinical-ink-soft">
          Once someone books a session with you, they&apos;ll show up here with their history.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {patients.map((patient) => (
        <Link
          key={patient.memberUid}
          to={`/provider/patients/${patient.memberUid}`}
          className="group flex items-center gap-3.5 rounded-2xl border border-clinical-border bg-clinical-surface px-4 py-3.5 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:border-clinical-emerald hover:shadow-lg"
        >
          <div
            className={`font-clinical-heading flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${avatarTint(
              patient.memberName
            )}`}
          >
            {(patient.memberName || "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-clinical-ink">{patient.memberName || "Member"}</p>
            <p className="text-xs text-clinical-ink-soft">Last visit {formatLastVisit(patient.lastBookedAt)}</p>
          </div>
          <span className="shrink-0 text-xs font-semibold text-clinical-emerald-dark transition-transform duration-150 group-hover:translate-x-0.5">
            View &rarr;
          </span>
        </Link>
      ))}
    </div>
  );
}
