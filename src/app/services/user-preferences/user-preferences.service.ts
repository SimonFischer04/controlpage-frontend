import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {

  constructor() {
    UserPreferencesService.checkDefaults();
  }

  private static checkDefaults(): void {
    if (!localStorage.getItem('spaceBetween')) {
      localStorage.setItem('spaceBetween', String(10));
    }
  }

  setSpaceBetweenFields(space: number): void {
    localStorage.setItem('spaceBetween', String(space));
  }

  getSpaceBetweenFields(): number {
    return parseInt(localStorage.getItem('spaceBetween'), 10);
  }
}
