import { Router } from 'express';
import { PrismaClient, Priority, ApptStatus } from '@prisma/client';
import { requireAuth, AuthedRequest } from '../middleware/auth.js';
import { audit } from '../utils/audit.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const date = String(req.query.date || '');
  const where: any = {};
  if (date) {
    const start = new Date(date + 'T00:00:00');
    const end = new Date(date + 'T23:59:59');
    where.scheduledDate = { gte: start, lte: end };
  }
  const list = await prisma.appointment.findMany({ where, include: { patient: true }, orderBy: [{ scheduledDate: 'asc' }, { scheduledTime: 'asc' }] });
  res.json(list);
});

router.post('/', requireAuth, async (req: AuthedRequest, res) => {
  const { date, time, patient, phone, priority, comment, status, externalId, payment } = req.body;
  let p = null;
  if (phone) p = await prisma.patient.findFirst({ where: { phone } });
  if (!p && patient?.firstName && patient?.lastName) {
    p = await prisma.patient.findFirst({ where: { firstName: patient.firstName, lastName: patient.lastName } });
  }
  if (!p) {
    p = await prisma.patient.create({ data: { firstName: patient?.firstName || 'PaEmër', lastName: patient?.lastName || 'PaMbiemër', phone: phone || null } });
    await audit(req.user?.sub || null, 'CREATE', 'Patient', p.id, null, p, req.ip);
  }
  const appt = await prisma.appointment.create({ data: {
    scheduledDate: new Date(date), scheduledTime: time, patientId: p.id,
    externalId: externalId || null, priority: priority as Priority, phone: phone || null,
    comment: comment || null, status: (status as ApptStatus) || 'PLANIFIKUAR',
    paymentStatus: payment?.status || null, paymentAmount: payment?.amount || null,
    paymentCurrency: payment?.currency || 'EUR', paymentMethod: payment?.method || null,
    createdBy: String(req.user?.sub || '')
  }});
  await audit(req.user?.sub || null, 'CREATE', 'Appointment', appt.id, null, appt, req.ip);
  res.json(appt);
});

router.patch('/:id', requireAuth, async (req: AuthedRequest, res) => {
  const id = String(req.params.id);
  const before = await prisma.appointment.findUnique({ where: { id } });
  if (!before) return res.status(404).json({ error: 'Not found' });
  const appt = await prisma.appointment.update({ where: { id }, data: req.body });
  await audit(req.user?.sub || null, 'UPDATE', 'Appointment', id, before, appt, req.ip);
  res.json(appt);
});

export default router;
