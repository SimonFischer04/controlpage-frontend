import {Action} from '../action';

export interface RestAction extends Action{
  restType: RestType;
  url: string;
  body: string;
}

export enum RestType {
  GET = 'GET',
  POST = 'POST'
}
