import {title, UNREACHABLE_BACKEND_URL, View} from '../support/constants';

describe('View list', () => {
  let livingRoom: View;
  let kitchen: View;

  before(() => {
    cy.createView('Living Room', [[{title: title('Lights')}]]).then(view => livingRoom = view);
    cy.createView('Kitchen', [[{title: title('Oven')}]]).then(view => kitchen = view);
  });

  it('lists the views stored in the backend', () => {
    cy.visitApp('/view');

    [livingRoom, kitchen].forEach(view => {
      cy.contains('app-view-list mat-card', view.name).should('be.visible').within(() => {
        cy.contains('button', 'View').should('be.visible');
        cy.contains('button', 'Edit').should('be.visible');
      });
    });
  });

  it('opens a view in action mode', () => {
    cy.visitApp('/view');
    cy.contains('app-view-list mat-card', livingRoom.name).contains('button', 'View').click();

    cy.location('hash').should('eq', `#/view?view=${livingRoom.id}&edit=false`);
    cy.get('app-view-action').should('contain.text', livingRoom.name).and('contain.text', 'Lights');
    cy.get('app-view-edit').should('not.exist');
    cy.get('app-view-list').should('not.exist');
  });

  it('opens a view in edit mode', () => {
    cy.visitApp('/view');
    cy.contains('app-view-list mat-card', kitchen.name).contains('button', 'Edit').click();

    cy.location('hash').should('eq', `#/view?view=${kitchen.id}&edit=true`);
    cy.get('app-view-edit').should('contain.text', kitchen.name).and('contain.text', 'Oven');
    cy.get('app-view-action').should('not.exist');
  });

  describe('backend errors', () => {
    it('shows an alert when the backend is not reachable', () => {
      const alert = cy.stub().as('alert');
      cy.on('window:alert', alert);

      cy.visitApp('/view', {backendHost: UNREACHABLE_BACKEND_URL});

      cy.get('@alert').should('have.been.calledOnce')
        .its('firstCall.args.0').should('match', /^REST-Service: .*\/api\/view\/all/);
      cy.get('app-view-list mat-card').should('not.exist');
    });

    it('does not show an alert when error alerts are disabled', () => {
      const alert = cy.stub().as('alert');
      cy.on('window:alert', alert);
      cy.intercept(`${UNREACHABLE_BACKEND_URL}/**`).as('failingRequest');

      cy.visitApp('/view', {backendHost: UNREACHABLE_BACKEND_URL, shouldDisplayErrorAlert: false});

      cy.wait('@failingRequest').its('error').should('exist');
      cy.get('app-view-list mat-card').should('not.exist');
      cy.get('@alert').should('not.have.been.called');
    });

    it('shows an alert when the backend rejects the request for an unknown view', () => {
      const alert = cy.stub().as('alert');
      cy.on('window:alert', alert);

      cy.visitApp('/view?view=2147483647&edit=false');

      cy.get('@alert').should('have.been.calledOnce')
        .its('firstCall.args.0').should('match', /^REST-Service: .*\/api\/view\/2147483647: 400/);
    });
  });
});
