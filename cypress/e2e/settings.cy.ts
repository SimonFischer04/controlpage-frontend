import {BACKEND_URL, title} from '../support/constants';

describe('Settings page', () => {
  const field = (label: string) => cy.contains('mat-form-field', label);

  // these tests are about the settings themselves: visit the app without any seeded preference
  const visitSettingsAsNewUser = () => cy.visit('/#/settings');

  it('initialises sensible defaults on first visit', () => {
    visitSettingsAsNewUser();

    field('Desktop Automation Host').find('input').should('have.value', 'localhost');
    field('Backend Host').find('input').should('have.value', Cypress.config('baseUrl').replace(/\/$/, ''));
    field('Field-Style').find('mat-select').should('contain.text', 'SQUARE');
    field('Space Between Fields').find('input').should('have.value', '10');
    cy.contains('mat-checkbox', 'Should show alert').find('input').should('be.checked');
    cy.contains('mat-checkbox', 'Field keybindings enabled').find('input').should('be.checked');

    cy.preference('desktopAutomationHost').should('eq', 'localhost');
    cy.preference('fieldStyle').should('eq', 'SQUARE');
    cy.preference('spaceBetweenFields').should('eq', '10');
    cy.preference('shouldDisplayErrorAlert').should('eq', 'TRUE');
    cy.preference('fieldKeybindingEnabled').should('eq', 'TRUE');
  });

  it('persists changed settings in localStorage and restores them after a reload', () => {
    visitSettingsAsNewUser();

    field('Desktop Automation Host').find('input').clear().type('192.168.0.42');
    field('Backend Host').find('input').clear().type('http://backend.local:42000');
    field('Space Between Fields').find('input').clear().type('25');

    field('Field-Style').find('mat-select').click();
    cy.contains('mat-option', 'RECTANGLE').click();

    cy.contains('mat-checkbox', 'Should show alert').click();
    cy.contains('mat-checkbox', 'Field keybindings enabled').click();

    cy.preference('desktopAutomationHost').should('eq', '192.168.0.42');
    cy.preference('backendHost').should('eq', 'http://backend.local:42000');
    cy.preference('spaceBetweenFields').should('eq', '25');
    cy.preference('fieldStyle').should('eq', 'RECTANGLE');
    cy.preference('shouldDisplayErrorAlert').should('eq', 'FALSE');
    cy.preference('fieldKeybindingEnabled').should('eq', 'FALSE');

    cy.reload();

    field('Desktop Automation Host').find('input').should('have.value', '192.168.0.42');
    field('Backend Host').find('input').should('have.value', 'http://backend.local:42000');
    field('Space Between Fields').find('input').should('have.value', '25');
    field('Field-Style').find('mat-select').should('contain.text', 'RECTANGLE');
    cy.contains('mat-checkbox', 'Should show alert').find('input').should('not.be.checked');
    cy.contains('mat-checkbox', 'Field keybindings enabled').find('input').should('not.be.checked');
  });

  it('connects to the backend entered as backend host', () => {
    cy.createView('Settings', [[{title: title('A field')}]]).then(view => {
      visitSettingsAsNewUser();
      field('Backend Host').find('input').clear().type(BACKEND_URL);

      cy.get('#topBar').contains('a', 'View').click();
      cy.contains('app-view-list mat-card', view.name).should('be.visible');

      // and still does after a reload
      cy.reload();
      cy.contains('app-view-list mat-card', view.name).should('be.visible');
    });
  });
});
