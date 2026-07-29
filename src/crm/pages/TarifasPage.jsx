import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { supabase } from "../supabaseClient.js";
import { useAuth } from "../AuthContext.jsx";

export default function TarifasPage() {
  const { profile, role } = useAuth();
  const [rates, setRates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const loadRates = () => {
    supabase
      .from("service_types")
      .select("id, name, default_price, active")
      .order("name")
      .then(({ data }) => setRates(data || []));
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleDelete = async (rate) => {
    if (!window.confirm(`¿Borrar la tarifa "${rate.name}"? Esto no afecta a envíos ya registrados con este tipo.`)) return;
    const { error: delError } = await supabase.from("service_types").delete().eq("id", rate.id);
    if (delError) {
      alert("No se pudo borrar (puede que ya esté en uso en tarifas de alguna empresa).");
      return;
    }
    loadRates();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-black text-[#092640]">Tarifas</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-xl bg-[#092640] px-4 py-2 text-sm font-black text-white"
        >
          <Plus size={16} /> Nueva tarifa
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[1.4fr_0.8fr_0.6fr] bg-slate-50 px-4 py-2 text-xs font-bold text-slate-400">
          <div>Tipo de envío</div>
          <div>Precio orientativo</div>
          <div>Acciones</div>
        </div>
        {rates.map((r) => (
          <div key={r.id} className="grid grid-cols-[1.4fr_0.8fr_0.6fr] items-center border-t border-slate-100 px-4 py-3 text-sm">
            <div>{r.name}</div>
            <div>{Number(r.default_price).toFixed(2)} €</div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditing(r); setShowForm(true); }} className="text-xs font-bold text-[#092640] underline">Editar</button>
              {role === "admin" && (
                <button onClick={() => handleDelete(r)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-[#e50914]" title="Borrar">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
        {rates.length === 0 && <div className="px-4 py-8 text-center text-sm text-slate-400">Aún no hay tarifas creadas.</div>}
      </div>

      {showForm && (
        <RateModal
          rate={editing}
          profileId={profile.id}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); loadRates(); }}
        />
      )}
    </div>
  );
}

function RateModal({ rate, profileId, onClose, onSaved }) {
  const isEdit = Boolean(rate);
  const [name, setName] = useState(rate?.name || "");
  const [price, setPrice] = useState(rate?.default_price ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (isEdit) {
      const { error: updateError } = await supabase
        .from("service_types")
        .update({ name, default_price: Number(price) })
        .eq("id", rate.id);
      if (updateError) { setError("No se pudo guardar."); setSaving(false); return; }
    } else {
      const { error: insertError } = await supabase
        .from("service_types")
        .insert({ name, default_price: Number(price), created_by: profileId });
      if (insertError) { setError("No se pudo crear (¿ya existe ese nombre?)."); setSaving(false); return; }
    }

    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-[#092640]">{isEdit ? "Editar tarifa" : "Nueva tarifa"}</h2>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input required placeholder="Tipo de envío" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input required type="number" step="0.01" placeholder="Precio orientativo (€)" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          {error && <p className="text-sm font-medium text-[#e50914]">{error}</p>}
          <button type="submit" disabled={saving} className="w-full rounded-xl bg-[#092640] px-4 py-3 text-sm font-black text-white disabled:opacity-60">
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
}
