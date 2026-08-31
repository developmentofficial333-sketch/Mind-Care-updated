import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getAppointment } from "../firebase/appointments";
import { getApprovedProvider } from "../firebase/providers";
import { getConsultationNote } from "../firebase/consultationNotes";
import VideoCallModal from "../components/VideoCallModal";

export default function SessionPage() {
  const { appointmentId } = useParams();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [provider, setProvider] = useState(null);
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCall, setShowCall] = useState(false);

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

  // Only needed for the in-person address block below — appointments don't
  // store the provider's address themselves (it can change after booking).
  useEffect(() => {
    if (!appointment || appointment.mode === "Online") return;
    let cancelled = false;
    getApprovedProvider(appointment.providerId)
      .then((result) => {
        if (!cancelled) setProvider(result);
      })
      .catch((err) => console.error("Failed to load provider:", err));
    return () => {
      cancelled = true;
    };
  }, [appointment]);

  useEffect(() => {
    let cancelled = false;
    getConsultationNote(appointmentId)
      .then((result) => {
        if (!cancelled) setNote(result?.note || null);
      })
      .catch((err) => console.error("Failed to load consultation note:", err));
    return () => {
      cancelled = true;
    };
  }, [appointmentId]);

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
        <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl bg-clinical-ink px-6 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
              <rect x="2" y="6" width="14" height="12" rx="2" />
              <path d="M16 10l4-2v8l-4-2" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-white">Video session with {appointment.providerName}</p>
          <p className="text-xs text-white/60">
            Your secure video room is ready. Join when you&apos;re both connected.
          </p>
          <button
            type="button"
            onClick={() => setShowCall(true)}
            className="font-clinical-heading mt-1 flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-clinical-ink hover:bg-white/90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="6" width="14" height="12" rx="2" />
              <path d="M16 10l4-2v8l-4-2" />
            </svg>
            Join Secure Video Consultation
          </button>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-clinical-border bg-clinical-surface p-5">
          <h2 className="font-clinical-heading text-sm font-bold text-clinical-ink">
            In-person appointment
          </h2>
          {provider?.address ? (
            <p className="mt-1.5 text-xs text-clinical-ink-soft">{provider.address}</p>
          ) : (
            <p className="mt-1.5 text-xs text-clinical-ink-soft">
              Practice location details aren&apos;t available yet — {appointment.providerName}{" "}
              hasn&apos;t added an address.
            </p>
          )}
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

      {note && (
        <div className="mt-5 rounded-2xl border border-clinical-border bg-clinical-surface p-4">
          <p className="text-xs font-bold text-clinical-ink-soft">SESSION NOTES</p>
          <p className="mt-1.5 whitespace-pre-wrap text-sm text-clinical-ink">{note}</p>
          <p className="mt-2 text-[11px] text-clinical-ink-soft">
            From {appointment.providerName}.
          </p>
        </div>
      )}

      <Link
        to={`/app/follow-up/${appointmentId}`}
        className="font-clinical-heading mt-5 block rounded-full bg-clinical-amber px-5 py-3.5 text-center text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark"
      >
        Session complete &mdash; leave feedback
      </Link>

      {showCall && (
        <VideoCallModal providerName={appointment.providerName} onClose={() => setShowCall(false)} />
      )}
    </div>
  );
}
