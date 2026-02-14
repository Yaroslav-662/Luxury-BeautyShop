import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ua from "./messages/ua.json";
import en from "./messages/en.json";

const savedLang = localStorage.getItem("lang") || "ua";

i18n.use(initReactI18next).init({
  resources: {
    ua: { translation: ua },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: "ua",
  interpolation: {
    escapeValue: false,
  },
});

export const changeLanguage = (lang: "ua" | "en") => {
  i18n.changeLanguage(lang);
  localStorage.setItem("lang", lang);
};

export default i18n;
