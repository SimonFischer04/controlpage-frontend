import {Component, Input, OnInit} from '@angular/core';
import {Field} from '../../../../../types/view/field/field';
import {ActionFieldRendererParameter} from '../../../../../types/field-renderer-parameter/action-field-renderer-parameter';
import {ViewUtilsService} from '../../../../../services/view-utils/view-utils.service';

@Component({
  selector: 'app-action-field-render',
  templateUrl: './action-field-render.component.html',
  styleUrls: ['./action-field-render.component.scss']
})
export class ActionFieldRenderComponent implements OnInit {
  @Input() field: Field;
  @Input() params: ActionFieldRendererParameter;

  constructor(
    public readonly viewUtils: ViewUtilsService
  ) {
  }

  ngOnInit(): void {
  }
}
