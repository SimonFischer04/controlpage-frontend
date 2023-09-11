import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {DummyUtils} from "../../utils/dummy-utils";
import {FullViewDTO} from "../../../gen";

@Injectable({
  providedIn: 'root'
})
export class GlobalEventsService {
  // Observable sources
  private readonly viewChangeEventSource = new Subject<number>(); // Subject<viewId>
  private readonly viewSource = new BehaviorSubject<FullViewDTO>(DummyUtils.getDummyView());

  // Observable streams
  private readonly viewChangeRequest$_: Observable<number> = this.viewChangeEventSource.asObservable(); // Observable<viewId>

  public get viewChangeRequest$(): Observable<number> {
    return this.viewChangeRequest$_;
  }

  public emitViewChangeRequest(viewId: number): void {
    this.viewChangeEventSource.next(viewId);
  }

  public get currentView(): FullViewDTO {
    return this.viewSource.getValue();
  }

  public changeCurrentView(view: FullViewDTO): void {
    this.viewSource.next(view);
  }
}
