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
    return this.imageUtils.hasBackground(this.field);
  }

  public getBackgroundImage(): string {
    return this.imageUtils.getBackgroundImage(this.field);
  }
}
