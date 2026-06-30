import { createClient } from "@/lib/supabase/server";

export async function getAuthorizedClient() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user ? supabase : null;
}
