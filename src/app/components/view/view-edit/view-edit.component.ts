import {Component, Input, OnInit} from '@angular/core';
import {FullView} from '../../../interfaces/full-view';

@Component({
  selector: 'app-view-edit',
  templateUrl: './view-edit.component.html',
  styleUrls: ['./view-edit.component.scss']
})
export class ViewEditComponent implements OnInit {
  @Input() view: FullView;

  constructor() {
  }

  ngOnInit(): void {
  }

}
