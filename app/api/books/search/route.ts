import { getPrisma } from "@/lib/prisma";
import { json, run } from "@/lib/http";
import { searchSchema, pagination } from "@/lib/validation";
import type { Prisma } from "@/generated/prisma/client";
export const runtime = "nodejs";
export async function GET(req: Request) { return run(async () => {
  const p=searchSchema.parse(Object.fromEntries(new URL(req.url).searchParams));
  const where: Prisma.BookWhereInput = {
    ...(p.search?{title:{contains:p.search,mode:"insensitive"}}:{}),
    ...(p.genre?{genre:p.genre}:{}),
    ...(p.authorName?{author:{name:{contains:p.authorName,mode:"insensitive"}}}:{}),
    ...(p.authorId?{authorId:p.authorId}:{}),
  };
  // Ambos resultados pertenecen a la misma fotografía de la base de datos.
  const [total,data]=await getPrisma().$transaction([
    getPrisma().book.count({where}),
    getPrisma().book.findMany({where,include:{author:true},skip:(p.page-1)*p.limit,take:p.limit,orderBy:[{[p.sortBy]:p.order},{id:"asc"}]}),
  ],{isolationLevel:"RepeatableRead"});
  return json({data,pagination:pagination(p.page,p.limit,total)});
}); }
