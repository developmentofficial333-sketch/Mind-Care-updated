import { useEffect, useRef, useState } from "react";
import { listenToMessages, sendMessage } from "../../firebase/sessionChat";

function formatTime(timestamp) {
  if (!timestamp?.seconds) return "";
  return new Date(timestamp.seconds * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Shared between SessionPage.jsx (member side) and AppointmentsTab.jsx's
 * inline panel (provider side) — same component, no role-specific logic;
 * the caller just says who "you" are via currentUid.
 */
export default function ChatThread({ appointmentId, providerId, memberUid, currentUid, otherPartyName }) {
  const [messages, setMessages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    let unsubscribe;
    let cancelled = false;
    listenToMessages(appointmentId, (result) => {
      if (cancelled) return;
      setMessages(result);
      setLoaded(true);
    })
      .then((unsub) => {
        if (cancelled) unsub();
        else unsubscribe = unsub;
      })
      .catch((err) => console.error("Failed to open chat:", err));
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [appointmentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);

  async function handleSend(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setSending(true);
    setError("");
    try {
      await sendMessage(appointmentId, { providerId, memberUid, senderUid: currentUid, text });
      setDraft("");
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Message didn't send — please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-clinical-border bg-clinical-surface">
      <div className="flex max-h-80 flex-col gap-2 overflow-y-auto p-3">
        {!loaded ? (
          <p className="py-6 text-center text-xs text-clinical-ink-soft">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="py-6 text-center text-xs text-clinical-ink-soft">
            No messages yet — say hello to {otherPartyName || "them"}.
          </p>
        ) : (
          messages.map((message) => {
            const isMine = message.senderUid === currentUid;
            return (
              <div key={message.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                    isMine
                      ? "bg-clinical-teal text-white"
                      : "bg-white text-clinical-ink border border-clinical-border"
                  }`}
                >
                  {message.text}
                </div>
                <span className="mt-0.5 text-[10px] text-clinical-ink-soft">{formatTime(message.createdAt)}</span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-clinical-border p-2.5">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-clinical-border bg-white px-3.5 py-2 text-sm outline-none focus:border-clinical-teal"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="font-clinical-heading rounded-full bg-clinical-amber px-4 py-2 text-xs font-bold text-clinical-ink hover:bg-clinical-amber-dark disabled:opacity-60"
        >
          Send
        </button>
      </form>
      {error && <p className="px-3 pb-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
