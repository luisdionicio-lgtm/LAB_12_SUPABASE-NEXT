export type Author={id:string;name:string;email:string;nationality:string;birthYear:number|null;bio:string|null;_count?:{books:number}};
export type Book={id:string;title:string;description:string|null;isbn:string;publishedYear:number;genre:string;pages:number;authorId:string;author:Author};
export type Stats={authorId:string;authorName:string;totalBooks:number;firstBook:{title:string;year:number}|null;latestBook:{title:string;year:number}|null;averagePages:number|null;genres:string[];longestBook:{title:string;pages:number}|null;shortestBook:{title:string;pages:number}|null};
export type General={totalAuthors:number;totalBooks:number;totalGenres:number;totalPages:number;genres:{name:string;count:number}[];recentBooks:Book[]};
export type Result={data:Book[];pagination:{page:number;limit:number;total:number;totalPages:number;hasNext:boolean;hasPrev:boolean}};
