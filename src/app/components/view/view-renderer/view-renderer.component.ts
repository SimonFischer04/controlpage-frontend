import {Component, Input, OnInit} from '@angular/core';
import {ViewUtilsService} from '../../../services/view-utils/view-utils.service';
import {FullView} from '../../../interfaces/full-view';

@Component({
  selector: 'app-view-renderer',
  templateUrl: './view-renderer.component.html',
  styleUrls: ['./view-renderer.component.scss']
})
export class ViewRendererComponent implements OnInit {
  @Input() view: FullView;

  constructor(
    private viewUtils: ViewUtilsService
  ) {
  }

  ngOnInit(): void {
  }

  getView(): FullView {
    return this.view || this.viewUtils.getDummyView();
  }

  test(): void {
    console.log('rendering view: ', this.view);
  }
}
