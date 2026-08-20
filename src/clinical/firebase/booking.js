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
    mode,
    dateLabel,
    isoDate,
    time,
    fee,
    bookingType = "self-pay",
    companyName = null,
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

  await runTransaction(db, async (tx) => {
    const [providerSlotSnap, memberSlotSnap] = await Promise.all([
      tx.get(providerSlotRef),
      tx.get(memberSlotRef),
    ]);

    if (providerSlotSnap.exists()) throw new BookingConflictError("provider-taken");
    if (memberSlotSnap.exists()) throw new BookingConflictError("member-conflict");

    tx.set(providerSlotRef, { isoDate, time, reservedAt: serverTimestamp() });
    tx.set(memberSlotRef, { isoDate, time, providerId, reservedAt: serverTimestamp() });
    tx.set(appointmentRef, {
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
  });

  return appointmentRef.id;
}
