import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
  component: Index,
});

type Note = { id: string; title: string; body: string; createdAt: number };
const KEY = "notas-app";

function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    try {
      setNotes(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(notes));
  }, [notes, loaded]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !body.trim()) return;
    setNotes([{ id: crypto.randomUUID(), title: title.trim(), body: body.trim(), createdAt: Date.now() }, ...notes]);
    setTitle("");
    setBody("");
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
            className="w-full rounded-md border bg-background px-3 py-2 text-lg font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Escribe tu nota…"
            rows={4}
            className="w-full resize-y rounded-md border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-5 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Guardar nota
          </button>
        </form>

        <ul className="mt-10 space-y-4">
          {loaded && notes.length === 0 && (
            <li className="text-center text-muted-foreground">Aún no hay notas.</li>
          )}
          {notes.map((n) => (
            <li key={n.id} className="group rounded-lg border bg-card p-5 shadow-paper">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-card-foreground">{n.title || "Sin título"}</h2>
                <button
                  onClick={() => setNotes(notes.filter((x) => x.id !== n.id))}
                  className="text-sm text-muted-foreground hover:text-destructive"
                >
                  Borrar
                </button>
              </div>
              {n.body && <p className="mt-2 whitespace-pre-wrap text-card-foreground/80">{n.body}</p>}
              <p className="mt-3 text-xs text-muted-foreground">
                {new Date(n.createdAt).toLocaleString("es-ES")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
