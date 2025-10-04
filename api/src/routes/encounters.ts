import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthedRequest } from '../middleware/auth.js';
import { audit } from '../utils/audit.js';

const prisma = new PrismaClient();
const router = Router();

router.post('/', requireAuth, async (req: AuthedRequest, res) => {
  const { appointment_id, patient_id, encounter_type, pershkrimi_kontrolles, icd10_code, pagesa_eur } = req.body;
  const patient = await prisma.patient.findUnique({ where: { id: patient_id } });
  if (!patient) return res.status(400).json({ error: 'Invalid patient_id' });
  const data: any = {
    patientId: patient_id, appointmentId: appointment_id || null,
    encounterType: encounter_type || 'KONTROLL', description: pershkrimi_kontrolles || null,
    icd10Code: icd10_code || null, paymentEur: pagesa_eur || null, createdBy: String(req.user?.sub || '')
  };
  const enc = await prisma.encounter.create({ data });
  await audit(req.user?.sub || null, 'CREATE', 'Encounter', enc.id, null, enc, req.ip);
  res.json(enc);
});

router.get('/', requireAuth, async (req, res) => {
  const patientId = String(req.query.patient_id || '');
  const where: any = {};
  if (patientId) where.patientId = patientId;
  const list = await prisma.encounter.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(list);
});

export default router;
