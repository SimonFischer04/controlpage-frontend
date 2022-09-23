import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FullView} from '../../../../types/view/full-view';
import {Field} from '../../../../types/view/field/field';
import {ActionService} from '../../../../services/action/action.service';
// noinspection SpellCheckingInspection
import screenfull from 'screenfull';

@Component({
  selector: 'app-view-action',
  templateUrl: './view-action.component.html',
  styleUrls: ['./view-action.component.scss']
})
export class ViewActionComponent implements OnInit {
  @Input() view: FullView;
  @ViewChild('viewRendererWrapper', {static: true}) viewRendererWrapperRef: ElementRef;

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