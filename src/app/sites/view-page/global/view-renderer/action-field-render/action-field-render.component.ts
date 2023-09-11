import {Component, Input} from '@angular/core';
import {ActionFieldRendererParameter} from '../../../../../types/field-renderer-parameter/action-field-renderer-parameter';
import {ViewUtilsService} from '../../../../../services/view-utils/view-utils.service';
import {FieldDTO} from "../../../../../../gen";

@Component({
  selector: 'app-action-field-render',
  templateUrl: './action-field-render.component.html',
  styleUrls: ['./action-field-render.component.scss']
})
export class ActionFieldRenderComponent {
  @Input() field: FieldDTO;
  @Input() params: ActionFieldRendererParameter;

  constructor(
    public readonly viewUtils: ViewUtilsService
  ) {
  }
}
