import {Injectable} from '@angular/core';
import {Action} from '../../types/view/action/action';
import {RestActionExecutor} from './impl/rest-action-executor';
import {ActionType} from '../../types/view/action/action-type';
import {DesktopAutomationExecutor} from './impl/desktop-automation-executor';
import {ActionExecutor} from './action-executor';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  readonly executors:
    {
      [key: string]: ActionExecutor<any>
    } =
    {
      [ActionType.REST]: new RestActionExecutor(),
      [ActionType.DESKTOP_AUTOMATION]: new DesktopAutomationExecutor()
    };

  constructor(
    private readonly preferences: UserPreferencesService
  ) {
  }

  public executeAction(action: Action) {
    if (!action) {
      return;
    }

    const executor = this.executors[action.type];
    if (!executor) {
      console.error(`No executor for type '${action.type}' found!`);
    }
    executor.executeAction(this.preferences, action);
  }
}

