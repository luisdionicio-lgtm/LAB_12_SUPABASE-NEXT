import { getPrisma } from "@/lib/prisma";
import { json, run } from "@/lib/http";
import { authorSchema } from "@/lib/validation";
export const runtime = "nodejs";
export async function GET() { return run(async () => json(await getPrisma().author.findMany({orderBy: [{name:"asc"},{id:"asc"}], include:{_count:{select:{books:true}}}}))); }
export async function POST(req: Request) { return run(async () => {
  const data = authorSchema.parse(await req.json());
  return json(await getPrisma().author.create({data}),201);
}); }
