import { CreateInvoiceResponseDTO } from '../dtos/invoice/createInvoiceDTO';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import * as invoiceRepo from '../repo/invoiceRepo';

class invoiceService {
  async createInvoice(
    id: string,
  ): Promise<ServiceResponseDTO<CreateInvoiceResponseDTO | null>> {
    try {
      const invoice = await invoiceRepo.createInvoice(id);

      return new ServiceResponseDTO<CreateInvoiceResponseDTO>({
        error: false,
        message: null,
        payload: invoice,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
    }
  }
}

export default new invoiceService();
