import {Injectable} from '@angular/core';
import {Image} from '../../types/view/image';
import {Field} from '../../types/view/field/field';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';

@Injectable({
  providedIn: 'root'
})
export class ImageUtilsService {

  constructor(
    private readonly preferences: UserPreferencesService
  ) {
  }

  public hasBackground(field: Field): boolean {
    return !!field.backgroundImage || field.backgroundId > 0;
  }

  public getBackgroundImage(field: Field): string {
    // "backgroundImage" is only set in "unsaved-state", server will only respond with "backgroundId"
    if (field.backgroundImage) {
      return this.getBackgroundImgString(field);
    }
    if (field.backgroundId > 0) {
      return this.getRemoteImageSrc(field);
    }
    return '';
  }

  public getBackgroundImageAltText(field: Field): string {
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

  private getRemoteImageSrc(field: Field): string {
    return `${this.preferences.backendHost}/api/image/${field.backgroundId}`;
  }

  private getBackgroundImgString(field: Field): string {
    return `${this.getSrcStringByImage(field.backgroundImage)}`;
  }

  private getSrcStringByImage(image: Image): string {
    if (!image) {
      return ``;
    }
    return `data:${image.type};base64,${image.imageData}`;
  }

  private getSrcStringByFile(file: File): string {
    const reader = new FileReader();

    let data = '';
    reader.onload = (event) => { // called once readAsDataURL is completed
      data = event.target.result as string;
    };

    reader.readAsDataURL(file);
    return data;
  }
}
