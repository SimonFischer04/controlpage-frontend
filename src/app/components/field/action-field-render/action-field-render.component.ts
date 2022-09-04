import {Component, Input, OnInit} from '@angular/core';
import {Field} from '../../../interfaces/field';
import {ActionFieldRendererParameter} from '../../../interfaces/field-renderer-parameter/action-field-renderer-parameter';
import {ImageUtilsService} from '../../../services/image-utils/image-utils.service';

@Component({
  selector: 'app-action-field-render',
  templateUrl: './action-field-render.component.html',
  styleUrls: ['./action-field-render.component.scss']
})
export class ActionFieldRenderComponent implements OnInit {
  @Input() field: Field;
  @Input() params: ActionFieldRendererParameter;

  constructor(
    private imageUtils: ImageUtilsService
  ) {
  }

  ngOnInit(): void {
  }

  public getBackgroundImage(): string {
    return this.imageUtils.getBackgroundImage(this.field);
  }

  public hasBackground(): boolean {
    return this.imageUtils.hasBackground(this.field);
  }
}
