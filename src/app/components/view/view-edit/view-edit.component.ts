import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FullView} from '../../../interfaces/full-view';
import {ViewUtilsService} from '../../../services/view-utils/view-utils.service';
import {Field} from '../../../interfaces/field';
import {RestService} from '../../../services/rest/rest.service';
import {EditFieldRendererParameter} from '../../../interfaces/field-renderer-parameter/edit-field-renderer-parameter';
import {ImageUtilsService} from '../../../services/image-utils/image-utils.service';
import deepEqual from 'deep-equal';
import {ActionType} from '../../../enums/action-type';
import {getEnumKeyNames} from '../../../utils/enum-utils';
import {DummyUtils} from '../../../utils/dummy-utils';
import {RestAction} from '../../../interfaces/action/rest-action';
import {Action} from '../../../interfaces/action/action';
import {RunPolicy} from '../../../enums/run-policy';
import {RestType} from '../../../enums/rest-type';
import {ActionService} from '../../../services/action/action.service';

@Component({
  selector: 'app-view-edit',
  templateUrl: './view-edit.component.html',
  styleUrls: ['./view-edit.component.scss']
})
export class ViewEditComponent implements OnInit {
  @Output() requestRefresh: EventEmitter<FullView> = new EventEmitter();
  @Input() selectedViewChanged: EventEmitter<FullView> = new EventEmitter();
  @Input() view: FullView;

  // save copy of view to be able to check if something changed -> f.e. display "unsaved-infos"
  savedView?: FullView;

  fieldParams: EditFieldRendererParameter = {selectedField: null};

  // Map<fieldId, File>
  changedFiles: Map<number, File> = new Map<number, File>();

  constructor(
    private readonly viewUtils: ViewUtilsService,
    private readonly rest: RestService,
    private readonly imageUtils: ImageUtilsService,
    private readonly actionService: ActionService
  ) {
  }

  ngOnInit(): void {
    this.selectedViewChanged.subscribe((view: FullView) => {
      console.log('view changed: ', view);
      this.savedView = structuredClone(view);
    });
  }

  public selectedFieldChange(field: Field): void {
    // Unselect Field if pressed 2nd time
    this.changeSelectedField(field === this.getSelectedField() ? null : field);

    console.log('editing Field: ', this.getSelectedField());
  }


  /*
    Editing Section - Field
   */

  public onFileChanged(event: any): void {
    const field = this.getSelectedField();
    console.log('fileChangeEvent: ', event);
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.changedFiles.set(field.id, file);
      const reader = new FileReader();

      reader.onload = (e) => {
        const res: string = e.target.result as string;
        const regExpMatchArray: RegExpMatchArray = res.match('data:(.*?);base64,(.*)');
        // console.log(regExpMatchArray);
        field.background = {id: -1, name: file.name, type: file.type, imageData: regExpMatchArray[2]};
        console.log('backG: ', field.background);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  public removeBackground(): void {
    const field: Field = this.getSelectedField();
    field.backgroundId = -1;
    field.background = undefined;
  }

  public hasBackground(): boolean {
    return this.imageUtils.hasBackground(this.getSelectedField());
  }

  public getBackgroundSrcString(): string {
    return this.imageUtils.getBackgroundImage(this.getSelectedField());
  }

  /*
    Editing Section - Action
  */

  public isRestAction(): boolean {
    return this.getAction()?.type === ActionType.REST;
  }

  public getRestAction(): RestAction {
    const action: Action = this.getAction();
    if (action.type !== ActionType.REST) {
      console.error('NOT A REST TYPE!!!');
      return undefined;
    }
    return action as RestAction;
  }

  public getAction(): Action {
    const field: Field = this.getSelectedField();
    if (!field.action) {
      field.action = DummyUtils.getDummyAction();
    }
    return field.action;
  }

  /*
    Editing Section - General
   */

  public addRow(): void {
    const ar: Field[] = [];
    for (let i = 0; i < this.viewUtils.getViewWidth(this.view); i++) {
      ar.push(this.viewUtils.getDummyField(true));
    }
    this.view.fields.push(ar);
  }

  public removeRow(): void {
    if (confirm('Do you really want to delete last row?')) {
      this.view.fields.splice(this.view.fields.length - 1, 1);
    }
  }

  public addColumn(): void {
    this.view.fields.forEach(row => {
      row.push(this.viewUtils.getDummyField(true));
    });
  }

  public removeColumn(): void {
    if (confirm('Do you really want to delete last row?')) {
      this.view.fields.forEach(row => {
        if (row.length > 0) {
          row.splice(row.length - 1, 1);
        }
      });
    }
  }

  public save(): void {
    this.changedFiles.forEach((file, fieldId) => {
      this.rest.saveFile(file).subscribe(
        (imageId: number): void => {
          this.getFieldById(fieldId).backgroundId = imageId;
          this.changedFiles.delete(fieldId);
          this.saveView();
        }
      );
    });
    this.saveView();
  }

  public test(): void {
    console.log(this.view);
  }

  /*
    Other
   */

  public onActionFieldPress(field: Field) {
    this.actionService.executeAction(field.action);
  }

  /*
   Utils
  */

  public getSelectedField(): Field {
    return this.fieldParams.selectedField;
  }

  public getActionTypes(): string[] {
    return getEnumKeyNames(ActionType);
  }

  public getRunPolicies(): string[] {
    return getEnumKeyNames(RunPolicy);
  }

  public getRestTypes(): string[] {
    return getEnumKeyNames(RestType);
  }

  public hasUnsavedChanges(): boolean {
    return !deepEqual(this.view, this.savedView);
  }

  // ---

  private saveView(): void {
    if (this.changedFiles.size === 0) {
      const view: FullView = structuredClone(this.view);

      // filter out undefined-dummy-actions again
      view.fields.forEach((row: Field[]): void => {
        row.forEach((field: Field): void => {
          if (field.action && field.action.type === ActionType.UNDEFINED) {
            field.action = null;
          }
        });
      });

      this.rest.saveView(view).subscribe(
        () => {
          this.savedView = view;
          this.changedFiles.clear();
          /*
            Send Event to trigger reload (re-fetch from server) in "view-page-component".
            Yes, I know, I could skip this step but this should prevent inconsistent ("saved")-data between frontend and backend.
            And ... I think this is negligible because it is only part of "the editing". (wouldn't do such things in "the using expierence")
           */
          this.requestRefresh.emit();
        }
      );
    }
  }

  private changeSelectedField(field: Field): void {
    this.fieldParams.selectedField = field;
  }

  private getFieldById(id: number): Field {
    for (const row of this.view.fields) {
      for (const field of row) {
        if (field.id === id) {
          return field;
        }
      }
    }
  }
}
