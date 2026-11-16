import {title} from '../support/constants';

describe('Navigation', () => {
  it('redirects the root url to the home page', () => {
    cy.visit('/');
    cy.location('hash').should('eq', '#/home');
    cy.contains('home-page works!').should('be.visible');
  });

  it('redirects unknown routes to the home page', () => {
    cy.visitApp('/does-not-exist');
    cy.location('hash').should('eq', '#/home');
  });

  it('renders the top and bottom bar on every page', () => {
    ['/home', '/view', '/settings'].forEach(route => {
      cy.visitApp(route);
      cy.get('#topBar').should('be.visible');
      cy.get('#bottomBar').should('exist');
    });
  });

  it('navigates between the pages using the top bar', () => {
    cy.createView('Navigation', [[{title: title('A field')}]]).then(view => {
      cy.visitApp('/home');

      cy.get('#topBar').contains('a', 'View').click();
      cy.location('hash').should('eq', '#/view');
      cy.contains('app-view-list mat-card', view.name).should('be.visible');

      cy.get('#topBar').contains('a', 'Settings').click();
      cy.location('hash').should('eq', '#/settings');
      cy.get('app-settings-page').contains('Settings').should('be.visible');

      cy.get('#topBar').contains('a', 'Home').click();
      cy.location('hash').should('eq', '#/home');
      cy.contains('home-page works!').should('be.visible');
    });
  });
});
