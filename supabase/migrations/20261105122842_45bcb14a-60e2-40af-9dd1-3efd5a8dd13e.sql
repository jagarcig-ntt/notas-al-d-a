CREATE TABLE public.notas_ensayo (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 titulo text NOT NULL DEFAULT '',
 texto text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.notas_ensayo TO anon, authenticated;
GRANT ALL ON public.notas_ensayo TO service_role;
ALTER TABLE public.notas_ensayo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read notes" ON public.notas_ensayo FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add notes" ON public.notas_ensayo FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE FUNCTION public.notas_ensayo_update_timestamp() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER notas_ensayo_updated_at BEFORE UPDATE ON public.notas_ensayo FOR EACH ROW EXECUTE FUNCTION public.notas_ensayo_update_timestamp();