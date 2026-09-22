import { NextResponse } from 'next/server';
import { destroyStaffSession, getCurrentStaff } from '@/lib/auth';
import { writeAudit } from '@/lib/audit';
export async function POST() {
  const staff = await getCurrentStaff();
  if (staff) await writeAudit(staff.id, 'AUTH_LOGOUT', 'auth', staff.id);
  await destroyStaffSession();
  return NextResponse.json({ ok: true });
}
