import React, { createContext, useContext, useEffect, useState } from "react";

type TranslationContextValue = {
  text: string;
  setText: (t: string) => void;
};

const TranslationContext = createContext<TranslationContextValue | null>(null);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState("");
  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<{ text?: string }>).detail;
      if (!detail) return;
      setText(detail.text || "");
    }
    window.addEventListener("_setTranslation", handler as EventListener);
    return () => window.removeEventListener("_setTranslation", handler as EventListener);
  }, []);

  return (
    <TranslationContext.Provider value={{ text, setText }}>{children}</TranslationContext.Provider>
  );
}

export function useTranslationBar() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useTranslationBar must be used inside TranslationProvider");
  return ctx;
}

export default TranslationProvider;
