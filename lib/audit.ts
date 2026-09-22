import { Prisma } from '@prisma/client';
import { prisma } from './prisma';
export async function writeAudit(actorId: string | null, action: string, resource: string, resourceId?: string | null, metadata?: Record<string, unknown>) {
  await prisma.auditLog.create({ data: { actorId, action, resource, resourceId: resourceId ?? null, metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined } });
}
