import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FullView} from '../../../interfaces/full-view';
import {ViewUtilsService} from '../../../services/view-utils/view-utils.service';
import {Field} from '../../../interfaces/field';
import {error} from '@angular/compiler/src/util';
import {RestService} from '../../../services/rest/rest.service';
import {Router} from '@angular/router';
import {EditFieldRendererParameter} from '../../../interfaces/field-renderer-parameter/edit-field-renderer-parameter';
import {ImageUtilsService} from '../../../services/image-utils/image-utils.service';
import {Image} from '../../../interfaces/image';
import {FileChangeEvent} from '@angular/compiler-cli/src/perform_watch';

@Component({
  selector: 'app-view-edit',
  templateUrl: './view-edit.component.html',
  styleUrls: ['./view-edit.component.scss']
})
export class ViewEditComponent implements OnInit {
  @Output() requestRefresh: EventEmitter<any> = new EventEmitter();
  @Input() view: FullView;
  selectedField: Field;
  viewChanged = false;
  fieldParams: EditFieldRendererParameter = {selectedField: null};
  // Map<fieldId, File>
  changedFiles: Map<number, File> = new Map<number, File>();

  constructor(
    private viewUtils: ViewUtilsService,
    private rest: RestService,
    private imageUtils: ImageUtilsService
  ) {
  }

  ngOnInit(): void {
  }

  selectedFieldChange(field: Field): void {
    // Unselect Field if pressed 2nd time
    this.changeSelectedField(field === this.selectedField ? null : field);

    console.log('editing Field: ', this.selectedField);
  }


  /*
    Editing Section - Field
   */

  onFileChanged(event: any, field: Field): void {
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

  /*
    Editing Section - General
   */

  addRow(): void {
    this.viewChanged = true;
    const ar: Field[] = [];
    for (let i = 0; i < this.viewUtils.getViewWidth(this.view); i++) {
      ar.push(this.viewUtils.getDummyField(true));
    }
    this.view.fields.push(ar);
  }

  removeRow(): void {
    this.viewChanged = true;
    if (confirm('Do you really want to delete last row?')) {
      this.view.fields.splice(this.view.fields.length - 1, 1);
    }
  }

  addColumn(): void {
    this.viewChanged = true;
    this.view.fields.forEach(row => {
      row.push(this.viewUtils.getDummyField(true));
    });
  }

  removeColumn(): void {
    this.viewChanged = true;
    if (confirm('Do you really want to delete last row?')) {
      this.view.fields.forEach(row => {
        if (row.length > 0) {
          row.splice(row.length - 1, 1);
        }
      });
    }
  }

  private saveView(): void {
    if (this.changedFiles.size === 0) {
      this.rest.saveView(this.view).subscribe(
        () => {
          this.viewChanged = false;
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

  save(): void {
    this.changedFiles.forEach((file, fieldId) => {
      this.rest.saveFile(file).subscribe(
        image => {
          this.getFieldById(fieldId).background = image;
          this.changedFiles.delete(fieldId);
          this.saveView();
        }
      );
    });
    this.saveView();
  }

  test(): void {
    console.log(this.view.fields);
  }

  /*
    Utils
   */
  getFieldById(id: number): Field {
    for (const row of this.view.fields) {
      for (const field of row) {
        if (field.id === id) {
          return field;
        }
      }
    }
  }

  getBackgroundSrcString(field: Field): string {
    return this.imageUtils.getSrcStringByImage(field.background);
  }

  changeSelectedField(field: Field): void {
    this.selectedField = field;
    this.fieldParams.selectedField = field;
  }
}
