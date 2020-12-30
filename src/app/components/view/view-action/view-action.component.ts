import {Component, Input, OnInit} from '@angular/core';
import {FullView} from '../../../interfaces/full-view';

@Component({
  selector: 'app-view-action',
  templateUrl: './view-action.component.html',
  styleUrls: ['./view-action.component.scss']
})
export class ViewActionComponent implements OnInit {
  @Input() view: FullView;

  constructor() { }

  ngOnInit(): void {
  }

}
