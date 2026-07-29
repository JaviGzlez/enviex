-- ============================================================
-- ENVIEX CRM — Permisos de Admin, catálogo de tarifas, concepto en envíos
-- Ejecutar en Supabase: SQL Editor > New query > pegar > Run
-- ============================================================

-- ------------------------------------------------------------
-- 1) Separar permisos: gestores pueden crear/editar, solo Admin borra
-- ------------------------------------------------------------
drop policy if exists "staff gestiona empresas" on public.companies;

create policy "staff ve y crea empresas" on public.companies
  for select using (public.is_staff());
create policy "staff inserta empresas" on public.companies
  for insert with check (public.is_staff());
create policy "staff actualiza empresas" on public.companies
  for update using (public.is_staff());
create policy "solo admin borra empresas" on public.companies
  for delete using (public.is_admin());

-- Las facturas nunca se editan/borran vía RLS normal (solo con la función de abajo,
-- pensada exclusivamente para limpiar pruebas, nunca facturas reales ya enviadas)
create policy "solo admin borra facturas" on public.invoices
  for delete using (public.is_admin());
create policy "solo admin borra lineas de factura" on public.invoice_lines
  for delete using (public.is_admin());

-- ------------------------------------------------------------
-- 2) Catálogo de tarifas compartido (tipos de envío + precio orientativo)
--    Gestores y Admin pueden crear/editar; solo Admin borra.
-- ------------------------------------------------------------
create table public.service_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  default_price numeric(10,2) not null,
  active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.service_types enable row level security;

create policy "staff ve tarifas" on public.service_types
  for select using (public.is_staff());
create policy "staff crea tarifas" on public.service_types
  for insert with check (public.is_staff());
create policy "staff edita tarifas" on public.service_types
  for update using (public.is_staff());
create policy "solo admin borra tarifas" on public.service_types
  for delete using (public.is_admin());

insert into public.service_types (name, default_price) values
  ('Documento', 4.50),
  ('Paquete pequeño', 6.50),
  ('Paquete mediano', 9.00),
  ('Paquete grande', 13.00);

-- ------------------------------------------------------------
-- 3) Campo de concepto en cada envío (para desglosar mejor en la factura)
-- ------------------------------------------------------------
alter table public.shipments add column concept text;

-- ------------------------------------------------------------
-- 4) Funciones para que el Admin pueda borrar de verdad (empresas y facturas
--    de prueba). Son "security definer" para poder saltarse las restricciones
--    normales de borrado en cascada, pero comprueban por dentro que quien
--    llama es Admin de verdad.
-- ------------------------------------------------------------
create or replace function public.admin_delete_company(target_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Solo un Admin puede borrar empresas';
  end if;

  delete from public.invoice_lines where invoice_id in (select id from public.invoices where company_id = target_id);
  delete from public.invoices where company_id = target_id;
  delete from public.shipments where company_id = target_id;
  delete from public.company_rates where company_id = target_id;
  delete from public.companies where id = target_id;
end;
$$;

create or replace function public.admin_delete_invoice(target_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Solo un Admin puede borrar facturas';
  end if;

  -- Los envíos vuelven a quedar sin facturar, en vez de borrarse
  update public.shipments set invoice_id = null where invoice_id = target_id;
  delete from public.invoice_lines where invoice_id = target_id;
  delete from public.invoices where id = target_id;
end;
$$;

-- ------------------------------------------------------------
-- 5) Guardamos el email en el perfil (para poder mandar recuperación
--    de contraseña y mostrarlo en la lista de usuarios)
-- ------------------------------------------------------------
alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;

