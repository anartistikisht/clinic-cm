import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  const password = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@clinic.local' },
    update: {},
    create: { fullName: 'Admin', email: 'admin@clinic.local', role: Role.ADMIN, password }
  });
  console.log('Seeded admin user: admin@clinic.local / admin123');
}
main().finally(() => prisma.$disconnect());
