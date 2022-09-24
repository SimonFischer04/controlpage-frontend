import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {FullView} from "../../types/view/full-view";
import {DummyUtils} from "../../utils/dummy-utils";

@Injectable({
  providedIn: 'root'
})
export class GlobalEventsService {
  // Observable sources
  private readonly viewChangeEventSource = new Subject<number>(); // Subject<viewId>
  private readonly viewSource = new BehaviorSubject<FullView>(DummyUtils.getDummyView());

  // Observable streams
  private readonly viewChangeRequest$_: Observable<number> = this.viewChangeEventSource.asObservable(); // Observable<viewId>
  private readonly currentView$_: Observable<FullView> = this.viewSource.asObservable();

  constructor() {
  }

  public get viewChangeRequest$(): Observable<number> {
    return this.viewChangeRequest$_;
  }

  public emitViewChangeRequest(viewId: number): void {
    this.viewChangeEventSource.next(viewId);
  }

  public get currentView(): FullView {
    return this.viewSource.getValue();
  }

  public get currentView$(): Observable<FullView> {
    return this.currentView$_;
  }

  public changeCurrentView(view: FullView): void {
    this.viewSource.next(view);
  }
}
