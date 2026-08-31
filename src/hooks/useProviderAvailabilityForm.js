import { useState, useCallback, useEffect } from "react";
import { getProviderAvailability, setProviderAvailability } from "../clinical/firebase/providerAvailability";

const EMPTY_WEEKLY = {};

/**
 * Drives ProviderDashboardPage's Availability tab. Unlike the other form
 * hooks in this codebase (useNewsletterSignup, useDemoRequestForm,
 * useProviderApplicationForm), this one loads existing data on mount — a
 * provider editing their own hours, not filling a blank form — otherwise
 * the same status state machine: "idle" | "loading" | "success" | "error",
 * plus a separate `loaded` flag gating the initial read.
 */
export function useProviderAvailabilityForm(providerId) {
  const [weekly, setWeekly] = useState(EMPTY_WEEKLY);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!providerId) return;
    let cancelled = false;
    getProviderAvailability(providerId)
      .then((existing) => {
        if (!cancelled) setWeekly(existing || EMPTY_WEEKLY);
      })
      .catch((err) => console.error("Failed to load availability:", err))
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [providerId]);

  const addRange = useCallback((day) => {
    setWeekly((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), { start: "09:00", end: "17:00" }],
    }));
  }, []);

  const updateRange = useCallback((day, index, field, value) => {
    setWeekly((prev) => ({
      ...prev,
      [day]: prev[day].map((range, i) => (i === index ? { ...range, [field]: value } : range)),
    }));
  }, []);

  const removeRange = useCallback((day, index) => {
    setWeekly((prev) => {
      const remaining = prev[day].filter((_, i) => i !== index);
      const next = { ...prev, [day]: remaining };
      if (remaining.length === 0) delete next[day];
      return next;
    });
  }, []);

  const submit = useCallback(async () => {
    setStatus("loading");
    try {
      await setProviderAvailability(providerId, weekly);
      setStatus("success");
    } catch (err) {
      console.error("Failed to save availability:", err);
      setStatus("error");
    }
  }, [providerId, weekly]);

  return { weekly, loaded, addRange, updateRange, removeRange, status, submit };
}
