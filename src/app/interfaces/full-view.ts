import {BasicView} from './basic-view';
import {Field} from './field';

export interface FullView extends BasicView {
  fields: Field[][];
}
