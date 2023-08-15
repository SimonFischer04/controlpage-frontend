import {Action} from '../action';

export interface RestAction extends Action{
  restType: RestType;
  url: string;
  body: string;
}

// noinspection JSUnusedGlobalSymbols
export enum RestType {
  GET = 'GET',
  POST = 'POST'
}
