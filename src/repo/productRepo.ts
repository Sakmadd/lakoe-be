import { CreateProductDTO } from '../dtos/products/createProduct';
import { ProductDetailDTO } from '../dtos/products/productDetailDTO';
import { ProductsDTO } from '../dtos/products/productsDTO';
import { SearchDTO } from '../dtos/products/searchProductDTO';
import { prisma } from '../libs/prisma';
import { ProductType } from '../types/types';

export async function getAllProducts(take: number, skip: number) {
  const products = await prisma.product.findMany({
    include: {
      Images: {
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
    Images: {
      src: product.Images[0].src,
    },
    Shop: {
      name: product.Shop.User.name,
    },
  }));

  return productsFinal;
}

export async function createProduct(data: CreateProductDTO) {
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
      is_active: data.is_active,
      length: data.length,
      width: data.width,
      height: data.height,
      Shop: {
        connectOrCreate: {
          where: { id: data.Shop.id },
          create: {
            id: data.Shop.id,
          },
        },
      },
      Category: {
        connectOrCreate: {
          where: { id: data.Category.id },
          create: {
            id: data.Category.id,
            value: data.Category.value,
            label: data.Category.label,
          },
        },
      },
      Images: {
        create: data.Images.map((image) => ({
          src: image.src,
          alt: image.alt,
        })),
      },
      Variant: {
        create: (data.Variant || []).map((variant) => ({
          name: variant.name,
          is_active: variant.is_active,
          VariantOption: {
            create: (variant.VariantOption || []).map((option) => ({
              name: option.name,
              src: option.src,
              alt: option.alt,
            })),
          },
        })),
      },
      VariantOptionCombination: {
        create: (data.VariantOptionCombination || []).map((combination) => ({
          name: combination.name,
          is_active: combination.is_active,
          price: combination.price,
          weight: combination.weight,
          sku: combination.sku,
          stock: combination.stock,
        })),
      },
    },
    include: {
      Shop: true,
      Category: true,
      Images: true,
      Variant: {
        include: {
          VariantOption: true,
        },
      },
      VariantOptionCombination: true,
    },
  });

  if (!product) {
    throw new Error('Product not created');
  }

  return {
    id: product.id,
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
    Shop: {
      id: product.Shop.id,
      name: data.Shop.name,
    },
    Category: {
      id: product.Category.id,
      label: product.Category.label,
      value: product.Category.value,
    },
    Images: product.Images.map((image) => ({
      id: image.id,
      product_id: product.id,
      src: image.src,
      alt: image.alt,
    })),
    Variant: (product.Variant || []).map((variant) => ({
      id: variant.id,
      name: variant.name,
      is_active: variant.is_active,
      product_id: product.id,
      VariantOption: (variant.VariantOption || []).map((option) => ({
        id: option.id,
        variant_id: variant.id,
        name: option.name,
        src: option.src,
        alt: option.alt,
      })),
    })),
    VariantOptionCombination: (product.VariantOptionCombination || []).map(
      (combination) => ({
        id: combination.id,
        product_id: product.id,
        name: combination.name,
        is_active: combination.is_active,
        price: combination.price,
        weight: combination.weight,
        sku: combination.sku,
        stock: combination.stock,
      }),
    ),
  };
}

export async function getProductsByIds(id: string[]) {
  const products = prisma.product.findMany({
    where: {
      id: {
        in: id,
      },
    },
  });

  return products;
}

export async function deleteProducts(id: string[]) {
  const product = await prisma.product.deleteMany({
    where: {
      id: {
        in: id,
      },
    },
  });

  return product;
}

export async function searchProducts(data: SearchDTO) {
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: data.search,
      },
    },
    include: {
      Images: true,
      Variant: {
        select: {
          VariantOption: true,
        },
      },
      VariantOptionCombination: true,
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
    take: data.take,
    skip: data.skip,
  });

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
    Images: {
      src: product.Images[0].src,
    },
    Shop: {
      name: product.Shop.User.name,
    },
  }));

  return productsFinal;
}

export async function getProductById(
  id: string,
): Promise<ProductDetailDTO | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      Images: true,
      Variant: {
        select: {
          id: true,
          name: true,
          is_active: true,
          product_id: true,
          created_at: true,
          updated_at: true,
          VariantOption: {
            select: {
              id: true,
              name: true,
              variantId: true, // Prisma field; will be renamed below
              src: true,
              alt: true,
            },
          },
        },
      },
      VariantOptionCombination: true,
      Shop: {
        include: {
          User: {
            select: {
              name: true,
            },
          },
        },
      },
      Category: {
        include: {
          Parent: true,
          Children: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  const productFinal: ProductDetailDTO = {
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
    Images: product.Images.map((image) => ({
      id: image.id,
      product_id: product.id,
      src: image.src,
      alt: image.alt,
    })),
    Variant: (product.Variant || []).map((variant) => ({
      id: variant.id,
      name: variant.name,
      is_active: variant.is_active,
      product_id: product.id,
      VariantOption: (variant.VariantOption || []).map((option) => ({
        id: option.id,
        name: option.name,
        variant_id: option.variantId, // Rename to match DTO
        src: option.src,
        alt: option.alt,
      })),
    })),
    VariantOptionCombinations: (product.VariantOptionCombination || []).map(
      (combination) => ({
        id: combination.id,
        name: combination.name,
        is_active: combination.is_active,
        price: combination.price,
        weight: combination.weight,
        sku: combination.sku,
        stock: combination.stock,
        product_id: product.id,
      }),
    ),
    Shop: product.Shop
      ? {
          id: product.Shop.id,
          description: product.Shop.description,
          slogan: product.Shop.slogan,
          logo: product.Shop.logo,
          phone: product.Shop.phone,
          User: product.Shop.User
            ? {
                name: product.Shop.User.name,
              }
            : undefined,
        }
      : undefined,
    Category: product.Category
      ? {
          id: product.Category.id,
          label: product.Category.label,
          value: product.Category.value,
          parent_id: product.Category.parent_id || null,
        }
      : undefined,
  };

  return productFinal;
}
