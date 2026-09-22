import { NextResponse } from 'next/server';
import { getCurrentStaff } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';
import { writeAudit } from '@/lib/audit';
export async function POST(request: Request) {
  const staff = await getCurrentStaff();
  if (!staff) return NextResponse.json({ error: 'Session expirée.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const currentPassword = String(body.currentPassword || '');
  const newPassword = String(body.newPassword || '');
  if (newPassword.length < 12) return NextResponse.json({ error: 'Le nouveau mot de passe doit contenir au moins 12 caractères.' }, { status: 400 });
  if (!verifyPassword(currentPassword, staff.passwordHash)) return NextResponse.json({ error: 'Mot de passe actuel incorrect.' }, { status: 400 });
  await prisma.staffUser.update({ where: { id: staff.id }, data: { passwordHash: hashPassword(newPassword), mustChangePassword: false, passwordChangedAt: new Date() } });
  await writeAudit(staff.id, 'PASSWORD_CHANGED', 'staff', staff.id);
  return NextResponse.json({ ok: true });
}
