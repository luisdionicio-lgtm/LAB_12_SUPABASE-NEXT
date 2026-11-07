import { getPrisma } from "@/lib/prisma";
import { json, run, HttpError, type IdContext } from "@/lib/http";
import { authorUpdateSchema } from "@/lib/validation";
export const runtime = "nodejs";
export async function GET(_req: Request, ctx: IdContext) { return run(async () => {
  const {id} = await ctx.params;
  const author = await getPrisma().author.findUnique({where:{id},include:{_count:{select:{books:true}}}});
  if (!author) throw new HttpError(404,"Autor no encontrado");
  return json(author);
}); }
export async function PUT(req: Request, ctx: IdContext) { return run(async () => {
  const {id} = await ctx.params; const data = authorUpdateSchema.parse(await req.json());
  return json(await getPrisma().author.update({where:{id},data}));
}); }
export async function DELETE(_req: Request, ctx: IdContext) { return run(async () => {
  const {id} = await ctx.params;
  await getPrisma().author.delete({where:{id}});
  return new Response(null,{status:204});
}); }
