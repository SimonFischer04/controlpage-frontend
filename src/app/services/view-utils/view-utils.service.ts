import {Injectable} from '@angular/core';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';
import {Size} from '../../types/size';
import {DummyUtils} from '../../utils/dummy-utils';
import {FieldStyle} from '../../types/field-style';
import {ObjectUtils} from "../../utils/object-utils";
import {FieldDTO, FullViewDTO, StyledText} from "../../../gen";

@Injectable({
  providedIn: 'root'
})
export class ViewUtilsService {

  constructor(
    private pref: UserPreferencesService
  ) {
  }

  public getFieldHorizontalAlignmentCss(horizontalAlignment: StyledText.horizontalAlignment): string {
    switch (horizontalAlignment) {
      case StyledText.horizontalAlignment.CENTER: {
        return "center";
      }
      case StyledText.horizontalAlignment.LEFT: {
        return "start";
      }
      case StyledText.horizontalAlignment.RIGHT: {
        return "end";
      }
    }
  }

  public getFieldVerticalAlignmentCss(verticalAlignment: StyledText.verticalAlignment): string {
    switch (verticalAlignment) {
      case StyledText.verticalAlignment.CENTER: {
        return "center";
      }
      case StyledText.verticalAlignment.TOP: {
        return "start";
      }
      case StyledText.verticalAlignment.BOTTOM: {
        return "end";
      }
    }
  }


  public assignField(target: FieldDTO, source: FieldDTO) {
    ObjectUtils.assignUnion(target, source, ["id"]);
  }

  public getFieldWidth(view: FullViewDTO, containerSize: Size): number {
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
  public getFieldHeight(view: FullViewDTO, containerSize: Size): number {
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

  // noinspection JSUnusedGlobalSymbols
  public getDummyView(): FullViewDTO {
    return DummyUtils.getDummyView();
  }

  public getDummyField(): FieldDTO {
    return DummyUtils.getDummyField();
  }

  public addDummyRow(view: FullViewDTO): void {
    const ar: FieldDTO[] = [];
    // add minimum of 1 column => do expected behaviour of going from completely empty("[]") => 1x1 view / 1 field("[[Field1]]")
    for (let i = 0; i < Math.max(1, this.getViewWidthCount(view)); i++) {
      ar.push(this.getDummyField());
    }
    view.fields.push(ar);
  }

  public addDummyColumn(view: FullViewDTO): void {
    // add minimum of 1 row => do expected behaviour of going from completely empty("[]") => 1x1 view / 1 field("[[Field1]]")
    if (view.fields.length === 0) {
      view.fields.push([this.getDummyField()]);
      return;
    }
    view.fields.forEach(row => {
      row.push(this.getDummyField());
    });
  }

  public getFieldById(view: FullViewDTO, fieldId: number): FieldDTO {
    return view.fields.find((fields) => {
      return fields.find((field) => field.id === fieldId);
    }).find((field) => {
      return field.id === fieldId;
    });
  }

  // -------------

  // sizing fields so that there is a fixed amount of space between them
  private getMaxFieldWidth(view: FullViewDTO, containerSize: Size): number {
    // console.log('getMaxFieldWidth: ', view, containerSize);
    return (containerSize.width - this.pref.spaceBetweenFields) / this.getViewWidthCount(view) - this.pref.spaceBetweenFields;
  }

  private getMaxFieldHeight(view: FullViewDTO, containerSize: Size): number {
    // console.log('getMaxFieldHeight: ', view, containerSize);
    return (containerSize.height - this.pref.spaceBetweenFields) / this.getViewHeightCount(view) - this.pref.spaceBetweenFields;
  }

  private getViewWidthCount(view: FullViewDTO): number {
    return view.fields[0]?.reduce((prev, curr) => prev + curr.colspan, 0) || 0;
  }

  private getViewHeightCount(view: FullViewDTO): number {
    return view.fields.reduce((prev, curr) => prev + Math.max(1, curr[0]?.rowspan), 0);
  }

  // noinspection JSUnusedLocalSymbols
  /**
   * Function to get the view size (amount of fields * row/colspan for each) [NOT pixel size!!!]
   * @param view - The view to get the size from
   * @private
   */
  private getViewSize(view: FullViewDTO): Size {
    return {width: this.getViewWidthCount(view), height: this.getViewHeightCount(view)};
  }
}
