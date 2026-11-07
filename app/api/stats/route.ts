import { getPrisma } from "@/lib/prisma";
import { json, run } from "@/lib/http";
export const runtime = "nodejs";
export async function GET() { return run(async () => {
  const db=getPrisma();
  const [totalAuthors,totalBooks,aggregate,groups,recentBooks]=await db.$transaction([
    db.author.count(),db.book.count(),db.book.aggregate({_sum:{pages:true},_avg:{pages:true}}),
    db.book.groupBy({by:["genre"],_count:{_all:true},orderBy:{genre:"asc"}}),
    db.book.findMany({take:4,include:{author:true},orderBy:[{createdAt:"desc"},{id:"asc"}]}),
  ],{isolationLevel:"RepeatableRead"});
  return json({totalAuthors,totalBooks,totalGenres:groups.length,totalPages:aggregate._sum.pages??0,
    averagePages:aggregate._avg.pages===null?null:Math.round(aggregate._avg.pages*100)/100,
    genres:groups.map(g=>({name:g.genre,count:g._count._all})),recentBooks});
}); }
