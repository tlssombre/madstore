import type {PrismaClient} from '@prisma/client';

type Db = PrismaClient | any;
export const BASE_SHIPPING=5000;
export const STORE_NAME=process.env.STORE_NAME||'MadStore2';
export const STORE_ADDRESS=process.env.STORE_ADDRESS||'Adresse du magasin à configurer';

export function discountAmount(type:string,value:number,base:number){
  if(type==='PERCENT') return Math.min(base,Math.round(base*Math.max(0,value)/100));
  if(type==='FIXED') return Math.min(base,Math.max(0,value));
  return 0;
}
export async function activePromotions(db:Db){
  const now=new Date();
  return db.promotion.findMany({where:{active:true,AND:[{OR:[{startsAt:null},{startsAt:{lte:now}}]},{OR:[{endsAt:null},{endsAt:{gte:now}}]}]}});
}
export async function priceAutomaticPromotions(db:Db,lines:{productId:string;categoryId:string;unitPrice:number;quantity:number}[],shippingBase:number){
  const promos=await activePromotions(db); let productDiscount=0,shipping=shippingBase; const applied:string[]=[]; const orderSubtotal=lines.reduce((sum,l)=>sum+l.unitPrice*l.quantity,0);
  for(const line of lines){const base=line.unitPrice*line.quantity;let best=0,bestName='';for(const p of promos){if(orderSubtotal<p.minSubtotal)continue;const match=p.scope==='ALL'||(p.scope==='CATEGORY'&&p.categoryId===line.categoryId)||(p.scope==='PRODUCT'&&p.productId===line.productId);if(!match)continue;if(p.type==='FREE_SHIPPING'){shipping=0;if(!applied.includes(p.name))applied.push(p.name);continue}const d=discountAmount(p.type,p.value,base);if(d>best){best=d;bestName=p.name}}productDiscount+=best;if(bestName&&!applied.includes(bestName))applied.push(bestName)}
  return {productDiscount,shipping,applied};
}
export async function validatePromoCode(db:Db,raw:string,base:number,shipping:number){
  const code=raw.trim().toUpperCase(); if(!code)return {promo:null,discount:0,shipping}; const now=new Date();
  const promo=await db.promoCode.findUnique({where:{code}}); if(!promo||!promo.active)return {promo:null,discount:0,shipping,error:'Code promo invalide.'};
  if(promo.startsAt&&promo.startsAt>now)return {promo:null,discount:0,shipping,error:'Ce code promo n’est pas encore actif.'};
  if(promo.endsAt&&promo.endsAt<now)return {promo:null,discount:0,shipping,error:'Ce code promo a expiré.'};
  if(promo.usageLimit!==null&&promo.usedCount>=promo.usageLimit)return {promo:null,discount:0,shipping,error:'Ce code promo a atteint sa limite d’utilisation.'};
  if(base<promo.minSubtotal)return {promo:null,discount:0,shipping,error:`Montant minimum requis : ${promo.minSubtotal} F CFA.`};
  if(promo.type==='FREE_SHIPPING')return {promo,discount:0,shipping:0};
  return {promo,discount:discountAmount(promo.type,promo.value,base),shipping};
}
