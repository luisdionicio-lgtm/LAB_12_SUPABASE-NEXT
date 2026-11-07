import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'http://localhost:3000';
async function get(path:string){const r=await fetch(base+path);const body=await r.json();assert.equal(r.status,200,JSON.stringify(body));return body}
const authors=await get('/api/authors');const a=authors.find((x:{email:string})=>x.email==='jkr@example.com');assert(a);
const all=await get('/api/books/search?limit=3&sortBy=publishedYear&order=asc');assert(all.data.length<=3);assert(all.pagination.total>=8);assert.equal(all.pagination.hasNext,true);assert(all.data.every((x:{publishedYear:number},i:number,arr:{publishedYear:number}[])=>!i||x.publishedYear>=arr[i-1].publishedYear));
const next=await get('/api/books/search?limit=3&page=2&sortBy=publishedYear&order=asc');assert.equal(next.pagination.hasPrev,true);assert(!next.data.some((x:{id:string})=>all.data.some((y:{id:string})=>x.id===y.id)));
const filtered=await get('/api/books/search?search=HARRY&genre=Fantas%C3%ADa&authorName=rowling&limit=50');assert.equal(filtered.pagination.total,7);assert(filtered.data.every((x:{genre:string})=>x.genre==='Fantasía'));
const cap=await get('/api/books/search?limit=999');assert.equal(cap.pagination.limit,50);
const empty=await get('/api/books/search?search=&genre=&authorId=&page=1&limit=6&sortBy=createdAt&order=desc');assert.equal(empty.pagination.limit,6);assert(empty.data.length>0);
const bad=await fetch(base+'/api/books/search?page=0');assert.equal(bad.status,400);
const stats=await get(`/api/authors/${a.id}/stats`);assert.equal(stats.totalBooks,8);assert.equal(stats.firstBook.year,1997);assert.equal(stats.latestBook.year,2007);assert.deepEqual(stats.genres,['Aventura','Fantasía']);assert(stats.longestBook.pages>=stats.shortestBook.pages);assert(stats.averagePages>0);
const none=await fetch(base+'/api/authors/no-existe/stats');assert.equal(none.status,404);
const general=await get('/api/stats');assert(general.totalBooks>=8);assert(general.totalGenres>=2);
console.log('✓ Búsqueda parcial sin distinguir mayúsculas; filtros combinados');console.log('✓ Orden, límite máximo, paginación y validaciones');console.log('✓ Estadísticas de autor y generales; autor inexistente');
