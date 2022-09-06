import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private readonly DESKTOP_AUTOMATION_HOST_KEY = 'DESKTOP_AUTOMATION_HOST';
  private readonly validFieldStyles: string[] = ['square', 'rectangle'];

  constructor() {
    this.checkDefaults();
  }

  private checkDefaults(): void {
    if (!localStorage.getItem('spaceBetween')) {
      localStorage.setItem('spaceBetween', String(10));
    }
    if (!localStorage.getItem('fieldStyle')) {
      localStorage.setItem('fieldStyle', 'square');
    }
    if (!this.desktopAutomationHost) {
      this.desktopAutomationHost = 'localhost';
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

  public get desktopAutomationHost(): string {
    return localStorage.getItem(this.DESKTOP_AUTOMATION_HOST_KEY);
  }

  public set desktopAutomationHost(value: string) {
    localStorage.setItem(this.DESKTOP_AUTOMATION_HOST_KEY, value);
  }

  public get desktopAutomationPrefix(): string {
    // noinspection HttpUrlsUsage
    return `http://${this.desktopAutomationHost}:42069/api/controlPageInterface/`;
  }
}
