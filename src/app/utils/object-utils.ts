export class ObjectUtils {
  /**
   * Assign all properties from source to target and remove properties in target that does exist in target but not in source.
   * => allows to assign values, but keep reference
   * @param target - The target object
   * @param source - The source object
   * @param excludedProperties - Array of parameters to exclude / ignore during assign
   */
  public static assignUnion(target: object, source: object, excludedProperties: string[] = []) {
    for (const prop in target) {
      if (excludedProperties.indexOf(prop) > -1) {
        continue;
      }
      target[prop] = source[prop] ?? undefined;
    }
  }
}
