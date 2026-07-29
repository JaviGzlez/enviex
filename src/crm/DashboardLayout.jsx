import React from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { Building2, FileText, LogOut, Tags, Truck, Users } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";

const navItemClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
    isActive ? "bg-[#e9f0fa] text-[#092640]" : "text-slate-500 hover:bg-slate-50"
  }`;

export default function DashboardLayout() {
  const { loading, role, profile, signOut } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-400">Cargando...</div>;
  }

  // Solo el staff (admin/gestor) entra aquí. Las empresas van a su propio portal.
  if (role !== "admin" && role !== "gestor") {
    return <Navigate to="/crm/portal" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-52 flex-shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-4">
        <div>
          <div className="mb-6 px-1 text-lg font-black text-[#092640]">enviex</div>
          <nav className="flex flex-col gap-1">
            <NavLink to="/crm" end className={navItemClass}>
              <Truck size={18} /> Envíos
            </NavLink>
            <NavLink to="/crm/empresas" className={navItemClass}>
              <Building2 size={18} /> Empresas
            </NavLink>
            <NavLink to="/crm/tarifas" className={navItemClass}>
              <Tags size={18} /> Tarifas
            </NavLink>
            <NavLink to="/crm/facturas" className={navItemClass}>
              <FileText size={18} /> Facturas
            </NavLink>
            {role === "admin" && (
              <NavLink to="/crm/usuarios" className={navItemClass}>
                <Users size={18} /> Usuarios
              </NavLink>
            )}
          </nav>
        </div>
        <div>
          <div className="mb-2 px-1 text-xs font-bold text-slate-400">{profile?.full_name}</div>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50"
          >
            <LogOut size={18} /> Salir
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
