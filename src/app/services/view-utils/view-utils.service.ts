import {Injectable} from '@angular/core';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';
import {FullView} from '../../interfaces/full-view';

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

  getDummyView(): FullView {
    return {id: -1, name: '', group: {id: -1, childGroups: [], name: '', parentGroup: null}, fields: []};
  }
}
