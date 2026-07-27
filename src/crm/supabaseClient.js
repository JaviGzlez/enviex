import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Ayuda a detectar rápido si falta configurar el .env
  console.error(
    "Faltan las variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Revisa tu archivo .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
