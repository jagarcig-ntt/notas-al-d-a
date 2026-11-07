import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Acceso | Mis notas del ensayo 2" },
    { name: "description", content: "Inicia sesión o crea una cuenta para guardar tus notas privadas." },
    { property: "og:title", content: "Acceso | Mis notas del ensayo 2" },
    { property: "og:description", content: "Inicia sesión o crea una cuenta para guardar tus notas privadas." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (pending) return;
    setPending(true); setError(""); setMessage("");
    try {
      const result = mode === "signup"
        ? await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin } })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (result.error) {
        const code = result.error.code;
        setError(code === "invalid_credentials" ? "El email o la contraseña no son correctos."
          : code === "email_not_confirmed" ? "Confirma tu email antes de iniciar sesión."
          : code === "user_already_exists" ? "Ya existe una cuenta con ese email."
          : code === "weak_password" ? "Elige una contraseña más segura."
          : code === "over_email_send_rate_limit" || code === "over_request_rate_limit" ? "Demasiados intentos. Espera unos minutos."
          : "No se pudo completar la operación. Inténtalo de nuevo.");
        return;
      }
      if (result.data.session) {
        const { data, error: validationError } = await supabase.auth.getUser();
        if (validationError || !data.user) { setError("No se pudo verificar la sesión."); return; }
        await navigate({ to: "/notas", replace: true });
      } else {
        setMessage("Revisa tu correo y confirma tu email para completar el registro. Después podrás iniciar sesión.");
        setPassword("");
      }
    } catch {
      setError("No se pudo conectar. Inténtalo de nuevo.");
    } finally { setPending(false); }
  };
  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-5xl text-foreground">Mis notas del ensayo 2</h1>
        <div className="mt-8 max-w-md">
          <div className="mb-6 flex gap-2" role="group" aria-label="Acceso a la cuenta">
            <Button variant={mode === "login" ? "default" : "outline"} disabled={pending} aria-pressed={mode === "login"} onClick={() => { setMode("login"); setError(""); setMessage(""); }}>Iniciar sesión</Button>
            <Button variant={mode === "signup" ? "default" : "outline"} disabled={pending} aria-pressed={mode === "signup"} onClick={() => { setMode("signup"); setError(""); setMessage(""); }}>Crear cuenta</Button>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" required value={email} disabled={pending} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="password">Contraseña</Label><Input id="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={6} required value={password} disabled={pending} onChange={(e) => setPassword(e.target.value)} /></div>
            <Button type="submit" disabled={pending}>{pending ? "Espera…" : mode === "signup" ? "Registrarme" : "Entrar"}</Button>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            {message && <p role="status" className="text-sm text-foreground">{message}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}