/// <reference types="cypress" />

import {BACKEND_URL, DESKTOP_AUTOMATION_PREFIX, Field, PREFERENCE_KEYS, Preferences, View} from './constants';

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
       * Visits a route of the (hash-routed) app, e.g. `cy.visitApp('/view?view=1')`, as a full page load.
       *
       * The app is configured to use the real backend (`backendHost`), further user preferences can be
       * seeded in localStorage before the app boots.
       */
      visitApp(route: string, preferences?: Preferences): Chainable<Cypress.AUTWindow>;

      /**
       * Reads a user preference straight from localStorage.
       * This is a query: assertions chained to it retry until they pass.
       */
      preference(key: keyof typeof PREFERENCE_KEYS): Chainable<string | null>;

      /**
       * Creates a view with a unique name (`<name> <random suffix>`) in the real backend
       * and yields it as the backend returns it (with the ids the database assigned).
       */
      createView(name: string, fields: Field[][]): Chainable<View>;

      /**
       * Saves changes to an existing view in the real backend, like the "Save View" button does,
       * and yields the view as the backend returns it afterwards.
       */
      saveView(view: View): Chainable<View>;

      /**
       * Reads a view from the real backend.
       */
      fetchView(viewId: number): Chainable<View>;

      /**
       * Uploads a fixture image to the real backend and yields the id of the stored image.
       */
      uploadImage(fixture: string): Chainable<number>;

      /**
       * Stubs the function list of the desktop-automation service (not part of this project).
       *
       * Alias: @getFunctions
       */
      stubDesktopAutomationFunctions(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('visitApp', (route: string, preferences: Preferences = {}) => {
  const path = route.startsWith('/') ? route : `/${route}`;
  const allPreferences: Preferences = {backendHost: BACKEND_URL, ...preferences};

  // If the app is already loaded, a visit only changes the hash: the page does not reload, onBeforeLoad does not
  // run and the app would not boot with the preferences. Leave the app first to force a full page load.
  cy.window({log: false}).then(win => {
    if (win.location.href !== 'about:blank') {
      win.location.href = 'about:blank';
    }
  });
  cy.location('href', {log: false}).should('eq', 'about:blank');

  return cy.visit(`/#${path}`, {
    onBeforeLoad(win) {
      Object.entries(allPreferences).forEach(([key, value]) => {
        win.localStorage.setItem(PREFERENCE_KEYS[key as keyof typeof PREFERENCE_KEYS], toStorageValue(value));
      });
    }
  });
});

Cypress.Commands.addQuery('preference', function (key: keyof typeof PREFERENCE_KEYS) {
  const getWindow = cy.now('window') as () => Cypress.AUTWindow;
  return () => getWindow().localStorage.getItem(PREFERENCE_KEYS[key]);
});

Cypress.Commands.add('createView', (name: string, fields: Field[][]) => {
  const uniqueName = `${name} ${Date.now().toString(36)}${Cypress._.random(1e6).toString(36)}`;
  const body = {
    id: 0,
    name: uniqueName,
    groupId: -1,
    // like the frontend: a negative id tells the backend to create the field
    fields: fields.map(row => row.map(field => ({id: -1, rowspan: 1, colspan: 1, ...field})))
  };

  cy.request('POST', `${BACKEND_URL}/api/view`, body);

  // the backend does not return the id of the created view: find it by its unique name
  return cy.request<{ views: { id: number, name: string }[] }>(`${BACKEND_URL}/api/view/all`).then(({body: {views}}) => {
    const created = views.filter(view => view.name === uniqueName);
    expect(created, `view "${uniqueName}" in the backend`).to.have.length(1);
    return cy.fetchView(created[0].id);
  });
});

Cypress.Commands.add('saveView', (view: View) => {
  cy.request('POST', `${BACKEND_URL}/api/view`, {groupId: -1, ...view});
  return cy.fetchView(view.id);
});

Cypress.Commands.add('fetchView', (viewId: number) => {
  return cy.request<View>(`${BACKEND_URL}/api/view/${viewId}`).its('body');
});

Cypress.Commands.add('uploadImage', (fixture: string) => {
  return cy.fixture(fixture, 'base64').then((base64: string) => {
    const formData = new FormData();
    formData.append('imageFile', Cypress.Blob.base64StringToBlob(base64, 'image/png'), fixture.split('/').pop());

    return cy.request({method: 'POST', url: `${BACKEND_URL}/api/image`, body: formData}).then(response => {
      // for a FormData request the response body is not parsed
      const {imageId} = JSON.parse(new TextDecoder().decode(response.body));
      expect(imageId, 'id of the uploaded image').to.be.greaterThan(0);
      return imageId as number;
    });
  });
});

Cypress.Commands.add('stubDesktopAutomationFunctions', () => {
  cy.intercept('GET', `${DESKTOP_AUTOMATION_PREFIX}/function`, {fixture: 'desktop-automation-functions.json'}).as('getFunctions');
});
