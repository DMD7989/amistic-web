// Valeurs du projet Supabase (voir supabase/LISEZMOI.md).
// La clé « publishable » est publique : la sécurité repose sur les règles de supabase/schema.sql.
export const SUPABASE_URL = 'https://lrzycauhnkklamhubqlg.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_mx2JViOkPVARFnT5cJZsIw_HPlrqCWA';

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
