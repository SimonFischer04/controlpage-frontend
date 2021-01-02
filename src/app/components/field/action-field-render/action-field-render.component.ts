import {Component, Input, OnInit} from '@angular/core';
import {Field} from '../../../interfaces/field';

@Component({
  selector: 'app-action-field-render',
  templateUrl: './action-field-render.component.html',
  styleUrls: ['./action-field-render.component.scss']
})
export class ActionFieldRenderComponent implements OnInit {
  @Input() field: Field;

  constructor() {
  }

  ngOnInit(): void {
  }

}
