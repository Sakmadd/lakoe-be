import { PostWaResponseDTO } from '../dtos/invoice/postWa';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import * as invoiceRepo from '../repo/invoiceRepo';
import { CreateOrderBiteshipResponseDTO } from '../dtos/invoice/createOrderBiteshipDTO';
import { InvoiceBuyerDTO } from '../dtos/invoice/invoiceBuyerDTO';

class invoiceService {
  async postToWa(
    id: string,
  ): Promise<ServiceResponseDTO<PostWaResponseDTO | null>> {
    try {
      const invoice = await invoiceRepo.postToWa(id);

      return new ServiceResponseDTO<PostWaResponseDTO>({
        error: false,
        message: null,
        payload: invoice,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
    }
  }

  async createOrderBiteship(
    id: string,
  ): Promise<ServiceResponseDTO<CreateOrderBiteshipResponseDTO | null>> {
    try {
      const invoice = await invoiceRepo.createOrderBiteship(id);

      return new ServiceResponseDTO<CreateOrderBiteshipResponseDTO>({
        error: false,
        message: 'Order Created',
        payload: invoice,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
    }
  }

  async getInvoiceDetail(
    id: string,
  ): Promise<ServiceResponseDTO<InvoiceBuyerDTO | null>> {
    try {
      const invoice = await invoiceRepo.getInvoiceDetail(id);

      return new ServiceResponseDTO<InvoiceBuyerDTO>({
        error: false,
        message: null,
        payload: invoice,
      });
    } catch (error) {
      serviceErrorHandler<null>(error);
    }
  }

  async rejectOrder(id: string): Promise<ServiceResponseDTO<string | null>> {
    try {
      const invoice = await invoiceRepo.rejectOrder(id);

      return new ServiceResponseDTO<string>({
        error: false,
        message: 'Canceled',
        payload: invoice,
      });
    } catch (error) {
      serviceErrorHandler<null>(error);
    }
  }
}

export default new invoiceService();
