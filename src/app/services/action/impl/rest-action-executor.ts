import {ActionExecutor} from '../action-executor';
import {RestAction} from '../../../types/view/action/impl/rest-action';

export class RestActionExecutor extends ActionExecutor<RestAction> {
  public executeAction(_, action: RestAction): void {
    console.log('rest-action: ', action);
    fetch(action.url, {
      method: action.restType,
      body: action.body
    }).then((result: Response) => {
      return result.json();
    }).then((value: any) => {
      console.log('fetch-result: ', value);
    }).catch((error: any) => {
      alert(`RestAction-Error: ${error}`);
    });
  }
}
