import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getAppointment } from "../firebase/appointments";

export default function SessionPage() {
  const { appointmentId } = useParams();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAppointment(user.uid, appointmentId).then((data) => {
      if (!cancelled) {
        setAppointment(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user.uid, appointmentId]);

  if (loading) {
    return <p className="mx-auto max-w-lg px-6 py-16 text-center text-sm text-clinical-ink-soft">Loading...</p>;
  }
  if (!appointment) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-sm text-clinical-ink-soft">We couldn&apos;t find that appointment.</p>
        <Link to="/app/care" className="mt-4 inline-block text-sm font-semibold text-clinical-teal-dark">
          &larr; Back to find a provider
        </Link>
      </div>
    );
  }

  const isOnline = appointment.mode === "Online";

  return (
    <div className="mx-auto max-w-lg px-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-clinical-heading text-base font-bold text-clinical-ink">
          Session with {appointment.providerName}
        </h1>
        <span className="rounded-full bg-clinical-teal-soft px-2.5 py-1 text-[11px] font-bold text-clinical-teal-dark">
          Upcoming
        </span>
      </div>
      <p className="mt-0.5 text-xs text-clinical-ink-soft">
        {appointment.dateLabel}, {appointment.time} &middot; {appointment.mode} &middot; 50 min
      </p>

      {isOnline ? (
        <div className="mt-4 flex aspect-[3/4] flex-col items-center justify-center gap-3 rounded-2xl bg-clinical-ink px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
              <rect x="2" y="6" width="14" height="12" rx="2" />
              <path d="M16 10l4-2v8l-4-2" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-white">Video session via Zoom</p>
          <p className="text-xs text-white/60">
            Zoom integration is not connected yet — this is where the live video will appear once
            the account is set up.
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-clinical-border bg-clinical-surface p-5">
          <h2 className="font-clinical-heading text-sm font-bold text-clinical-ink">
            In-person appointment
          </h2>
          <p className="mt-1.5 text-xs text-clinical-ink-soft">
            Practice location details aren&apos;t available yet — providers need to add their
            address before this can show directions.
          </p>
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-clinical-border bg-clinical-surface p-4">
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="text-clinical-ink-soft">Provider</span>
          <span className="font-bold text-clinical-ink">{appointment.providerName}</span>
        </div>
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="text-clinical-ink-soft">Fee</span>
          <span className="font-bold text-clinical-ink">{appointment.fee}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-clinical-ink-soft">Status</span>
          <span className="font-bold text-clinical-ink capitalize">{appointment.status}</span>
        </div>
      </div>

      <Link
        to={`/app/follow-up/${appointmentId}`}
        className="font-clinical-heading mt-5 block rounded-full bg-clinical-amber px-5 py-3.5 text-center text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark"
      >
        Session complete &mdash; leave feedback
      </Link>
    </div>
  );
}
