import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { getProviderAppointment, updateAppointmentStatus } from "../../firebase/providerAppointments";
import { getConsultationNote, saveConsultationNote } from "../../firebase/consultationNotes";
import { Spinner } from "../../../components/ui/LoadingSpinner";
import VideoCallModal from "../../components/VideoCallModal";
import ChatThread from "../../components/provider/ChatThread";

const STATUS_STYLES = {
  confirmed: "bg-clinical-mint text-clinical-emerald-dark",
  completed: "bg-clinical-success/15 text-clinical-success",
  cancelled: "bg-clinical-border text-clinical-ink-soft",
};

export default function ProviderAppointmentPage() {
  const { appointmentId } = useParams();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showCall, setShowCall] = useState(false);

  const [note, setNote] = useState("");
  const [noteLoaded, setNoteLoaded] = useState(false);
  const [noteStatus, setNoteStatus] = useState("idle");

  useEffect(() => {
    let cancelled = false;
    getProviderAppointment(user.uid, appointmentId).then((data) => {
      if (!cancelled) {
        setAppointment(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user.uid, appointmentId]);

  useEffect(() => {
    let cancelled = false;
    getConsultationNote(appointmentId)
      .then((existing) => {
        if (!cancelled) setNote(existing?.note ?? "");
      })
      .catch((err) => console.error("Failed to load consultation note:", err))
      .finally(() => {
        if (!cancelled) setNoteLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [appointmentId]);

  async function handleUpdateStatus(status) {
    setUpdating(true);
    try {
      await updateAppointmentStatus(user.uid, appointment.memberUid, appointmentId, status);
      setAppointment((prev) => ({ ...prev, status }));
    } catch (err) {
      console.error("Failed to update appointment status:", err);
    } finally {
      setUpdating(false);
    }
  }

  async function handleSaveNote() {
    setNoteStatus("loading");
    try {
      await saveConsultationNote(user.uid, appointment.memberUid, appointmentId, note);
      setNoteStatus("success");
    } catch (err) {
      console.error("Failed to save consultation note:", err);
      setNoteStatus("error");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Loading appointment" />
      </div>
    );
  }
  if (!appointment) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-sm text-clinical-ink-soft">We couldn&apos;t find that appointment.</p>
        <Link to="/provider/dashboard" className="mt-4 inline-block text-sm font-semibold text-clinical-teal-dark">
          &larr; Back to dashboard
        </Link>
      </div>
    );
  }

  const isOnline = appointment.mode === "Online";
  const isChat = appointment.mode === "Chat";

  return (
    <div className="mx-auto max-w-lg px-6 py-8">
      <Link
        to="/provider/dashboard?tab=appointments"
        className="text-sm font-semibold text-clinical-emerald-dark"
      >
        &larr; Back to appointments
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-clinical-heading flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clinical-mint text-sm font-extrabold text-clinical-emerald-dark">
            {(appointment.memberName || "M").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-clinical-heading text-base font-bold text-clinical-ink">
              {appointment.memberName || "Member"}
            </h1>
            <p className="text-xs text-clinical-ink-soft">
              {appointment.dateLabel}, {appointment.time} &middot; {appointment.mode}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${
            STATUS_STYLES[appointment.status] ?? STATUS_STYLES.confirmed
          }`}
        >
          {appointment.status}
        </span>
      </div>

      {isOnline ? (
        <div className="mt-5 flex flex-col items-center gap-3 rounded-2xl bg-clinical-ink px-6 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
              <rect x="2" y="6" width="14" height="12" rx="2" />
              <path d="M16 10l4-2v8l-4-2" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-white">Video session with {appointment.memberName}</p>
          <p className="text-xs text-white/60">Join when you&apos;re both connected.</p>
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
      ) : isChat ? (
        <div className="mt-5">
          <ChatThread
            appointmentId={appointmentId}
            providerId={user.uid}
            memberUid={appointment.memberUid}
            currentUid={user.uid}
            otherPartyName={appointment.memberName}
          />
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-clinical-border bg-clinical-surface p-5">
          <h2 className="font-clinical-heading text-sm font-bold text-clinical-ink">In-person appointment</h2>
          <p className="mt-1.5 text-xs text-clinical-ink-soft">
            {appointment.memberName} will see your saved practice address for this booking.
          </p>
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-clinical-border bg-clinical-surface p-4">
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="text-clinical-ink-soft">Fee</span>
          <span className="font-bold text-clinical-ink">{appointment.fee}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-clinical-ink-soft">Status</span>
          <span className="font-bold capitalize text-clinical-ink">{appointment.status}</span>
        </div>
      </div>

      {appointment.status === "confirmed" && (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={updating}
            onClick={() => handleUpdateStatus("completed")}
            className="font-clinical-heading flex-1 rounded-full bg-clinical-emerald py-3 text-sm font-bold text-white shadow-card transition-colors hover:bg-clinical-emerald-dark disabled:opacity-60"
          >
            Mark complete
          </button>
          <button
            type="button"
            disabled={updating}
            onClick={() => handleUpdateStatus("cancelled")}
            className="font-clinical-heading flex-1 rounded-full border-[1.5px] border-clinical-border py-3 text-sm font-bold text-clinical-ink-soft transition-colors hover:border-clinical-crisis hover:text-clinical-crisis disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="mt-5 rounded-2xl bg-clinical-mint/50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-clinical-emerald-dark">Session notes</p>
        {!noteLoaded ? (
          <div className="flex justify-center py-4">
            <Spinner size="sm" label="Loading notes" />
          </div>
        ) : (
          <>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="What happened in this session, follow-ups, anything worth remembering..."
              className="mt-2 w-full resize-none rounded-lg border border-clinical-border bg-white p-2.5 text-sm outline-none transition-colors focus:border-clinical-emerald"
            />
            {noteStatus === "error" && (
              <p className="mt-1.5 text-xs text-red-600">Something went wrong. Please try again.</p>
            )}
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={noteStatus === "loading"}
                className="font-clinical-heading rounded-full bg-clinical-emerald px-4 py-1.5 text-xs font-bold text-white shadow-card transition-colors hover:bg-clinical-emerald-dark disabled:opacity-60"
              >
                {noteStatus === "loading" ? "Saving..." : "Save notes"}
              </button>
              {noteStatus === "success" && (
                <span className="text-xs font-semibold text-clinical-success">Saved.</span>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-clinical-ink-soft">
              Visible to {appointment.memberName || "the member"} on their session page.
            </p>
          </>
        )}
      </div>

      {showCall && (
        <VideoCallModal providerName={appointment.memberName} onClose={() => setShowCall(false)} />
      )}
    </div>
  );
}
