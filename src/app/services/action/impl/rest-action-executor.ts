import {ActionExecutor} from '../action-executor';
import {RestAction} from '../../../types/view/action/impl/rest-action';

export class RestActionExecutor extends ActionExecutor<RestAction> {
  public executeAction(action: RestAction): void {
    console.log('rest-action: ', action);
    fetch(action.url, {
      method: action.restType,
      body: action.body,
      mode: 'no-cors'
    }).catch((error: unknown) => {
      if (this.preferences.shouldDisplayErrorAlert) {
        alert(`RestAction-Error: ${error}`);
      }
    });
  }
}
