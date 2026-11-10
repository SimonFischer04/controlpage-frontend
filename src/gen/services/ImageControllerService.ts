/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

@Injectable({
    providedIn: 'root',
})
export class ImageControllerService {

    constructor(public readonly http: HttpClient) {}

    /**
     * @returns any OK
     * @throws ApiError
     */
    public uploadImage({
        formData,
    }: {
        formData?: {
            imageFile: Blob;
        },
    }): Observable<Record<string, any>> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/image',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public getImage({
        id,
    }: {
        id: number,
    }): Observable<Record<string, any>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/image/{id}',
            path: {
                'id': id,
            },
        });
    }

}
