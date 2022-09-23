import {UserPreferencesService} from '../user-preferences/user-preferences.service';
import {Action} from '../../types/view/action/action';

export abstract class ActionExecutor<T extends Action> {
  public abstract executeAction(preferences: UserPreferencesService, action: T): void;
}
