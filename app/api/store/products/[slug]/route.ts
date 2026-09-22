import {NextResponse} from 'next/server';import {getStoreProduct} from '@/lib/catalog';
export async function GET(_r:Request,{params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=await getStoreProduct(slug);return p?NextResponse.json({product:p}):NextResponse.json({error:'Introuvable'},{status:404});}
