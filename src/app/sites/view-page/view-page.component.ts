import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FullView} from '../../interfaces/full-view';
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
    this.route.queryParamMap.subscribe(
      () => {
        if (this.getSelectedViewId()) {
          this.rest.getView(this.getSelectedViewId()).subscribe(
            v => {
              this.selectedView = v;
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
