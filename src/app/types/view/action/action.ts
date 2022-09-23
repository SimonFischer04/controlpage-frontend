import {ActionType} from './action-type';
import {RunPolicy} from './run-policy';

export interface Action{
  id: number;
  runPolicy: RunPolicy;
  type: ActionType;
}
