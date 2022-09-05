import {Component, Input, OnInit} from '@angular/core';
import {FullView} from '../../../interfaces/full-view';
import {Field} from '../../../interfaces/field';
import {ActionService} from '../../../services/action/action.service';

@Component({
  selector: 'app-view-action',
  templateUrl: './view-action.component.html',
  styleUrls: ['./view-action.component.scss']
})
export class ViewActionComponent implements OnInit {
  @Input() view: FullView;

  constructor(
    private readonly actionService: ActionService
  ) {
  }

  ngOnInit(): void {
  }

  public onFieldPress(field: Field): void {
    this.actionService.executeAction(field.action);
  }
}
