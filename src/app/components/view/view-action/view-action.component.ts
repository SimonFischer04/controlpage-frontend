import {Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {FullView} from '../../../interfaces/full-view';
import {Field} from '../../../interfaces/field';
import {ActionService} from '../../../services/action/action.service';
// noinspection SpellCheckingInspection
import screenfull from 'screenfull';
import {Size} from '../../../interfaces/size';

@Component({
  selector: 'app-view-action',
  templateUrl: './view-action.component.html',
  styleUrls: ['./view-action.component.scss']
})
export class ViewActionComponent implements OnInit {
  @Input() view: FullView;
  @ViewChild('viewRendererWrapper', {static: true}) viewRendererWrapperRef: ElementRef;
  public reInitEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private readonly actionService: ActionService
  ) {
  }

  ngOnInit(): void {
    if (screenfull.isEnabled) {
      screenfull.on('change', () => {
        console.log('Am I fullscreen?', screenfull.isFullscreen ? 'Yes' : 'No');
        // only trigger on fullscreen off event => manually emit reInitEvent if activating => wait for "fullscreen-animation"
        if (!screenfull.isFullscreen) {
          setTimeout(() => {
            this.reInitEvent.emit();
          }, 0);
        }
      });
    }
  }

  public onFieldPress(field: Field): void {
    this.actionService.executeAction(field.action);
  }

  public fullScreen(): void {
    if (screenfull.isEnabled) {
      screenfull.request(this.viewRendererWrapperRef.nativeElement).then(() => {
        setTimeout(() => {
          this.reInitEvent.emit();
        }, 0);
      });
    }
  }

  public getContainerSize(): Size {
    return {
      width: this.viewRendererWrapperRef.nativeElement?.clientWidth,
      height: this.viewRendererWrapperRef.nativeElement?.clientHeight
    };
  }
}
