import {NextResponse} from 'next/server';
import {getApiStaff} from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import {writeAudit} from '@/lib/audit';

const clean=(body:any)=>({
  internalName:String(body.internalName||'').trim(), eyebrow:String(body.eyebrow||'').trim()||null,
  title:String(body.title||'').trim(), subtitle:String(body.subtitle||'').trim()||null,
  ctaLabel:String(body.ctaLabel||'').trim()||null, ctaHref:String(body.ctaHref||'').trim()||null,
  imageUrl:String(body.imageUrl||'').trim()||null, mobileImageUrl:String(body.mobileImageUrl||'').trim()||null,
  background:/^#[0-9a-f]{6}$/i.test(String(body.background||''))?String(body.background):'#f2f3f5',
  textColor:/^#[0-9a-f]{6}$/i.test(String(body.textColor||''))?String(body.textColor):'#0b0d12',
  contentAlign:['CENTER','LEFT'].includes(String(body.contentAlign))?String(body.contentAlign):'CENTER',
  active:body.active!==false, sortOrder:Number.isFinite(Number(body.sortOrder))?Number(body.sortOrder):0,
  autoplayMs:Math.min(15000,Math.max(2800,Number(body.autoplayMs)||5200)),
});
export async function GET(){const auth=await getApiStaff('content.view');if(!auth.ok)return NextResponse.json({error:'Accès refusé.'},{status:auth.status});const slides=await prisma.homeSlide.findMany({orderBy:[{sortOrder:'asc'},{createdAt:'asc'}]});return NextResponse.json({slides});}
export async function POST(request:Request){const auth=await getApiStaff('content.manage');if(!auth.ok)return NextResponse.json({error:'Accès refusé.'},{status:auth.status});const data=clean(await request.json().catch(()=>({})));if(!data.internalName||!data.title)return NextResponse.json({error:'Nom interne et titre requis.'},{status:400});const slide=await prisma.homeSlide.create({data});await writeAudit(auth.staff.id,'HOME_SLIDE_CREATED','home-slide',slide.id,{name:slide.internalName});return NextResponse.json({slide},{status:201});}
