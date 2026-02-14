// frontend/src/app/providers/I18nProvider.tsx
import { createContext, useContext, useMemo, useState } from "react";
import ua from "@/i18n/messages/ua.json";
import en from "@/i18n/messages/en.json";

type Lang = "ua" | "en";

type Messages = Record<string, any>;

interface I18nContextValue {
  lang: Lang;
  t: (key: string) => string;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "ua",
  t: (k) => k,
  setLang: () => {},
});

export const useI18n = () => useContext(I18nContext);

interface I18nProviderProps {
  children: React.ReactNode;
}

const I18N_KEY = "beauty_lang";

export default function I18nProvider({ children }: I18nProviderProps) {
  const [lang, setLangState] = useState<Lang>(
    (localStorage.getItem(I18N_KEY) as Lang) || "ua"
  );

 const messages: Messages = useMemo(() => {
  return lang === "ua" ? ua : en;
}, [lang]);
  const t = (key: string) => messages[key] || key;

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(I18N_KEY, l);
  };

  return (
    <I18nContext.Provider value={{ lang, t, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}
