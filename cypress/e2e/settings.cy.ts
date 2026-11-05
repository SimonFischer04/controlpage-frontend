describe('Settings page', () => {
  const field = (label: string) => cy.contains('mat-form-field', label);

  beforeEach(() => {
    cy.stubBackend();
  });

  it('initialises sensible defaults on first visit', () => {
    cy.visitApp('/settings');

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
    cy.visitApp('/settings');

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

  it('uses the configured backend host for api requests', () => {
    cy.intercept('GET', 'http://backend.local:42000/api/view/all', {fixture: 'views/view-list.json'}).as('customBackend');

    cy.visitApp('/settings');
    field('Backend Host').find('input').clear().type('http://backend.local:42000');

    cy.get('#topBar').contains('a', 'View').click();
    cy.wait('@customBackend');
    cy.get('app-view-list mat-card').should('have.length', 2);
  });
});
