import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import prismaErrorHandler from './prismaError';

export function serviceErrorHandler<T>(
  error: unknown,
): ServiceResponseDTO<T | null> {
  if (error instanceof PrismaClientKnownRequestError) {
    return new ServiceResponseDTO<T>({
      error: true,
      payload: null,
      message: prismaErrorHandler(error),
    });
  } else if (error instanceof PrismaClientValidationError) {
    return new ServiceResponseDTO<T>({
      error: true,
      payload: null,
      message: `Validation error with database query : ${error.message}`,
    });
  } else if (error instanceof PrismaClientInitializationError) {
    return new ServiceResponseDTO<T>({
      error: true,
      payload: null,
      message: 'Database initialization error',
    });
  } else if (error instanceof Error) {
    return new ServiceResponseDTO<T>({
      error: true,
      payload: null,
      message: error.message,
    });
  } else {
    return new ServiceResponseDTO<T>({
      error: true,
      payload: null,
      message: 'Unknown error occurred',
    });
  }
}
