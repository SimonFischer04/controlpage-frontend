import {Component, Input, OnInit} from '@angular/core';
import {Field} from '../../../../../types/view/field/field';
import {EditFieldRendererParameter} from '../../../../../types/field-renderer-parameter/edit-field-renderer-parameter';
import {ViewUtilsService} from '../../../../../services/view-utils/view-utils.service';

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
    public readonly viewUtils: ViewUtilsService
  ) {
  }

  ngOnInit(): void {
  }

  public isSelected(): boolean {
    return this.field === this.params.selectedField;
  }
}
