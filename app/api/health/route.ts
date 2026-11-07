import { getPrisma } from "@/lib/prisma";
import { json, run } from "@/lib/http";
export const runtime="nodejs";
export async function GET(){return run(async()=>{await getPrisma().$queryRaw`SELECT 1`;return json({status:"ok",database:"connected"});});}
