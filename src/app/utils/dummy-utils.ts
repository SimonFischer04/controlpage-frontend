import {Action} from '../interfaces/action/action';
import {ActionType} from '../enums/action-type';
import {RunPolicy} from '../enums/run-policy';

export class DummyUtils {
  static getDummyAction(): Action {
    return {
      type: ActionType.UNDEFINED,
      runPolicy: RunPolicy.ASYNC,
      id: -1
    };
  }
}
