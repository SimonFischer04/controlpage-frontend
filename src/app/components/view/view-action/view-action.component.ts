import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FullView} from '../../../interfaces/full-view';
import {Field} from '../../../interfaces/field';
import {ActionService} from '../../../services/action/action.service';
// noinspection SpellCheckingInspection
import screenfull from 'screenfull';

@Component({
  selector: 'app-view-action',
  templateUrl: './view-action.component.html',
  styleUrls: ['./view-action.component.scss']
})
export class ViewActionComponent implements OnInit {
  @Input() view: FullView;
  @ViewChild('viewRendererRefWrapper', {static: true}) viewRendererWrapperRef: ElementRef;

  constructor(
    private readonly actionService: ActionService
  ) {
  }

  ngOnInit(): void {
  }

  public onFieldPress(field: Field): void {
    this.actionService.executeAction(field.action);
  }

  public fullScreen(): void {
    if (screenfull.isEnabled) {
      screenfull.request(this.viewRendererWrapperRef.nativeElement);
    }
  }
}
