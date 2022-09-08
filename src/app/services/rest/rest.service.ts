import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError, map, Observable, retry, throwError} from 'rxjs';
import {ViewListResponse} from '../../interfaces/rest/view-list-response';
import {FullView} from '../../interfaces/full-view';
import {ControlPageFunctionsResponse} from '../../interfaces/desktop-automation-interface/ControlPageFunctionsResponse';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';

@Injectable({
  providedIn: 'root'
})
export class RestService implements HttpInterceptor {
  // readonly urlPrefix;

  constructor(
    private readonly http: HttpClient,
    private readonly preferencesService: UserPreferencesService
  ) {
    // this.urlPrefix = `${environment.host}/api/`;
    // this.urlPrefix = `${environment.protocol}://${window.location.host.split(":")[0]}:${environment.apiPort}/api/`;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.startsWith('http')) {
      request = request.clone({url: `${this.preferencesService.backendHost}/api/${request.url}`});
    }
    return next.handle(request).pipe(
      // map((event: HttpEvent<any>) => {
      //   console.error("FJKDSFJK")
      //   if (event instanceof HttpResponse) {
      //     console.error("JFKDSJF", event.status !== 200, event);
      //     // event = event.clone({body: this.modifyBody(event.body)});
      //     if (event.status !== 200 && this.preferencesService.shouldDisplayErrorAlert) {
      //       console.error("fgklsdfjgdlkfg")
      //       alert(`HTTP-Error: ${event.statusText}`);
      //     }
      //   }
      //   return event;
      // }),
      catchError((error: HttpErrorResponse) => {
        if (this.preferencesService.shouldDisplayErrorAlert) {
          alert(`REST-Service: ${error.message}`);
        }
        return throwError(() => error);
      })
    );
  }

  /*
    Desktop-Automation Interface
   */

  public getDesktopAutomationFunctions(): Observable<ControlPageFunctionsResponse> {
    return this.http.get<ControlPageFunctionsResponse>(`${this.preferencesService.desktopAutomationPrefix}function`);
  }

  /*
    Backend
   */

  getViewList(): Observable<ViewListResponse> {
    return this.http.get<ViewListResponse>(`view/all`);
  }

  getView(viewId: number): Observable<FullView> {
    return this.http.get<FullView>(`view/${viewId}`);
  }

  saveView(view: FullView): Observable<any> {
    return this.http.post(`view`, view);
  }

  // returns id
  saveFile(file: File): Observable<number> {
    const data = new FormData();
    data.append('imageFile', file, file.name);

    return this.http.post<number>(`image`, data);
  }
}
