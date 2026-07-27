import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useAuth } from "../AuthContext.jsx";

const SERVICE_TYPES = ["Documento", "Paquete pequeño", "Paquete mediano", "Paquete grande"];
const DEFAULT_RATES = { "Documento": "4.50", "Paquete pequeño": "6.50", "Paquete mediano": "9.00", "Paquete grande": "13.00" };

export default function EmpresasPage() {
  const { profile } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    nif_cif: "",
    fiscal_address: "",
    email: "",
    phone: "",
    rates: { ...DEFAULT_RATES },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadCompanies = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("companies")
      .select("id, name, nif_cif, portal_user_id")
      .order("name");
    setCompanies(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const updateRate = (type, value) => setForm((prev) => ({ ...prev, rates: { ...prev.rates, [type]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    // 1. Creamos la empresa
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: form.name,
        nif_cif: form.nif_cif,
        fiscal_address: form.fiscal_address,
        email: form.email,
        phone: form.phone || null,
        created_by: profile.id,
      })
      .select()
      .single();

    if (companyError) {
      setError("No se pudo crear la empresa. Revisa los datos.");
      setSaving(false);
      return;
    }

    // 2. Guardamos la tarifa pactada por tipo de envío
    const rateRows = Object.entries(form.rates)
      .filter(([, price]) => price !== "")
      .map(([service_type, price]) => ({ company_id: company.id, service_type, price: Number(price) }));

    if (rateRows.length) {
      await supabase.from("company_rates").insert(rateRows);
    }

    // Nota: el envío automático del acceso al portal (email de invitación) lo hace
    // una función en el servidor (Edge Function) que dispara este alta — ver más abajo.
    setNotice(`Empresa "${company.name}" creada. Se le enviará su acceso al portal por email.`);
    setForm({ name: "", nif_cif: "", fiscal_address: "", email: "", phone: "", rates: { ...DEFAULT_RATES } });
    setSaving(false);
    loadCompanies();
  };

  return (
    <div className="flex gap-6">
      <div className="flex-[1.3]">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-lg font-black text-[#092640]">Empresas</h1>
          <span className="text-sm text-slate-500">{loading ? "Cargando..." : `${companies.length} empresas`}</span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[1.6fr_1fr_0.8fr] bg-slate-50 px-4 py-2 text-xs font-bold text-slate-400">
            <div>Empresa</div>
            <div>NIF/CIF</div>
            <div>Portal</div>
          </div>
          {companies.map((c) => (
            <div key={c.id} className="grid grid-cols-[1.6fr_1fr_0.8fr] border-t border-slate-100 px-4 py-3 text-sm">
              <div>{c.name}</div>
              <div>{c.nif_cif}</div>
              <div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${c.portal_user_id ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {c.portal_user_id ? "Activo" : "Pendiente"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 rounded-2xl bg-white p-5">
        <h2 className="mb-4 font-black text-[#092640]">Nueva empresa</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input required placeholder="Nombre de la empresa" value={form.name} onChange={(e) => updateField("name", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input required placeholder="NIF / CIF" value={form.nif_cif} onChange={(e) => updateField("nif_cif", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input required placeholder="Dirección fiscal" value={form.fiscal_address} onChange={(e) => updateField("fiscal_address", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input required type="email" placeholder="Email (recibirá facturas y acceso)" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input placeholder="Teléfono (opcional)" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />

          <div className="pt-2 text-xs font-bold text-slate-400">Tarifa pactada</div>
          {SERVICE_TYPES.map((type) => (
            <div key={type} className="grid grid-cols-[1fr_100px] items-center gap-2">
              <span className="text-sm">{type}</span>
              <input
                type="number"
                step="0.01"
                value={form.rates[type]}
                onChange={(e) => updateRate(type, e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          ))}

          {error && <p className="text-sm font-medium text-[#e50914]">{error}</p>}
          {notice && <p className="text-sm font-medium text-green-700">{notice}</p>}

          <button type="submit" disabled={saving} className="mt-2 w-full rounded-xl bg-[#092640] px-4 py-3 text-sm font-black text-white disabled:opacity-60">
            {saving ? "Creando..." : "Crear empresa"}
          </button>
        </form>
      </div>
    </div>
  );
}
