import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FullView} from '../../interfaces/full-view';
import {RestService} from '../../services/rest/rest.service';

@Component({
  selector: 'app-action-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss']
})
export class ViewPageComponent implements OnInit {
  selectedViewChanged: EventEmitter<FullView> = new EventEmitter();
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
        if (this.getSelectedViewId()) {
          this.rest.getView(this.getSelectedViewId()).subscribe(
            (v: FullView) => {
              this.selectedView = v;
              this.selectedViewChanged.emit(v);
            }
          );
        }
      }
    );
  }

  isViewSelected(): boolean {
    return this.getSelectedViewId();
  }

  isEditMode(): boolean {
    return this.route.snapshot.queryParams.edit && this.route.snapshot.queryParams.edit === 'true';
  }

  /*
    Utils
   */

  private getSelectedViewId() {
    return this.route.snapshot.queryParams.view;
  }
}
