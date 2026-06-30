import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const password = crypto.createHash('sha256').update('Admin123').digest('hex');

  await prisma.user.upsert({
    where: { username: 'josue.lopez' },
    update: {},
    create: {
      name: 'Josue López Herrera',
      username: 'josue.lopez',
      email: 'josue@sgip.mx',
      password,
      role: 'ADMIN',
    },
  });

  console.log('Seed completado — josue.lopez / Admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

