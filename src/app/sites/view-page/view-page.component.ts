import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FullView} from '../../types/view/full-view';
import {RestService} from '../../services/rest/rest.service';

@Component({
  selector: 'app-action-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss']
})
export class ViewPageComponent implements OnInit {
  selectedView: FullView;

  constructor(
    private route: ActivatedRoute,
    private rest: RestService
  ) {
  }

  ngOnInit(): void {
    this.loadView();
  }

  loadView(): void {
    this.route.queryParamMap.subscribe(
      () => {
        if (this.isViewSelected()) {
          this.rest.getView(this.selectedViewId).subscribe(
            (v: FullView) => {
              console.log('loadView: ', v);
              this.selectedView = v;
            }
          );
        }
      }
    );
  }

  isViewSelected(): boolean {
    return this.selectedViewId > -1;
  }

  isEditMode(): boolean {
    return this.route.snapshot.queryParams.edit && this.route.snapshot.queryParams.edit === 'true';
  }

  /*
    Utils
   */

  private get selectedViewId() {
    return this.route.snapshot.queryParams.view;
  }
}
