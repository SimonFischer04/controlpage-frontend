import {ViewActionType} from '../../enums/view-action-type';
import {Action} from './action';

export interface ViewAction extends Action {
  viewActionType: ViewActionType;
  viewId: number;
}
