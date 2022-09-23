import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ViewUtilsService} from '../../../../../services/view-utils/view-utils.service';
import {FullView} from '../../../../../types/view/full-view';
import deepEqual from 'deep-equal';
import {Field} from '../../../../../types/view/field/field';
import {ActionType} from '../../../../../types/view/action/action-type';
import {RestService} from '../../../../../services/rest/rest.service';

@Component({
  selector: 'app-view-edit-section',
  templateUrl: './view-edit-section.component.html',
  styleUrls: ['./view-edit-section.component.scss']
})
export class ViewEditSectionComponent implements OnInit, OnChanges {
  @Input() private view: FullView;

  // save copy of view to be able to check if something changed -> f.e. display "unsaved-infos"
  private savedView?: FullView;

  constructor(
    private readonly rest: RestService,
    private readonly viewUtils: ViewUtilsService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.view) {
      // console.error("changes", changes.view.currentValue)
      this.savedView = structuredClone(changes.view.currentValue);
    }
  }

  /*
   Edit section - Tools
  */

  public addRow(): void {
    this.viewUtils.addDummyRow(this.view);
  }

  public removeRow(): void {
    if (confirm('Do you really want to delete last row?')) {
      this.view.fields.splice(this.view.fields.length - 1, 1);
    }
  }

  public addColumn(): void {
    this.viewUtils.addDummyColumn(this.view);
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
    this.changedFiles.forEach(({fieldId, backgroundFile}) => {
      this.rest.saveFile(backgroundFile).subscribe(
        (imageId: number): void => {
          const field = this.viewUtils.getFieldById(this.view, fieldId);
          field.backgroundId = imageId;
          field.backgroundFile = null;
          field.backgroundImage = null;
          this.save();
        }
      );
    });
    this.saveView();
  }

  /*
    ---
   */

  public hasUnsavedChanges(): boolean {
    // console.error("check")
    return !deepEqual(this.view, this.savedView);
  }

  private saveView(): void {
    if (this.changedFiles.length > 0) {
      console.error('saveView called without saving all files beforehand');
      return;
    }

    const view: FullView = structuredClone(this.view);
    console.log('saveView: ', view);

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
        /*
          Send Event to trigger reload (re-fetch from server) in "view-page-component".
          Yes, I know, I could skip this step but this should prevent inconsistent ("saved")-data between frontend and backend.
          And ... I think this is negligible because it is only part of "the editing". (wouldn't do such things in "the using expierence")
         */
        // this.refreshEvent.emit();
        window.location.reload();
      }
    );
  }

  private get changedFiles(): { fieldId: number, backgroundFile: File }[] {
    // reduce to 1d array
    return this.view.fields.reduce((prev, curr) => prev.concat(curr), [])
      // filter non-null
      .filter((field) => field.backgroundFile)

      // map to background files
      .map(field => ({fieldId: field.id, backgroundFile: field.backgroundFile}));
  }
}
