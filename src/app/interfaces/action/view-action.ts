import {ViewActionType} from '../../enums/view-action-type';

export interface ViewAction {
  viewActionType: ViewActionType;
  viewId: number;
}
