import {ActionType} from '../../enums/action-type';
import {RunPolicy} from '../../enums/run-policy';

export interface Action{
  id: number;
  runPolicy: RunPolicy;
  type: ActionType;
}
