import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

/**
 * Buscador de empresa con sugerencias en vivo.
 * companies: [{ id, name }]
 * value: id de la empresa seleccionada (o "")
 * onChange: (id) => void
 */
export default function CompanySearchSelect({ companies, value, onChange, placeholder = "Buscar empresa..." }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selected = companies.find((c) => c.id === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = companies
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  if (selected && !open) {
    return (
      <div className="flex items-center gap-1 rounded-xl border border-slate-200 py-2 pl-3 pr-1 text-sm">
        <span className="font-bold text-[#092640]">{selected.name}</span>
        <button
          type="button"
          onClick={() => { onChange(""); setQuery(""); }}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
          title="Quitar filtro"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-56 rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm"
      />
      {open && query && (
        <div className="absolute z-20 mt-1 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {suggestions.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => { onChange(c.id); setQuery(""); setOpen(false); }}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
            >
              {c.name}
            </button>
          ))}
          {suggestions.length === 0 && (
            <div className="px-3 py-2 text-sm text-slate-400">Sin coincidencias</div>
          )}
        </div>
      )}
    </div>
  );
}
