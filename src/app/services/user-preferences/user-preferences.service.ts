import {Injectable} from '@angular/core';
import {FieldStyle} from '../../types/view/field/field-style';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private readonly SPACE_BETWEEN_FIELDS_KEY = 'SPACE_BETWEEN_FIELDS';
  private readonly FIELD_STYLE_KEY = 'FIELD_STYLE';
  private readonly DESKTOP_AUTOMATION_HOST_KEY = 'DESKTOP_AUTOMATION_HOST';
  private readonly ERROR_ALERT_KEY = 'ERROR_ALERT';
  private readonly BACKEND_HOST_KEY = 'BACKEND_HOST';
  private readonly FIELD_KEYBINDINGS_ENABLED_KEY = "FIELD_KEYBINDINGS_ENABLED";

  constructor() {
    this.checkDefaults();
  }

  private checkDefaults(): void {
    if (!(localStorage.getItem(this.SPACE_BETWEEN_FIELDS_KEY) ?? false)) {
      localStorage.setItem(this.SPACE_BETWEEN_FIELDS_KEY, String(10));
    }
    if (!localStorage.getItem(this.FIELD_STYLE_KEY)) {
      this.fieldStyle = FieldStyle.SQUARE;
    }
    if (!localStorage.getItem(this.DESKTOP_AUTOMATION_HOST_KEY)) {
      this.desktopAutomationHost = 'localhost';
    }
    if (!(localStorage.getItem(this.ERROR_ALERT_KEY) ?? false)) {
      this.shouldDisplayErrorAlert = true;
    }
    if (!localStorage.getItem(this.BACKEND_HOST_KEY)) {
      this.backendHost = `${window.location.protocol}//${window.location.host}`;
    }
    if (!(localStorage.getItem(this.FIELD_KEYBINDINGS_ENABLED_KEY) ?? false)) {
      this.fieldKeybindingEnabled = true;
    }
  }

  // ---


  get spaceBetweenFields(): number {
    this.checkDefaults();
    return parseInt(localStorage.getItem(this.SPACE_BETWEEN_FIELDS_KEY), 10);
  }

  set spaceBetweenFields(space: number) {
    localStorage.setItem(this.SPACE_BETWEEN_FIELDS_KEY, String(space));
  }

  // ---

  get fieldStyle(): FieldStyle {
    this.checkDefaults();
    return FieldStyle[localStorage.getItem(this.FIELD_STYLE_KEY)];
  }


  set fieldStyle(style: FieldStyle) {
    localStorage.setItem(this.FIELD_STYLE_KEY, style);
  }

  // ---

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

  // ---

  public get shouldDisplayErrorAlert(): boolean {
    this.checkDefaults();
    return localStorage.getItem(this.ERROR_ALERT_KEY) === 'TRUE';
  }

  public set shouldDisplayErrorAlert(value: boolean) {
    localStorage.setItem(this.ERROR_ALERT_KEY, value ? 'TRUE' : 'FALSE');
  }

  // ---

  public get backendHost(): string {
    this.checkDefaults();
    return localStorage.getItem(this.BACKEND_HOST_KEY);
  }

  public set backendHost(value: string) {
    localStorage.setItem(this.BACKEND_HOST_KEY, value);
  }

  //

  public get fieldKeybindingEnabled(): boolean {
    this.checkDefaults();
    return localStorage.getItem(this.FIELD_KEYBINDINGS_ENABLED_KEY) === 'TRUE';
  }

  public set fieldKeybindingEnabled(value: boolean) {
    localStorage.setItem(this.FIELD_KEYBINDINGS_ENABLED_KEY, this.FIELD_KEYBINDINGS_ENABLED_KEY ? 'TRUE' : 'FALSE');
  }
}
