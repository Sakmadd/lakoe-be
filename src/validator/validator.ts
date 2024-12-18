/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ZodObject, ZodType, ZodTypeAny } from 'zod';
import { validationErrorHandler } from '../utils/validationErrorHandler';

export function validator<T>(data: T, schema: ZodType<T, ZodObject<any>>) {
  const { success, error } = schema.safeParse(data);
  if (!success) {
    throw new Error(`Validation Error: ${validationErrorHandler(error)}`);
  }
}
