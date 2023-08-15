import {Injectable} from '@angular/core';
import {Action} from '../../types/view/action/action';
import {RestActionExecutor} from './impl/rest-action-executor';
import {ActionType} from '../../types/view/action/action-type';
import {DesktopAutomationExecutor} from './impl/desktop-automation-executor';
import {ActionExecutor} from './action-executor';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';
import {ViewActionExecutor} from "./impl/view-action-executor";
import {GlobalEventsService} from "../global-events/global-events.service";

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  private readonly executors: { [key: string]: ActionExecutor<Action> };

  constructor(
    private readonly preferences: UserPreferencesService,
    private readonly events: GlobalEventsService
  ) {
    this.executors = {
      [ActionType.REST]: new RestActionExecutor(preferences),
      [ActionType.DESKTOP_AUTOMATION]: new DesktopAutomationExecutor(preferences),
      [ActionType.VIEW]: new ViewActionExecutor(preferences, events)
    };
  }

  public executeAction(action: Action) {
    if (!action) {
      return;
    }

    const executor = this.executors[action.type];
    if (!executor) {
      console.error(`No executor for type '${action.type}' found!`);
    }
    executor.executeAction(action);
  }
}

