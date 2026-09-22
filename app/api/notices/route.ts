import {NextResponse} from 'next/server';import {getPublishedNotices} from '@/lib/notices';
export async function GET(){return NextResponse.json({notices:await getPublishedNotices()});}
