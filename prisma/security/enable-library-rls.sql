-- Las tablas de la biblioteca solo se consultan desde el backend con Prisma.
-- No se autoriza acceso directo mediante la Data API de Supabase.
BEGIN;
SET LOCAL lock_timeout = '10s';
ALTER TABLE public."Author" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Book" ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public."Author", public."Book"
  FROM anon, authenticated, PUBLIC;
COMMIT;
