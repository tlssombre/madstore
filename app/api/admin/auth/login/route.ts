import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { createStaffSession } from '@/lib/auth';
import { writeAudit } from '@/lib/audit';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  if (!email || !password) return NextResponse.json({ error: 'E-mail et mot de passe requis.' }, { status: 400 });
  const staff = await prisma.staffUser.findUnique({ where: { email } });
  if (!staff || !verifyPassword(password, staff.passwordHash)) {
    await writeAudit(staff?.id ?? null, 'AUTH_LOGIN_FAILED', 'auth', staff?.id, { email });
    return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 });
  }
  if (staff.status !== 'ACTIVE') return NextResponse.json({ error: 'Ce compte est suspendu.' }, { status: 403 });
  await prisma.staffSession.deleteMany({ where: { staffId: staff.id, expiresAt: { lt: new Date() } } });
  await createStaffSession(staff.id);
  await prisma.staffUser.update({ where: { id: staff.id }, data: { lastLoginAt: new Date() } });
  await writeAudit(staff.id, 'AUTH_LOGIN', 'auth', staff.id);
  return NextResponse.json({ ok: true, mustChangePassword: staff.mustChangePassword });
}
