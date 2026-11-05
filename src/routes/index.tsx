import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { notesQuery } from "@/lib/notes-query";
import { saveNote } from "@/lib/notes.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Notas — Apunta lo importante" },
      { name: "description", content: "Una app sencilla para crear y guardar notas con título y texto." },
      { property: "og:title", content: "Notas — Apunta lo importante" },
      { property: "og:description", content: "Una app sencilla para crear y guardar notas con título y texto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(notesQuery),
  component: Index,
});

function Index() {
  const { data: notes } = useSuspenseQuery(notesQuery);
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const save = useMutation({
    mutationFn: (data: { titulo: string; texto: string }) => saveNote({ data }),
    onSuccess: (note) => {
      queryClient.setQueryData(notesQuery.queryKey, (previous) => [note, ...(previous || [])]);
      setTitle("");
      setBody("");
      void queryClient.invalidateQueries({ queryKey: notesQuery.queryKey });
    },
  });

  const add = (e: FormEvent) => {
    e.preventDefault();
    if (save.isPending || (!title.trim() && !body.trim())) return;
    save.mutate({ titulo: title.trim(), texto: body.trim() });
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-5xl text-foreground">Notas</h1>
        <p className="mt-2 text-muted-foreground">Apunta lo importante.</p>

        <form onSubmit={add} className="mt-8 space-y-3 rounded-lg border bg-card p-5 shadow-paper">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            aria-label="Título"
            disabled={save.isPending}
            className="w-full rounded-md border bg-background px-3 py-2 text-lg font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Escribe tu nota…"
            aria-label="Texto"
            disabled={save.isPending}
            rows={4}
            className="w-full resize-y rounded-md border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            type="submit"
            disabled={save.isPending || (!title.trim() && !body.trim())}
          >
            {save.isPending ? "Guardando…" : "Guardar nota"}
          </Button>
          {save.isError && <p role="alert" className="text-sm text-destructive">No se pudo guardar la nota. Inténtalo de nuevo.</p>}
        </form>

        <ul className="mt-10 space-y-4">
          {notes.length === 0 && (
            <li className="text-center text-muted-foreground">Aún no hay notas.</li>
          )}
          {notes.map((n) => (
            <li key={n.id} className="group rounded-lg border bg-card p-5 shadow-paper">
              <div className="flex items-start justify-between gap-4">
                <h2 className="break-words text-xl font-semibold text-card-foreground">{n.titulo || "Sin título"}</h2>
              </div>
              {n.texto && <p className="mt-2 whitespace-pre-wrap break-words text-card-foreground/80">{n.texto}</p>}
              <p className="mt-3 text-xs text-muted-foreground">
                {new Date(n.created_at).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
