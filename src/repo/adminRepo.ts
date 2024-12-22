import { InvoiceDTO } from '../dtos/admin/transactionDTO';
import { UserDTO } from '../dtos/admin/userDTO';
import { prisma } from '../libs/prisma';

export async function getAllBalance() {
  const balance = await prisma.shop.findMany({
    select: {
      balance: true,
    },
  });

  const totalAmount = balance.reduce((sum, shop) => sum + shop.balance, 0);
  return {
    amount: totalAmount,
  };
}

export async function getAllTransaction() {
  const transactions = await prisma.invoices.findMany({
    select: {
      id: true,
      recipient_id: true,
      prices: true,
      service_charge: true,
      invoice_number: true,
      Courier: {
        select: {
          id: true,
          price: true,
          courier_code: true,
        },
      },
      Payment: {
        select: {
          id: true,
          order_id: true,
          type: true,
          url: true,
          bank: true,
          amount: true,
          account_name: true,
          account_number: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      },
      Recipient: {
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          phone: true,
          district: true,
          city: true,
          longitude: true,
          latitude: true,
        },
      },
      OrderHistory: {
        select: {
          id: true,
          status: true,
          timestamp: true,
        },
      },
    },
  });

  const response = transactions.map(
    (inv): InvoiceDTO => ({
      id: inv.id,
      recipientId: inv.recipient_id,
      prices: inv.prices,
      serviceCharge: inv.service_charge,
      invoiceNumber: inv.invoice_number,
      courier: {
        id: inv.Courier.id,
        price: inv.Courier.price,
        courierCode: inv.Courier.courier_code,
      },
      payment: {
        id: inv.Payment.id,
        transaction_id: inv.Payment.order_id,
        type: inv.Payment.type,
        url: inv.Payment.url,
        bank: inv.Payment.bank,
        amount: inv.Payment.amount,
        account_name: inv.Payment.account_name,
        account_number: inv.Payment.account_number,
        status: inv.Payment.status,
        createdAt: inv.Payment.created_at,
        updatedAt: inv.Payment.updated_at,
      },
      recipient: {
        id: inv.Recipient.id,
        name: inv.Recipient.name,
        email: inv.Recipient.email,
        address: inv.Recipient.address,
        phone: inv.Recipient.phone,
        district: inv.Recipient.district,
        city: inv.Recipient.city,
        longitude: inv.Recipient.longitude,
        latitude: inv.Recipient.latitude,
      },
      orderHistory: inv.OrderHistory.map((history) => ({
        id: history.id,
        status: history.status,
        timestamp: history.timestamp,
      })),
    }),
  );

  return response;
}

export async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      Shop: {
        select: {
          id: true,
          balance: true,
          description: true,
          logo: true,
        },
      },
    },
  });

  const response: UserDTO[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    shop: {
      id: user.Shop.id,
      balance: user.Shop.balance,
      description: user.Shop.description,
      logo: user.Shop.logo,
    },
  }));

  return response;
}

export async function getAllCategory() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      label: true,
      value: true,
      parent_id: true,
      Product: {
        select: {
          id: true,
          name: true,
          url_name: true,
          description: true,
          price: true,
          stock: true,
          sku: true,
          Images: {
            select: {
              id: true,
              alt: true,
              src: true,
            },
          },
        },
      },
    },
  });

  const mappedCategories = categories.map((category) => ({
    id: category.id,
    label: category.label,
    value: category.value,
    parentId: category.parent_id || null,
    products:
      category.Product?.map((product) => ({
        id: product.id,
        name: product.name,
        urlName: product.url_name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
        productImages:
          product.Images?.map((image) => ({
            id: image.id,
            alt: image.alt,
            src: image.src,
          })) || [],
      })) || [],
  }));

  return mappedCategories;
}

export async function getAllWithdraw() {
  const withdraw = await prisma.withdraw.findMany({
    select: {
      id: true,
      reference_no: true,
      amount: true,
      status: true,
      notes: true,
      updated_at: true,
      created_at: true,
      BankAccount: {
        select: {
          id: true,
          name: true,
          account: true,
          bank: true,
        },
      },
      Shop: {
        select: {
          id: true,
          balance: true,
          User: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const response = withdraw.map((wd) => ({
    id: wd.id,
    referenceNo: wd.reference_no,
    amount: wd.amount,
    status: wd.status,
    notes: wd.notes,
    updatedAt: wd.updated_at,
    createdAt: wd.created_at,
    bankAccount: {
      id: wd.BankAccount.id,
      name: wd.BankAccount.name,
      account: wd.BankAccount.account,
      bank: wd.BankAccount.bank,
    },
    shop: {
      id: wd.Shop.id,
      balance: wd.Shop.balance,
      userName: wd.Shop.User?.name,
    },
  }));

  return response;
}
