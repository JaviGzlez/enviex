import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { supabase } from "../supabaseClient.js";
import { useAuth } from "../AuthContext.jsx";
import CompanySearchSelect from "../components/CompanySearchSelect.jsx";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function EnviosPage() {
  const { profile } = useAuth();
  const [date, setDate] = useState(todayISO());
  const [companyFilter, setCompanyFilter] = useState("");
  const [shipments, setShipments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadShipments = async (forDate, forCompany) => {
    setLoading(true);
    let query = supabase
      .from("shipments")
      .select("id, shipment_date, service_type, concept, price, notes, companies(name), profiles(full_name)")
      .eq("shipment_date", forDate);

    if (forCompany) query = query.eq("company_id", forCompany);

    const { data, error } = await query.order("created_at", { ascending: false });

    if (!error) setShipments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadShipments(date, companyFilter);
  }, [date, companyFilter]);

  useEffect(() => {
    supabase
      .from("companies")
      .select("id, name")
      .eq("active", true)
      .order("name")
      .then(({ data }) => setCompanies(data || []));
  }, []);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CompanySearchSelect companies={companies} value={companyFilter} onChange={setCompanyFilter} placeholder="Filtrar por empresa..." />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <span className="text-sm text-slate-500">
            {loading ? "Cargando..." : `${shipments.length} envío(s)`}
          </span>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#092640] px-4 py-2 text-sm font-black text-white"
        >
          <Plus size={16} /> Nuevo envío
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[1.3fr_0.9fr_1fr_0.7fr_0.7fr] bg-slate-50 px-4 py-2 text-xs font-bold text-slate-400">
          <div>Empresa</div>
          <div>Tipo de envío</div>
          <div>Concepto</div>
          <div>Precio</div>
          <div>Gestor</div>
        </div>
        {shipments.map((s) => (
          <div key={s.id} className="grid grid-cols-[1.3fr_0.9fr_1fr_0.7fr_0.7fr] border-t border-slate-100 px-4 py-3 text-sm">
            <div>{s.companies?.name}</div>
            <div>{s.service_type}</div>
            <div className="text-slate-500">{s.concept || "—"}</div>
            <div>{Number(s.price).toFixed(2)} €</div>
            <div>{s.profiles?.full_name}</div>
          </div>
        ))}
        {!loading && shipments.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-slate-400">No hay envíos registrados este día.</div>
        )}
      </div>

      {showForm && (
        <NewShipmentModal
          defaultDate={date}
          companies={companies}
          profileId={profile.id}
          onClose={() => setShowForm(false)}
          onCreated={(shipmentDate) => {
            setShowForm(false);
            setDate(shipmentDate);
          }}
        />
      )}
    </div>
  );
}

function NewShipmentModal({ defaultDate, companies, profileId, onClose, onCreated }) {
  const [shipmentDate, setShipmentDate] = useState(defaultDate);
  const [companyId, setCompanyId] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [concept, setConcept] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.from("service_types").select("name").eq("active", true).order("name")
      .then(({ data }) => setServiceTypes(data || []));
  }, []);

  // Al elegir empresa + tipo, proponemos el precio pactado si existe
  useEffect(() => {
    if (!companyId || !serviceType) return;
    supabase
      .from("company_rates")
      .select("price")
      .eq("company_id", companyId)
      .eq("service_type", serviceType)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setPrice(data.price);
      });
  }, [companyId, serviceType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error: insertError } = await supabase.from("shipments").insert({
      company_id: companyId,
      shipment_date: shipmentDate,
      service_type: serviceType,
      concept: concept || null,
      price: Number(price),
      notes: notes || null,
      created_by: profileId,
    });

    setSaving(false);
    if (insertError) {
      setError("No se pudo guardar el envío. Revisa los datos.");
      return;
    }
    onCreated(shipmentDate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-[#092640]">Nuevo envío</h2>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-400">Fecha del envío</label>
            <input
              required
              type="date"
              value={shipmentDate}
              onChange={(e) => setShipmentDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <select
            required
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="" disabled>Selecciona una empresa</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            required
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="" disabled>Tipo de envío</option>
            {serviceTypes.map((t) => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>

          <input
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Concepto (ej: molde dental, sobre documentación...)"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />

          <input
            required
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Precio (€)"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas internas (opcional, no sale en la factura)"
            rows={2}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />

          {error && <p className="text-sm font-medium text-[#e50914]">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#e50914] px-4 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar envío"}
          </button>
        </form>
      </div>
    </div>
  );
}
