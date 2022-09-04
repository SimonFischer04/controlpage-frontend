import {Action} from './action/action';
import {Image} from './image';

export interface Field {
  id: number;
  action?: Action;
  title?: string;
  background?: Image;
  backgroundId?: number;
  rowspan: number;
  colspan: number;
}
