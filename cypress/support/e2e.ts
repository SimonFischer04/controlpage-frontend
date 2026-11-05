// Loaded automatically before every spec file.
import './commands';

beforeEach(() => {
  // keep the tests hermetic: don't depend on Google Fonts being reachable
  cy.intercept('https://fonts.googleapis.com/**', {statusCode: 200, body: '', headers: {'content-type': 'text/css'}});
  cy.intercept('https://fonts.gstatic.com/**', {statusCode: 204});
});
