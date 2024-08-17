import globalError from "~/utils/globalError";

export async function asyncWrapper<T>(fn: () => Promise<T>): Promise<{
  data: T | null;
  error: { message: string; statusCode: number } | null;
}> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err) {
    const error = globalError(err as Error);
    return {
      data: null,
      error: { message: error.message, statusCode: error.statusCode },
    };
  }
}
