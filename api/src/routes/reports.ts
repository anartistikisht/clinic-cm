import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';
const prisma = new PrismaClient();
const router = Router();

router.get('/finance', requireAuth, async (req, res) => {
  const from = req.query.from ? new Date(String(req.query.from)) : new Date('2000-01-01');
  const to = req.query.to ? new Date(String(req.query.to)) : new Date();
  const enc = await prisma.encounter.findMany({ where: { createdAt: { gte: from, lte: to } } });
  const total = enc.reduce((s, e) => s + (e.paymentEur || 0), 0);
  res.json({ from, to, totalEncounterPaymentsEur: total, count: enc.length });
});

export default router;
