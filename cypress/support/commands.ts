/// <reference types="cypress" />

import {DESKTOP_AUTOMATION_PREFIX, PREFERENCE_KEYS, Preferences} from './constants';

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
       * Stubs the backend / desktop-automation endpoints the frontend talks to with fixtures.
       *
       * Any other request to the backend api, the desktop-automation service or the REST-action target of the
       * fixtures fails the test instead of reaching a real service: add a `cy.intercept()` for it after this command.
       *
       * Aliases: @getViewList, @getView1, @getView2, @getImage, @saveView, @uploadImage, @getFunctions
       */
      stubBackend(): Chainable<void>;

      /**
       * Visits a route of the (hash-routed) app, e.g. `cy.visitApp('/view?view=1')`.
       * Optionally seeds user preferences in localStorage before the app boots
       * (this always is a full page load, even if the app is already loaded).
       */
      visitApp(route: string, preferences?: Preferences): Chainable<Cypress.AUTWindow>;

      /**
       * Reads a user preference straight from localStorage.
       * This is a query: assertions chained to it retry until they pass.
       */
      preference(key: keyof typeof PREFERENCE_KEYS): Chainable<string | null>;
    }
  }
}

/** Hosts that must never be reached for real from a stubbed test. */
const DESKTOP_AUTOMATION_PORT = /^https?:\/\/[^/]+:42069\//;
const REST_ACTION_TARGET = 'http://rest-target.test/**';

Cypress.Commands.add('stubBackend', () => {
  // Safety net: registered first, so the stubs below and every intercept a test defines later take precedence.
  const failUnstubbed = (req: {method: string, url: string}): never => {
    throw new Error(`Unstubbed request: ${req.method} ${req.url} - add a cy.intercept() for it after cy.stubBackend()`);
  };
  cy.intercept('**/api/**', failUnstubbed);
  cy.intercept({url: DESKTOP_AUTOMATION_PORT}, failUnstubbed);
  cy.intercept(REST_ACTION_TARGET, failUnstubbed);

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
  const seedPreferences = (win: Cypress.AUTWindow) => {
    Object.entries(preferences).forEach(([key, value]) => {
      win.localStorage.setItem(PREFERENCE_KEYS[key as keyof typeof PREFERENCE_KEYS], toStorageValue(value));
    });
  };

  if (Object.keys(preferences).length > 0) {
    // If the app is already loaded, a visit only changes the hash: the page does not reload, onBeforeLoad does not
    // run and the app would not boot with the preferences. Leave the app first to force a full page load.
    cy.window({log: false}).then(win => {
      if (win.location.href !== 'about:blank') {
        win.location.href = 'about:blank';
      }
    });
    cy.location('href', {log: false}).should('eq', 'about:blank');
  }

  return cy.visit(`/#${path}`, {onBeforeLoad: seedPreferences});
});

Cypress.Commands.addQuery('preference', function (key: keyof typeof PREFERENCE_KEYS) {
  const getWindow = cy.now('window') as () => Cypress.AUTWindow;
  return () => getWindow().localStorage.getItem(PREFERENCE_KEYS[key]);
});
