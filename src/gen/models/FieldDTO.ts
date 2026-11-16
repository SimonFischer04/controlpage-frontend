/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DesktopAutomationAction } from './DesktopAutomationAction';
import type { RestAction } from './RestAction';
import type { StyledText } from './StyledText';
import type { ViewAction } from './ViewAction';

export type FieldDTO = {
    id?: number;
    viewId?: number;
    action?: (DesktopAutomationAction | RestAction | ViewAction);
    title?: StyledText;
    description?: string;
    backgroundId?: number;
    rowspan?: number;
    colspan?: number;
};

