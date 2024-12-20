import { CreateProductDTO } from '../dtos/products/createProduct';
import { ProductDetailDTO } from '../dtos/products/productDetailDTO';
import { ProductsDTO } from '../dtos/products/productsDTO';
import { SearchDTO } from '../dtos/products/searchProductDTO';
import { prisma } from '../libs/prisma';
import { CategoriesDTO } from '../dtos/products/categoriesDTO';
import { ProductByShopDTO } from '../dtos/products/ProductByShopDTO';
import { UpdateStockDTO } from '../dtos/products/updateProductStockDTO';
import { UpdatePriceDTO } from '../dtos/products/UpdateProductPriceDTO';
import { BatchDeleteDTO } from '../dtos/products/batchDeleteDTO';

export async function getAllProducts(take: number, skip: number) {
  const products = await prisma.product.findMany({
    include: {
      Images: {
        select: {
          src: true,
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
    name: product.name,
    price: product.price,
    url_name: product.url_name,
    description: product.description,
    created_at: product.created_at,
    updated_at: product.updated_at,
    Images: {
      src: product.Images[0].src,
    },
  }));

  return productsFinal;
}

export async function getProductsByShopId(id: string) {
  const products = await prisma.product.findMany({
    where: {
      shop_id: id,
    },
    select: {
      id: true,
      name: true,
      is_active: true,
      price: true,
      stock: true,
      sku: true,
      url_name: true,
      created_at: true,
      updated_at: true,
      Images: {
        select: {
          id: true,
          src: true,
          alt: true,
        },
      },
      Category: {
        select: {
          id: true,
          parent_id: true,
          label: true,
          value: true,
        },
      },
    },
  });

  if (!products) {
    throw new Error('Products not found');
  }

  const productsFinal: ProductByShopDTO[] = (products ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    is_active: product.is_active,
    price: product.price,
    stock: product.stock,
    sku: product.sku,
    url_name: product.url_name,
    created_at: product.created_at,
    updated_at: product.updated_at,
    Images: product.Images.map((image) => ({
      id: image.id,
      src: image.src,
      alt: image.alt,
    })),
    Category: {
      id: product.Category.id,
      parent_id: product.Category.parent_id ? product.Category.parent_id : null,
      label: product.Category.label,
      value: product.Category.value,
    },
  }));

  return productsFinal;
}

export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      parent_id: true,
      label: true,
      value: true,
      Children: true,
    },
  });

  const finalCategories: CategoriesDTO[] = (categories ?? []).map(
    (category) => ({
      id: category.id,
      label: category.label,
      value: category.value,
      children: category.Children.map((child) => ({
        id: child.id,
        parent_id: child.parent_id,
        label: child.label,
        value: child.value,
      })),
    }),
  );

  return finalCategories;
}

export async function createProduct(data: CreateProductDTO, user_id: string) {
  try {
    const shopId = await prisma.user.findUnique({
      where: { id: user_id },
      select: {
        Shop: {
          select: {
            id: true,
            User: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!data.category_id) {
      throw new Error('Category ID is required');
    }

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
        Shop: { connect: { id: shopId?.Shop.id } },
        Category: {
          connect: {
            id: data.category_id,
          },
        },
        Images: {
          create: data.Images.map((image, index) => ({
            src: image.src,
            alt: `${data.name} - ${index + 1}`,
          })),
        },
        Variant: data.Variant
          ? {
              create: data.Variant.map((variant) => ({
                name: variant.name,
                is_active: true,
                VariantOption: variant.VariantOption
                  ? {
                      create: variant.VariantOption.map((option) => ({
                        name: option.name,
                        src: option.src || '',
                        alt: option.alt || '',
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
        VariantOptionCombination: data.VariantOptionCombination
          ? {
              create: data.VariantOptionCombination.map((combination) => ({
                name: combination.name,
                price: combination.price,
                sku: combination.sku,
                stock: combination.stock,
                weight: combination.weight,
                is_active: combination.is_active,
              })),
            }
          : undefined,
      },
      include: {
        Shop: true,
        Category: true,
        Images: true,
        Variant: {
          include: { VariantOption: true },
        },
        VariantOptionCombination: true,
      },
    });

    return {
      id: product.id,
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
      Shop: { id: product.Shop.id, name: shopId.Shop.User.name },
      Category: {
        id: product.category_id,
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
  } catch (error) {
    throw error;
  }
}

export async function getProductsByIds(id: string[]) {
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: id,
      },
    },
    include: {
      Images: true,
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

export async function batchDelete(ids: string[]): Promise<BatchDeleteDTO> {
  try {
    const existingProducts = await prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: { id: true },
    });

    const existingIds = existingProducts.map((product) => product.id);

    const missingIds = ids.filter((id) => !existingIds.includes(id));
    if (missingIds.length > 0) {
      throw new Error(
        `The following product IDs do not exist: ${missingIds.join(', ')}`,
      );
    }

    await prisma.image.deleteMany({
      where: { product_id: { in: ids } },
    });

    await prisma.variant.deleteMany({
      where: { product_id: { in: ids } },
    });

    await prisma.variantOptionCombination.deleteMany({
      where: { product_id: { in: ids } },
    });

    const deleteResult = await prisma.product.deleteMany({
      where: { id: { in: ids } },
    });

    return {
      success: true,
      deletedIds: ids,
    };
  } catch (error) {
    throw error;
  }
}

export async function updateProductStock(data: UpdateStockDTO) {
  data.stock = +data.stock;

  const product = await prisma.product.update({
    where: {
      id: data.id,
    },
    data: {
      stock: data.stock,
    },
  });

  const productFinal = {
    id: product.id,
    stock: product.stock,
  };

  return productFinal;
}

export async function updateProductPrice(data: UpdatePriceDTO) {
  data.price = +data.price;

  const product = await prisma.product.update({
    where: {
      id: data.id,
    },
    data: {
      price: data.price,
    },
  });

  const productFinal = {
    id: product.id,
    price: product.price,
  };

  return productFinal;
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

export async function getProductByUrl(
  url: string,
): Promise<ProductDetailDTO | null> {
  const product = await prisma.product.findUnique({
    where: { url_name: url },
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
              variantId: true,
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
        variant_id: option.variantId,
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
              variantId: true,
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
        variant_id: option.variantId,
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

export async function updateProductById(id: string, data: CreateProductDTO) {
  const product = await prisma.product.update({
    where: {
      id: id,
    },
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
      Category: {
        connect: {
          id: data.category_id,
        },
      },
      Images: {
        create: data.Images.map((image, index) => ({
          src: image.src,
          alt: `${data.name} - ${index + 1}`,
        })),
      },
      Variant: data.Variant
        ? {
            create: data.Variant.map((variant) => ({
              name: variant.name,
              is_active: true,
              VariantOption: variant.VariantOption
                ? {
                    create: variant.VariantOption.map((option) => ({
                      name: option.name,
                      src: option.src || '',
                      alt: option.alt || '',
                    })),
                  }
                : undefined,
            })),
          }
        : undefined,
      VariantOptionCombination: data.VariantOptionCombination
        ? {
            create: data.VariantOptionCombination.map((combination) => ({
              name: combination.name,
              price: combination.price,
              sku: combination.sku,
              stock: combination.stock,
              weight: combination.weight,
              is_active: combination.is_active,
            })),
          }
        : undefined,
    },
    include: {
      Shop: true,
      Category: true,
      Images: true,
      Variant: {
        include: { VariantOption: true },
      },
      VariantOptionCombination: true,
    },
  });

  if (!product) {
    throw new Error(`Product with id ${id} not found`);
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
    category_id: product.category_id,
    shop_id: product.shop_id,
    Shop: product.Shop
      ? {
          id: product.Shop.id,
          name: product.Shop.name,
        }
      : undefined,
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
        variant_id: option.variantId,
        src: option.src,
        alt: option.alt,
      })),
    })),
    VariantOptionCombination: (product.VariantOptionCombination || []).map(
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
  };
}

export async function toggleProductActive(id: string) {
  const currentProduct = await prisma.product.findUnique({
    where: { id },
    select: { is_active: true },
  });

  if (!currentProduct) {
    throw new Error(`Product with id ${id} not found`);
  }

  const newIsActive = !currentProduct.is_active;

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      is_active: newIsActive,
    },
  });

  return {
    id: updatedProduct.id,
    isActive: updatedProduct.is_active,
  };
}

export async function toggleProductsActive(ids: string[]) {
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, is_active: true },
  });

  if (products.length !== ids.length) {
    throw new Error('Some products were not found');
  }

  const updatePromises = products.map((product) =>
    prisma.product.update({
      where: { id: product.id },
      data: { is_active: !product.is_active },
    }),
  );

  const updatedProducts = await Promise.all(updatePromises);

  const finalProducts = updatedProducts.map((product) => ({
    id: product.id,
    isActive: product.is_active,
  }));

  return finalProducts;
}
