import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import apptRoutes from './routes/appointments.js';
import encounterRoutes from './routes/encounters.js';
import reportRoutes from './routes/reports.js';
import auditRoutes from './routes/audit.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/', (_, res) => res.json({ ok: true, name: 'clinic-cms-api' }));

app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);
app.use('/appointments', apptRoutes);
app.use('/encounters', encounterRoutes);
app.use('/reports', reportRoutes);
app.use('/audit', auditRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
