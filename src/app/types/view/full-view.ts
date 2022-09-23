import {BasicView} from './basic-view';
import {Field} from './field/field';

export interface FullView extends BasicView {
  fields: Field[][];
}
