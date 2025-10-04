import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthedRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const q = String(req.query.q || '').trim();
  const where = q ? { OR: [ { firstName: { contains: q, mode: 'insensitive' } }, { lastName: { contains: q, mode: 'insensitive' } }, { phone: { contains: q } } ] } : {};
  const patients = await prisma.patient.findMany({ where, orderBy: { updatedAt: 'desc' } });
  res.json(patients);
});

router.post('/', requireAuth, async (req: AuthedRequest, res) => {
  const data = req.body;
  const patient = await prisma.patient.create({ data });
  res.json(patient);
});

router.get('/:id', requireAuth, async (req, res) => {
  const p = await prisma.patient.findUnique({ where: { id: String(req.params.id) }, include: { encounters: true, appointments: true } });
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

export default router;
