import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null); // fila de public.profiles si es staff
  const [company, setCompany] = useState(null); // fila de public.companies si es cliente

  const loadIdentity = async (currentSession) => {
    setSession(currentSession);
    if (!currentSession) {
      setProfile(null);
      setCompany(null);
      setLoading(false);
      return;
    }

    const userId = currentSession.user.id;

    try {
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profileRow) {
        setProfile(profileRow);
        setCompany(null);
        return;
      }

      const { data: companyRow } = await supabase
        .from("companies")
        .select("*")
        .eq("portal_user_id", userId)
        .maybeSingle();

      setProfile(null);
      setCompany(companyRow || null);
    } catch (err) {
      console.error("Error cargando identidad del usuario:", err);
      setProfile(null);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => loadIdentity(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      loadIdentity(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = () => supabase.auth.signOut();

  const role = profile?.role || (company ? "empresa" : null);

  const value = {
    loading,
    session,
    user: session?.user || null,
    profile,
    company,
    role, // 'admin' | 'gestor' | 'empresa' | null
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
