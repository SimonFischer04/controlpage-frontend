import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FullView} from '../../types/view/full-view';
import {RestService} from '../../services/rest/rest.service';
import {GlobalEventsService} from "../../services/global-events/global-events.service";

@Component({
  selector: 'app-action-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss']
})
export class ViewPageComponent implements OnInit {
  public selectedView: FullView;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly rest: RestService,
    private readonly events: GlobalEventsService,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(
      () => {
        if (this.isViewSelected()) {
          this.loadView(this.selectedViewId);
        }
      }
    );

    this.events.viewChangeRequest$.subscribe((viewId: number) => {
      if (viewId < 0) {
        this.router.navigate(['/view']);
        return;
      }
      this.loadView(viewId);
    });
  }

  private loadView(viewId: number): void {
    this.rest.getView(viewId).subscribe(
      (v: FullView) => {
        console.log('loadView: ', v);
        this.selectedView = v;
        this.events.changeCurrentView(v);
      }
    );
  }

  public isViewSelected(): boolean {
    return this.selectedViewId > -1;
  }

  public isEditMode(): boolean {
    return this.route.snapshot.queryParams.edit && this.route.snapshot.queryParams.edit === 'true';
  }

  /*
    Utils
   */

  private get selectedViewId() {
    return this.route.snapshot.queryParams.view;
  }
}
