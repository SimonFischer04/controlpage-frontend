/*
  wrapper to allow additional (temporary) properties in angular
 */
import {FieldDTO} from "../../../gen";
import {Image} from "../image";

export interface FrontendField extends FieldDTO {
  // backgroundId to request the image from the backend (only exist AFTER saving view)
  backgroundId?: number;

  // the newly uploaded image used in editing section to display (only exist BEFORE saving view)
  backgroundImage?: Image;

  // the newly uploaded image file used to send to backend when saving view (only exist BEFORE saving view)
  backgroundFile?: File;
}
