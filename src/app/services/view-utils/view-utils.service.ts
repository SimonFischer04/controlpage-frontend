import {Injectable} from '@angular/core';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';
import {FullView} from '../../types/view/full-view';
import {Size} from '../../types/size';
import {Field} from '../../types/view/field/field';
import {DummyUtils} from '../../utils/dummy-utils';
import {FieldStyle} from '../../types/view/field/field-style';

@Injectable({
  providedIn: 'root'
})
export class ViewUtilsService {

  constructor(
    private pref: UserPreferencesService
  ) {
  }

  public getFieldWidth(view: FullView, containerSize: Size): number {
    switch (this.pref.fieldStyle) {
      case FieldStyle.SQUARE: {
        return Math.min(this.getMaxFieldWidth(view, containerSize), this.getMaxFieldHeight(view, containerSize));
      }
      case FieldStyle.RECTANGLE: {
        return this.getMaxFieldWidth(view, containerSize);
      }
    }
  }

  /*
    - preference-fieldStyle === 'square': use same height as width => shrink/extend space
    - preference-fieldStyle === 'rectangle': use fixed space => shrink/extend height (dump idea? -> backgroundImage would get stretched?)
   */
  public getFieldHeight(view: FullView, containerSize: Size): number {
    switch (this.pref.fieldStyle) {
      case FieldStyle.SQUARE: {
        return Math.min(this.getMaxFieldHeight(view, containerSize), this.getMaxFieldWidth(view, containerSize));
      }
      case FieldStyle.RECTANGLE: {
        return this.getMaxFieldHeight(view, containerSize);
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

  public getFieldById(view: FullView, fieldId: number): Field {
    return view.fields.find((fields) => {
      return fields.find((field) => field.id === fieldId);
    }).find((field) => {
      return field.id === fieldId;
    });
  }

  // -------------

  // sizing fields so that there is a fixed amount of space between them
  private getMaxFieldWidth(view: FullView, containerSize: Size): number {
    // console.log('getMaxFieldWidth: ', view, containerSize);
    return (containerSize.width - this.pref.spaceBetweenFields) / this.getViewWidthCount(view) - this.pref.spaceBetweenFields;
  }

  private getMaxFieldHeight(view: FullView, containerSize: Size): number {
    // console.log('getMaxFieldHeight: ', view, containerSize);
    return (containerSize.height - this.pref.spaceBetweenFields) / this.getViewHeightCount(view) - this.pref.spaceBetweenFields;
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
