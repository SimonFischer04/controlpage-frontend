import {Injectable} from '@angular/core';
import {Image} from '../../interfaces/image';
import {Field} from '../../interfaces/field';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageUtilsService {

  constructor() {
  }

  public getRemoteImageSrc(field: Field): string {
    return `${environment.host}/api/image/${field.backgroundId}`;
  }

  public getBackgroundImgString(field: Field): string {
    return `${this.getSrcStringByImage(field.background)}`;
  }

  // Used in edit-section to display currently selected file
  public getSrcStringByImage(image: Image): string {
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
