const { PrismaClient } = require('@prisma/client');

async function migrateSlug() {
  const prisma = new PrismaClient();

  try {
    console.log('Starting slug migration...');

    // Get all models without slugs
    const models = await prisma.model.findMany({
      where: { slug: null },
      select: { id: true, firstName: true, lastName: true }
    });

    console.log(`Found ${models.length} models to update`);

    // Generate and update slugs
    for (const model of models) {
      const slug = `${model.firstName.toLowerCase()}-${model.lastName.toLowerCase()}`
        .replace(/[^a-z0-9\-]/g, '')
        .replace(/\-+/g, '-')
        .replace(/^\-|\-$/g, '');

      await prisma.model.update({
        where: { id: model.id },
        data: { slug: slug }
      });

      console.log(`Updated ${model.firstName} ${model.lastName} -> ${slug}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateSlug();
