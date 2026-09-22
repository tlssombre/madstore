import { createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';
import { allPermissions, PermissionKey } from './permissions';

export const SESSION_COOKIE = 'madstore_admin_session';
const SESSION_HOURS = 8;
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export async function createStaffSession(staffId: string) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  await prisma.staffSession.create({ data: { tokenHash: hashToken(token), staffId, expiresAt } });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', expires: expiresAt });
}

export async function destroyStaffSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await prisma.staffSession.deleteMany({ where: { tokenHash: hashToken(token) } });
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentStaff() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.staffSession.findUnique({ where: { tokenHash: hashToken(token) }, include: { staff: { include: { permissions: true } } } });
  if (!session || session.expiresAt <= new Date() || session.staff.status !== 'ACTIVE') {
    if (session) await prisma.staffSession.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }
  const permissionKeys = session.staff.isOwner ? allPermissions : session.staff.permissions.map(p => p.key as PermissionKey);
  return { ...session.staff, permissionKeys };
}

export async function requireStaff() {
  const staff = await getCurrentStaff();
  if (!staff) redirect('/connexion-admin');
  if (staff.mustChangePassword) redirect('/admin/changer-mot-de-passe');
  return staff;
}

export async function requirePermission(permission: PermissionKey) {
  const staff = await requireStaff();
  if (!staff.isOwner && !staff.permissionKeys.includes(permission)) redirect('/admin?acces=refuse');
  return staff;
}

export async function getApiStaff(permission?: PermissionKey) {
  const staff = await getCurrentStaff();
  if (!staff || staff.mustChangePassword) return { ok: false as const, status: 401, staff: null };
  if (permission && !staff.isOwner && !staff.permissionKeys.includes(permission)) return { ok: false as const, status: 403, staff };
  return { ok: true as const, status: 200, staff };
}
