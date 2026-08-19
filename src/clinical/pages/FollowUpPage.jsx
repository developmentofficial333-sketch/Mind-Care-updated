import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { submitFeedback } from "../firebase/feedback";

function Star({ filled, onClick }) {
  return (
    <button type="button" onClick={onClick} aria-label="Rate">
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill={filled ? "var(--color-clinical-amber)" : "none"}
        stroke="var(--color-clinical-amber-dark)"
        strokeWidth="1.5"
      >
        <path d="M12 2l2.9 6 6.6.6-5 4.5 1.5 6.5L12 16.5 6 19.6 7.5 13.1l-5-4.5 6.6-.6L12 2z" />
      </svg>
    </button>
  );
}

export default function FollowUpPage() {
  const { appointmentId } = useParams();
  const { user } = useAuth();
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    try {
      await submitFeedback(user.uid, appointmentId, { rating, comment });
      setStatus("success");
    } catch (err) {
      console.error("Feedback submission failed:", err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="font-clinical-heading text-xl font-bold text-clinical-ink">
          Thanks for your feedback.
        </h1>
        <p className="mt-2 text-sm text-clinical-ink-soft">It helps us match you with the right support.</p>
        <Link
          to="/app/care"
          className="font-clinical-heading mt-6 inline-block rounded-full bg-clinical-amber px-6 py-3 text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark"
        >
          Book your next session
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-9">
      <h1 className="font-clinical-heading text-xl font-bold text-clinical-ink">
        How did your session go?
      </h1>
      <p className="mt-1.5 text-sm text-clinical-ink-soft">
        Your feedback helps us match you with the right support.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} filled={n <= rating} onClick={() => setRating(n)} />
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Anything you'd like your provider or our team to know? (optional)"
          className="resize-none rounded-2xl border border-clinical-border bg-clinical-surface p-3.5 text-sm outline-none focus:border-clinical-teal"
        />

        {status === "error" && (
          <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="font-clinical-heading rounded-full bg-clinical-amber px-5 py-3.5 text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark disabled:opacity-60"
        >
          {status === "loading" ? "Submitting..." : "Share feedback"}
        </button>
      </form>
    </div>
  );
}
