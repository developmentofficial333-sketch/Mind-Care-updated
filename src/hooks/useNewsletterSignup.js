import { useState, useCallback } from "react";
import { subscribeToNewsletter } from "../firebase/firestore";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Drives the "Stay in the loop" email capture form.
 * status: "idle" | "loading" | "success" | "duplicate" | "error"
 */
export function useNewsletterSignup() {
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const submit = useCallback(async (email) => {
    if (!EMAIL_PATTERN.test(email)) {
      setStatus("error");
      setErrorMessage("Enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const result = await subscribeToNewsletter(email);
      setStatus(result === "duplicate" ? "duplicate" : "success");
    } catch (err) {
      console.error("Newsletter signup failed:", err);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }, []);

  return { status, errorMessage, submit };
}
