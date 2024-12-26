import axios from 'axios';
import { CONFIGS } from '../config/config';

export function generateInvoiceNumber(currentInvoiceCount: number): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}${month}${day}`;
  const sequenceNumber = String(currentInvoiceCount + 1).padStart(6, '0');
  return `INV/${formattedDate}/${sequenceNumber}`;
}

export function formatCityName(input: string) {
  return input.replace(/^(Kabupaten|Kota)\s+/i, '').toLowerCase();
}

export async function shipmentLocation(city: string, postal_code: string) {
  try {
    const token = CONFIGS.BITESHIP_API_KEY;

    const formatInputLocation = formatCityName(city).replace(/ /g, '+');

    const hitLocation = await axios.get(
      `https://api.biteship.com/v1/maps/areas?countries=ID&input=${formatInputLocation}&type=single`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (hitLocation.data?.success && hitLocation.data?.areas?.length > 0) {
      const areas = hitLocation.data.areas;

      const matchingArea = areas.find(
        (area: any) => area.postal_code === postal_code,
      );

      return matchingArea ? matchingArea.id : areas[0].id;
    } else {
      throw new Error('Invalid API response or no areas found');
    }
  } catch (error) {
    throw new Error(
      `Error fetching shipment location: ${error instanceof Error ? error.message : error}`,
    );
  }
}
