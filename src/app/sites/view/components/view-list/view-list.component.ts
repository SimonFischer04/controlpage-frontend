import {Component, OnInit} from '@angular/core';
import {RestService} from '../../../../services/rest/rest.service';
import {BasicView} from '../../../../interfaces/basic-view';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.scss']
})
export class ViewListComponent implements OnInit {
  views: BasicView[];

  constructor(
    private rest: RestService
  ) {
  }

  ngOnInit(): void {
    this.rest.getViewList().subscribe(
      data => {
        this.views = data.views;
      },
    );
  }

}
