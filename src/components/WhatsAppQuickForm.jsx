import React, { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

const WHATSAPP_NUMBER = "34604895001";

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  need: "",
  acceptPrivacy: false,
};

export default function WhatsAppQuickForm({ open, onClose, onOpenPrivacy }) {
  const [form, setForm] = useState(EMPTY_FORM);

  if (!open) return null;

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.acceptPrivacy) return;

    const message =
      `Hola Enviex, quiero solicitar información 👋\n\n` +
      `Nombre: ${form.name}\n` +
      `Teléfono: ${form.phone}\n` +
      `Correo: ${form.email || "No indicado"}\n` +
      `Necesito enviar: ${form.need}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noreferrer");
    setForm(EMPTY_FORM);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl md:rounded-3xl md:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between">
          <h2 className="text-xl font-black text-[#092640]">Cuéntanos qué necesitas</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full bg-slate-100 p-2 transition hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mb-5 text-sm leading-6 text-slate-500">
          Rellena tus datos y te abriremos WhatsApp con el mensaje ya preparado.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Nombre y apellidos"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#25D366] focus:bg-white"
          />
          <input
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="Teléfono"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#25D366] focus:bg-white"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="Correo electrónico"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#25D366] focus:bg-white"
          />
          <select
            required
            value={form.need}
            onChange={(e) => update("need", e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#25D366] focus:bg-white"
          >
            <option value="" disabled>¿Qué necesitas enviar?</option>
            <option>Documento</option>
            <option>Paquete pequeño</option>
            <option>Paquete mediano</option>
            <option>Paquete grande</option>
            <option>Otro</option>
          </select>

          <label className="flex items-start gap-2 text-xs leading-5 text-slate-500">
            <input
              type="checkbox"
              required
              checked={form.acceptPrivacy}
              onChange={(e) => update("acceptPrivacy", e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#25D366]"
            />
            <span>
              He leído y acepto la{" "}
              <button type="button" onClick={onOpenPrivacy} className="font-bold text-[#092640] underline underline-offset-2">
                Política de Privacidad
              </button>
            </span>
          </label>

          <button
            type="submit"
            disabled={!form.acceptPrivacy}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-4 text-base font-black text-white transition hover:bg-[#1ebc59] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Abrir WhatsApp <Send size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}

export function WhatsAppFab({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-24 right-6 z-[80] flex items-center justify-center rounded-full bg-[#25D366] p-4 text-white shadow-2xl shadow-green-900/30 transition hover:-translate-y-0.5 hover:bg-[#1ebc59]"
    >
      <MessageCircle size={26} />
    </button>
  );
}
