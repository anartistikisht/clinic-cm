import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function audit(userId: string | null, action: string, entity: string, entityId: string, before: any, after: any, ip?: string) {
  await prisma.audit.create({ data: { userId: userId || undefined, action, entity, entityId, before: before ? JSON.stringify(before) : undefined, after: after ? JSON.stringify(after) : undefined, ip } });
}
