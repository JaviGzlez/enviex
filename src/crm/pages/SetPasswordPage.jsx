import React, { useState } from "react";
import { supabase } from "../supabaseClient.js";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (updateError) {
      setError("No se pudo guardar la contraseña: " + updateError.message);
      return;
    }

    setDone(true);
    // Limpiamos el token de la URL y entramos a la app
    window.location.replace("/crm");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <img src="/logo-enviex.png" alt="Enviex" className="mx-auto mb-6 h-16 w-16 rounded-full" />
        <h1 className="mb-1 text-center text-xl font-black text-[#092640]">Crea tu contraseña</h1>
        <p className="mb-6 text-center text-sm text-slate-500">Elige una contraseña para acceder a Enviex.</p>

        {done ? (
          <p className="text-center text-sm font-medium text-green-700">Contraseña guardada, entrando...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nueva contraseña"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#092640] focus:bg-white"
            />
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repite la contraseña"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#092640] focus:bg-white"
            />

            {error && <p className="text-sm font-medium text-[#e50914]">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-[#092640] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar y entrar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
