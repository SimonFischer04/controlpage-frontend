import {Injectable} from '@angular/core';
import {Action} from '../../interfaces/action/action';
import {RestActionExecutor} from './impl/rest-action-executor';
import {ActionType} from '../../enums/action-type';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  readonly executors = {
    [ActionType.REST]: new RestActionExecutor()
  };

  constructor() {
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

