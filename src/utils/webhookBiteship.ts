import { prisma } from '../libs/prisma';
import { OrderStatus } from '@prisma/client';

export async function updateOrderStatus(orderId: string, status: string) {
  if (!orderId || !status) {
    throw new Error('Invalid order ID or status.');
  }

  const findInvoiceID = await prisma.courier.findFirst({
    where: {
      biteship_order_id: orderId,
    },
    select: {
      invoice_id: true,
    },
  });

  if (!findInvoiceID) {
    throw new Error(`Invoice record with order_id "${orderId}" not found.`);
  }

  if (status === 'dropping_off') {
    await prisma.orderHistory.create({
      data: {
        invoice_id: findInvoiceID.invoice_id,
        status: OrderStatus.on_delivery,
      },
    });
  }

  if (status === 'delivered') {
    await prisma.orderHistory.create({
      data: {
        invoice_id: findInvoiceID.invoice_id,
        status: OrderStatus.done,
      },
    });
    const findOrderDetails = await prisma.courier.findFirst({
      where: {
        biteship_order_id: orderId,
      },
      select: {
        order: {
          select: {
            OrderItem: {
              select: {
                product_id: true,
                variant_combination_id: true,
                quantity: true,
                Product: {
                  select: {
                    shop_id: true,
                    price: true,
                    VariantOptionCombination: {
                      select: {
                        id: true,
                        price: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log('Ini order detail', findOrderDetails);

    const orderItem = findOrderDetails?.order?.OrderItem;

    if (!orderItem) {
      throw new Error(`Order details not found for order_id "${orderId}".`);
    }

    const { Product, variant_combination_id, quantity } = orderItem;

    if (!Product?.shop_id) {
      throw new Error('Shop information not found for the product.');
    }

    let price = Product?.price;

    if (
      variant_combination_id &&
      Product?.VariantOptionCombination?.length > 0
    ) {
      const variantCombination = Product.VariantOptionCombination.find(
        (variant) => variant.id === variant_combination_id,
      );
      price = variantCombination?.price || price;
    }

    if (price == null) {
      throw new Error('Price information not found.');
    }

    console.log('Price before : ', price);

    const totalRevenue = price * quantity;

    console.log('Price After : ', totalRevenue);

    await prisma.shop.update({
      where: { id: Product.shop_id },
      data: {
        balance: {
          increment: totalRevenue,
        },
      },
    });
  }

  return status;
}
