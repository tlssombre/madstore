import { prisma } from './prisma';
import type { Product } from './data';
import { formatPrice } from './data';

const include = { category:true, brand:true, variants:{where:{active:true},orderBy:{sortOrder:'asc' as const}}, images:{orderBy:{sortOrder:'asc' as const}} };

export function dbProductToCard(p:any):Product{
  const v=p.variants?.[0];
  const available=v?Math.max(0,v.stockOnHand-v.stockReserved):0;
  const promo=!!(v?.compareAtPrice&&v.compareAtPrice>v.price);
  return {
    id:p.id, variantId:v?.id,
    slug:p.slug,name:p.name,shortName:p.shortName,category:p.category?.name||'',brand:p.brand?.name||'',
    price:formatPrice(v?.price||0),priceValue:v?.price||0,oldPrice:v?.compareAtPrice?formatPrice(v.compareAtPrice):undefined,oldPriceValue:v?.compareAtPrice||undefined,
    tag:promo?'PROMO':p.isNew?'NOUVEAU':p.bestseller?'BEST-SELLER':available>0?'EN STOCK':'RUPTURE',tone:p.tone||'light',kind:p.kind||'accessory',
    color:v?.color||'',storage:v?.storage||'—',memory:v?.memory||undefined,sku:v?.sku||'',stock:available,
    description:p.description||'',specs:Array.isArray(p.specs)?p.specs:[],isNew:p.isNew,featured:p.featured,bestseller:p.bestseller,promotion:promo,
    imageUrl:p.images?.[0]?.url||undefined,images:(p.images||[]).map((x:any)=>x.url),status:p.status,
    variants:(p.variants||[]).map((x:any)=>({id:x.id,sku:x.sku,label:x.label,color:x.color||'',storage:x.storage||'',memory:x.memory||'',price:x.price,compareAtPrice:x.compareAtPrice||undefined,stock:Math.max(0,x.stockOnHand-x.stockReserved),stockOnHand:x.stockOnHand,stockReserved:x.stockReserved}))
  } as Product;
}

export async function getStoreProducts(){
  const rows=await prisma.product.findMany({where:{status:'ACTIVE'},include,orderBy:{createdAt:'desc'}});
  return rows.map(dbProductToCard);
}
export async function getStoreProduct(slug:string){
  const row=await prisma.product.findFirst({where:{slug,status:'ACTIVE'},include});
  return row?dbProductToCard(row):null;
}
export async function getAdminProducts(){
  return prisma.product.findMany({include,orderBy:{updatedAt:'desc'}});
}
