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
import {RestService} from "../../../../../services/rest/rest.service";

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
    private readonly preferences: UserPreferencesService,
    private readonly rest: RestService
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
      const pasted: FrontendField = JSON.parse(clipboardText);
      this.saveCurrentStateForUndo();
      this.clearRedoStack();

      // In the backend a title, an action and a background image belong to exactly one field. The pasted field
      // must not reference the ones of the field it was copied from: it gets its own, with the same content.
      if (pasted.title) {
        pasted.title.id = DummyUtils.getDummyTitle().id;
      }
      if (pasted.action) {
        pasted.action.id = DummyUtils.getDummyAction().id;
      }
      this.viewUtils.assignField(this.selectedField, pasted);
      this.pasteBackground(this.selectedField, pasted);
    });
  }

  /**
   * Gives the field its own copy of the background image of the pasted field.
   * Like a newly selected image file it is uploaded when the view is saved.
   */
  private pasteBackground(field: FrontendField, pasted: FrontendField): void {
    const sourceBackgroundId = pasted.backgroundId;
    field.backgroundId = -1;
    field.backgroundFile = undefined;
    field.backgroundImage = undefined;

    if (pasted.backgroundImage) {
      // the copied field had an image that was not saved yet: the clipboard contains the image itself
      const image = pasted.backgroundImage;
      const bytes = Uint8Array.from(atob(image.imageData), char => char.charCodeAt(0));
      field.backgroundFile = new File([bytes], image.name, {type: image.type});
      field.backgroundImage = image;
    } else if (sourceBackgroundId > 0) {
      this.rest.getImage(sourceBackgroundId).subscribe((blob: Blob) => {
        this.setBackgroundFile(field, new File([blob], `background-${sourceBackgroundId}`, {type: blob.type}));
      });
    }
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
      this.setBackgroundFile(field, selectedFile);
    }
  }

  /**
   * Sets a new, not yet saved background image: the file is uploaded when the view is saved,
   * until then the field displays the image from its data.
   */
  private setBackgroundFile(field: FrontendField, file: File): void {
    field.backgroundFile = file;
    const reader = new FileReader();

    reader.onload = (e) => {
      const res: string = e.target.result as string;
      const regExpMatchArray: RegExpMatchArray = res.match('data:(.*?);base64,(.*)');
      // console.log(regExpMatchArray);
      field.backgroundImage = {id: -1, name: file.name, type: file.type, imageData: regExpMatchArray[2]};
      console.log('backG: ', field.backgroundImage);
    };

    reader.readAsDataURL(file);
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
