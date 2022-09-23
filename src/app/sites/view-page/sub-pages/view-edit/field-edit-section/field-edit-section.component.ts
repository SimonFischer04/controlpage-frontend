import {Component, Input, OnInit} from '@angular/core';
import {Field} from '../../../../../types/view/field/field';
import {ActionType} from '../../../../../types/view/action/action-type';
import {getEnumKeyNames} from '../../../../../utils/enum-utils';
import {RunPolicy} from '../../../../../types/view/action/run-policy';
import {RestAction, RestType} from '../../../../../types/view/action/impl/rest-action';
import {DesktopAutomationAction} from '../../../../../types/view/action/impl/desktop-automation-action';
import {Action} from '../../../../../types/view/action/action';
import {DummyUtils} from '../../../../../utils/dummy-utils';
import {ImageUtilsService} from '../../../../../services/image-utils/image-utils.service';

@Component({
  selector: 'app-field-edit-section',
  templateUrl: './field-edit-section.component.html',
  styleUrls: ['./field-edit-section.component.scss']
})
export class FieldEditSectionComponent implements OnInit {
  @Input() public selectedField: Field;

  constructor(
    private readonly imageUtils: ImageUtilsService
  ) {
  }

  ngOnInit(): void {
  }

  /*
    Field
   */

  public onFileChanged(event: any): void {
    const field = this.selectedField;
    console.log('fileChangeEvent: ', event);
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.selectedField.backgroundFile = file;
      const reader = new FileReader();

      reader.onload = (e) => {
        const res: string = e.target.result as string;
        const regExpMatchArray: RegExpMatchArray = res.match('data:(.*?);base64,(.*)');
        // console.log(regExpMatchArray);
        field.backgroundImage = {id: -1, name: file.name, type: file.type, imageData: regExpMatchArray[2]};
        console.log('backG: ', field.backgroundImage);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  public removeBackground(): void {
    const field: Field = this.selectedField;
    field.backgroundId = -1;
    field.backgroundImage = undefined;
  }

  public hasBackground(): boolean {
    return this.imageUtils.hasBackground(this.selectedField);
  }

  public getBackgroundSrcString(): string {
    return this.imageUtils.getBackgroundImage(this.selectedField);
  }

  /*
    Action
  */

  public isRestAction(): boolean {
    return this.action.type === ActionType.REST;
  }

  public isDesktopAutomationAction(): boolean {
    return this.action.type === ActionType.DESKTOP_AUTOMATION;
  }

  public getDesktopAutomationAction(): DesktopAutomationAction {
    return this.getTypedAction<DesktopAutomationAction>(ActionType.DESKTOP_AUTOMATION);
  }

  public getRestAction(): RestAction {
    return this.getTypedAction<RestAction>(ActionType.REST);
  }

  public get action(): Action {
    const field: Field = this.selectedField;
    if (!field.action) {
      field.action = DummyUtils.getDummyAction();
    }
    return field.action;
  }

  /*
    Getter
   */

  public getActionTypes(): string[] {
    return getEnumKeyNames(ActionType);
  }

  public getRunPolicies(): string[] {
    return getEnumKeyNames(RunPolicy);
  }

  public getRestTypes(): string[] {
    return getEnumKeyNames(RestType);
  }

  // ---

  private getTypedAction<T extends Action>(typeParam: ActionType): T {
    const action: Action = this.action;
    if (action.type !== typeParam) {
      console.error(`NOT A ${typeParam} TYPE!!!`);
      return undefined;
    }
    return action as T;
  }
}
