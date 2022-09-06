import {Component, OnInit} from '@angular/core';
import {UserPreferencesService} from '../../services/user-preferences/user-preferences.service';

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

  public get preferences(): UserPreferencesService {
    return this.preferencesService;
  }
}
