import { useState, useCallback } from "react";
import { submitProviderApplication } from "../firebase/firestore";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  discipline: "",
  licenseNumber: "",
  yearsExperience: "",
  languages: [],
  concerns: [],
  feeAmount: "",
  city: "",
  message: "",
};

/**
 * Drives ProviderApplicationPage's form. status: "idle" | "loading" | "success" | "error"
 */
export function useProviderApplicationForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle");

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleLanguage = useCallback((language) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  }, []);

  const toggleConcern = useCallback((concern) => {
    setForm((prev) => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter((c) => c !== concern)
        : [...prev.concerns, concern],
    }));
  }, []);

  const submit = useCallback(async () => {
    setStatus("loading");
    try {
      await submitProviderApplication({ ...form, feeAmount: Number(form.feeAmount) || null });
      setStatus("success");
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error("Provider application submission failed:", err);
      setStatus("error");
    }
  }, [form]);

  return { form, updateField, toggleLanguage, toggleConcern, status, submit };
}
