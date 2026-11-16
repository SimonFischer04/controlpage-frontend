/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

import type { FullViewDTO } from '../models/FullViewDTO';
import type { ViewListResponse } from '../models/ViewListResponse';

import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

@Injectable({
    providedIn: 'root',
})
export class ViewControllerService {

    constructor(public readonly http: HttpClient) {}

    /**
     * @returns any OK
     * @throws ApiError
     */
    public saveView({
        requestBody,
    }: {
        requestBody: FullViewDTO,
    }): Observable<Record<string, any>> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/view',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns FullViewDTO OK
     * @throws ApiError
     */
    public getView({
        id,
    }: {
        id: number,
    }): Observable<FullViewDTO> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/view/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns ViewListResponse OK
     * @throws ApiError
     */
    public getViewList(): Observable<ViewListResponse> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/view/all',
        });
    }

}
