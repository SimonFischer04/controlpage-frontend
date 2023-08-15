import {Action} from '../action';

export interface ViewAction extends Action {
  viewActionType: ViewActionType;
  viewId: number;
}

// noinspection JSUnusedGlobalSymbols
export enum ViewActionType {
  UNDEFINED = "UNDEFINED",
  CLOSE = "CLOSE",
  SWITCH_TO = "SWITCH_TO",
  BACK = "BACK"
}
