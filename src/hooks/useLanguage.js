import { useContext } from "react";
import { LanguageContext } from "../context/languageContext";

export function useLanguage() {
  return useContext(LanguageContext);
}
