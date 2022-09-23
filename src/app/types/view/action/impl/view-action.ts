import {Action} from '../action';

export interface ViewAction extends Action {
  viewActionType: ViewActionType;
  viewId: number;
}

export enum ViewActionType {
  CLOSE, SWITCH
}
