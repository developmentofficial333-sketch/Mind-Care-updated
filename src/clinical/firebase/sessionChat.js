import { app } from "../../firebase/config";

/**
 * Real-time messages for one Chat-mode appointment. Subscribes rather than
 * one-shot reading — a chat is only useful if both sides see new messages
 * without refreshing. Returns the unsubscribe function; call it on unmount.
 */
export async function listenToMessages(appointmentId, onMessages) {
  const { getFirestore, collection, query, orderBy, onSnapshot } = await import("firebase/firestore");

  const db = getFirestore(app);
  const q = query(
    collection(db, "sessionChats", appointmentId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    onMessages(snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() })));
  });
}

export async function sendMessage(appointmentId, { providerId, memberUid, senderUid, text }) {
  const { getFirestore, collection, addDoc, serverTimestamp } = await import("firebase/firestore");

  const db = getFirestore(app);
  await addDoc(collection(db, "sessionChats", appointmentId, "messages"), {
    providerId,
    memberUid,
    senderUid,
    text,
    createdAt: serverTimestamp(),
  });
}
