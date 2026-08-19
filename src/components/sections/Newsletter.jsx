import { useState } from "react";
import Container from "../ui/Container";
import Button from "../ui/Button";
import SkyDecoration from "../ui/SkyDecoration";
import { useNewsletterSignup } from "../../hooks/useNewsletterSignup";

const STATUS_MESSAGE = {
  success: "You're on the list.",
  duplicate: "You're already subscribed.",
};

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const { status, errorMessage, submit } = useNewsletterSignup();

  function handleSubmit(event) {
    event.preventDefault();
    submit(email);
  }

  return (
    <section className="bg-cream">
      <SkyDecoration />
      <Container className="flex flex-col items-center gap-6 pb-20 pt-4 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
          Stay in the loop
        </h2>
        <p className="max-w-md text-sm text-ink-soft">
          Be the first to get updates on our latest content, special offers, and new features. By
          signing up you agree to receive marketing emails.
        </p>

        <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="w-full flex-1 rounded-pill border border-border bg-white px-5 py-3 text-sm text-ink outline-none focus:border-ink"
          />
          <Button type="submit" variant="primary" disabled={status === "loading"}>
            {status === "loading" ? "Submitting..." : "Subscribe"}
          </Button>
        </form>

        {status !== "idle" && status !== "loading" && (
          <p className={`text-sm ${status === "error" ? "text-red-600" : "text-ink-soft"}`}>
            {status === "error" ? errorMessage : STATUS_MESSAGE[status]}
          </p>
        )}
      </Container>
    </section>
  );
}
