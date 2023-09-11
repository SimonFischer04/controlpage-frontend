import {ActionExecutor} from "../action-executor";
import {UserPreferencesService} from "../../user-preferences/user-preferences.service";
import {GlobalEventsService} from "../../global-events/global-events.service";
import {ViewAction} from "../../../../gen";

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
      case ViewAction.viewActionType.SWITCH_TO: {
        this.lastViewId = this.globalEvents.currentView.id;
        this.globalEvents.emitViewChangeRequest(action.viewId);
        break;
      }
      case ViewAction.viewActionType.BACK: {
        this.globalEvents.emitViewChangeRequest(this.lastViewId);
        break;
      }
      case ViewAction.viewActionType.CLOSE: {
        this.globalEvents.emitViewChangeRequest(-1);
        break;
      }
    }
  }
}
