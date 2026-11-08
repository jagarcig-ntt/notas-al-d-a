import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mis notas del ensayo 2" },
      { name: "description", content: "Accede a tu cuenta para crear y guardar tus notas privadas." },
      { property: "og:title", content: "Mis notas del ensayo 2" },
      { property: "og:description", content: "Accede a tu cuenta para crear y guardar tus notas privadas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active) void navigate({ to: data.user ? "/notas" : "/auth", replace: true });
    }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [navigate]);
  return <main className="min-h-screen bg-background px-4 py-12"><div className="mx-auto max-w-2xl"><h1 className="font-display text-5xl text-foreground">Mis notas del ensayo 2</h1>{error ? <Button className="mt-8" onClick={() => navigate({ to: "/auth" })}>Iniciar sesión</Button> : <p role="status" className="mt-8 text-muted-foreground">Cargando…</p>}</div></main>;
}
