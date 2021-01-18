import {Component, Input, OnInit} from '@angular/core';
import {FullView} from '../../../interfaces/full-view';
import {ViewUtilsService} from '../../../services/view-utils/view-utils.service';
import {Field} from '../../../interfaces/field';
import {error} from '@angular/compiler/src/util';

@Component({
  selector: 'app-view-edit',
  templateUrl: './view-edit.component.html',
  styleUrls: ['./view-edit.component.scss']
})
export class ViewEditComponent implements OnInit {
  @Input() view: FullView;
  changed = false;

  constructor(
    private viewUtils: ViewUtilsService
  ) {
  }

  ngOnInit(): void {
  }

  addRow(): void {
    const ar: Field[] = [];
    for (let i = 0; i < this.viewUtils.getViewWidth(this.view); i++) {
      ar.push(this.viewUtils.getDummyField(true));
    }
    this.view.fields.push(ar);
  }

  removeRow(): void {
    if (confirm('Do you really want to delete last row?')) {
      this.view.fields.splice(this.view.fields.length - 1, 1);
    }
  }

  addColumn(): void {
    this.view.fields.forEach(row => {
      row.push(this.viewUtils.getDummyField(true));
    });
  }

  removeColumn(): void {
    if (confirm('Do you really want to delete last row?')) {
      this.view.fields.forEach(row => {
        if (row.length > 0) {
          row.splice(row.length - 1, 1);
        }
      });
    }
  }

  test(): void {
    console.log(this.view.fields);
  }
}
