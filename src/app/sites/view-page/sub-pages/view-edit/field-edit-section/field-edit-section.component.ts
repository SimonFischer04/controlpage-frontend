import {Component, HostListener, Input} from '@angular/core';
import {ActionType} from '../../../../../types/action-type';
import {getEnumKeyNames} from '../../../../../utils/enum-utils';
import {DummyUtils} from '../../../../../utils/dummy-utils';
import {ImageUtilsService} from '../../../../../services/image-utils/image-utils.service';
import {Clipboard} from '@angular/cdk/clipboard';
import {ViewUtilsService} from '../../../../../services/view-utils/view-utils.service';
import {UserPreferencesService} from '../../../../../services/user-preferences/user-preferences.service';
import {Action, DesktopAutomationAction, FieldDTO, RestAction, StyledText, ViewAction} from "../../../../../../gen";
import {FrontendField} from "../../../../../types/frontend-wrapper/frontend-field";

@Component({
  selector: 'app-field-edit-section',
  templateUrl: './field-edit-section.component.html',
  styleUrls: ['./field-edit-section.component.scss']
})
export class FieldEditSectionComponent  {
  @Input() public selectedField: FrontendField;

  private readonly undoStack: FieldDTO[] = [];
  private readonly redoStack: FieldDTO[] = [];

  constructor(
    private readonly imageUtils: ImageUtilsService,
    private readonly clipboard: Clipboard,
    private readonly viewUtils: ViewUtilsService,
    private readonly preferences: UserPreferencesService
  ) {
  }

  public test() {
    console.warn('test');
  }

  /*
    Field - tools
   */

  public copy(): void {
    console.log('copy: ', this.selectedField);
    this.saveCurrentStateForUndo();
    this.clearRedoStack();
    this.clipboard.copy(JSON.stringify(this.selectedField));
  }

  public cut(): void {
    console.log('cut: ', this.selectedField);
    this.saveCurrentStateForUndo();
    this.clearRedoStack();
    this.clipboard.copy(JSON.stringify(this.selectedField));
    this.viewUtils.assignField(this.selectedField, this.viewUtils.getDummyField());
  }

  public clear(): void {
    console.log('clear.');
    this.saveCurrentStateForUndo();
    this.clearRedoStack();
    this.viewUtils.assignField(this.selectedField, this.viewUtils.getDummyField());
  }

  public paste(): void {
    navigator.clipboard.readText().then((clipboardText: string) => {
      console.log('paste: ', clipboardText);
      this.saveCurrentStateForUndo();
      this.clearRedoStack();
      this.viewUtils.assignField(this.selectedField, JSON.parse(clipboardText));
    });
  }

  public undo(): void {
    console.log('undo: ', structuredClone(this.undoStack));

    if (this.undoStack.length === 0) {
      return;
    }

    this.saveCurrentStateForRedo();
    this.viewUtils.assignField(this.selectedField, this.undoStack.pop());
  }

  public redo(): void {
    console.log('redo: ', this.redoStack);

    if (this.redoStack.length === 0) {
      return;
    }

    this.saveCurrentStateForUndo();
    this.viewUtils.assignField(this.selectedField, this.redoStack.pop());
  }

  @HostListener('window:keydown', ['$event'])
  private onKeyPress($event: KeyboardEvent) {
    if (this.preferences.fieldKeybindingEnabled) {
      // console.error("key", $event.key, $event.code);
      if (($event.ctrlKey) && $event.key === 'c') {
        this.copy();
      }
      if (($event.ctrlKey) && $event.key === 'x') {
        this.cut();
      }
      if (($event.ctrlKey) && $event.key === 'v') {
        this.paste();
      }

      // don't trigger when in input field, ... (undo handled natively by browser)
      if (($event.ctrlKey) && $event.key === 'z' && document.activeElement.tagName === 'BODY') {
        this.undo();
      }
      // don't trigger when in input field, ... (undo handled natively by browser)
      if (($event.ctrlKey) && $event.key === 'y' && document.activeElement.tagName === 'BODY') {
        this.redo();
      }

      // don't trigger when in input field, ...
      if ($event.key === 'Delete' && document.activeElement.tagName === 'BODY') {
        this.clear();
      }
    }
  }

  private saveCurrentStateForRedo(): void {
    console.log('redo-stack update: ', this.redoStack);
    this.redoStack.push(structuredClone(this.selectedField));
  }

  private saveCurrentStateForUndo(): void {
    console.log('undo stack update: ', this.undoStack);
    this.undoStack.push(structuredClone(this.selectedField));
  }

  private clearRedoStack(): void {
    console.log('clearing redo stack');
    this.redoStack.splice(0, this.redoStack.length);
  }

  /*
    Field
   */

  public onFileChanged(event: Event): void {
    const field = this.selectedField;
    console.log('fileChangeEvent: ', event);
    const inputElement = event.target as HTMLInputElement;
    const selectedFile = inputElement.files?.[0];

    if (selectedFile) {
      this.selectedField.backgroundFile = selectedFile;
      const reader = new FileReader();

      reader.onload = (e) => {
        const res: string = e.target.result as string;
        const regExpMatchArray: RegExpMatchArray = res.match('data:(.*?);base64,(.*)');
        // console.log(regExpMatchArray);
        field.backgroundImage = {id: -1, name: selectedFile.name, type: selectedFile.type, imageData: regExpMatchArray[2]};
        console.log('backG: ', field.backgroundImage);
      };

      reader.readAsDataURL(selectedFile);
    }
  }

  public removeBackground(): void {
    const field: FrontendField = this.selectedField;
    field.backgroundId = -1;
    field.backgroundImage = undefined;
  }

  public hasBackground(): boolean {
    return this.imageUtils.hasBackground(this.selectedField);
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

  public isViewAction(): boolean {
    return this.action.type === ActionType.VIEW;
  }

  public isViewSwitchToAction(): boolean {
    return this.isViewAction() && this.getViewAction().viewActionType === ViewAction.viewActionType.SWITCH_TO;
  }

  public getDesktopAutomationAction(): DesktopAutomationAction {
    return this.getTypedAction<DesktopAutomationAction>(ActionType.DESKTOP_AUTOMATION);
  }

  public getRestAction(): RestAction {
    return this.getTypedAction<RestAction>(ActionType.REST);
  }

  public getViewAction(): ViewAction {
    return this.getTypedAction<ViewAction>(ActionType.VIEW);
  }

  public get action(): Action {
    const field: FieldDTO = this.selectedField;
    if (!field.action) {
      field.action = DummyUtils.getDummyAction();
    }
    return field.action;
  }

  public get title(): StyledText {
    const field: FieldDTO = this.selectedField;
    if (!field.title) {
      field.title = DummyUtils.getDummyTitle();
    }
    return field.title;
  }

  /*
    Getter
   */

  public getActionTypes(): string[] {
    return getEnumKeyNames(ActionType);
  }

  public getRunPolicies(): string[] {
    return getEnumKeyNames(Action.runPolicy);
  }

  public getRestTypes(): string[] {
    return getEnumKeyNames(RestAction.restType);
  }

  public getViewActionTypes(): string[] {
    return getEnumKeyNames(ViewAction.viewActionType);
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
