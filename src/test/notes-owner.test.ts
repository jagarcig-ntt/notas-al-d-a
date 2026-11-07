import { createClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const url = "https://cewuvlymayskfmotcvau.supabase.co";
const key = "sb_publishable_jKkZV7NTXmkoXsPY2IXjhg_JJZxk6Nh";
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const secret = process.env["SUPABASE_SERVICE_ROLE_KEY"];
const admin = secret ? createClient(url, secret, options) : null;
const owner = createClient(url, key, options);
const other = createClient(url, key, options);
const users: string[] = [];
let noteId = "";

describe.skipIf(!admin)("Owner-only notes", () => {
  beforeAll(async () => {
    if (!admin) throw new Error("Missing test account management");
    for (const client of [owner, other]) {
      const email = `notes-check-${crypto.randomUUID()}@example.com`;
      const password = `Check-${crypto.randomUUID()}`;
      const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
      if (created.error || !created.data.user) throw new Error("Test account creation failed");
      users.push(created.data.user.id);
      const login = await client.auth.signInWithPassword({ email, password });
      if (login.error) throw new Error("Test account login failed");
    }
  }, 30000);
  afterAll(async () => {
    if (!admin) return;
    if (noteId) await admin.from("notas_ensayo").delete().eq("id", noteId);
    for (const id of users) await admin.auth.admin.deleteUser(id);
  });
  it("allows adding a note with the signed-in owner as default", async () => {
    const { data, error } = await owner.from("notas_ensayo").insert({ titulo: "Prueba de privacidad", texto: "Solo del propietario" }).select("id, user_id").single();
    expect(error).toBeNull();
    expect(data?.user_id).toBe(users[0]);
    noteId = data?.id ?? "";
  });
  it("reads the owner's own note", async () => {
    const { data, error } = await owner.from("notas_ensayo").select("id").eq("id", noteId);
    expect(error).toBeNull();
    expect(data).toEqual([{ id: noteId }]);
  });
  it("hides that note from another signed-in user", async () => {
    const { data, error } = await other.from("notas_ensayo").select("id").eq("id", noteId);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });
  it("denies inserting a note for a different owner", async () => {
    const { error } = await other.from("notas_ensayo").insert({ titulo: "Intento ajeno", texto: "No debe guardarse", user_id: users[0] });
    expect(error?.code).toBe("42501");
  });
});