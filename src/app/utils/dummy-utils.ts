import {Action} from '../types/view/action/action';
import {ActionType} from '../types/view/action/action-type';
import {RunPolicy} from '../types/view/action/run-policy';
import {FullView} from '../types/view/full-view';
import {Field} from '../types/view/field/field';

export class DummyUtils {
  static getDummyView(): FullView {
    return {id: -1, name: '', group: {id: -1, childGroups: [], name: '', parentGroup: null}, fields: []};
  }

  static getDummyField(): Field {
    return {id: -1, colspan: 1, rowspan: 1};
  }

  static getDummyAction(): Action {
    return {
      type: ActionType.UNDEFINED,
      runPolicy: RunPolicy.ASYNC,
      id: -1
    };
  }
}
