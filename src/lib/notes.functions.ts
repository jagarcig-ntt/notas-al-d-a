import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { noteInput } from "./notes-input";

function publicNotesClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("La conexión con Supabase no está configurada.");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
}

export const listNotes = createServerFn({ method: "GET" }).handler(async () => {
  const client = publicNotesClient();
  const notes = [];
  // Page through all notes instead of silently stopping at Supabase's row limit.
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await client.from("notas_ensayo")
      .select("id, titulo, texto, created_at").order("created_at", { ascending: false })
      .order("id", { ascending: false }).range(offset, offset + 999);
    if (error) throw new Error("No se pudieron cargar las notas.");
    notes.push(...data);
    if (data.length < 1000) return notes;
  }
});

export const saveNote = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => noteInput.parse(input))
  .handler(async ({ data }) => {
    const { data: note, error } = await publicNotesClient().from("notas_ensayo")
      .insert(data).select("id, titulo, texto, created_at").single();
    if (error) throw new Error("No se pudo guardar la nota. Inténtalo de nuevo.");
    return note;
  });