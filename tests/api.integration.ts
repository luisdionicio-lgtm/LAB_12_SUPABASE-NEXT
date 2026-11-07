import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://localhost:3000';
const suffix=Date.now();
let authorId='',bookId='';
const results:{test:string;status:number;passed:boolean}[]=[];
async function request(test:string,path:string,method:string,status:number,body?:unknown){
 const res=await fetch(base+path,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:typeof body==='string'?body:JSON.stringify(body)});
 const data=res.status===204?null:await res.json();
 assert.equal(res.status,status,`${test}: ${JSON.stringify(data)}`);
 results.push({test,status:res.status,passed:true});console.log(`✓ ${test} [${res.status}]`);return data;
}
try {
 await request('Conexión PostgreSQL','/api/health','GET',200);
 await request('JSON inválido','/api/authors','POST',400,'{');
 await request('Validación de autor','/api/authors','POST',400,{name:'A'});
 const author=await request('Crear autor','/api/authors','POST',201,{name:`Prueba temporal ${suffix}`,email:`test.${suffix}@example.com`,nationality:'Perú',birthYear:1980,bio:'Registro temporal de integración'}); authorId=author.id;
 await request('Correo duplicado','/api/authors','POST',409,{name:'Duplicado',email:author.email,nationality:'Perú'});
 const authors=await request('Listar autores','/api/authors','GET',200);assert(authors.some((a:{id:string})=>a.id===authorId));
 assert.equal((await request('Autor por ID',`/api/authors/${authorId}`,'GET',200)).email,author.email);
 assert.deepEqual(await request('Autor sin libros',`/api/authors/${authorId}/books`,'GET',200),[]);
 const updated=await request('Actualizar autor parcialmente',`/api/authors/${authorId}`,'PUT',200,{bio:'Biografía actualizada'});assert.equal(updated.name,author.name);assert.equal(updated.bio,'Biografía actualizada');
 await request('Actualización vacía',`/api/authors/${authorId}`,'PUT',400,{});
 await request('Autor inexistente','/api/authors/no-existe','GET',404);
 await request('Libros de autor inexistente','/api/authors/no-existe/books','GET',404);
 const payload={title:`Libro temporal ${suffix}`,description:'Registro de prueba',isbn:`TEST-${suffix}`,publishedYear:2000,genre:'Novela',pages:120,authorId};
 await request('Libro sin autor válido','/api/books','POST',404,{...payload,authorId:'no-existe'});
 await request('Páginas inválidas','/api/books','POST',400,{...payload,pages:-1});
 const book=await request('Crear libro','/api/books','POST',201,payload);bookId=book.id;assert.equal(book.author.id,authorId);
 await request('ISBN duplicado','/api/books','POST',409,payload);
 const books=await request('Listar libros','/api/books','GET',200);assert(books.some((b:{id:string})=>b.id===bookId));
 const filtered=await request('Filtrar género exacto','/api/books?genre=Novela','GET',200);assert(filtered.every((b:{genre:string})=>b.genre==='Novela'));assert(filtered.some((b:{id:string})=>b.id===bookId));
 assert.equal((await request('Libro por ID',`/api/books/${bookId}`,'GET',200)).title,payload.title);
 assert.equal((await request('Libros por autor',`/api/authors/${authorId}/books`,'GET',200))[0].id,bookId);
 assert.equal((await request('Actualizar libro',`/api/books/${bookId}`,'PUT',200,{pages:150})).pages,150);
 await request('Proteger autor con libros',`/api/authors/${authorId}`,'DELETE',409);
 await request('Eliminar libro',`/api/books/${bookId}`,'DELETE',204);bookId='';
 await request('Libro inexistente',`/api/books/${book.id}`,'GET',404);
 await request('Eliminar autor',`/api/authors/${authorId}`,'DELETE',204);authorId='';
 await request('Autor eliminado',`/api/authors/${author.id}`,'GET',404);
 await mkdir('docs',{recursive:true});await writeFile('docs/resultados-integracion.json',JSON.stringify({date:new Date().toISOString(),base,total:results.length,results},null,2));
 console.log(`\n${results.length} pruebas correctas. Registros temporales eliminados.`);
} finally {
 if(bookId)await fetch(`${base}/api/books/${bookId}`,{method:'DELETE'});
 if(authorId)await fetch(`${base}/api/authors/${authorId}`,{method:'DELETE'});
}
