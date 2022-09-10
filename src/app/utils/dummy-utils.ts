import {Action} from '../interfaces/action/action';
import {ActionType} from '../enums/action-type';
import {RunPolicy} from '../enums/run-policy';
import {FullView} from '../interfaces/full-view';
import {Field} from '../interfaces/field';

export class DummyUtils {
  static getDummyView(): FullView {
    return {id: -1, name: '', group: {id: -1, childGroups: [], name: '', parentGroup: null}, fields: []};
  }

  static getDummyField(randomTitle = false): Field {
    if (!randomTitle) {
      return {id: -1, colspan: 1, rowspan: 1};
    }
    return {id: -1, colspan: 1, rowspan: 1, title: `testField ${Math.floor(Math.random() * 255)}`};
  }

  static getDummyAction(): Action {
    return {
      type: ActionType.UNDEFINED,
      runPolicy: RunPolicy.ASYNC,
      id: -1
    };
  }
}
