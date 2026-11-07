import { getPrisma } from "@/lib/prisma";
import { json, run, HttpError, type IdContext } from "@/lib/http";
import { bookUpdateSchema } from "@/lib/validation";
export const runtime = "nodejs";
export async function GET(_req: Request, ctx: IdContext) { return run(async () => {
  const {id}=await ctx.params; const book=await getPrisma().book.findUnique({where:{id},include:{author:true}});
  if(!book) throw new HttpError(404,"Libro no encontrado"); return json(book);
}); }
export async function PUT(req: Request, ctx: IdContext) { return run(async () => {
  const {id}=await ctx.params; const data=bookUpdateSchema.parse(await req.json()); const db=getPrisma();
  if(data.authorId && !await db.author.findUnique({where:{id:data.authorId},select:{id:true}})) throw new HttpError(404,"Autor no encontrado");
  return json(await db.book.update({where:{id},data,include:{author:true}}));
}); }
export async function DELETE(_req: Request, ctx: IdContext) { return run(async () => {
  const {id}=await ctx.params; await getPrisma().book.delete({where:{id}}); return new Response(null,{status:204});
}); }
