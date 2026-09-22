import { NextResponse } from 'next/server';
import { getApiStaff } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { roleCodeToLabel, roleLabelToCode, roleTemplates, sanitizePermissions } from '@/lib/permissions';
import { writeAudit } from '@/lib/audit';

function serializeStaff(staff: any) {
  return { id: staff.id, name: staff.name, email: staff.email, phone: staff.phone || '', role: roleCodeToLabel[staff.role] || staff.role, roleCode: staff.role, status: staff.status === 'ACTIVE' ? 'Actif' : 'Suspendu', lastSeen: staff.lastLoginAt ? staff.lastLoginAt.toISOString() : null, permissions: staff.isOwner ? [] : staff.permissions.map((p: any) => p.key), owner: staff.isOwner, mustChangePassword: staff.mustChangePassword };
}

export async function GET() {
  const auth = await getApiStaff('staff.view');
  if (!auth.ok) return NextResponse.json({ error: 'Accès refusé.' }, { status: auth.status });
  const staff = await prisma.staffUser.findMany({ include: { permissions: true }, orderBy: [{ isOwner: 'desc' }, { createdAt: 'asc' }] });
  return NextResponse.json({ staff: staff.map(serializeStaff) });
}

export async function POST(request: Request) {
  const auth = await getApiStaff('staff.manage');
  if (!auth.ok) return NextResponse.json({ error: 'Accès refusé.' }, { status: auth.status });
  const body = await request.json().catch(() => ({}));
  const name = String(body.name || '').trim(); const email = String(body.email || '').trim().toLowerCase(); const phone = String(body.phone || '').trim(); const password = String(body.password || '');
  const roleLabel = String(body.role || 'Ventes'); const role = roleLabelToCode[roleLabel] || 'CUSTOM';
  if (!name || !email || password.length < 12) return NextResponse.json({ error: 'Nom, e-mail et mot de passe temporaire de 12 caractères minimum requis.' }, { status: 400 });
  const exists = await prisma.staffUser.findUnique({ where: { email } }); if (exists) return NextResponse.json({ error: 'Cette adresse e-mail est déjà utilisée.' }, { status: 409 });
  const permissions = sanitizePermissions(role === 'CUSTOM' ? body.permissions : (roleTemplates[roleLabel] || []));
  const created = await prisma.staffUser.create({ data: { name, email, phone: phone || null, passwordHash: hashPassword(password), role, status: 'ACTIVE', mustChangePassword: true, permissions: { create: permissions.map(key => ({ key })) } }, include: { permissions: true } });
  await writeAudit(auth.staff.id, 'STAFF_CREATED', 'staff', created.id, { name, email, role: roleLabel, permissions });
  return NextResponse.json({ staff: serializeStaff(created) }, { status: 201 });
}
