import { addLocationDTO } from '../dtos/shop/addLocationDTO';
import { ShopUpdateDTO } from '../dtos/shop/shopUpdateDTO';
import { UpdateLocationDTO } from '../dtos/shop/updateLocationDTO';
import { prisma } from '../libs/prisma';
import { LocationType } from '../types/types';

export async function getShopDetail(id: string) {
  const shop = await prisma.shop.findUnique({
    where: { id },
    select: {
      id: true,
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

export async function updateShop(body: ShopUpdateDTO, id: string) {
  const shop = await prisma.shop.update({
    where: { id },
    data: {
      phone: body.phone,
      description: body.description,
      slogan: body.slogan,
      logo: body.logo,
      User: {
        update: {
          name: body.name,
        },
      },
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

  console.log(
    'Checking is_main output before mapping : ',
    locations.map((loc) => loc.is_main),
  );

  if (!locations) {
    throw new Error('Shop not found');
  }

  const locationsFinal: LocationType[] = (locations ?? []).map((loc) => ({
    id: loc.id,
    shop_id: loc.shop_id,
    name: loc.name,
    address: loc.address,
    city: loc.city,
    district: loc.district,
    postal_code: loc.postal_code,
    longitude: loc.longitude,
    latitude: loc.latitude,
    is_main: loc.is_main,
  }));

  console.log(
    'Checking is_main output after mapping : ',
    locationsFinal.map((loc) => loc.is_main),
  );

  return locationsFinal;
}

export async function addLocationById(data: addLocationDTO, id: string) {
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
      address: data.address,
      city: data.city,
      district: data.district,
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
