import {prisma} from './prisma';

export const defaultNotices=[
 {id:'default-1',text:'Garantie 12 mois',active:true,sortOrder:0},
 {id:'default-2',text:'Livraison sur tout Abidjan',active:true,sortOrder:1},
 {id:'default-3',text:'Produits 100 % authentiques',active:true,sortOrder:2},
];

export async function getPublishedNotices(){
 try{
  const rows=await prisma.noticeItem.findMany({where:{active:true},orderBy:[{sortOrder:'asc'},{createdAt:'asc'}]});
  return rows.length?rows:defaultNotices;
 }catch{return defaultNotices}
}
