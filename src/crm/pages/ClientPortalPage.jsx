import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { supabase } from "../supabaseClient.js";
import { useAuth } from "../AuthContext.jsx";

const firstDayOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function ClientPortalPage() {
  const { loading, role, company, signOut } = useAuth();
  const [from, setFrom] = useState(firstDayOfMonth());
  const [to, setTo] = useState(todayISO());
  const [shipments, setShipments] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (!company) return;
    supabase
      .from("shipments")
      .select("shipment_date, service_type, price")
      .eq("company_id", company.id)
      .gte("shipment_date", from)
      .lte("shipment_date", to)
      .order("shipment_date", { ascending: false })
      .then(({ data }) => setShipments(data || []));
  }, [company, from, to]);

  useEffect(() => {
    if (!company) return;
    supabase
      .from("invoices")
      .select("id, series, number, period_start, period_end, total, pdf_url")
      .eq("company_id", company.id)
      .order("issued_at", { ascending: false })
      .then(({ data }) => setInvoices(data || []));
  }, [company]);

  if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-400">Cargando...</div>;
  if (role !== "empresa") return <Navigate to="/crm" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <div className="font-black text-[#092640]">{company.name}</div>
          <div className="text-xs text-slate-400">Portal de cliente Enviex</div>
        </div>
        <button onClick={signOut} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100">
          <LogOut size={16} /> Salir
        </button>
      </div>

      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-black text-[#092640]">Tus envíos</h2>
          <div className="flex items-center gap-2 text-sm">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-xl border border-slate-200 px-2 py-1" />
            <span className="text-slate-400">a</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-xl border border-slate-200 px-2 py-1" />
          </div>
        </div>
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[1fr_1.4fr_0.8fr] bg-slate-50 px-4 py-2 text-xs font-bold text-slate-400">
            <div>Fecha</div><div>Tipo de envío</div><div>Precio</div>
          </div>
          {shipments.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_1.4fr_0.8fr] border-t border-slate-100 px-4 py-3 text-sm">
              <div>{s.shipment_date}</div><div>{s.service_type}</div><div>{Number(s.price).toFixed(2)} €</div>
            </div>
          ))}
          {shipments.length === 0 && <div className="px-4 py-8 text-center text-sm text-slate-400">No hay envíos en este rango de fechas.</div>}
        </div>

        <h2 className="mb-2 font-black text-[#092640]">Tus facturas</h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[1fr_1fr_0.8fr_0.6fr] bg-slate-50 px-4 py-2 text-xs font-bold text-slate-400">
            <div>Periodo</div><div>Número</div><div>Total</div><div></div>
          </div>
          {invoices.map((inv) => (
            <div key={inv.id} className="grid grid-cols-[1fr_1fr_0.8fr_0.6fr] items-center border-t border-slate-100 px-4 py-3 text-sm">
              <div>{inv.period_start} - {inv.period_end}</div>
              <div>{inv.series}-{inv.number}</div>
              <div>{Number(inv.total).toFixed(2)} €</div>
              <div>
                {inv.pdf_url ? (
                  <a href={inv.pdf_url} target="_blank" rel="noreferrer" className="font-bold text-[#092640] underline">PDF</a>
                ) : "-"}
              </div>
            </div>
          ))}
          {invoices.length === 0 && <div className="px-4 py-8 text-center text-sm text-slate-400">Aún no tienes facturas.</div>}
        </div>
      </div>
    </div>
  );
}
