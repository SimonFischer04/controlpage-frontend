/// <reference types="cypress" />

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

function toStorageValue(value: unknown): string {
  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }
  return String(value);
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Stubs every backend / desktop-automation endpoint the frontend talks to with fixtures.
       *
       * Aliases: @getViewList, @getView1, @getView2, @getImage, @saveView, @uploadImage, @getFunctions
       */
      stubBackend(): Chainable<void>;

      /**
       * Visits a route of the (hash-routed) app, e.g. `cy.visitApp('/view?view=1')`.
       * Optionally seeds user preferences in localStorage before the app boots.
       */
      visitApp(route: string, preferences?: Preferences): Chainable<Cypress.AUTWindow>;

      /**
       * Reads a user preference straight from localStorage.
       */
      preference(key: keyof typeof PREFERENCE_KEYS): Chainable<string | null>;
    }
  }
}

Cypress.Commands.add('stubBackend', () => {
  cy.intercept('GET', '**/api/view/all', {fixture: 'views/view-list.json'}).as('getViewList');
  cy.intercept('GET', '**/api/view/1', {fixture: 'views/view-1.json'}).as('getView1');
  cy.intercept('GET', '**/api/view/2', {fixture: 'views/view-2.json'}).as('getView2');
  cy.intercept('POST', '**/api/view', {statusCode: 200}).as('saveView');

  cy.intercept('GET', '**/api/image/*', {fixture: 'images/background.png', headers: {'content-type': 'image/png'}}).as('getImage');
  cy.intercept('POST', '**/api/image', {statusCode: 200, body: {imageId: 42}}).as('uploadImage');

  cy.intercept('GET', `${DESKTOP_AUTOMATION_PREFIX}/function`, {fixture: 'desktop-automation-functions.json'}).as('getFunctions');
});

Cypress.Commands.add('visitApp', (route: string, preferences: Preferences = {}) => {
  const path = route.startsWith('/') ? route : `/${route}`;
  return cy.visit(`/#${path}`, {
    onBeforeLoad(win) {
      Object.entries(preferences).forEach(([key, value]) => {
        win.localStorage.setItem(PREFERENCE_KEYS[key as keyof typeof PREFERENCE_KEYS], toStorageValue(value));
      });
    }
  });
});

Cypress.Commands.add('preference', (key: keyof typeof PREFERENCE_KEYS) => {
  return cy.window().then(win => win.localStorage.getItem(PREFERENCE_KEYS[key]));
});
