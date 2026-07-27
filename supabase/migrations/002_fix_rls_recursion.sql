-- ============================================================
-- ENVIEX CRM — Corrección: recursión infinita en RLS
-- Ejecutar en Supabase: SQL Editor > New query > pegar > Run
-- (Es seguro ejecutarlo aunque ya tengas la migración 001 aplicada)
-- ============================================================

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and active = true and role in ('admin', 'gestor')
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and active = true and role = 'admin'
  );
$$;

create or replace function public.my_company_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.companies where portal_user_id = auth.uid();
$$;
