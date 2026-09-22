import { PrismaClient, Priority, TaskStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@flowpilot.dev' },
    update: {
      name: 'Demo User',
      password,
    },
    create: {
      name: 'Demo User',
      email: 'demo@flowpilot.dev',
      password,
    },
  });

  const existing = await prisma.project.findFirst({
    where: {
      ownerId: user.id,
      name: 'Launch Website',
    },
  });

  if (!existing) {
    await prisma.project.create({
      data: {
        ownerId: user.id,
        name: 'Launch Website',
        description: 'Ship the new marketing website and analytics.',
        tasks: {
          create: [
            {
              title: 'Finalize landing page',
              priority: Priority.HIGH,
              status: TaskStatus.IN_PROGRESS,
            },
            {
              title: 'Connect analytics',
              priority: Priority.MEDIUM,
              status: TaskStatus.TODO,
            },
            {
              title: 'Production QA',
              priority: Priority.URGENT,
              status: TaskStatus.TODO,
            },
          ],
        },
      },
    });
  }

  console.log('Demo account ready: demo@flowpilot.dev / password123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
