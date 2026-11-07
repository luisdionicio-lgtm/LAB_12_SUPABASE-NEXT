# Archivos mágicos — Sistema de biblioteca

Laboratorio 12 de Desarrollo de Aplicaciones Web Avanzado. Aplicación de autores y libros con Next.js App Router, TypeScript, Prisma y PostgreSQL alojado en Supabase. La interfaz está inspirada en una biblioteca mágica.

## Requisitos e instalación

Node.js 22.12 o superior. Ejecutar `npm ci`, copiar `.env.example` a `.env` y configurar las URL de PostgreSQL con la contraseña de la base de datos codificada para URL. No incluir `.env` en Git. La CA pública de Supabase se encuentra en `certs/supabase-ca.crt` para verificar el certificado.

Ejecutar `npm run db:push` y después `npm run dev`; abrir http://localhost:3000. `DATABASE_URL` se usa en tiempo de ejecución y `DIRECT_URL` por la CLI de Prisma. No es necesario instalar PostgreSQL localmente.

## Funciones

- Gestión de autores y libros: crear, consultar, actualizar y eliminar.
- `GET /api/books/search`: búsqueda parcial por título y nombre de autor sin distinguir mayúsculas, filtro exacto de género, paginación, límites, orden y estadísticas de página. También admite `authorId` para el selector de autor.
- `GET /api/authors/[id]/stats`: total, primer y último libro, promedio de páginas, géneros únicos y libros más largo y corto.
- Panel principal con estadísticas generales, catálogo con filtros y detalle de autor con edición y libros.
- Las operaciones que eliminan autores con libros asociados se rechazan hasta reasignar o eliminar sus libros.

Ejemplos de catálogo: `GET /api/books/search?search=harry&genre=Fantasía&page=1&limit=10&sortBy=publishedYear&order=desc`. Los ISBN que comienzan con `EJEMPLO-HP-` son identificadores de demostración, no ISBN reales.

## Pruebas y despliegue

`npm run build`, `npm run lint`, `npm test` y `npx tsx tests/advanced.integration.ts` comprueban la compilación, el código y los endpoints. La prueba avanzada utiliza los registros de ejemplo de Rowling creados para esta demostración; la prueba básica crea y elimina sus propios registros temporales.

En Vercel configurar `DATABASE_URL` con la URL de Supabase, incluido el certificado raíz, como variable sensible del servidor. La aplicación es una demostración académica sin autenticación: cualquier visitante con acceso puede crear, editar o eliminar datos; no utilizarla para datos privados.
