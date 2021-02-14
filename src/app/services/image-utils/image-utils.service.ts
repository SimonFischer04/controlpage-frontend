import {Injectable} from '@angular/core';
import {Image} from '../../interfaces/image';

@Injectable({
  providedIn: 'root'
})
export class ImageUtilsService {

  constructor() {
  }

  getBackgroundImgStringByImage(image: Image) {
    return `url(${this.getSrcStringByImage(image)})`;
  }

  getSrcStringByImage(image: Image): string {
    if (!image) {
      return ``;
    }
    return `data:${image.type};base64,${image.imageData}`;
  }

  getSrcStringByFile(file: File): string {
    const reader = new FileReader();

    let data = '';
    reader.onload = (event) => { // called once readAsDataURL is completed
      data = event.target.result as string;
    };

    reader.readAsDataURL(file);
    return data;
  }
}
