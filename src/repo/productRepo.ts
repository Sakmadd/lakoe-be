import { CreateProductOnlyDTO } from '../dtos/products/CreateProductOnlyDTO';
import { ProductsDTO } from '../dtos/products/productsDTO';
import { prisma } from '../libs/prisma';
import { ProductType } from '../types/types';

export async function getAllProducts(take: number, skip: number) {
  const products = await prisma.product.findMany({
    include: {
      ProductImages: {
        select: {
          src: true,
        },
      },
      Shop: {
        select: {
          User: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    take: take,
    skip: skip,
  });

  if (!products) {
    throw new Error('Products not found');
  }

  const productsFinal: ProductsDTO[] = (products ?? []).map((product) => ({
    id: product.id,
    shop_id: product.shop_id,
    category_id: product.category_id,
    name: product.name,
    sku: product.sku,
    price: product.price,
    url_name: product.url_name,
    description: product.description,
    stock: product.stock,
    weight: product.weight,
    minimum_order: product.minimum_order,
    is_active: product.is_active,
    length: product.length,
    width: product.width,
    height: product.height,
    created_at: product.created_at,
    updated_at: product.updated_at,
    ProductImages: {
      src: product.ProductImages[0].src,
    },
    Shop: {
      name: product.Shop.User.name,
    },
  }));

  return productsFinal;
}

export async function createProductWithoutVariant(data: CreateProductOnlyDTO) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      price: data.price,
      url_name: data.url_name,
      description: data.description,
      stock: data.stock,
      weight: data.weight,
      minimum_order: data.minimum_order,
      length: data.length,
      width: data.width,
      height: data.height,
      is_active: data.is_active,
      Category: {
        connect: {
          id: data.category_id,
        },
      },
      Shop: {
        connect: {
          id: data.shop_id,
        },
      },
      ProductImages: {
        createMany: {
          data: data.ProductImages.map((image) => ({
            src: image.src,
          })),
        },
      },
    },
  });
  return product;
}
