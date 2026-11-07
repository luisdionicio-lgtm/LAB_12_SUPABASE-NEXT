import type {Metadata} from 'next';import {Shell} from '@/components/shell';import './globals.css';
export const metadata:Metadata={title:'Hogwarts · Archivos mágicos',description:'Explora autores y libros en una biblioteca llena de magia.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es"><body><Shell>{children}</Shell></body></html>}
