// Loaded automatically before every spec file.
import './commands';
import {BACKEND_URL} from './constants';

before(`the e2e environment (backend + database) must be running at ${BACKEND_URL}: npm run e2e:env:up`, () => {
  cy.request({url: `${BACKEND_URL}/api/view/all`, timeout: 10000});
});

beforeEach(() => {
  // The desktop-automation service is not part of the environment. A test that talks to it has to stub it,
  // any other request fails the test instead of triggering something on a developer's desktop.
  // (registered first, so the intercepts of a test take precedence)
  cy.intercept({url: /^https?:\/\/[^/]+:42069\//}, req => {
    throw new Error(`Unstubbed request to the desktop-automation service: ${req.method} ${req.url}`);
  });

  // fonts are loaded from a CDN: don't depend on it being reachable
  cy.intercept('https://fonts.googleapis.com/**', {statusCode: 200, body: '', headers: {'content-type': 'text/css'}});
  cy.intercept('https://fonts.gstatic.com/**', {statusCode: 204});
});
