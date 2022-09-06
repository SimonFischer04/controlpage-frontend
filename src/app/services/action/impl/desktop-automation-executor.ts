import {ActionExecutor} from '../action-executor';
import {DesktopAutomationAction} from '../../../interfaces/action/desktop-automation-action';
import {UserPreferencesService} from '../../user-preferences/user-preferences.service';

export class DesktopAutomationExecutor extends ActionExecutor<DesktopAutomationAction> {
  public executeAction(preferences: UserPreferencesService, action: DesktopAutomationAction): void {
    console.log('DesktopAutomationAction: ', action);

    const url = `${preferences.desktopAutomationPrefix}function/${action.functionName}`;

    fetch(url, {
      method: 'POST',
      // TODO: DesktopAutomationExecutor add parameter support
      // body: action
    }).then((result: Response) => {
      return result.text();
    }).then((value: any) => {
      console.log('fetch-result: ', value);
    }).catch((error: any) => {
      alert(`DesktopAutomationAction-Error: ${error}`);
    });
  }
}
