import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { noteInput } from "./notes-input";

export const listNotes = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const notes = [];
  // Page through all notes instead of silently stopping at Supabase's row limit.
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await context.supabase.from("notas_ensayo")
      .select("id, titulo, texto, created_at").eq("user_id", context.userId).order("created_at", { ascending: false })
      .order("id", { ascending: false }).range(offset, offset + 999);
    if (error) throw new Error("No se pudieron cargar las notas.");
    notes.push(...data);
    if (data.length < 1000) return notes;
  }
});

export const saveNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => noteInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: note, error } = await context.supabase.from("notas_ensayo")
      .insert({ ...data, user_id: context.userId }).select("id, titulo, texto, created_at").single();
    if (error) throw new Error("No se pudo guardar la nota. Inténtalo de nuevo.");
    return note;
  });