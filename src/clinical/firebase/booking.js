import { app } from "../../firebase/config";

function slotId(isoDate, time) {
  return `${isoDate}_${time.replace(/[^0-9a-zA-Z]/g, "")}`;
}

/**
 * Thrown by bookAppointment() so callers can tell the two failure reasons
 * apart and show the right message.
 */
export class BookingConflictError extends Error {
  constructor(reason) {
    super(reason);
    this.reason = reason; // "provider-taken" | "member-conflict"
  }
}

/**
 * Atomically books an appointment. A plain "check availability, then
 * write" has a race window between the check and the write — two members
 * (or two browser tabs) could both pass the check before either writes,
 * and a two-step write (reserve, then separately create the appointment)
 * can leave an orphaned reservation with no matching appointment if the
 * second write fails. A single Firestore transaction closes both gaps:
 * Firestore re-runs the whole read+write together if another write lands
 * in between, and either everything below commits or nothing does.
 *
 * Two conflicts are checked, both real constraints for a national-scale
 * booking system, not just one:
 *  - the PROVIDER already has someone booked at this date/time
 *  - the MEMBER already has an appointment with ANY provider at this
 *    date/time (can't be in two sessions at once)
 */
export async function bookAppointment(
  uid,
  {
    providerId,
    providerName,
    memberName,
    mode,
    dateLabel,
    isoDate,
    time,
    fee,
    bookingType = "self-pay",
    companyName = null,
    // Captured here, not editable after booking — the appointment doc is
    // immutable once created (see firestore.rules), so this is the only
    // point where a reminder preference can ever be written. Nothing sends
    // on it yet: that needs a Cloud Function + an email/SMS provider
    // (SendGrid/Twilio), not built here.
    emailReminder = true,
    smsReminder = true,
  }
) {
  const { getFirestore, doc, collection, runTransaction, serverTimestamp } = await import(
    "firebase/firestore"
  );

  const db = getFirestore(app);
  const id = slotId(isoDate, time);
  const providerSlotRef = doc(db, "providers", providerId, "bookedSlots", id);
  const memberSlotRef = doc(db, "members", uid, "bookedSlots", id);
  const appointmentRef = doc(collection(db, "members", uid, "appointments"));
  // Reuses the same id as appointmentRef so both sides of a status update
  // (see providerAppointments.js) can be targeted without a lookup.
  const providerAppointmentRef = doc(db, "providers", providerId, "appointments", appointmentRef.id);
  // Relationship marker — powers the Patients roster and gates provider
  // read access to this member's memberNeeds (see providerPatients.js /
  // firestore.rules). Read first so a repeat booking with the same
  // provider doesn't clobber firstBookedAt.
  const providerPatientRef = doc(db, "providerPatients", providerId, "patients", uid);
  // Only for Chat-mode appointments — see sessionChat.js / firestore.rules.
  const sessionChatRef = mode === "Chat" ? doc(db, "sessionChats", appointmentRef.id) : null;

  await runTransaction(db, async (tx) => {
    const [providerSlotSnap, memberSlotSnap, providerPatientSnap] = await Promise.all([
      tx.get(providerSlotRef),
      tx.get(memberSlotRef),
      tx.get(providerPatientRef),
    ]);

    if (providerSlotSnap.exists()) throw new BookingConflictError("provider-taken");
    if (memberSlotSnap.exists()) throw new BookingConflictError("member-conflict");

    tx.set(providerSlotRef, { isoDate, time, reservedAt: serverTimestamp() });
    tx.set(memberSlotRef, { isoDate, time, providerId, reservedAt: serverTimestamp() });
    tx.set(appointmentRef, {
      providerId,
      providerName,
      memberName,
      mode,
      dateLabel,
      isoDate,
      time,
      fee,
      bookingType,
      companyName,
      emailReminder,
      smsReminder,
      status: "confirmed",
      createdAt: serverTimestamp(),
    });
    // The one legitimate new disclosure to a provider: memberProfiles
    // itself stays strictly owner-read-only, but a provider needs to know
    // who's showing up for their own appointment. Everything else here
    // mirrors the member-side doc so ProviderDashboardPage doesn't need a
    // second read to render a full appointment row.
    tx.set(providerAppointmentRef, {
      memberUid: uid,
      memberName,
      providerId,
      providerName,
      mode,
      dateLabel,
      isoDate,
      time,
      fee,
      bookingType,
      companyName,
      status: "confirmed",
      createdAt: serverTimestamp(),
    });
    tx.set(
      providerPatientRef,
      {
        memberName,
        lastBookedAt: serverTimestamp(),
        ...(providerPatientSnap.exists() ? {} : { firstBookedAt: serverTimestamp() }),
      },
      { merge: true }
    );
    if (sessionChatRef) {
      tx.set(sessionChatRef, { providerId, memberUid: uid, createdAt: serverTimestamp() });
    }
  });

  return appointmentRef.id;
}
