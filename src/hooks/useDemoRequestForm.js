import { useState, useCallback } from "react";
import { submitDemoRequest } from "../firebase/firestore";

const INITIAL_FORM = {
  helpType: "",
  firstName: "",
  lastName: "",
  email: "",
  dialCode: "+92",
  phone: "",
  jobTitle: "",
  companyName: "",
  headquarters: "",
  message: "",
};

/**
 * Drives RequestDemoPage's form. status: "idle" | "loading" | "success" | "error"
 */
export function useDemoRequestForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle");

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const submit = useCallback(async () => {
    setStatus("loading");
    try {
      await submitDemoRequest(form);
      setStatus("success");
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error("Demo request submission failed:", err);
      setStatus("error");
    }
  }, [form]);

  return { form, updateField, status, submit };
}
