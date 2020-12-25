import {Injectable} from '@angular/core';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';

@Injectable({
  providedIn: 'root'
})
export class ViewUtilsService {

  constructor(
    private pref: UserPreferencesService
  ) {
  }

  getFieldWidth(fieldCount: number): number {
    return (window.innerWidth - this.pref.getSpaceBetweenFields()) / fieldCount - this.pref.getSpaceBetweenFields();
  }
}
