import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FullView} from '../../../interfaces/full-view';
import {ViewUtilsService} from '../../../services/view-utils/view-utils.service';
import {Field} from '../../../interfaces/field';
import {error} from '@angular/compiler/src/util';
import {RestService} from '../../../services/rest/rest.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-view-edit',
  templateUrl: './view-edit.component.html',
  styleUrls: ['./view-edit.component.scss']
})
export class ViewEditComponent implements OnInit {
  @Output() requestRefresh: EventEmitter<any> = new EventEmitter();
  @Input() view: FullView;
  changed = false;

  constructor(
    private viewUtils: ViewUtilsService,
    private rest: RestService,
  ) {
  }

  ngOnInit(): void {
  }

  addRow(): void {
    this.changed = true;
    const ar: Field[] = [];
    for (let i = 0; i < this.viewUtils.getViewWidth(this.view); i++) {
      ar.push(this.viewUtils.getDummyField(true));
    }
    this.view.fields.push(ar);
  }

  removeRow(): void {
    this.changed = true;
    if (confirm('Do you really want to delete last row?')) {
      this.view.fields.splice(this.view.fields.length - 1, 1);
    }
  }

  addColumn(): void {
    this.changed = true;
    this.view.fields.forEach(row => {
      row.push(this.viewUtils.getDummyField(true));
    });
  }

  removeColumn(): void {
    this.changed = true;
    if (confirm('Do you really want to delete last row?')) {
      this.view.fields.forEach(row => {
        if (row.length > 0) {
          row.splice(row.length - 1, 1);
        }
      });
    }
  }

  save(): void {
    this.rest.saveView(this.view).subscribe(
      () => {
        this.changed = false;
        /*
          Send Event to trigger reload (re-fetch from server) in "view-page-component".
          Yes, I know, I could skip this step but this should prevent inconsistent ("saved")-data between frontend and backend.
          And ... I think this is negligible because it is only part of "the editing". (wouldn't do such things in "the using expierence")
         */
        this.requestRefresh.emit();
      }
    );
    // this.rest.saveField(this.view.fields[0][0]).subscribe();
  }

  test(): void {
    console.log(this.view.fields);
  }
}
