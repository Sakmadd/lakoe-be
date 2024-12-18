import { PrismaClient } from '@prisma/client';
import { categories } from './categoriesSeed';

const prisma = new PrismaClient();

async function main() {

    for (const category of categories) {
        await prisma.category.create({
            data: {
                id: category.id,
                label: category.label,
                value: category.value,
                parent_id: category.parent_id ?? null,
            },
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
