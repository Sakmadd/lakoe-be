import { ZodError } from 'zod';

/**
 * Fungsi untuk menangani error validasi menggunakan Zod dan mengembalikan pesan error dalam format string yang ringkas.
 * @param error - Error yang terjadi saat validasi gagal
 * @returns Pesan error yang dihasilkan
 */
export function validationErrorHandler(error: ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join(', ');
}
