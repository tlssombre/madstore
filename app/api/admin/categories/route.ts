import {NextResponse} from 'next/server';
import {getApiStaff} from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import {writeAudit} from '@/lib/audit';

const slugify=(v:string)=>v.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

export async function GET(){
  const auth=await getApiStaff('products.view');if(!auth.ok)return NextResponse.json({error:'Accès refusé.'},{status:auth.status});
  const rows=await prisma.category.findMany({orderBy:[{sortOrder:'asc'},{name:'asc'}],include:{_count:{select:{products:true}}}});
  return NextResponse.json({categories:rows.map(c=>({id:c.id,name:c.name,slug:c.slug,active:c.active,sortOrder:c.sortOrder,productCount:c._count.products}))});
}

export async function POST(req:Request){
  const auth=await getApiStaff('products.create');if(!auth.ok)return NextResponse.json({error:'Accès refusé.'},{status:auth.status});
  const b=await req.json().catch(()=>({}));
  const name=String(b.name||'').trim();
  if(!name)return NextResponse.json({error:'Nom de catégorie requis.'},{status:400});
  const base=slugify(name);let slug=base,n=2;
  while(await prisma.category.findUnique({where:{slug}}))slug=`${base}-${n++}`;
  const count=await prisma.category.count();
  const category=await prisma.category.create({data:{name,slug,active:b.active!==false,sortOrder:Number.isFinite(Number(b.sortOrder))?Number(b.sortOrder):count}});
  await writeAudit(auth.staff.id,'CATEGORY_CREATED','category',category.id,{name});
  return NextResponse.json({category:{...category,productCount:0}},{status:201});
}
