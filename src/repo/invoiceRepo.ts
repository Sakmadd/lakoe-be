import { prisma } from '../libs/prisma';

export async function createInvoice(id: string) {
  const invoice = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id: id,
      },
    });
  });
}
