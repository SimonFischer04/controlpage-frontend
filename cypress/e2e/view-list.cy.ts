describe('View list', () => {
  beforeEach(() => {
    cy.stubBackend();
  });

  it('lists all views returned by the backend', () => {
    cy.visitApp('/view');
    cy.wait('@getViewList');

    cy.get('app-view-list mat-card').should('have.length', 2);
    cy.get('app-view-list mat-card').eq(0).should('contain.text', 'Living Room');
    cy.get('app-view-list mat-card').eq(1).should('contain.text', 'Kitchen');
  });

  it('renders nothing but the list when the backend has no views', () => {
    cy.intercept('GET', '**/api/view/all', {body: {views: []}}).as('emptyViewList');
    cy.visitApp('/view');
    cy.wait('@emptyViewList');

    cy.get('app-view-list').should('exist');
    cy.get('app-view-list mat-card').should('not.exist');
  });

  it('opens a view in action mode', () => {
    cy.visitApp('/view');
    cy.contains('app-view-list mat-card', 'Living Room').contains('button', 'View').click();

    cy.location('hash').should('eq', '#/view?view=1&edit=false');
    cy.wait('@getView1');
    cy.get('app-view-action').should('exist');
    cy.get('app-view-edit').should('not.exist');
    cy.get('app-view-list').should('not.exist');
  });

  it('opens a view in edit mode', () => {
    cy.visitApp('/view');
    cy.contains('app-view-list mat-card', 'Kitchen').contains('button', 'Edit').click();

    cy.location('hash').should('eq', '#/view?view=2&edit=true');
    cy.wait('@getView2');
    cy.get('app-view-edit').should('exist');
    cy.get('app-view-action').should('not.exist');
  });

  describe('backend errors', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/view/all', {statusCode: 500, body: {}}).as('failingViewList');
    });

    it('shows an alert when the backend request fails', () => {
      const alert = cy.stub().as('alert');
      cy.on('window:alert', alert);

      cy.visitApp('/view');
      cy.wait('@failingViewList');

      cy.get('@alert').should('have.been.calledOnce')
        .its('firstCall.args.0').should('match', /^REST-Service: .*500/);
    });

    it('does not show an alert when error alerts are disabled', () => {
      const alert = cy.stub().as('alert');
      cy.on('window:alert', alert);

      cy.visitApp('/view', {shouldDisplayErrorAlert: false});
      cy.wait('@failingViewList');

      cy.get('app-view-list mat-card').should('not.exist');
      cy.get('@alert').should('not.have.been.called');
    });
  });
});
