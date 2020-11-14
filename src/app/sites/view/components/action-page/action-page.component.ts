import {Component, OnInit} from '@angular/core';
import ViewUtils from 'src/app/other/view-utils';

@Component({
  selector: 'app-action-page',
  templateUrl: './action-page.component.html',
  styleUrls: ['./action-page.component.scss']
})
export class ActionPageComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  getFieldWidth(): number {
    return ViewUtils.getFieldWidth(2, 10, 100);
  }
}
