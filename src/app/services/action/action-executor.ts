import {UserPreferencesService} from '../user-preferences/user-preferences.service';
import {Action} from "../../../gen";

export abstract class ActionExecutor<T extends Action> {
  constructor(
    protected readonly preferences: UserPreferencesService
  ) {
  }

  public abstract executeAction(action: T): void;
}
