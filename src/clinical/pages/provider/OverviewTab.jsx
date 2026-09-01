import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProviderAppointments } from "../../firebase/providerAppointments";
import { listProviderPatients } from "../../firebase/providerPatients";
import { getProviderAvailability } from "../../firebase/providerAvailability";
import { toLocalIsoDate } from "../../utils/slotGeneration";
import { Spinner } from "../../../components/ui/LoadingSpinner";

function daysUntilNextSunday(from) {
  // 0 (Sun) through 6 (Sat) days remaining in the current week, inclusive of today.
  return 7 - from.getDay();
}

function TodayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M8 3v3M16 3v3" />
      <circle cx="12" cy="15" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WeekIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 7v5l3.5 2" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function PatientsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

const MODE_STYLES = {
  Online: "bg-clinical-teal-soft text-clinical-teal-dark",
  Chat: "bg-clinical-sky text-clinical-sky-dark",
  "In-person": "bg-clinical-amber/25 text-clinical-amber-dark",
};

function StatCard({ Icon, tint, value, label }) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-clinical-border bg-clinical-surface p-4 shadow-card transition-shadow duration-150 hover:shadow-lg">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tint}`}>
        <Icon />
      </div>
      <div>
        <p className="font-clinical-heading text-2xl font-extrabold leading-none tracking-tight text-clinical-ink">
          {value}
        </p>
        <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-clinical-ink-soft">{label}</p>
      </div>
    </div>
  );
}

export default function OverviewTab({ providerId, providerName }) {
  const [appointments, setAppointments] = useState([]);
  const [patientCount, setPatientCount] = useState(0);
  const [hasAvailability, setHasAvailability] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      listProviderAppointments(providerId),
      listProviderPatients(providerId),
      getProviderAvailability(providerId),
    ])
      .then(([appointmentList, patients, availability]) => {
        if (cancelled) return;
        setAppointments(appointmentList);
        setPatientCount(patients.length);
        setHasAvailability(Boolean(availability));
      })
      .catch((err) => {
        console.error("Failed to load overview:", err);
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
        <Spinner size="sm" label="Loading overview" />
      </div>
    );
  }
  if (error) {
    return (
      <p className="py-6 text-center text-sm text-clinical-ink-soft">
        Couldn&apos;t load your overview right now — please try again shortly.
      </p>
    );
  }

  const now = new Date();
  const today = toLocalIsoDate(now);
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + daysUntilNextSunday(now));
  const weekEndIso = toLocalIsoDate(weekEnd);

  const confirmed = appointments.filter((a) => a.status === "confirmed");
  const todaysSchedule = confirmed.filter((a) => a.isoDate === today).sort((a, b) => a.time.localeCompare(b.time));
  const thisWeekCount = confirmed.filter((a) => a.isoDate >= today && a.isoDate <= weekEndIso).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-clinical-heading text-xl font-extrabold tracking-tight text-clinical-ink">
          Good day{providerName ? `, ${providerName}` : ""}
        </h2>
        <p className="mt-0.5 text-sm text-clinical-ink-soft">
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {!hasAvailability && (
        <div className="flex items-start gap-3 rounded-2xl border border-clinical-amber-dark/40 bg-clinical-amber/15 p-4 text-sm text-clinical-ink shadow-card">
          <span className="mt-0.5 text-lg leading-none">💡</span>
          <p>
            You haven&apos;t set your weekly hours yet — members can still book you on standard
            fallback hours, but setting your own is how they&apos;ll see your real schedule.{" "}
            <Link to="?tab=availability" className="font-semibold text-clinical-emerald-dark underline underline-offset-2">
              Set availability
            </Link>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard Icon={TodayIcon} tint="bg-clinical-teal-soft text-clinical-teal-dark" value={todaysSchedule.length} label="Today" />
        <StatCard Icon={WeekIcon} tint="bg-clinical-amber/25 text-clinical-amber-dark" value={thisWeekCount} label="This week" />
        <StatCard Icon={PatientsIcon} tint="bg-clinical-sky text-clinical-sky-dark" value={patientCount} label="Total patients" />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-clinical-ink-soft">Today&apos;s schedule</p>
        <div className="mt-2.5 flex flex-col gap-2.5">
          {todaysSchedule.length ? (
            todaysSchedule.map((appointment) => (
              <Link
                key={appointment.id}
                to={`/provider/appointments/${appointment.id}`}
                className="flex items-center justify-between rounded-xl border border-clinical-border bg-clinical-surface px-4 py-3.5 shadow-card transition-shadow duration-150 hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="font-clinical-heading flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-clinical-mint text-xs font-extrabold text-clinical-emerald-dark">
                    {(appointment.memberName || "M").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-clinical-ink">{appointment.memberName || "Member"}</p>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        MODE_STYLES[appointment.mode] ?? "bg-clinical-border text-clinical-ink-soft"
                      }`}
                    >
                      {appointment.mode}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-clinical-ink-soft">{appointment.time}</span>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-clinical-border bg-clinical-surface/60 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-clinical-mint text-xl">🗓️</span>
              <p className="mt-1 text-sm font-bold text-clinical-ink">Nothing on the books today</p>
              <p className="text-xs text-clinical-ink-soft">New bookings will show up here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
