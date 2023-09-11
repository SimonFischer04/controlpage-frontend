import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ActionService} from '../../../../services/action/action.service';
// noinspection SpellCheckingInspection
import screenfull from 'screenfull';
import {FieldDTO, FullViewDTO} from "../../../../../gen";

@Component({
  selector: 'app-view-action',
  templateUrl: './view-action.component.html',
  styleUrls: ['./view-action.component.scss']
})
export class ViewActionComponent  {
  @Input() view: FullViewDTO;
  @ViewChild('viewRendererWrapper', {static: true}) viewRendererWrapperRef: ElementRef;

  constructor(
    private readonly actionService: ActionService
  ) {
  }

  public onFieldPress(field: FieldDTO): void {
    this.actionService.executeAction(field.action);
  }

  public async fullScreen(): Promise<void> {
    if (screenfull.isEnabled) {
      await screenfull.request(this.viewRendererWrapperRef.nativeElement);
    }
  }
}
