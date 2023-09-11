import {Action, FieldDTO, FullViewDTO, StyledText} from "../../gen";
import {ActionType} from "../types/action-type";

export class DummyUtils {
  public static getDummyView(): FullViewDTO {
    return {id: -1, name: '', groupId: -1, fields: []};
  }

  public static getDummyField(): FieldDTO {
    return {id: -1, colspan: 1, rowspan: 1};
  }

  public static getDummyAction(): Action {
    return {
      type: ActionType.UNDEFINED,
      runPolicy: Action.runPolicy.ASYNC,
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
      horizontalAlignment: StyledText.horizontalAlignment.CENTER,
      verticalAlignment: StyledText.verticalAlignment.CENTER
    }
  }
}
