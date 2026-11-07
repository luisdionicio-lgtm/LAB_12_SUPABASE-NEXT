import { getPrisma } from "@/lib/prisma";
import { json, run, HttpError, type IdContext } from "@/lib/http";
export const runtime = "nodejs";
export async function GET(_req: Request, ctx: IdContext) { return run(async () => {
  const {id} = await ctx.params;
  const author=await getPrisma().author.findUnique({where:{id},include:{books:{orderBy:[{publishedYear:"asc"},{title:"asc"},{id:"asc"}]}}});
  if (!author) throw new HttpError(404,"Autor no encontrado");
  const books=author.books;
  const byPages=[...books].sort((a,b)=>a.pages-b.pages || a.title.localeCompare(b.title));
  const first=books[0], latest=books.at(-1), shortest=byPages[0], longest=byPages.at(-1);
  return json({authorId:id,authorName:author.name,totalBooks:books.length,
    firstBook:first?{title:first.title,year:first.publishedYear}:null,
    latestBook:latest?{title:latest.title,year:latest.publishedYear}:null,
    averagePages:books.length?Math.round(books.reduce((n,b)=>n+b.pages,0)/books.length*100)/100:null,
    genres:[...new Set(books.map(b=>b.genre))].sort(),
    longestBook:longest?{title:longest.title,pages:longest.pages}:null,
    shortestBook:shortest?{title:shortest.title,pages:shortest.pages}:null});
}); }
