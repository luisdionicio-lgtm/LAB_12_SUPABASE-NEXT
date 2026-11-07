import { z } from "zod";

const year = z.number().int().min(1).max(2100);
export const authorSchema = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.email().trim().toLowerCase().max(254),
  nationality: z.string().trim().min(2).max(100),
  birthYear: year.nullable().optional(),
  bio: z.string().trim().max(5000).nullable().optional(),
}).strict();
export const bookSchema = z.object({
  title: z.string().trim().min(1).max(250),
  description: z.string().trim().max(5000).nullable().optional(),
  isbn: z.string().trim().min(3).max(40),
  publishedYear: year,
  genre: z.string().trim().min(1).max(80),
  pages: z.number().int().min(1).max(100000),
  authorId: z.string().trim().min(1).max(100),
}).strict();
export const authorUpdateSchema = authorSchema.partial().refine(v => Object.keys(v).length > 0, "Envía al menos un campo");
export const bookUpdateSchema = bookSchema.partial().refine(v => Object.keys(v).length > 0, "Envía al menos un campo");
const positive = z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().safe().min(1));
export const searchSchema = z.object({
  search:z.string().trim().max(250).default(''), genre:z.string().trim().max(80).default(''),
  authorName:z.string().trim().max(150).default(''), authorId:z.string().trim().max(100).default(''),
  page:positive.default(1), limit:positive.transform(v=>Math.min(v,50)).default(10),
  sortBy:z.enum(['title','publishedYear','createdAt']).default('createdAt'), order:z.enum(['asc','desc']).default('desc'),
}).refine(v=>Number.isSafeInteger((v.page-1)*v.limit)&&(v.page-1)*v.limit<=2147483647,{message:'Página demasiado alta',path:['page']});
export function pagination(page:number,limit:number,total:number){const totalPages=Math.ceil(total/limit);return {page,limit,total,totalPages,hasNext:page<totalPages,hasPrev:page>1};}
