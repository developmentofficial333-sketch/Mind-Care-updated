import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { listAppointmentsForPatient } from "../../firebase/providerAppointments";
import { getConsultationNote } from "../../firebase/consultationNotes";
import { getMemberNeeds } from "../../firebase/memberNeeds";
import { Spinner } from "../../../components/ui/LoadingSpinner";

// Same ids IdentifyNeedPage.jsx saves — kept local since this is the only
// other place that needs to turn them back into readable labels.
const NEED_LABELS = {
  anxiety: "Stress & anxiety",
  mood: "Low mood",
  sleep: "Sleep difficulties",
  relationships: "Relationship concerns",
  grief: "Grief & loss",
  work: "Work / study pressure",
  other: "Something else",
};

export default function PatientHistoryPage() {
  const { memberUid } = useParams();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [notesByAppointment, setNotesByAppointment] = useState({});
  const [needs, setNeeds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      listAppointmentsForPatient(user.uid, memberUid),
      getMemberNeeds(memberUid).catch(() => null), // absent for older patients, or denied if no real relationship — not fatal
    ])
      .then(async ([appointmentList, needsResult]) => {
        if (cancelled) return;
        setAppointments(appointmentList);
        setNeeds(needsResult);
        const notes = await Promise.all(
          appointmentList.map((a) => getConsultationNote(a.id).catch(() => null))
        );
        if (cancelled) return;
        const byId = {};
        appointmentList.forEach((a, i) => {
          if (notes[i]?.note) byId[a.id] = notes[i].note;
        });
        setNotesByAppointment(byId);
      })
      .catch((err) => {
        console.error("Failed to load patient history:", err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user.uid, memberUid]);

  if (loading) return <LoadingScreen />;
  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10 text-center">
        <p className="text-sm text-clinical-ink-soft">
          Couldn&apos;t load this patient&apos;s history — either something went wrong, or you
          haven&apos;t actually had an appointment with them.
        </p>
        <Link to="/provider/dashboard" className="mt-3 inline-block text-sm font-semibold text-clinical-teal-dark">
          &larr; Back to dashboard
        </Link>
      </div>
    );
  }

  const patientName = appointments[0]?.memberName || "This patient";

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <Link to="/provider/dashboard?tab=patients" className="text-sm font-semibold text-clinical-teal-dark">
        &larr; Back to patients
      </Link>
      <h1 className="font-clinical-heading mt-2 text-2xl font-bold text-clinical-ink">{patientName}</h1>

      {needs?.needs?.length > 0 && (
        <div className="mt-5 rounded-2xl border border-clinical-border bg-clinical-surface p-4">
          <p className="text-xs font-bold text-clinical-ink-soft">STATED NEEDS (FROM ONBOARDING)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {needs.needs.map((id) => (
              <span
                key={id}
                className="rounded-full bg-clinical-teal-soft px-3 py-1 text-xs font-semibold text-clinical-teal-dark"
              >
                {NEED_LABELS[id] ?? id}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="text-xs font-bold text-clinical-ink-soft">APPOINTMENT HISTORY</p>
        <div className="mt-2 flex flex-col gap-3">
          {appointments.length ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="rounded-2xl border border-clinical-border bg-clinical-surface p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-clinical-ink">
                    {appointment.dateLabel}, {appointment.time}
                  </p>
                  <span className="text-xs font-semibold capitalize text-clinical-ink-soft">
                    {appointment.mode} &middot; {appointment.status}
                  </span>
                </div>
                {notesByAppointment[appointment.id] && (
                  <p className="mt-2 whitespace-pre-wrap border-t border-clinical-border pt-2 text-sm text-clinical-ink-soft">
                    {notesByAppointment[appointment.id]}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-sm text-clinical-ink-soft">No appointments on record.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner label="Loading patient history" />
    </div>
  );
}
