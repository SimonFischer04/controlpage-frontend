/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BasicView } from './BasicView';

export type Group = {
    id?: number;
    childGroups?: Array<Group>;
    parentGroup?: Group;
    name?: string;
    views?: Array<BasicView>;
};

