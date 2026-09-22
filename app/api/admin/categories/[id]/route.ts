import {NextResponse} from 'next/server';
import {getApiStaff} from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import {writeAudit} from '@/lib/audit';

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
  const auth=await getApiStaff('products.update');if(!auth.ok)return NextResponse.json({error:'Accès refusé.'},{status:auth.status});
  const {id}=await params;
  const b=await req.json().catch(()=>({}));
  const data:any={};
  if(typeof b.name==='string'){const name=b.name.trim();if(!name)return NextResponse.json({error:'Nom de catégorie requis.'},{status:400});data.name=name}
  if(typeof b.active==='boolean')data.active=b.active;
  if(Number.isFinite(Number(b.sortOrder)))data.sortOrder=Number(b.sortOrder);
  try{
    const category=await prisma.category.update({where:{id},data,include:{_count:{select:{products:true}}}});
    await writeAudit(auth.staff.id,'CATEGORY_UPDATED','category',id,{name:category.name,active:category.active});
    return NextResponse.json({category:{...category,productCount:category._count.products}});
  }catch(e:any){if(e?.code==='P2002')return NextResponse.json({error:'Une catégorie porte déjà ce nom.'},{status:409});throw e}
}

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
  const auth=await getApiStaff('products.delete');if(!auth.ok)return NextResponse.json({error:'Accès refusé.'},{status:auth.status});
  const {id}=await params;
  const category=await prisma.category.findUnique({where:{id},include:{_count:{select:{products:true}}}});
  if(!category)return NextResponse.json({error:'Catégorie introuvable.'},{status:404});
  if(category._count.products>0)return NextResponse.json({error:`Impossible de supprimer : ${category._count.products} produit(s) utilisent encore cette catégorie.`},{status:409});
  await prisma.category.delete({where:{id}});
  await writeAudit(auth.staff.id,'CATEGORY_DELETED','category',id,{name:category.name});
  return NextResponse.json({ok:true});
}
