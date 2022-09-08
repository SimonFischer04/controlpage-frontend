import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private readonly DESKTOP_AUTOMATION_HOST_KEY = 'DESKTOP_AUTOMATION_HOST';
  private readonly ERROR_ALERT_KEY = 'ERROR_ALERT';
  private readonly BACKEND_HOST_KEY = 'BACKEND_HOST';

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
    if (!localStorage.getItem(this.DESKTOP_AUTOMATION_HOST_KEY)) {
      this.desktopAutomationHost = 'localhost';
    }
    if (!(localStorage.getItem(this.ERROR_ALERT_KEY) ?? false)) {
      this.shouldDisplayErrorAlert = true;
    }
    if (!localStorage.getItem(this.BACKEND_HOST_KEY)) {
      this.backendHost = `${window.location.protocol}//${window.location.host.split(':')[0]}:42000`;
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
    this.checkDefaults();
    return localStorage.getItem(this.DESKTOP_AUTOMATION_HOST_KEY);
  }

  public set desktopAutomationHost(value: string) {
    localStorage.setItem(this.DESKTOP_AUTOMATION_HOST_KEY, value);
  }

  public get desktopAutomationPrefix(): string {
    // noinspection HttpUrlsUsage
    return `http://${this.desktopAutomationHost}:42069/api/controlPageInterface/`;
  }

  public get shouldDisplayErrorAlert(): boolean {
    this.checkDefaults();
    return localStorage.getItem(this.ERROR_ALERT_KEY) === 'true';
  }

  public set shouldDisplayErrorAlert(value: boolean) {
    localStorage.setItem(this.ERROR_ALERT_KEY, value ? 'true' : 'false');
  }

  public get backendHost(): string {
    this.checkDefaults();
    return localStorage.getItem(this.BACKEND_HOST_KEY);
  }

  public set backendHost(value: string) {
    localStorage.setItem(this.BACKEND_HOST_KEY, value);
  }
}
