import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@/generated/prisma/client";

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export type IdContext = { params: Promise<{ id: string }> };
export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}
export function handleError(error: unknown) {
  if (error instanceof HttpError) return json({error: error.message}, error.status);
  if (error instanceof ZodError) return json({ error: "Datos inválidos", details: error.issues.map(i => ({ field: i.path.join("."), message: i.message })) }, 400);
  if (error instanceof SyntaxError) return json({error: "El cuerpo debe contener JSON válido"}, 400);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return json({error: "Ya existe un registro con ese correo o ISBN"}, 409);
    if (error.code === "P2025") return json({error: "Registro no encontrado"}, 404);
    if (error.code === "P2003") return json({error: "El autor no existe o tiene libros asociados. Elimina o reasigna sus libros antes de eliminarlo."}, 409);
  }
  // No exponer URL, credenciales ni errores internos en las respuestas.
  console.error("API error:", error instanceof Error ? error.name : "UnknownError");
  return json({error: "No se pudo completar la operación. Revisa la conexión con la base de datos."}, 503);
}
export async function run(action: () => Promise<Response>) {
  try { return await action(); } catch (error) { return handleError(error); }
}
