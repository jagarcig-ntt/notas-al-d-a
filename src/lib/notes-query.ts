import { queryOptions } from "@tanstack/react-query";
import { listNotes } from "./notes.functions";

export const notesQuery = queryOptions({ queryKey: ["notas_ensayo"], queryFn: () => listNotes() });