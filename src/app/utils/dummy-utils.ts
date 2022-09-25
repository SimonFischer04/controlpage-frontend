import {Action} from '../types/view/action/action';
import {ActionType} from '../types/view/action/action-type';
import {RunPolicy} from '../types/view/action/run-policy';
import {FullView} from '../types/view/full-view';
import {Field} from '../types/view/field/field';
import {StyledText} from "../types/styled-text";
import {HorizontalAlignment} from "../types/horizontal-alignment";
import {VerticalAlignment} from "../types/vertical-alignment";

export class DummyUtils {
  public static getDummyView(): FullView {
    return {id: -1, name: '', group: {id: -1, childGroups: [], name: '', parentGroup: null}, fields: []};
  }

  public static getDummyField(): Field {
    return {id: -1, colspan: 1, rowspan: 1};
  }

  public static getDummyAction(): Action {
    return {
      type: ActionType.UNDEFINED,
      runPolicy: RunPolicy.ASYNC,
      id: -1
    };
  }

  public static getDummyTitle(): StyledText {
    return this.getDummyStyledText();
  }

  private static getDummyStyledText(): StyledText {
    return {
      id: -1,
      text: '',
      color: '#FFFFFF',
      horizontalAlignment: HorizontalAlignment.CENTER,
      verticalAlignment: VerticalAlignment.CENTER
    }
  }
}
