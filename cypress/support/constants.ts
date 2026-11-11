// Constants shared by the custom commands and the specs.
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

export const DESKTOP_AUTOMATION_PREFIX = 'http://localhost:42069/api/controlPageInterface';
