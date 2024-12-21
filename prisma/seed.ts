import { PrismaClient } from '@prisma/client';
import { categories } from './categoriesSeed';

const prisma = new PrismaClient();

async function seedCategories() {
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  for (const category of categories) {
    if (category.parent_id) {
      await prisma.category.update({
        where: { id: category.id },
        data: { Parent: { connect: { id: category.parent_id } } },
      });
    }
  }

  console.log('Categories seeded successfully.');
}

seedCategories()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
