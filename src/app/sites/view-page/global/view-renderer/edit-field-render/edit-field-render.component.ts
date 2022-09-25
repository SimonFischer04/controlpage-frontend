import {Component, Input, OnInit} from '@angular/core';
import {Field} from '../../../../../types/view/field/field';
import {EditFieldRendererParameter} from '../../../../../types/field-renderer-parameter/edit-field-renderer-parameter';
import {ImageUtilsService} from '../../../../../services/image-utils/image-utils.service';
import {ViewUtilsService} from "../../../../../services/view-utils/view-utils.service";

@Component({
  selector: 'app-edit-field-render',
  templateUrl: './edit-field-render.component.html',
  styleUrls: ['./edit-field-render.component.scss']
})
export class EditFieldRenderComponent implements OnInit {
  @Input() field: Field;
  @Input() params: EditFieldRendererParameter;

  public readonly FIELD_SELECTED_COLOR: string = 'rgb(86, 204, 73, 0.5)';

  constructor(
    private readonly imageUtils: ImageUtilsService,
    public readonly viewUtils: ViewUtilsService
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
