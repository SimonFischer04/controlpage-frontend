import {Action} from './action/action';

export interface Field {
  id: number;
  action?: Action;
  title?: string;
  background?: string;
  rowspan: number;
  colspan: number;
}
