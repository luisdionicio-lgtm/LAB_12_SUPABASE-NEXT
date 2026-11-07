import { getPrisma } from "@/lib/prisma";
import { json, run, HttpError, type IdContext } from "@/lib/http";
export const runtime = "nodejs";
export async function GET(_req: Request, ctx: IdContext) { return run(async () => {
  const {id} = await ctx.params; const db=getPrisma();
  if (!await db.author.findUnique({where:{id},select:{id:true}})) throw new HttpError(404,"Autor no encontrado");
  return json(await db.book.findMany({where:{authorId:id},include:{author:true},orderBy:[{publishedYear:"desc"},{title:"asc"},{id:"asc"}]}));
}); }
