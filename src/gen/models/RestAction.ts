/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Action } from './Action';

export type RestAction = (Action & {
    restType?: RestAction.restType;
    url?: string;
    body?: string;
});

export namespace RestAction {

    export enum restType {
        UNDEFINED = 'UNDEFINED',
        GET = 'GET',
        POST = 'POST',
    }


}

