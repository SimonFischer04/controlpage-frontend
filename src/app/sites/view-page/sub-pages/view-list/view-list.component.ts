import {Component, OnInit} from '@angular/core';
import {RestService} from '../../../../services/rest/rest.service';
import {Router} from '@angular/router';
import {BasicView} from "../../../../../gen";

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.scss']
})
export class ViewListComponent implements OnInit {
  views: BasicView[];

  constructor(
    private rest: RestService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.rest.getViewList().subscribe(
      data => {
        this.views = data.views;
      },
    );
  }

  protected async onPressed(viewId: number, edit: boolean) {
    await this.router.navigate([], {queryParams: {view: viewId, edit}});
  }

}
