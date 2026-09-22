import { NextResponse } from 'next/server';
import { getApiStaff } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET(request: Request) {
  const auth = await getApiStaff('settings.view'); if (!auth.ok) return NextResponse.json({ error: 'Accès refusé.' }, { status: auth.status });
  const { searchParams } = new URL(request.url); const take = Math.min(Number(searchParams.get('limit') || 100), 200);
  const logs = await prisma.auditLog.findMany({ take, orderBy: { createdAt: 'desc' }, include: { actor: { select: { name: true, email: true } } } });
  return NextResponse.json({ logs });
}
