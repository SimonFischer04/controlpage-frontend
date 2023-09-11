import {Component, Input} from '@angular/core';
import {ImageUtilsService} from '../../../../services/image-utils/image-utils.service';
import {FrontendField} from "../../../../types/frontend-wrapper/frontend-field";

@Component({
  selector: 'app-background-image-renderer',
  templateUrl: './background-image-renderer.component.html',
  styleUrls: ['./background-image-renderer.component.scss']
})
export class BackgroundImageRendererComponent {
  @Input({required: true}) field: FrontendField;

  constructor(
    private readonly imageUtils: ImageUtilsService,
  ) {
  }

  protected getBackgroundImage(): string {
    return this.imageUtils.getBackgroundImage(this.field);
  }

  protected getBackgroundImageAltText(){
    return this.imageUtils.getBackgroundImageAltText(this.field);
  }

  protected hasBackground(): boolean {
    return this.imageUtils.hasBackground(this.field);
  }

  protected isUnsavedImage(): boolean{
    return !!this.field.backgroundImage;
  }
}
