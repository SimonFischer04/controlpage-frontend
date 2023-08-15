import {ActionExecutor} from "../action-executor";
import {ViewAction, ViewActionType} from "../../../types/view/action/impl/view-action";
import {UserPreferencesService} from "../../user-preferences/user-preferences.service";
import {GlobalEventsService} from "../../global-events/global-events.service";

export class ViewActionExecutor extends ActionExecutor<ViewAction> {
  private lastViewId = -1;

  constructor(
    protected readonly preferences: UserPreferencesService,
    private readonly globalEvents: GlobalEventsService,
  ) {
    super(preferences);
  }

  public executeAction(action: ViewAction): void {
    console.log('view-action: ', action);
    switch (action.viewActionType) {
      case ViewActionType.SWITCH_TO: {
        this.lastViewId = this.globalEvents.currentView.id;
        this.globalEvents.emitViewChangeRequest(action.viewId);
        break;
      }
      case ViewActionType.BACK: {
        this.globalEvents.emitViewChangeRequest(this.lastViewId);
        break;
      }
      case ViewActionType.CLOSE: {
        this.globalEvents.emitViewChangeRequest(-1);
        break;
      }
    }
  }
}
