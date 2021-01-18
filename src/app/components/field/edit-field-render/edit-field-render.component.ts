import {Component, Input, OnInit} from '@angular/core';
import {Field} from '../../../interfaces/field';

@Component({
  selector: 'app-edit-field-render',
  templateUrl: './edit-field-render.component.html',
  styleUrls: ['./edit-field-render.component.scss']
})
export class EditFieldRenderComponent implements OnInit {
  @Input() field: Field;

  constructor() {
  }

  ngOnInit(): void {
  }

  rand(): number {
    return Math.floor(Math.random() * 100);
  }
}
