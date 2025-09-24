import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing models
  await prisma.model.deleteMany({});

  // Add sample models
  const models = await Promise.all([
    prisma.model.create({
      data: {
        firstName: 'Sofia',
        lastName: 'Rossi',
        email: 'sofia.rossi@velgance.com',
        igProfileLink: 'https://instagram.com/sofiarossi',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80',
        isActive: true,
      },
    }),
    prisma.model.create({
      data: {
        firstName: 'Marco',
        lastName: 'Bianchi',
        email: 'marco.bianchi@velgance.com',
        igProfileLink: 'https://instagram.com/marcobianchi',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80',
        isActive: true,
      },
    }),
    prisma.model.create({
      data: {
        firstName: 'Giulia',
        lastName: 'Ferrari',
        email: 'giulia.ferrari@velgance.com',
        igProfileLink: 'https://instagram.com/giuliaferrari',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80',
        isActive: true,
      },
    }),
    prisma.model.create({
      data: {
        firstName: 'Alessandro',
        lastName: 'Conti',
        email: 'alessandro.conti@velgance.com',
        igProfileLink: 'https://instagram.com/alessandroconti',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80',
        isActive: true,
      },
    }),
    prisma.model.create({
      data: {
        firstName: 'Chiara',
        lastName: 'Romano',
        email: 'chiara.romano@velgance.com',
        igProfileLink: 'https://instagram.com/chiararomano',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80',
        isActive: true,
      },
    }),
  ]);

  console.log('Created models:', models.length);
  console.log('Sample models added successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
