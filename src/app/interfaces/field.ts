import {Action} from './action/action';

export interface Field {
  id: number;
  action?: Action;
  background?: string;
  rowspan: number;
  colspan: number;
}
