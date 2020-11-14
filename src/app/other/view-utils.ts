export default class ViewUtils {
  static getFieldWidth(fieldCount: number, space: number, totalWidth: number): number {
    return (totalWidth - space) / fieldCount - space;
  }
}
