import {Component} from '@angular/core';
import {UserPreferencesService} from '../../services/user-preferences/user-preferences.service';
import {getEnumKeyNames} from "../../utils/enum-utils";
import {FieldStyle} from "../../types/field-style";

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent  {

  constructor(
    private readonly preferencesService: UserPreferencesService
  ) {
  }

  public get fieldStyles(): string[]{
    return getEnumKeyNames(FieldStyle);
  }

  public get preferences(): UserPreferencesService {
    return this.preferencesService;
  }
}
