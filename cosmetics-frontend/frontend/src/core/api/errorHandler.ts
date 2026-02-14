// frontend/src/core/api/errorHandler.ts

export function extractErrorMessage(err: any): string {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.message) return err.message;
  return "Сталася невідома помилка";
}
