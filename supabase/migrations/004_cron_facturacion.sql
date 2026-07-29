-- ============================================================
-- ENVIEX CRM — Programación automática de facturación mensual
-- Ejecutar en Supabase: SQL Editor > New query > pegar > Run
--
-- IMPORTANTE: antes de ejecutar esto, sustituye:
--   - TU-PROYECTO   por el identificador de tu proyecto (ej: jrggcnkbhlpwztbkavcy)
--   - TU-ANON-KEY   por tu clave "anon public" / "publishable" (la misma del .env)
-- ============================================================

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'facturacion-mensual-enviex',
  '0 6 1 * *', -- a las 06:00 el día 1 de cada mes
  $$
  select net.http_post(
    url := 'https://TU-PROYECTO.supabase.co/functions/v1/generate-monthly-invoices',
    headers := jsonb_build_object(
      'Authorization', 'Bearer TU-ANON-KEY',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Para comprobar que quedó programado:
-- select * from cron.job;
