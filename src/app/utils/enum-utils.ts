export function getEnumKeyNames<T>(enumType: T): string[] {
  return Object.keys(enumType).filter(x => !(parseInt(x, 10) >= 0));
}
