import { addLocationDTO } from '../dtos/shop/addLocationDTO';
import { ShopUpdateDTO } from '../dtos/shop/shopUpdateDTO';
import {
  UpdateLocationDTO,
  updateMainLocation,
} from '../dtos/shop/updateLocationDTO';
import { prisma } from '../libs/prisma';
import { LocationType } from '../types/types';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';

export async function getShopDetail(id: string) {
  const shop = await prisma.shop.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      phone: true,
      description: true,
      slogan: true,
      logo: true,
      balance: true,
      location: true,
      User: {
        select: {
          id: true,
          shop_id: true,
          name: true,
          role: true,
          email: true,
        },
      },
    },
  });

  if (!shop) {
    throw new Error('Shop not found');
  }

  return shop;
}

export async function getAllLocations(id: string) {
  const locations = await prisma.location.findMany({
    where: {
      shop_id: id,
    },
  });

  if (!locations) {
    throw new Error('Locations not found');
  }

  return locations;
}
export async function updateMainLocation(body: updateMainLocation, id: string) {
  let mainLocation: any;
  if (id) {
    await prisma.location.updateMany({
      where: {
        id: {
          not: id,
        },
      },
      data: {
        is_main: false,
      },
    });
    mainLocation = await prisma.location.update({
      where: { id },
      data: {
        is_main: true,
      },
    });
  }
  return mainLocation;
}
export async function updateShop(body: ShopUpdateDTO, id: string) {
  const shop = await prisma.shop.update({
    where: { id },
    data: {
      name: body.name,
      phone: body.phone,
      description: body.description,
      slogan: body.slogan,
      logo: body.logo,
    },
    include: {
      User: true,
      location: true,
      Withdraw: true,
    },
  });

  if (!shop) {
    throw new Error('Shop not found');
  }

  const finalData = {
    id: shop.id,
    name: shop.name ?? '',
    description: shop.description ?? '',
    slogan: shop.slogan ?? '',
    phone: shop.phone ?? '',
    logo: shop.logo ?? '',
    balance: shop.balance,
    User: {
      id: shop.User.id,
      name: shop.User.name,
      email: shop.User.email,
      role: shop.User.role,
      shop_id: shop.User.shop_id,
    },
    location: shop.location,
    Withdraw: shop.Withdraw,
  };

  return finalData;
}

export async function getLocationById(id: string) {
  const locations = await prisma.location.findMany({
    where: {
      shop_id: id,
    },
  });

  if (!locations) {
    throw new Error('Shop not found');
  }

  const locationsFinal: LocationType[] = (locations ?? []).map((loc) => ({
    id: loc.id,
    shop_id: loc.shop_id,
    name: loc.name,
    address: loc.address,
    province: loc.province,
    city: loc.city,
    district: loc.district,
    subdistrict: loc.subdistrict,
    postal_code: loc.postal_code,
    longitude: loc.longitude,
    latitude: loc.latitude,
    is_main: loc.is_main,
  }));

  return locationsFinal;
}

export async function addLocationById(data: addLocationDTO, id: string) {
  try {
    const cariId = await prisma.shop.findUnique({
      where: { id },
    });

    const existingID = await prisma.location.count({
      where: {
        shop_id: id,
      },
    });

    const isMain = existingID === 0;

    const locations = await prisma.location.create({
      data: {
        name: data.name,
        province: data.province,
        city: data.city,
        district: data.district,
        subdistrict: data.subdistrict,
        address: data.address,
        postal_code: data.postal_code,
        longitude: data.longitude,
        latitude: data.latitude,
        is_main: isMain ?? false,
        shop_id: cariId.id,
      },
    });

    if (!locations) {
      throw new Error('Shop not found');
    }

    return locations;
  } catch (error) {
    serviceErrorHandler(error);
  }
}

export async function updateLocationByLocationId(
  data: UpdateLocationDTO,
  id: string,
) {
  const locations = await prisma.location.update({
    where: {
      id: id,
    },
    data: {
      name: data.name,
      address: data.address,
      city: data.city,
      district: data.district,
      province: data.province,
      subdistrict: data.subdistrict,
      postal_code: data.postal_code,
      longitude: data.longitude,
      latitude: data.latitude,
      is_main: data.is_main,
    },
  });

  if (!locations) {
    throw new Error('Shop location not found');
  }

  return locations;
}

export async function deleteLocation(id: string) {
  const locations = await prisma.location.delete({
    where: {
      id,
    },
  });

  if (!locations) {
    throw new Error('Shop location not found');
  }

  return locations;
}
