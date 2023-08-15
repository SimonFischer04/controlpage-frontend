import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {ViewListResponse} from '../../types/rest/view-list-response';
import {FullView} from '../../types/view/full-view';
import {ControlPageFunctionsResponse} from '../../types/desktop-automation-interface/ControlPageFunctionsResponse';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';

@Injectable({
  providedIn: 'root'
})
export class RestService implements HttpInterceptor {
  constructor(
    private readonly http: HttpClient,
    private readonly preferencesService: UserPreferencesService
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith('http')) {
      request = request.clone({url: `${this.preferencesService.backendHost}/api/${request.url}`});
    }
    return next.handle(request).pipe(
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

  // TODO: fix this (combined with client-generation)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
