import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {ControlPageFunctionsResponse} from '../../types/desktop-automation-interface/ControlPageFunctionsResponse';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';
import {FullViewDTO, ImageControllerService, ViewControllerService, ViewListResponse} from "../../../gen";
import {SaveImageResponse} from "../../types/save-image-response";

@Injectable({
  providedIn: 'root'
})
export class RestService implements HttpInterceptor {
  constructor(
    private readonly http: HttpClient,
    private readonly preferencesService: UserPreferencesService,
    private readonly viewService: ViewControllerService,
    private readonly imageService: ImageControllerService
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // if (!request.url.startsWith('http')) {
    //   request = request.clone({url: `${this.preferencesService.backendHost}/api/${request.url}`});
    // }
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
    return this.viewService.getViewList();
  }

  getView(viewId: number): Observable<FullViewDTO> {
    return this.viewService.getView({id: viewId});
  }

  // TODO: fix this typing
  saveView(view: FullViewDTO): Observable<Record<string, unknown>> {
    return this.viewService.saveView({requestBody: view});
  }

  // returns id
  // TODO: proper fix typing
  saveFile(file: File): Observable<SaveImageResponse> {
    const data = new FormData();
    data.append('imageFile', file, file.name);

    return this.imageService.uploadImage({formData: {imageFile: file}}) as Observable<SaveImageResponse>;
    // return this.http.post<SaveImageResponse>(`${this.preferencesService.backendHost}/api/image`, data);
  }
}
