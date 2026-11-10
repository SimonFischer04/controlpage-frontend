/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Action = {
    id?: number;
    runPolicy?: Action.runPolicy;
    type: string;
};

export namespace Action {

    export enum runPolicy {
        UNDEFINED = 'UNDEFINED',
        SYNC = 'SYNC',
        ASYNC = 'ASYNC',
    }


}

