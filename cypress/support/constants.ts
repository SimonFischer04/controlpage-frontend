// Constants and types shared by the custom commands and the specs.
// Keep this module free of side effects: specs import it, so it is loaded more than once
// (unlike commands.ts, which registers the commands and must only be loaded by the support file).

/**
 * The localStorage keys used by the app's UserPreferencesService.
 */
export const PREFERENCE_KEYS = {
  spaceBetweenFields: 'SPACE_BETWEEN_FIELDS',
  fieldStyle: 'FIELD_STYLE',
  desktopAutomationHost: 'DESKTOP_AUTOMATION_HOST',
  shouldDisplayErrorAlert: 'ERROR_ALERT',
  backendHost: 'BACKEND_HOST',
  fieldKeybindingEnabled: 'FIELD_KEYBINDINGS_ENABLED',
} as const;

export type Preferences = Partial<{
  spaceBetweenFields: number;
  fieldStyle: 'SQUARE' | 'RECTANGLE';
  desktopAutomationHost: string;
  shouldDisplayErrorAlert: boolean;
  backendHost: string;
  fieldKeybindingEnabled: boolean;
}>;

/** Base url of the real backend the tests run against (see docker-compose.e2e.yml). */
export const BACKEND_URL: string = String(Cypress.env('backendUrl')).replace(/\/$/, '');

/** A backend host nothing listens on, to test how the app deals with an unreachable backend. */
export const UNREACHABLE_BACKEND_URL = 'http://localhost:42999';

/**
 * The desktop-automation service runs on the user's desktop and is not part of this project.
 * It is the only thing the tests replace with stubs.
 */
export const DESKTOP_AUTOMATION_PREFIX = 'http://localhost:42069/api/controlPageInterface';

/*
  The backend's data model (only what the tests need)
 */

export interface Title {
  id?: number;
  text: string;
  color?: string;
  horizontalAlignment?: 'LEFT' | 'CENTER' | 'RIGHT';
  verticalAlignment?: 'TOP' | 'CENTER' | 'BOTTOM';
}

export type Action = { id?: number, runPolicy?: 'SYNC' | 'ASYNC' } & (
  { type: 'REST', restType: 'GET' | 'POST', url: string, body?: string } |
  { type: 'VIEW', viewActionType: 'SWITCH_TO' | 'BACK' | 'CLOSE', viewId?: number } |
  { type: 'DESKTOP_AUTOMATION', functionName: string }
);

export interface Field {
  id?: number;
  title?: Title | null;
  action?: Action | null;
  description?: string | null;
  backgroundId?: number;
  rowspan?: number;
  colspan?: number;
}

/** A view as the backend returns it: everything has an id. */
export interface View {
  id: number;
  name: string;
  fields: (Field & { id: number })[][];
}

/** A title with the defaults the frontend uses for new titles (white, centered). */
export function title(text: string, overrides: Partial<Title> = {}): Title {
  return {id: 0, text, color: '#ffffff', horizontalAlignment: 'CENTER', verticalAlignment: 'CENTER', ...overrides};
}
