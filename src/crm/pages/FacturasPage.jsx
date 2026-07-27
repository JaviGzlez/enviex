import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

export default function FacturasPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("invoices")
      .select("id, series, number, period_start, period_end, total, status, pdf_url, companies(name)")
      .order("issued_at", { ascending: false })
      .then(({ data }) => {
        setInvoices(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-lg font-black text-[#092640]">Facturas</h1>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr_0.8fr] bg-slate-50 px-4 py-2 text-xs font-bold text-slate-400">
          <div>Empresa</div>
          <div>Nº factura</div>
          <div>Periodo</div>
          <div>Total</div>
          <div>Estado</div>
        </div>
        {invoices.map((inv) => (
          <div key={inv.id} className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr_0.8fr] border-t border-slate-100 px-4 py-3 text-sm">
            <div>{inv.companies?.name}</div>
            <div>{inv.series}-{inv.number}</div>
            <div>{inv.period_start} a {inv.period_end}</div>
            <div>{Number(inv.total).toFixed(2)} €</div>
            <div className="capitalize">{inv.status}</div>
          </div>
        ))}
        {!loading && invoices.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-slate-400">
            Aún no hay facturas generadas. Se crearán automáticamente el día 1 de cada mes.
          </div>
        )}
      </div>
    </div>
  );
}
