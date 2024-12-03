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
      Product: true,
      User: true,
    },
  });

  if (!shop) {
    throw new Error('Shop not found');
  }

  return shop;
}

export async function updateShop(data: ShopUpdateDTO) {
  const shop = await prisma.shop.update({
    where: { id: data.id },
    data: {
      phone: data.phone,
      description: data.description,
      slogan: data.slogan,
      logo: data.logo,
      User: {
        update: {
          name: data.name,
        },
      },
    },
    include: {
      User: true,
      location: true,
      Product: true,
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
    },
    location: shop.location,
    Product: shop.Product,
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

export async function addLocationById(data: addLocationDTO) {
  const locations = await prisma.location.create({
    data: {
      name: data.name,
      address: data.address,
      city: data.city,
      district: data.district,
      postal_code: data.postal_code,
      longitude: data.longitude,
      latitude: data.latitude,
      shop_id: data.id,
      is_main: data.is_main,
    },
  });

  if (!locations) {
    throw new Error('Shop not found');
  }

  return locations;
}

export async function updateLocationByLocationId(data: UpdateLocationDTO) {
  const locations = await prisma.location.update({
    where: {
      id: data.location_id,
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

export async function deleteLocation(data: {
  id: string;
  location_id: string;
}) {
  const locations = await prisma.location.delete({
    where: {
      id: data.location_id,
    },
  });

  if (!locations) {
    throw new Error('Shop location not found');
  }

  return locations;
}
