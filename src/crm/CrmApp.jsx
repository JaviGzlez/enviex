import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardLayout from "./DashboardLayout.jsx";
import EnviosPage from "./pages/EnviosPage.jsx";
import EmpresasPage from "./pages/EmpresasPage.jsx";
import FacturasPage from "./pages/FacturasPage.jsx";
import UsuariosPage from "./pages/UsuariosPage.jsx";
import ClientPortalPage from "./pages/ClientPortalPage.jsx";

function RequireAuth({ children }) {
  const { loading, session } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-400">Cargando...</div>;
  if (!session) return <Navigate to="/crm/login" replace />;
  return children;
}

export default function CrmApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          path="portal"
          element={
            <RequireAuth>
              <ClientPortalPage />
            </RequireAuth>
          }
        />
        <Route
          path=""
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<EnviosPage />} />
          <Route path="empresas" element={<EmpresasPage />} />
          <Route path="facturas" element={<FacturasPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
