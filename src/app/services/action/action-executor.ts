import {UserPreferencesService} from '../user-preferences/user-preferences.service';
import {Action} from '../../types/view/action/action';

export abstract class ActionExecutor<T extends Action> {
  constructor(
    protected readonly preferences: UserPreferencesService
  ) {
  }

  public abstract executeAction(action: T): void;
}
