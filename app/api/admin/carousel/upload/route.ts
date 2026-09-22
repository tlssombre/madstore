import {NextResponse} from 'next/server';
import {getApiStaff} from '@/lib/auth';
import {mkdir,writeFile} from 'fs/promises';
import path from 'path';
import {randomBytes} from 'crypto';
export const runtime='nodejs';
const allowed=new Map([['image/jpeg','jpg'],['image/png','png'],['image/webp','webp']]);
export async function POST(request:Request){const auth=await getApiStaff('content.manage');if(!auth.ok)return NextResponse.json({error:'Accès refusé.'},{status:auth.status});const form=await request.formData();const file=form.get('file');if(!(file instanceof File))return NextResponse.json({error:'Image requise.'},{status:400});const ext=allowed.get(file.type);if(!ext)return NextResponse.json({error:'Format accepté : JPG, PNG ou WebP.'},{status:400});if(file.size>8*1024*1024)return NextResponse.json({error:'Image limitée à 8 Mo.'},{status:400});const dir=path.join(process.cwd(),'public','uploads','carousel');await mkdir(dir,{recursive:true});const name=`${Date.now()}-${randomBytes(5).toString('hex')}.${ext}`;await writeFile(path.join(dir,name),Buffer.from(await file.arrayBuffer()));return NextResponse.json({url:`/uploads/carousel/${name}`});}
