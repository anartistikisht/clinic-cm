import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';
const prisma = new PrismaClient();
const router = Router();
router.get('/', requireAuth, async (_req, res) => {
  const list = await prisma.audit.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  res.json(list);
});
export default router;
