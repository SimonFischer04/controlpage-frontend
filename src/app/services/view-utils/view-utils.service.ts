import {Injectable} from '@angular/core';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';
import {FullView} from '../../interfaces/full-view';
import {Size} from '../../interfaces/size';
import {Field} from '../../interfaces/field';

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

  getDummyField(): Field {
    return {id: -1, colspan: 1, rowspan: 1};
  }

  getViewWidth(view: FullView): number {
    if (view.fields.length === 0) {
      return 0;
    }
    let width = 0;
    view.fields[0].forEach(field => {
        width += field.colspan;
      }
    );
    return width;
  }

  getViewHeight(view: FullView): number {
    let height = 0;
    view.fields.forEach(row => {
      height += (row.length > 1 ? row[0].rowspan : 1);
    });
    return height;
  }

  getViewSize(view: FullView): Size {
    return {width: this.getViewWidth(view), height: this.getViewHeight(view)};
  }
}
