import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useProviderAvailabilityForm } from "../../hooks/useProviderAvailabilityForm";
import { listProviderAppointments, updateAppointmentStatus } from "../firebase/providerAppointments";
import { getConsultationNote, saveConsultationNote } from "../firebase/consultationNotes";
import { toLocalIsoDate } from "../utils/slotGeneration";
import { Spinner } from "../../components/ui/LoadingSpinner";

// Displayed Monday-first (a work week), but keyed by Date.getDay() values
// ("0"-"6", Sun-Sat) to match providerAvailability.js's schema and
// slotGeneration.js's lookup.
const WEEKDAYS = [
  { key: "1", label: "Monday" },
  { key: "2", label: "Tuesday" },
  { key: "3", label: "Wednesday" },
  { key: "4", label: "Thursday" },
  { key: "5", label: "Friday" },
  { key: "6", label: "Saturday" },
  { key: "0", label: "Sunday" },
];

const STATUS_STYLES = {
  confirmed: "bg-clinical-teal-soft text-clinical-teal-dark",
  completed: "bg-clinical-success/15 text-clinical-success",
  cancelled: "bg-clinical-border text-clinical-ink-soft",
};

function SessionNotes({ providerId, appointment }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [note, setNote] = useState("");
  const [hasNote, setHasNote] = useState(false);
  const [status, setStatus] = useState("idle");

  function handleOpen() {
    setOpen(true);
    if (loaded) return;
    getConsultationNote(appointment.id)
      .then((existing) => {
        setNote(existing?.note ?? "");
        setHasNote(Boolean(existing?.note));
      })
      .catch((err) => console.error("Failed to load consultation note:", err))
      .finally(() => setLoaded(true));
  }

  async function handleSave() {
    setStatus("loading");
    try {
      await saveConsultationNote(providerId, appointment.memberUid, appointment.id, note);
      setHasNote(Boolean(note));
      setStatus("success");
    } catch (err) {
      console.error("Failed to save consultation note:", err);
      setStatus("error");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="mt-3 text-xs font-semibold text-clinical-teal-dark"
      >
        {hasNote ? "Edit notes" : "Add notes"}
      </button>
    );
  }

  return (
    <div className="mt-3 border-t border-clinical-border pt-3">
      <p className="text-xs font-bold text-clinical-ink-soft">SESSION NOTES</p>
      {!loaded ? (
        <div className="flex justify-center py-4">
          <Spinner size="sm" label="Loading notes" />
        </div>
      ) : (
        <>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="What happened in this session, follow-ups, anything worth remembering..."
            className="mt-2 w-full resize-none rounded-lg border border-clinical-border bg-white p-2.5 text-xs outline-none focus:border-clinical-teal"
          />
          {status === "error" && (
            <p className="mt-1.5 text-xs text-red-600">Something went wrong. Please try again.</p>
          )}
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={status === "loading"}
              className="font-clinical-heading rounded-full bg-clinical-amber px-4 py-1.5 text-xs font-bold text-clinical-ink hover:bg-clinical-amber-dark disabled:opacity-60"
            >
              {status === "loading" ? "Saving..." : "Save notes"}
            </button>
            {status === "success" && (
              <span className="text-xs font-semibold text-clinical-success">Saved.</span>
            )}
          </div>
          <p className="mt-1.5 text-[11px] text-clinical-ink-soft">
            Visible to {appointment.memberName || "the member"} on their session page.
          </p>
        </>
      )}
    </div>
  );
}

function AppointmentRow({ providerId, appointment, onUpdateStatus, updating }) {
  return (
    <div className="rounded-2xl border border-clinical-border bg-clinical-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-clinical-ink">{appointment.memberName || "Member"}</p>
          <p className="mt-0.5 text-xs text-clinical-ink-soft">
            {appointment.dateLabel}, {appointment.time} &middot; {appointment.mode}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
            STATUS_STYLES[appointment.status] ?? STATUS_STYLES.confirmed
          }`}
        >
          {appointment.status}
        </span>
      </div>
      <p className="mt-2 text-xs text-clinical-ink-soft">{appointment.fee}</p>

      {appointment.status === "confirmed" && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={updating}
            onClick={() => onUpdateStatus(appointment, "completed")}
            className="font-clinical-heading flex-1 rounded-full border-[1.5px] border-clinical-teal py-2 text-xs font-bold text-clinical-teal-dark disabled:opacity-60"
          >
            Mark complete
          </button>
          <button
            type="button"
            disabled={updating}
            onClick={() => onUpdateStatus(appointment, "cancelled")}
            className="font-clinical-heading flex-1 rounded-full border-[1.5px] border-clinical-border py-2 text-xs font-bold text-clinical-ink-soft disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      )}

      <SessionNotes providerId={providerId} appointment={appointment} />
    </div>
  );
}

function AppointmentsTab({ providerId }) {
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
    <div className="mt-5 flex flex-col gap-6">
      <div>
        <p className="text-xs font-bold text-clinical-ink-soft">UPCOMING</p>
        <div className="mt-2 flex flex-col gap-3">
          {upcoming.length ? (
            upcoming.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                providerId={providerId}
                appointment={appointment}
                onUpdateStatus={handleUpdateStatus}
                updating={updatingId === appointment.id}
              />
            ))
          ) : (
            <p className="py-4 text-center text-sm text-clinical-ink-soft">
              No upcoming appointments.
            </p>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div>
          <p className="text-xs font-bold text-clinical-ink-soft">PAST</p>
          <div className="mt-2 flex flex-col gap-3">
            {history.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                providerId={providerId}
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

function AvailabilityTab({ providerId }) {
  const { weekly, loaded, addRange, updateRange, removeRange, status, submit } =
    useProviderAvailabilityForm(providerId);

  if (!loaded) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="sm" label="Loading availability" />
      </div>
    );
  }

  return (
    <div className="mt-5">
      <p className="text-sm text-clinical-ink-soft">
        Set the hours you&apos;re open each week. Members will only be able to book real open
        slots within these hours.
      </p>

      <div className="mt-4 flex flex-col gap-4">
        {WEEKDAYS.map((day) => {
          const ranges = weekly[day.key] || [];
          return (
            <div key={day.key} className="rounded-2xl border border-clinical-border bg-clinical-surface p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-clinical-ink">{day.label}</p>
                <button
                  type="button"
                  onClick={() => addRange(day.key)}
                  className="text-xs font-semibold text-clinical-teal-dark"
                >
                  + Add hours
                </button>
              </div>

              {ranges.length === 0 ? (
                <p className="mt-1.5 text-xs text-clinical-ink-soft">Not working this day.</p>
              ) : (
                <div className="mt-2 flex flex-col gap-2">
                  {ranges.map((range, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={range.start}
                        onChange={(e) => updateRange(day.key, index, "start", e.target.value)}
                        className="rounded-lg border border-clinical-border bg-white px-2 py-1.5 text-xs outline-none focus:border-clinical-teal"
                      />
                      <span className="text-xs text-clinical-ink-soft">to</span>
                      <input
                        type="time"
                        value={range.end}
                        onChange={(e) => updateRange(day.key, index, "end", e.target.value)}
                        className="rounded-lg border border-clinical-border bg-white px-2 py-1.5 text-xs outline-none focus:border-clinical-teal"
                      />
                      <button
                        type="button"
                        onClick={() => removeRange(day.key, index)}
                        aria-label={`Remove ${day.label} range ${index + 1}`}
                        className="ml-auto text-xs font-semibold text-clinical-crisis"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
      {status === "success" && (
        <p className="mt-3 text-sm font-semibold text-clinical-success">Availability saved.</p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={status === "loading"}
        className="font-clinical-heading mt-4 w-full rounded-full bg-clinical-amber px-5 py-3.5 text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark disabled:opacity-60"
      >
        {status === "loading" ? "Saving..." : "Save availability"}
      </button>
    </div>
  );
}

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("appointments");
  const providerId = useMemo(() => user?.uid, [user]);

  return (
    <div className="mx-auto max-w-lg px-6 py-6">
      <h1 className="font-clinical-heading text-xl font-bold text-clinical-ink">
        Provider dashboard
      </h1>

      <div className="mt-5 flex border-b border-clinical-border">
        <button
          type="button"
          onClick={() => setTab("appointments")}
          className={`font-clinical-heading flex-1 border-b-2 py-3 text-sm font-bold ${
            tab === "appointments"
              ? "border-clinical-teal text-clinical-teal-dark"
              : "border-transparent text-clinical-ink-soft"
          }`}
        >
          Appointments
        </button>
        <button
          type="button"
          onClick={() => setTab("availability")}
          className={`font-clinical-heading flex-1 border-b-2 py-3 text-sm font-bold ${
            tab === "availability"
              ? "border-clinical-teal text-clinical-teal-dark"
              : "border-transparent text-clinical-ink-soft"
          }`}
        >
          Availability
        </button>
      </div>

      {tab === "appointments" ? (
        <AppointmentsTab providerId={providerId} />
      ) : (
        <AvailabilityTab providerId={providerId} />
      )}
    </div>
  );
}
