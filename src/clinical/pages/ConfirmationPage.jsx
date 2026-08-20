import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getAppointment } from "../firebase/appointments";
import VideoCallModal from "../components/VideoCallModal";

function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors ${
        on ? "bg-clinical-teal" : "bg-clinical-border"
      }`}
    >
      <span
        className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-all ${
          on ? "left-[20px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function ConfirmationPage() {
  const { appointmentId } = useParams();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailReminder, setEmailReminder] = useState(true);
  const [smsReminder, setSmsReminder] = useState(true);
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

  return (
    <div className="mx-auto max-w-lg px-6 py-9 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-clinical-success">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="font-clinical-heading mt-4 text-2xl font-bold text-clinical-ink">You&apos;re booked!</h1>
      <p className="mt-1.5 text-sm text-clinical-ink-soft">A confirmation has been saved to your account.</p>

      <div className="mt-5 rounded-2xl border border-clinical-border bg-clinical-surface p-4 text-left">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-clinical-ink-soft">Provider</span>
          <span className="font-bold text-clinical-ink">{appointment.providerName}</span>
        </div>
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-clinical-ink-soft">When</span>
          <span className="font-bold text-clinical-ink">
            {appointment.dateLabel}, {appointment.time}
          </span>
        </div>
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-clinical-ink-soft">Modality</span>
          <span className="font-bold text-clinical-ink">{appointment.mode}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-clinical-ink-soft">Fee</span>
          <span className="font-bold text-clinical-ink">{appointment.fee}</span>
        </div>
        {appointment.bookingType === "corporate" && (
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-clinical-ink-soft">
              {appointment.companyName ? `Sponsored by ${appointment.companyName}` : "Sponsored"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-clinical-success/15 px-2.5 py-1 text-[10px] font-bold text-clinical-success">
              &#10003; Corporate Benefit Applied
            </span>
          </div>
        )}
        {appointment.mode === "Online" && (
          <div className="mt-2.5 border-t border-clinical-border pt-2.5">
            <p className="text-[11px] text-clinical-ink-soft">
              Your video link will be emailed and available here 15 minutes before your session.
            </p>
            <button
              type="button"
              onClick={() => setShowCall(true)}
              className="font-clinical-heading mt-2.5 flex w-full items-center justify-center gap-2 rounded-full bg-clinical-ink px-4 py-2.5 text-xs font-bold text-white hover:bg-clinical-ink/90"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="6" width="14" height="12" rx="2" />
                <path d="M16 10l4-2v8l-4-2" />
              </svg>
              Join Secure Video Consultation
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-left">
        <p className="text-xs font-bold text-clinical-ink-soft">REMINDERS</p>
        <div className="flex items-center justify-between border-b border-clinical-border py-3">
          <span className="text-sm font-semibold text-clinical-ink">Email reminder</span>
          <Toggle on={emailReminder} onClick={() => setEmailReminder((v) => !v)} />
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-sm font-semibold text-clinical-ink">SMS reminder</span>
          <Toggle on={smsReminder} onClick={() => setSmsReminder((v) => !v)} />
        </div>
        <p className="mt-1 text-[11px] text-clinical-ink-soft">
          These preferences aren&apos;t saved yet — actually sending reminders needs an email/SMS
          provider (e.g. SendGrid, Twilio) connected on the backend, which isn&apos;t set up.
        </p>
      </div>

      <Link
        to={`/app/session/${appointmentId}`}
        className="font-clinical-heading mt-6 block rounded-full bg-clinical-amber px-5 py-3.5 text-center text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark"
      >
        View appointment
      </Link>
      <Link to="/app/care" className="mt-3.5 inline-block text-sm font-semibold text-clinical-teal-dark">
        Book another appointment
      </Link>

      {showCall && (
        <VideoCallModal providerName={appointment.providerName} onClose={() => setShowCall(false)} />
      )}
    </div>
  );
}
