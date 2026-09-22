import { NextResponse } from 'next/server';
import { getApiStaff } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { roleLabelToCode, roleTemplates, sanitizePermissions } from '@/lib/permissions';
import { writeAudit } from '@/lib/audit';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getApiStaff('staff.manage'); if (!auth.ok) return NextResponse.json({ error: 'Accès refusé.' }, { status: auth.status });
  const { id } = await context.params; const target = await prisma.staffUser.findUnique({ where: { id }, include: { permissions: true } });
  if (!target) return NextResponse.json({ error: 'Employé introuvable.' }, { status: 404 });
  if (target.isOwner) return NextResponse.json({ error: 'Le compte propriétaire ne peut pas être modifié ici.' }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  if (target.id === auth.staff.id && body.status === 'Suspendu') return NextResponse.json({ error: 'Vous ne pouvez pas suspendre votre propre compte.' }, { status: 400 });
  const data: any = {};
  if (body.status === 'Actif' || body.status === 'Suspendu') data.status = body.status === 'Actif' ? 'ACTIVE' : 'SUSPENDED';
  let permissions: string[] | undefined;
  if (body.role) { const roleLabel = String(body.role); data.role = roleLabelToCode[roleLabel] || 'CUSTOM'; permissions = sanitizePermissions(data.role === 'CUSTOM' ? body.permissions : (roleTemplates[roleLabel] || [])); }
  else if (body.permissions) { data.role = 'CUSTOM'; permissions = sanitizePermissions(body.permissions); }
  await prisma.$transaction(async tx => { await tx.staffUser.update({ where: { id }, data }); if (permissions) { await tx.staffPermission.deleteMany({ where: { staffId: id } }); if (permissions.length) await tx.staffPermission.createMany({ data: permissions.map(key => ({ staffId: id, key })) }); } if (data.status === 'SUSPENDED') await tx.staffSession.deleteMany({ where: { staffId: id } }); });
  await writeAudit(auth.staff.id, 'STAFF_UPDATED', 'staff', id, { status: body.status, role: body.role, permissions });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getApiStaff('staff.manage'); if (!auth.ok) return NextResponse.json({ error: 'Accès refusé.' }, { status: auth.status });
  const { id } = await context.params; const target = await prisma.staffUser.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: 'Employé introuvable.' }, { status: 404 });
  if (target.isOwner || target.id === auth.staff.id) return NextResponse.json({ error: 'Ce compte ne peut pas être supprimé.' }, { status: 403 });
  await writeAudit(auth.staff.id, 'STAFF_DELETED', 'staff', id, { name: target.name, email: target.email });
  await prisma.staffUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
