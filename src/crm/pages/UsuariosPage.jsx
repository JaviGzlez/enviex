import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

export default function UsuariosPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, full_name, role, active")
      .order("full_name")
      .then(({ data }) => setUsers(data || []));
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-lg font-black text-[#092640]">Usuarios internos</h1>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[1.4fr_1fr_0.8fr] bg-slate-50 px-4 py-2 text-xs font-bold text-slate-400">
          <div>Nombre</div>
          <div>Rol</div>
          <div>Estado</div>
        </div>
        {users.map((u) => (
          <div key={u.id} className="grid grid-cols-[1.4fr_1fr_0.8fr] border-t border-slate-100 px-4 py-3 text-sm capitalize">
            <div>{u.full_name}</div>
            <div>{u.role}</div>
            <div>{u.active ? "Activo" : "Inactivo"}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-400">
        El alta de nuevos usuarios (Belén, Carlos) se hace de momento desde Supabase directamente.
        El botón de "Crear usuario" aquí mismo lo añadimos en el siguiente paso, cuando montemos
        la función de servidor que lo automatiza.
      </p>
    </div>
  );
}
