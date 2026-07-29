-- ============================================================
-- ENVIEX CRM — Almacenamiento de facturas + numeración segura
-- Ejecutar en Supabase: SQL Editor > New query > pegar > Run
-- ============================================================

-- Contador de numeración por serie, para que nunca se repita ni se salte un número
create table public.invoice_sequences (
  series text primary key,
  next_number integer not null default 1
);
insert into public.invoice_sequences (series, next_number) values ('A', 1);

-- Bucket privado donde se guardan los PDF de las facturas
insert into storage.buckets (id, name, public)
values ('invoices', 'invoices', false)
on conflict (id) do nothing;

-- Políticas de acceso a los archivos: mismo criterio que las tablas
create policy "staff lee todos los pdf de facturas"
on storage.objects for select
using (bucket_id = 'invoices' and public.is_staff());

create policy "empresa lee solo sus propios pdf"
on storage.objects for select
using (
  bucket_id = 'invoices'
  and (storage.foldername(name))[1] = public.my_company_id()::text
);

-- Solo el servidor (service_role, usado por la función automática) puede escribir/borrar
-- Nota: service_role se salta las políticas RLS por diseño, así que no hace falta
-- política de insert/update aquí — y así nos aseguramos de que nadie desde el
-- navegador pueda subir o modificar un PDF de factura manualmente.
