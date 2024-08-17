export function arrayValidator<T>(
  array: T[],
  checkType: (item: T) => boolean,
  options: { allowEmpty?: boolean } = { allowEmpty: false },
): boolean {
  if (!options.allowEmpty && array.length === 0) {
    return false;
  }
  return array.every(checkType);
}

export const isString = <T>(item: T) =>
  typeof item === "string" && item.trim().length > 0;

export const isObject = <T>(obj: T) => typeof obj === "object" && obj !== null;
