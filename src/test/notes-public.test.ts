import { createClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";
import { noteInput } from "@/lib/notes-input";

// Use a sessionless publishable client to verify actual anonymous access rules.
const client = createClient("https://cewuvlymayskfmotcvau.supabase.co", "sb_publishable_jKkZV7NTXmkoXsPY2IXjhg_JJZxk6Nh", {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

describe("Public notas_ensayo", () => {
  it("allows anyone to read notes without a session", async () => {
    const { data, error } = await client.from("notas_ensayo").select("id, titulo, texto").limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
  it("allows anyone to add notes without a session", async () => {
    const input = { titulo: "Prueba de conexión", texto: "Nota de prueba pública guardada en Supabase." };
    const { data, error } = await client.from("notas_ensayo").insert(input).select("titulo, texto").single();
    expect(error).toBeNull();
    expect(data).toEqual(input);
  });
  it("rejects empty notes", () => {
    expect(noteInput.safeParse({ titulo: " ", texto: " " }).success).toBe(false);
  });
});