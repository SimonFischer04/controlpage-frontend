import {Component, OnInit} from '@angular/core';
import {UserPreferencesService} from '../../services/user-preferences/user-preferences.service';
import {getEnumKeyNames} from "../../utils/enum-utils";
import {FieldStyle} from "../../types/view/field/field-style";

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {

  constructor(
    private readonly preferencesService: UserPreferencesService
  ) {
  }

  ngOnInit(): void {
  }

  public get fieldStyles(): string[]{
    return getEnumKeyNames(FieldStyle);
  }

  public get preferences(): UserPreferencesService {
    return this.preferencesService;
  }
}
