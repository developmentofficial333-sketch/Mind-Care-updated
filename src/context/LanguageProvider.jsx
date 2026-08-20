import { useEffect, useState } from "react";
import { LanguageContext } from "./languageContext";
import { translations } from "../data/translations";

const STORAGE_KEY = "mindcare-language";

function readStoredLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "ur" ? "ur" : "en";
  } catch {
    // localStorage can throw in private-browsing/blocked-storage contexts.
    return "en";
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readStoredLanguage);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore — persistence is a nice-to-have, not a hard requirement.
    }
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
  }, [language]);

  function setLanguage(next) {
    setLanguageState(next === "ur" ? "ur" : "en");
  }

  function toggleLanguage() {
    setLanguageState((prev) => (prev === "en" ? "ur" : "en"));
  }

  function t(key) {
    return translations[language]?.[key] ?? translations.en[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
