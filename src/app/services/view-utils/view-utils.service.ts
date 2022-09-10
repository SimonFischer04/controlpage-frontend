import {Injectable} from '@angular/core';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';
import {FullView} from '../../interfaces/full-view';
import {Size} from '../../interfaces/size';
import {Field} from '../../interfaces/field';
import {DummyUtils} from '../../utils/dummy-utils';

@Injectable({
  providedIn: 'root'
})
export class ViewUtilsService {

  constructor(
    private pref: UserPreferencesService
  ) {
  }

  public getFieldWidth(view: FullView, containerSize: Size): number {
    // switch (this.pref.getFieldStyle()) {
    //   case 'square': {
    //     return this.getFieldWidth(view, containerSize);
    //   }
    //   case 'rectangle': {
    //     // TODO
    //     return -1;
    //   }
    // }
    return this.getMaxFieldWidth(view, containerSize);
  }

  /*
    - preference-fieldStyle === 'square': use same height as width => shrink/extend space
    - preference-fieldStyle === 'rectangle': use fixed space => shrink/extend height (dump idea? -> backgroundImage would get stretched?)
   */
  public getFieldHeight(view: FullView, containerSize: Size): number {
    switch (this.pref.getFieldStyle()) {
      case 'square': {
        return this.getMaxFieldHeight(view, containerSize);
      }
      case 'rectangle': {
        // TODO
        return -1;
      }
    }
  }

  /*
    Utils
   */

  public getDummyView(): FullView {
    return DummyUtils.getDummyView();
  }

  public getDummyField(randomTitle = false): Field {
    return DummyUtils.getDummyField(randomTitle);
  }

  public addDummyRow(view: FullView): void {
    const ar: Field[] = [];
    for (let i = 0; i < this.getViewWidthCount(view); i++) {
      ar.push(this.getDummyField(true));
    }
    view.fields.push(ar);
  }

  public addDummyColumn(view: FullView): void {
    view.fields.forEach(row => {
      row.push(this.getDummyField(true));
    });
  }

  // -------------

  // sizing fields so that there is a fixed amount of space between them
  private getMaxFieldWidth(view: FullView, containerSize: Size): number {
    // console.log('getMaxFieldWidth: ', view, containerSize);
    return (containerSize.width - this.pref.getSpaceBetweenFields()) / this.getViewWidthCount(view) - this.pref.getSpaceBetweenFields();
  }

  private getMaxFieldHeight(view: FullView, containerSize: Size): number {
    // console.log('getMaxFieldHeight: ', view, containerSize);
    return (containerSize.height - this.pref.getSpaceBetweenFields()) / this.getViewHeightCount(view) - this.pref.getSpaceBetweenFields();
  }

  private getViewWidthCount(view: FullView): number {
    return view.fields[0]?.reduce((prev, curr) => prev + curr.colspan, 0);
  }

  private getViewHeightCount(view: FullView): number {
    return view.fields.reduce((prev, curr) => prev + Math.max(1, curr[0]?.rowspan), 0);
  }

  private getViewSize(view: FullView): Size {
    return {width: this.getViewWidthCount(view), height: this.getViewHeightCount(view)};
  }
}
