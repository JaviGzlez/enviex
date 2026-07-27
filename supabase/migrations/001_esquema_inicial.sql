-- ============================================================
-- ENVIEX CRM — Esquema inicial de base de datos
-- Ejecutar en Supabase: Project > SQL Editor > New query > Run
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- PROFILES: extiende auth.users con rol interno (admin/gestor)
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin', 'gestor')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- COMPANIES (empresas cliente)
-- ------------------------------------------------------------
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nif_cif text not null,
  fiscal_address text not null,
  email text not null,
  phone text,
  contact_person text,
  portal_user_id uuid unique references auth.users(id),
  created_by uuid not null references public.profiles(id),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- COMPANY_RATES (tarifa pactada por tipo de envio)
-- ------------------------------------------------------------
create table public.company_rates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  service_type text not null,
  price numeric(10,2) not null,
  unique (company_id, service_type)
);

-- ------------------------------------------------------------
-- INVOICES (facturas) — se crea antes de shipments por la FK
-- ------------------------------------------------------------
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  series text not null default 'A',
  number text not null,
  company_id uuid not null references public.companies(id),
  period_start date not null,
  period_end date not null,
  subtotal numeric(10,2) not null,
  iva_rate numeric(4,2) not null default 0.21,
  iva_amount numeric(10,2) not null,
  total numeric(10,2) not null,
  status text not null default 'issued' check (status in ('issued', 'sent', 'rectified')),
  hash text not null,
  previous_hash text,
  qr_data text not null,
  pdf_url text,
  issued_at timestamptz not null default now(),
  unique (series, number)
);

-- ------------------------------------------------------------
-- SHIPMENTS (envios diarios)
-- ------------------------------------------------------------
create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  shipment_date date not null,
  service_type text not null,
  price numeric(10,2) not null,
  notes text,
  created_by uuid not null references public.profiles(id),
  invoice_id uuid references public.invoices(id),
  created_at timestamptz not null default now()
);

create index shipments_company_date_idx on public.shipments (company_id, shipment_date);

-- ------------------------------------------------------------
-- INVOICE_LINES (detalle de cada factura)
-- ------------------------------------------------------------
create table public.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  shipment_id uuid references public.shipments(id),
  description text not null,
  price numeric(10,2) not null
);

-- ------------------------------------------------------------
-- EVENT_LOG (registro inmutable de eventos, obligatorio por ley)
-- Solo se escribe desde el backend (service_role), nunca desde el cliente
-- ------------------------------------------------------------
create table public.event_log (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  entity_type text not null,
  entity_id uuid,
  actor_id uuid references public.profiles(id),
  details jsonb,
  hash text not null,
  previous_hash text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- FUNCIONES DE APOYO PARA LAS POLITICAS (RLS)
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

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.company_rates enable row level security;
alter table public.shipments enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_lines enable row level security;
alter table public.event_log enable row level security;

-- PROFILES: el propio staff puede verse entre si; solo admin modifica
create policy "staff ve todos los perfiles" on public.profiles
  for select using (public.is_staff());
create policy "solo admin crea o edita perfiles" on public.profiles
  for insert with check (public.is_admin());
create policy "solo admin actualiza perfiles" on public.profiles
  for update using (public.is_admin());
create policy "solo admin borra perfiles" on public.profiles
  for delete using (public.is_admin());

-- COMPANIES: staff ve y gestiona todas; la empresa cliente solo ve la suya
create policy "staff gestiona empresas" on public.companies
  for all using (public.is_staff()) with check (public.is_staff());
create policy "empresa ve su propia ficha" on public.companies
  for select using (portal_user_id = auth.uid());

-- COMPANY_RATES: solo staff
create policy "staff gestiona tarifas" on public.company_rates
  for all using (public.is_staff()) with check (public.is_staff());

-- SHIPMENTS: staff gestiona todo; empresa ve solo los suyos
create policy "staff gestiona envios" on public.shipments
  for all using (public.is_staff()) with check (public.is_staff());
create policy "empresa ve sus propios envios" on public.shipments
  for select using (company_id = public.my_company_id());

-- INVOICES: staff ve todas; empresa ve solo las suyas; nadie las edita desde el cliente
create policy "staff ve facturas" on public.invoices
  for select using (public.is_staff());
create policy "empresa ve sus facturas" on public.invoices
  for select using (company_id = public.my_company_id());

-- INVOICE_LINES: mismo criterio via la factura
create policy "staff ve lineas de factura" on public.invoice_lines
  for select using (public.is_staff());
create policy "empresa ve lineas de sus facturas" on public.invoice_lines
  for select using (
    invoice_id in (select id from public.invoices where company_id = public.my_company_id())
  );

-- EVENT_LOG: solo lectura para admin; nunca editable desde el cliente
create policy "admin lee el registro de eventos" on public.event_log
  for select using (public.is_admin());
