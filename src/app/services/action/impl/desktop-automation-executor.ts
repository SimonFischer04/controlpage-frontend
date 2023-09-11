import {ActionExecutor} from '../action-executor';
import {DesktopAutomationAction} from "../../../../gen";

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
    }).then((value: unknown) => {
      console.log('fetch-result: ', value);
    }).catch((error: unknown) => {
      alert(`DesktopAutomationAction-Error: ${error}`);
    });
  }
}
