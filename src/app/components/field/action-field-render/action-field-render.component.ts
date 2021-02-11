import {Component, Input, OnInit} from '@angular/core';
import {Field} from '../../../interfaces/field';
import {ActionFieldRendererParameter} from '../../../interfaces/field-renderer-parameter/action-field-renderer-parameter';

@Component({
  selector: 'app-action-field-render',
  templateUrl: './action-field-render.component.html',
  styleUrls: ['./action-field-render.component.scss']
})
export class ActionFieldRenderComponent implements OnInit {
  @Input() field: Field;
  @Input() params: ActionFieldRendererParameter;

  constructor() {
  }

  ngOnInit(): void {
  }

}
