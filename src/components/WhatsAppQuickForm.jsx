import React, { useEffect, useState } from "react";
import { Send, X } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

const WHATSAPP_NUMBER = "34604895001";

const EMPTY_PARTICULAR = {
  name: "",
  phone: "",
  email: "",
  need: "",
  acceptPrivacy: false,
};

const EMPTY_EMPRESA = {
  company: "",
  contactName: "",
  phone: "",
  email: "",
  details: "",
  acceptPrivacy: false,
};

export default function WhatsAppQuickForm({ open, onClose, onOpenPrivacy, defaultMode = "particular" }) {
  const [mode, setMode] = useState(defaultMode);
  const [particularForm, setParticularForm] = useState(EMPTY_PARTICULAR);
  const [empresaForm, setEmpresaForm] = useState(EMPTY_EMPRESA);

  useEffect(() => {
    if (open) setMode(defaultMode);
  }, [open, defaultMode]);

  if (!open) return null;

  const updateParticular = (key, value) => setParticularForm((prev) => ({ ...prev, [key]: value }));
  const updateEmpresa = (key, value) => setEmpresaForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    let message;
    if (mode === "empresa") {
      if (!empresaForm.acceptPrivacy) return;
      message =
        `Hola Enviex, quiero información para una cuenta de empresa 🏢\n\n` +
        `Empresa: ${empresaForm.company}\n` +
        `Persona de contacto: ${empresaForm.contactName}\n` +
        `Teléfono: ${empresaForm.phone}\n` +
        `Correo: ${empresaForm.email || "No indicado"}\n` +
        `Qué necesitan: ${empresaForm.details || "Sin detalles adicionales"}`;
    } else {
      if (!particularForm.acceptPrivacy) return;
      message =
        `Hola Enviex, quiero solicitar información 👋\n\n` +
        `Nombre: ${particularForm.name}\n` +
        `Teléfono: ${particularForm.phone}\n` +
        `Correo: ${particularForm.email || "No indicado"}\n` +
        `Necesito enviar: ${particularForm.need}`;
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noreferrer");
    setParticularForm(EMPTY_PARTICULAR);
    setEmpresaForm(EMPTY_EMPRESA);
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
        <p className="mb-4 text-sm leading-6 text-slate-500">
          Rellena tus datos y te abriremos WhatsApp con el mensaje ya preparado.
        </p>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("particular")}
            className={`rounded-xl py-2 text-sm font-black transition ${
              mode === "particular" ? "bg-white text-[#092640] shadow-sm" : "text-slate-500"
            }`}
          >
            Particular
          </button>
          <button
            type="button"
            onClick={() => setMode("empresa")}
            className={`rounded-xl py-2 text-sm font-black transition ${
              mode === "empresa" ? "bg-white text-[#092640] shadow-sm" : "text-slate-500"
            }`}
          >
            Empresa
          </button>
        </div>

        {mode === "particular" ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              value={particularForm.name}
              onChange={(e) => updateParticular("name", e.target.value)}
              placeholder="Nombre y apellidos"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#25D366] focus:bg-white"
            />
            <input
              required
              value={particularForm.phone}
              onChange={(e) => updateParticular("phone", e.target.value)}
              placeholder="Teléfono"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#25D366] focus:bg-white"
            />
            <input
              type="email"
              value={particularForm.email}
              onChange={(e) => updateParticular("email", e.target.value)}
              placeholder="Correo electrónico"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#25D366] focus:bg-white"
            />
            <select
              required
              value={particularForm.need}
              onChange={(e) => updateParticular("need", e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#25D366] focus:bg-white"
            >
              <option value="" disabled>¿Qué necesitas enviar?</option>
              <option>Documento</option>
              <option>Paquete pequeño</option>
              <option>Paquete mediano</option>
              <option>Paquete grande</option>
              <option>Otro</option>
            </select>

            <PrivacyCheckbox
              checked={particularForm.acceptPrivacy}
              onChange={(v) => updateParticular("acceptPrivacy", v)}
              onOpenPrivacy={onOpenPrivacy}
            />

            <SubmitButton disabled={!particularForm.acceptPrivacy} />
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              value={empresaForm.company}
              onChange={(e) => updateEmpresa("company", e.target.value)}
              placeholder="Nombre de la empresa"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#25D366] focus:bg-white"
            />
            <input
              required
              value={empresaForm.contactName}
              onChange={(e) => updateEmpresa("contactName", e.target.value)}
              placeholder="Persona de contacto"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#25D366] focus:bg-white"
            />
            <input
              required
              value={empresaForm.phone}
              onChange={(e) => updateEmpresa("phone", e.target.value)}
              placeholder="Teléfono"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#25D366] focus:bg-white"
            />
            <input
              type="email"
              value={empresaForm.email}
              onChange={(e) => updateEmpresa("email", e.target.value)}
              placeholder="Correo electrónico"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#25D366] focus:bg-white"
            />
            <textarea
              value={empresaForm.details}
              onChange={(e) => updateEmpresa("details", e.target.value)}
              placeholder="Cuéntanos qué necesitáis: volumen de envíos, frecuencia..."
              rows={3}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#25D366] focus:bg-white"
            />

            <PrivacyCheckbox
              checked={empresaForm.acceptPrivacy}
              onChange={(v) => updateEmpresa("acceptPrivacy", v)}
              onOpenPrivacy={onOpenPrivacy}
            />

            <SubmitButton disabled={!empresaForm.acceptPrivacy} />
          </form>
        )}
      </div>
    </div>
  );
}

function PrivacyCheckbox({ checked, onChange, onOpenPrivacy }) {
  return (
    <label className="flex items-start gap-2 text-xs leading-5 text-slate-500">
      <input
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#25D366]"
      />
      <span>
        He leído y acepto la{" "}
        <button type="button" onClick={onOpenPrivacy} className="font-bold text-[#092640] underline underline-offset-2">
          Política de Privacidad
        </button>
      </span>
    </label>
  );
}

function SubmitButton({ disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-4 text-base font-black text-white transition hover:bg-[#1ebc59] disabled:cursor-not-allowed disabled:opacity-60"
    >
      Abrir WhatsApp <Send size={17} />
    </button>
  );
}

export function WhatsAppFab({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Contactar por WhatsApp"
      className="group fixed bottom-24 right-6 z-[80] flex items-center justify-center rounded-full bg-[#25D366] p-4 text-white shadow-2xl shadow-green-900/30 transition hover:bg-[#1ebc59]"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" />
      <WhatsAppIcon size={28} className="relative animate-[wa-bounce_2.4s_ease-in-out_infinite] text-white" />
    </button>
  );
}
