/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Action } from './Action';

export type ViewAction = (Action & {
    viewActionType?: ViewAction.viewActionType;
    viewId?: number;
});

export namespace ViewAction {

    export enum viewActionType {
        UNDEFINED = 'UNDEFINED',
        CLOSE = 'CLOSE',
        SWITCH_TO = 'SWITCH_TO',
        BACK = 'BACK',
    }


}

