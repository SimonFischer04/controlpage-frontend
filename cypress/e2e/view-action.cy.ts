import {DESKTOP_AUTOMATION_PREFIX} from '../support/constants';

describe('View page - action mode', () => {
  const tile = (title: string) => cy.contains('#viewRendererWrapper app-action-field-render', title);

  beforeEach(() => {
    cy.stubBackend();
  });

  describe('rendering', () => {
    beforeEach(() => {
      cy.visitApp('/view?view=1&edit=false');
      cy.wait('@getView1');
    });

    it('renders the view name and all fields in a grid', () => {
      cy.get('#viewRendererContainer').should('contain.text', 'Living Room');
      cy.get('#viewRendererContainer .field-row').should('have.length', 2);
      cy.get('#viewRendererContainer .field-row').each(row => {
        cy.wrap(row).find('app-action-field-render').should('have.length', 2);
      });

      ['Lights', 'Go to Kitchen', 'Play/Pause'].forEach(title => tile(title).should('be.visible'));
    });

    it('applies the title color and alignment of each field', () => {
      tile('Lights').find('#actionTitleRenderContainer')
        .should('have.css', 'color', 'rgb(255, 255, 255)')
        .and('have.css', 'justify-content', 'center')
        .and('have.css', 'align-items', 'center');

      tile('Go to Kitchen').find('#actionTitleRenderContainer')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'justify-content', 'start')
        .and('have.css', 'align-items', 'start');

      tile('Play/Pause').find('#actionTitleRenderContainer')
        .should('have.css', 'color', 'rgb(0, 255, 0)')
        .and('have.css', 'justify-content', 'end')
        .and('have.css', 'align-items', 'end');
    });

    it('loads background images from the backend', () => {
      cy.wait('@getImage').its('request.url').should('match', /\/api\/image\/7$/);
      cy.get('#viewRendererWrapper img[alt="background image with id: 7"]')
        .should('be.visible')
        .and($img => expect(($img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0));
    });

    it('renders square fields by default', () => {
      cy.get('#viewRendererWrapper .field').first().then($field => {
        const {width, height} = $field[0].getBoundingClientRect();
        expect(width).to.be.greaterThan(0);
        expect(width).to.be.closeTo(height, 1);
      });
    });

    it('requests fullscreen for the view renderer', () => {
      cy.document().then(doc => {
        Object.defineProperty(doc, 'fullscreenEnabled', {configurable: true, get: () => true});
      });
      cy.get('#viewRendererWrapper').then($wrapper => {
        cy.stub($wrapper[0], 'requestFullscreen').as('requestFullscreen').resolves();
      });

      cy.get('#fullscreenButton').click();
      cy.get('@requestFullscreen').should('have.been.calledOnce');
    });
  });

  describe('user preferences', () => {
    it('renders stretched fields with the RECTANGLE field style', () => {
      cy.visitApp('/view?view=1&edit=false', {fieldStyle: 'RECTANGLE'});
      cy.wait('@getView1');

      cy.get('#viewRendererWrapper .field').first().then($field => {
        const {width, height} = $field[0].getBoundingClientRect();
        expect(width).to.be.greaterThan(0);
        expect(height).to.be.greaterThan(0);
        expect(Math.abs(width - height)).to.be.greaterThan(1);
      });
    });

    it('uses the configured space between fields', () => {
      cy.visitApp('/view?view=1&edit=false', {spaceBetweenFields: 25});
      cy.wait('@getView1');

      cy.get('#viewRendererWrapper .field-row').first().find('.padded-field > div:not(.field)')
        .should('have.length', 1)
        .invoke('outerWidth').should('eq', 25);
    });
  });

  describe('actions', () => {
    it('executes REST actions', () => {
      cy.intercept('POST', 'http://rest-target.test/lights', {statusCode: 200}).as('restAction');

      cy.visitApp('/view?view=1&edit=false');
      tile('Lights').click();

      cy.wait('@restAction').its('request.body').should('eq', 'on');
    });

    it('shows an alert when a REST action fails', () => {
      cy.intercept('POST', 'http://rest-target.test/lights', {forceNetworkError: true}).as('restAction');
      const alert = cy.stub().as('alert');
      cy.on('window:alert', alert);

      cy.visitApp('/view?view=1&edit=false');
      tile('Lights').click();

      cy.wait('@restAction');
      cy.get('@alert').should('have.been.calledOnce')
        .its('firstCall.args.0').should('contain', 'RestAction-Error');
    });

    it('executes desktop automation actions on the default host', () => {
      cy.intercept('POST', `${DESKTOP_AUTOMATION_PREFIX}/function/playPause`, {statusCode: 200, body: 'ok'}).as('desktopAutomation');

      cy.visitApp('/view?view=1&edit=false');
      tile('Play/Pause').click();

      cy.wait('@desktopAutomation');
    });

    it('executes desktop automation actions on the configured host', () => {
      cy.intercept('POST', 'http://10.0.0.5:42069/api/controlPageInterface/function/playPause', {statusCode: 200, body: 'ok'})
        .as('desktopAutomation');

      cy.visitApp('/view?view=1&edit=false', {desktopAutomationHost: '10.0.0.5'});
      tile('Play/Pause').click();

      cy.wait('@desktopAutomation');
    });

    it('switches to another view and back again', () => {
      cy.visitApp('/view?view=1&edit=false');
      cy.wait('@getView1');

      tile('Go to Kitchen').click();
      cy.wait('@getView2');
      cy.get('#viewRendererContainer').should('contain.text', 'Kitchen');
      tile('Back').should('be.visible');
      tile('Lights').should('not.exist');

      tile('Back').click();
      cy.wait('@getView1');
      tile('Lights').should('be.visible');
      tile('Back').should('not.exist');
    });

    it('closes the view and returns to the view list', () => {
      cy.visitApp('/view?view=2&edit=false');
      cy.wait('@getView2');

      tile('Close').click();

      cy.location('hash').should('eq', '#/view');
      cy.get('app-view-list mat-card').should('have.length', 2);
      cy.get('app-view-action').should('not.exist');
    });
  });
});
