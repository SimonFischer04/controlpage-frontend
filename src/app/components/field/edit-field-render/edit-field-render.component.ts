import {Component, Input, OnInit} from '@angular/core';
import {Field} from '../../../interfaces/field';
import {EditFieldRendererParameter} from '../../../interfaces/field-renderer-parameter/edit-field-renderer-parameter';
import {Image} from '../../../interfaces/image';
import {ImageUtilsService} from '../../../services/image-utils/image-utils.service';

@Component({
  selector: 'app-edit-field-render',
  templateUrl: './edit-field-render.component.html',
  styleUrls: ['./edit-field-render.component.scss']
})
export class EditFieldRenderComponent implements OnInit {
  @Input() field: Field;
  @Input() params: EditFieldRendererParameter;

  constructor(
    public imageUtils: ImageUtilsService
  ) {
  }

  ngOnInit(): void {
  }

  isSelected(): boolean {
    return this.field === this.params.selectedField;
  }

  getColor(): string {
    return this.isSelected() ? '#56cc49' : '#ffffff';
  }
}
