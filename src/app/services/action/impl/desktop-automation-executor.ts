import {ActionExecutor} from '../action-executor';
import {DesktopAutomationAction} from '../../../types/view/action/impl/desktop-automation-action';
import {UserPreferencesService} from '../../user-preferences/user-preferences.service';

export class DesktopAutomationExecutor extends ActionExecutor<DesktopAutomationAction> {
  public executeAction(action: DesktopAutomationAction): void {
    console.log('DesktopAutomationAction: ', action);

    const url = `${this.preferences.desktopAutomationPrefix}function/${action.functionName}`;

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
