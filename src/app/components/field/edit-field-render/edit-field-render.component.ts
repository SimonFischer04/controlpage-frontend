import {Component, Input, OnInit} from '@angular/core';
import {Field} from '../../../interfaces/field';
import {EditFieldRendererParameter} from '../../../interfaces/field-renderer-parameter/edit-field-renderer-parameter';
import {Image} from '../../../interfaces/image';
import {ImageUtilsService} from '../../../services/image-utils/image-utils.service';
import {filter} from 'rxjs';
import {findElementsWithAttribute} from '@angular/cdk/schematics';

@Component({
  selector: 'app-edit-field-render',
  templateUrl: './edit-field-render.component.html',
  styleUrls: ['./edit-field-render.component.scss']
})
export class EditFieldRenderComponent implements OnInit {
  @Input() field: Field;
  @Input() params: EditFieldRendererParameter;

  public readonly SELECTED_COLOR: string = 'rgb(86, 204, 73, 0.5)';

  constructor(
    private imageUtils: ImageUtilsService
  ) {
  }

  ngOnInit(): void {
  }

  public isSelected(): boolean {
    return this.field === this.params.selectedField;
  }

  public hasBackground(): boolean {
    return !!this.field.background || this.field.backgroundId > 0;
  }

  public getBackgroundImage(): string {
    // "backgroundImage" is only set in "unsaved-state", server will only respond with "backgroundId"
    if (this.field.background) {
      return this.imageUtils.getBackgroundImgString(this.field);
    }
    if (this.field.backgroundId > 0) {
      return this.imageUtils.getRemoteImageSrc(this.field);
    }
    return '';
  }
}
