import {Action} from './action';
import {RestType} from '../../enums/rest-type';

export interface RestAction extends Action{
  restType: RestType;
  url: string;
  body: string;
}
