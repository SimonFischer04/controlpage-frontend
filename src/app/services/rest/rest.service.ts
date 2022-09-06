import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {ViewListResponse} from '../../interfaces/rest/view-list-response';
import {FullView} from '../../interfaces/full-view';
import {ControlPageFunctionsResponse} from '../../interfaces/desktop-automation-interface/ControlPageFunctionsResponse';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';

@Injectable({
  providedIn: 'root'
})
export class RestService implements HttpInterceptor {
  readonly urlPrefix;

  constructor(
    private readonly http: HttpClient,
    private readonly preferencesService: UserPreferencesService
  ) {
    this.urlPrefix = `${environment.host}/api/`;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.startsWith('http')) {
      request = request.clone({url: `${this.urlPrefix}${request.url}`});
    }
    return next.handle(request);
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
