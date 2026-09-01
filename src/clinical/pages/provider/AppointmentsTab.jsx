import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProviderAppointments, updateAppointmentStatus } from "../../firebase/providerAppointments";
import { toLocalIsoDate } from "../../utils/slotGeneration";
import { Spinner } from "../../../components/ui/LoadingSpinner";

const STATUS_STYLES = {
  confirmed: "bg-clinical-mint text-clinical-emerald-dark",
  completed: "bg-clinical-success/15 text-clinical-success",
  cancelled: "bg-clinical-border text-clinical-ink-soft",
};

const STATUS_DOTS = {
  confirmed: "bg-clinical-emerald",
  completed: "bg-clinical-success",
  cancelled: "bg-clinical-ink-soft",
};

const AVATAR_TINTS = [
  "bg-clinical-mint text-clinical-emerald-dark",
  "bg-clinical-sky text-clinical-sky-dark",
  "bg-clinical-amber/25 text-clinical-amber-dark",
];

function avatarTint(name) {
  const seed = (name || "?").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_TINTS[seed % AVATAR_TINTS.length];
}

function AppointmentRow({ appointment, onUpdateStatus, updating }) {
  return (
    <div className="rounded-2xl border border-clinical-border bg-clinical-surface p-4 shadow-card transition-shadow duration-150 hover:shadow-lg">
      <Link to={`/provider/appointments/${appointment.id}`} className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`font-clinical-heading flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${avatarTint(
              appointment.memberName
            )}`}
          >
            {(appointment.memberName || "M").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-clinical-ink">{appointment.memberName || "Member"}</p>
            <p className="mt-0.5 text-xs text-clinical-ink-soft">
              {appointment.dateLabel}, {appointment.time} &middot; {appointment.mode} &middot; {appointment.fee}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
            STATUS_STYLES[appointment.status] ?? STATUS_STYLES.confirmed
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[appointment.status] ?? STATUS_DOTS.confirmed}`} />
          {appointment.status}
        </span>
      </Link>

      {appointment.status === "confirmed" && (
        <div className="mt-3.5 flex gap-2 pl-13">
          <button
            type="button"
            disabled={updating}
            onClick={() => onUpdateStatus(appointment, "completed")}
            className="font-clinical-heading flex-1 rounded-full bg-clinical-emerald py-2 text-xs font-bold text-white shadow-card transition-colors hover:bg-clinical-emerald-dark disabled:opacity-60"
          >
            Mark complete
          </button>
          <button
            type="button"
            disabled={updating}
            onClick={() => onUpdateStatus(appointment, "cancelled")}
            className="font-clinical-heading flex-1 rounded-full border-[1.5px] border-clinical-border py-2 text-xs font-bold text-clinical-ink-soft transition-colors hover:border-clinical-crisis hover:text-clinical-crisis disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      )}

      <Link
        to={`/provider/appointments/${appointment.id}`}
        className="mt-2.5 inline-block pl-13 text-xs font-semibold text-clinical-emerald-dark"
      >
        View details &rarr;
      </Link>
    </div>
  );
}

export default function AppointmentsTab({ providerId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    listProviderAppointments(providerId)
      .then((result) => {
        if (!cancelled) setAppointments(result);
      })
      .catch((err) => {
        console.error("Failed to load appointments:", err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [providerId]);

  async function handleUpdateStatus(appointment, status) {
    setUpdatingId(appointment.id);
    try {
      await updateAppointmentStatus(providerId, appointment.memberUid, appointment.id, status);
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointment.id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error("Failed to update appointment status:", err);
    } finally {
      setUpdatingId(null);
    }
  }

  const today = toLocalIsoDate(new Date());
  const upcoming = appointments.filter((a) => a.status === "confirmed" && a.isoDate >= today);
  const history = appointments.filter((a) => a.status !== "confirmed" || a.isoDate < today);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="sm" label="Loading appointments" />
      </div>
    );
  }
  if (error) {
    return (
      <p className="py-6 text-center text-sm text-clinical-ink-soft">
        Couldn&apos;t load your appointments right now — please try again shortly.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-clinical-ink-soft">Upcoming</p>
        <div className="mt-2.5 flex flex-col gap-3">
          {upcoming.length ? (
            upcoming.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
                onUpdateStatus={handleUpdateStatus}
                updating={updatingId === appointment.id}
              />
            ))
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-clinical-border bg-clinical-surface/60 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-clinical-mint text-xl">📅</span>
              <p className="mt-1 text-sm font-bold text-clinical-ink">No upcoming appointments</p>
              <p className="text-xs text-clinical-ink-soft">New bookings will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-clinical-ink-soft">Past</p>
          <div className="mt-2 flex flex-col gap-3">
            {history.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
                onUpdateStatus={handleUpdateStatus}
                updating={updatingId === appointment.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
