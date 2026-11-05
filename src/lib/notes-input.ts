import { z } from "zod";

export const noteInput = z.object({
  titulo: z.string().trim(),
  texto: z.string().trim(),
}).refine((note) => Boolean(note.titulo || note.texto), "Escribe un título o texto.");