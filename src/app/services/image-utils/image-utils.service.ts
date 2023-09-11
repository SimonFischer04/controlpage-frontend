import {Injectable} from '@angular/core';
import {Image} from '../../types/image';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';
import {FieldDTO} from "../../../gen";
import {FrontendField} from "../../types/frontend-wrapper/frontend-field";

@Injectable({
  providedIn: 'root'
})
export class ImageUtilsService {

  constructor(
    private readonly preferences: UserPreferencesService
  ) {
  }

  public hasBackground(field: FrontendField): boolean {
    return !!field.backgroundImage || field.backgroundId > 0;
  }

  public getBackgroundImage(field: FrontendField): string {
    // "backgroundImage" is only set in "unsaved-state", server will only respond with "backgroundId"
    if (field.backgroundImage) {
      return this.getBackgroundImgString(field);
    }
    if (field.backgroundId > 0) {
      return this.getRemoteImageSrc(field);
    }
    return '';
  }

  public getBackgroundImageAltText(field: FrontendField): string {
    // "backgroundImage" is only set in "unsaved-state", server will only respond with "backgroundId"
    if (field.backgroundImage) {
      // TODO: improve this alt-text
      return '(recently uploaded background-image)';
    }
    if (field.backgroundId > 0) {
      // TODO: proper backend / save alt-text support
      return `background image with id: ${field.backgroundId}`;
    }
    return '';
  }

  private getRemoteImageSrc(field: FieldDTO): string {
    return `${this.preferences.backendHost}/api/image/${field.backgroundId}`;
  }

  private getBackgroundImgString(field: FrontendField): string {
    return `${this.getSrcStringByImage(field.backgroundImage)}`;
  }

  private getSrcStringByImage(image: Image): string {
    if (!image) {
      return ``;
    }
    return `data:${image.type};base64,${image.imageData}`;
  }
}
