import React, { useEffect, useState } from "react";

const STORAGE_KEY = "enviex_cookie_consent";

export default function CookieBanner({ onOpenPolicy }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const choose = (value) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // localStorage no disponible, ocultamos igualmente
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-slate-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur md:p-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-slate-600">
          Usamos cookies técnicas propias necesarias para el funcionamiento de la web. No usamos cookies de
          publicidad ni de análisis.{" "}
          <button
            type="button"
            onClick={onOpenPolicy}
            className="font-black text-[#092640] underline underline-offset-2 hover:text-[#e50914]"
          >
            Más información
          </button>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#092640] transition hover:bg-slate-50"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded-2xl bg-[#e50914] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
