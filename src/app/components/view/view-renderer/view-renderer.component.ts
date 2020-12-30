import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ViewUtilsService} from '../../../services/view-utils/view-utils.service';
import {FullView} from '../../../interfaces/full-view';

@Component({
  selector: 'app-view-renderer',
  templateUrl: './view-renderer.component.html',
  styleUrls: ['./view-renderer.component.scss']
})
export class ViewRendererComponent implements OnInit {
  @Input() view: FullView;
  @Input() isEditMode: boolean;
  @ViewChild('fieldContainer') fieldContainerRed: ElementRef;

  constructor(
    private viewUtils: ViewUtilsService
  ) {
  }

  ngOnInit(): void {
    console.log('rendering view-init: ', this.view);
  }

  test(): void {
    console.log('rendering view: ', this.view);
  }

  /*
    Utils
   */
  getView(): FullView {
    return this.view || this.viewUtils.getDummyView();
  }

  getFieldWidth(): number {
    return 100;
  }

  getFieldHeight(): number {
    return 100;
  }
}
