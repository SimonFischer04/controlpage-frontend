import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-action-page',
  templateUrl: './action-page.component.html',
  styleUrls: ['./action-page.component.scss']
})
export class ActionPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
  }

  isViewSelected(): boolean {
    return this.route.snapshot.queryParams.view;
  }
}
