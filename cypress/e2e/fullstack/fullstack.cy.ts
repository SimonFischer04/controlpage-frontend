/**
 * Full-stack tests: run against a real controlpage-backend instead of stubbed responses.
 *
 * They are skipped unless the `backendUrl` Cypress env variable points to a running backend, e.g.:
 *   CYPRESS_backendUrl=http://localhost:42000 npm run e2e
 *
 * Every test creates its own uniquely named view, so they can run against a backend that already contains data.
 */
const backendUrl: string = (Cypress.env('backendUrl') || '').replace(/\/$/, '');

interface BasicView {
  id: number;
  name: string;
}

(backendUrl ? describe : describe.skip)('Full stack (real backend)', () => {
  let viewName: string;
  let viewId: number;

  const createView = (name: string) => {
    cy.request('POST', `${backendUrl}/api/view`, {
      id: 0,
      name,
      groupId: -1,
      fields: [[
        {
          id: -1, colspan: 1, rowspan: 1,
          title: {id: 0, text: 'First', color: '#ffffff', horizontalAlignment: 'CENTER', verticalAlignment: 'CENTER'},
          action: {id: 0, type: 'REST', runPolicy: 'ASYNC', restType: 'POST', url: 'http://rest-target.test/first', body: '1'}
        },
        {
          id: -1, colspan: 1, rowspan: 1,
          title: {id: 0, text: 'Second', color: '#ffffff', horizontalAlignment: 'CENTER', verticalAlignment: 'CENTER'}
        }
      ]]
    });

    return cy.request<{ views: BasicView[] }>(`${backendUrl}/api/view/all`).then(({body}) => {
      const created = body.views.filter(view => view.name === name);
      expect(created, `view "${name}" in backend`).to.have.length(1);
      return created[0].id;
    });
  };

  const fetchView = () => cy.request(`${backendUrl}/api/view/${viewId}`).its('body');

  beforeEach(() => {
    viewName = `e2e-${Date.now()}-${Cypress._.random(1e6)}`;
    createView(viewName).then(id => viewId = id);
  });

  it('lists the view and opens it in action mode', () => {
    cy.intercept('POST', 'http://rest-target.test/first', {statusCode: 200}).as('restAction');

    cy.visitApp('/view', {backendHost: backendUrl});
    cy.contains('app-view-list mat-card', viewName).contains('button', 'View').click();

    cy.location('hash').should('eq', `#/view?view=${viewId}&edit=false`);
    cy.get('#viewRendererContainer').should('contain.text', viewName);
    cy.get('#viewRendererWrapper app-action-field-render').should('have.length', 2);

    cy.contains('#viewRendererWrapper app-action-field-render', 'First').click();
    cy.wait('@restAction').its('request.body').should('eq', '1');
  });

  it('persists edited fields and new rows in the backend', () => {
    cy.intercept('POST', `${backendUrl}/api/view`).as('saveView');

    cy.visitApp(`/view?view=${viewId}&edit=true`, {backendHost: backendUrl});
    cy.contains('#editViewDisplay app-edit-field-render', 'Second').click();
    cy.get('#fieldEditSection').contains('mat-form-field', 'Text').find('input').clear().type('Renamed');
    cy.get('#editViewSection').contains('button', 'Add Row').click();
    cy.get('#editViewSection').contains('button', 'Save View').click();

    cy.wait('@saveView').its('response.statusCode').should('eq', 200);

    // the page reloads the view from the backend after saving
    cy.contains('#editViewDisplay app-edit-field-render', 'Renamed').should('exist');
    cy.get('#editViewDisplay app-edit-field-render').should('have.length', 4);
    cy.contains('unsaved-view-changes!!!').should('not.exist');

    fetchView().then(view => {
      expect(view.name).to.eq(viewName);
      expect(view.fields).to.have.length(2);
      expect(view.fields[0][1].title.text).to.eq('Renamed');
      expect(view.fields[0][0].action).to.include({type: 'REST', url: 'http://rest-target.test/first'});
      view.fields[1].forEach((field: { id: number }) => expect(field.id).to.be.greaterThan(0));
    });
  });

  it('uploads a background image and renders it from the backend', () => {
    // NOTE: don't cy.intercept() the (binary) multipart upload here, even as passthrough:
    // Cypress re-encodes intercepted request bodies, which corrupts the uploaded image.
    cy.intercept('POST', `${backendUrl}/api/view`).as('saveView');

    cy.visitApp(`/view?view=${viewId}&edit=true`, {backendHost: backendUrl});
    cy.contains('#editViewDisplay app-edit-field-render', 'First').click();
    cy.get('#fieldEditSection input[type="file"]').selectFile('cypress/fixtures/images/background.png');
    cy.get('#editViewSection').contains('button', 'Save View').click();

    cy.wait('@saveView').its('response.statusCode').should('eq', 200);

    fetchView().its('fields.0.0.backgroundId').should('be.greaterThan', 0).then(imageId => {
      cy.request({url: `${backendUrl}/api/image/${imageId}`, encoding: 'base64'}).then(response => {
        expect(response.headers['content-type']).to.eq('image/png');
        cy.fixture('images/background.png', 'base64').should('eq', response.body);
      });

      cy.visitApp(`/view?view=${viewId}&edit=false`, {backendHost: backendUrl});
      cy.get(`#viewRendererWrapper img[alt="background image with id: ${imageId}"]`)
        .should('be.visible')
        .and($img => expect(($img[0] as HTMLImageElement).naturalWidth).to.eq(16));
    });
  });
});
