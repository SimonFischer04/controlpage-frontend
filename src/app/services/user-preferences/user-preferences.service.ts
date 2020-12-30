import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private readonly validFieldStyles: string[] = ['square', 'rectangle'];

  constructor() {
    UserPreferencesService.checkDefaults();
  }

  private static checkDefaults(): void {
    if (!localStorage.getItem('spaceBetween')) {
      localStorage.setItem('spaceBetween', String(10));
    }
    if (!localStorage.getItem('fieldStyle')) {
      localStorage.setItem('fieldStyle', 'square');
    }
  }

  setSpaceBetweenFields(space: number): void {
    localStorage.setItem('spaceBetween', String(space));
  }

  getSpaceBetweenFields(): number {
    return parseInt(localStorage.getItem('spaceBetween'), 10);
  }

  setFieldStyle(style: string): boolean {
    if (!this.validFieldStyles.find(value => value.localeCompare(style) === 0)) {
      return false;
    }
    localStorage.setItem('fieldStyle', style);
  }

  getFieldStyle(): string {
    return localStorage.getItem('fieldStyle');
  }
}
