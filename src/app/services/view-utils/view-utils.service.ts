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

  // sizing fields so that there is a fixed amount of space between them
  getFieldWidth(fieldCount: number, containerElement: HTMLElement): number {
    return (containerElement.clientWidth - this.pref.getSpaceBetweenFields()) / fieldCount - this.pref.getSpaceBetweenFields();
  }

  /*
    - preference-fieldStyle === 'square': use same height as width => shrink/extend space
    - preference-fieldStyle === 'rectangle': use fixed space => shrink/extend height
   */
  getFieldHeight(fieldCount: number, containerElement: HTMLElement): number {
    switch (this.pref.getFieldStyle()) {
      case 'square': {
        return this.getFieldWidth(fieldCount, containerElement);
      }
      case 'rectangle': {
        // TODO
        return -1;
      }
    }
  }

  getDummyView(): FullView {
    return {id: -1, name: '', group: {id: -1, childGroups: [], name: '', parentGroup: null}, fields: []};
  }
}
