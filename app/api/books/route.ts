import { getPrisma } from "@/lib/prisma";
import { json, run, HttpError } from "@/lib/http";
import { bookSchema } from "@/lib/validation";
export const runtime = "nodejs";
export async function GET(req: Request) { return run(async () => {
  const genre=new URL(req.url).searchParams.get("genre");
  return json(await getPrisma().book.findMany({where:genre?{genre}:undefined,include:{author:true},orderBy:[{createdAt:"desc"},{id:"asc"}]}));
}); }
export async function POST(req: Request) { return run(async () => {
  const data=bookSchema.parse(await req.json()); const db=getPrisma();
  if(!await db.author.findUnique({where:{id:data.authorId},select:{id:true}})) throw new HttpError(404,"Autor no encontrado");
  return json(await db.book.create({data,include:{author:true}}),201);
}); }
