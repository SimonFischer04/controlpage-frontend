import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {ViewListResponse} from '../../interfaces/rest/view-list-response';
import {FullView} from '../../interfaces/full-view';
import {Field} from '../../interfaces/field';

@Injectable({
  providedIn: 'root'
})
export class RestService implements HttpInterceptor {
  readonly urlPrefix;

  constructor(
    private http: HttpClient,
  ) {
    this.urlPrefix = `${environment.apiUrl}/api/`;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({url: `${this.urlPrefix}${request.url}`});
    return next.handle(request);
  }

  getViewList(): Observable<ViewListResponse> {
    return this.http.get<ViewListResponse>(`view/all`);
  }

  getView(viewId: number): Observable<FullView> {
    return this.http.get<FullView>(`view/${viewId}`);
  }

  saveView(view: FullView): Observable<any> {
    return this.http.post(`view`, view);
  }

  saveField(field: Field): Observable<any> {
    return this.http.post(`field`, field);
  }
}
