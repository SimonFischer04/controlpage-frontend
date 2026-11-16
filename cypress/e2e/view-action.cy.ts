import {BACKEND_URL, DESKTOP_AUTOMATION_PREFIX, title, UNREACHABLE_BACKEND_URL, View} from '../support/constants';

describe('View page - action mode', () => {
  const tile = (text: string) => cy.contains('#viewRendererWrapper app-action-field-render', text);

  let kitchen: View;
  let livingRoom: View;
  let backgroundImageId: number;

  // The tests of this spec only use the views, they don't change them: create them once.
  before(() => {
    cy.uploadImage('images/background.png').then(imageId => backgroundImageId = imageId);

    cy.createView('Kitchen', [[
      {title: title('Back'), action: {type: 'VIEW', runPolicy: 'ASYNC', viewActionType: 'BACK'}},
      {title: title('Close'), action: {type: 'VIEW', runPolicy: 'ASYNC', viewActionType: 'CLOSE'}},
    ]]).then(view => {
      kitchen = view;

      cy.createView('Living Room', [
        [
          {
            title: title('Lights'),
            // a REST action against a server that really exists: the backend itself
            action: {type: 'REST', runPolicy: 'ASYNC', restType: 'GET', url: `${BACKEND_URL}/api/view/${kitchen.id}`}
          },
          {
            title: title('Go to Kitchen', {color: '#ff0000', horizontalAlignment: 'LEFT', verticalAlignment: 'TOP'}),
            action: {type: 'VIEW', runPolicy: 'ASYNC', viewActionType: 'SWITCH_TO', viewId: kitchen.id}
          },
        ],
        [
          {
            title: title('Play/Pause', {color: '#00ff00', horizontalAlignment: 'RIGHT', verticalAlignment: 'BOTTOM'}),
            action: {type: 'DESKTOP_AUTOMATION', runPolicy: 'ASYNC', functionName: 'playPause'}
          },
          {
            title: title('Broken'),
            action: {type: 'REST', runPolicy: 'ASYNC', restType: 'POST', url: `${UNREACHABLE_BACKEND_URL}/lights`, body: 'on'}
          },
        ]
      ]).then(view => {
        // Like in the frontend, a background is attached to a field of an existing view
        // (the backend can't create a view together with a reference to an image).
        view.fields[1][1].backgroundId = backgroundImageId;
        cy.saveView(view).then(saved => livingRoom = saved);
      });
    });
  });

  const visitLivingRoom = (preferences = {}) => cy.visitApp(`/view?view=${livingRoom.id}&edit=false`, preferences);

  describe('rendering', () => {
    beforeEach(() => {
      visitLivingRoom();
    });

    it('renders the view name and all fields in a grid', () => {
      cy.get('#viewRendererContainer').should('contain.text', livingRoom.name);
      cy.get('#viewRendererContainer .field-row').should('have.length', 2);
      cy.get('#viewRendererContainer .field-row').each(row => {
        cy.wrap(row).find('app-action-field-render').should('have.length', 2);
      });

      ['Lights', 'Go to Kitchen', 'Play/Pause', 'Broken'].forEach(text => tile(text).should('be.visible'));
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
      cy.get(`#viewRendererWrapper img[alt="background image with id: ${backgroundImageId}"]`)
        .should('be.visible')
        .and('have.attr', 'src', `${BACKEND_URL}/api/image/${backgroundImageId}`)
        // the fixture is a 16x16 png: the browser really decoded the image the backend stored
        .and($img => expect(($img[0] as HTMLImageElement).naturalWidth).to.eq(16));
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
      visitLivingRoom({fieldStyle: 'RECTANGLE'});

      cy.get('#viewRendererWrapper .field').first().then($field => {
        const {width, height} = $field[0].getBoundingClientRect();
        expect(width).to.be.greaterThan(0);
        expect(height).to.be.greaterThan(0);
        expect(Math.abs(width - height)).to.be.greaterThan(1);
      });
    });

    it('uses the configured space between fields', () => {
      visitLivingRoom({spaceBetweenFields: 25});

      cy.get('#viewRendererWrapper .field-row').first().find('.padded-field > div:not(.field)')
        .should('have.length', 1)
        .invoke('outerWidth').should('eq', 25);
    });
  });

  describe('REST actions', () => {
    it('sends the configured request', () => {
      // not a stub: the request goes to the real backend, this only observes it
      cy.intercept('GET', `${BACKEND_URL}/api/view/${kitchen.id}`).as('restAction');

      visitLivingRoom();
      tile('Lights').click();

      cy.wait('@restAction').its('response.statusCode').should('eq', 200);
    });

    it('shows an alert when the request fails', () => {
      const alert = cy.stub().as('alert');
      cy.on('window:alert', alert);

      visitLivingRoom();
      tile('Broken').click();

      cy.get('@alert').should('have.been.calledOnce')
        .its('firstCall.args.0').should('contain', 'RestAction-Error');
    });

    it('does not show an alert for a failed request when error alerts are disabled', () => {
      const alert = cy.stub().as('alert');
      cy.on('window:alert', alert);
      cy.intercept('POST', `${UNREACHABLE_BACKEND_URL}/lights`).as('restAction');

      visitLivingRoom({shouldDisplayErrorAlert: false});
      tile('Broken').click();

      cy.wait('@restAction').then(({request, error}) => {
        expect(request.body).to.eq('on');
        expect(error).to.exist;
      });
      cy.get('@alert').should('not.have.been.called');
    });
  });

  // The desktop-automation service runs on the user's desktop and is not part of this project: it is stubbed.
  describe('desktop automation actions', () => {
    it('calls the function on the default host', () => {
      cy.intercept('POST', `${DESKTOP_AUTOMATION_PREFIX}/function/playPause`, {statusCode: 200, body: 'ok'}).as('desktopAutomation');

      visitLivingRoom();
      tile('Play/Pause').click();

      cy.wait('@desktopAutomation');
    });

    it('calls the function on the configured host', () => {
      cy.intercept('POST', 'http://10.0.0.5:42069/api/controlPageInterface/function/playPause', {statusCode: 200, body: 'ok'})
        .as('desktopAutomation');

      visitLivingRoom({desktopAutomationHost: '10.0.0.5'});
      tile('Play/Pause').click();

      cy.wait('@desktopAutomation');
    });
  });

  describe('view actions', () => {
    it('switches to another view and back again', () => {
      visitLivingRoom();

      tile('Go to Kitchen').click();
      cy.get('#viewRendererContainer').should('contain.text', kitchen.name);
      tile('Back').should('be.visible');
      tile('Lights').should('not.exist');

      tile('Back').click();
      cy.get('#viewRendererContainer').should('contain.text', livingRoom.name);
      tile('Lights').should('be.visible');
      tile('Back').should('not.exist');
    });

    it('closes the view and returns to the view list', () => {
      cy.visitApp(`/view?view=${kitchen.id}&edit=false`);

      tile('Close').click();

      cy.location('hash').should('eq', '#/view');
      cy.contains('app-view-list mat-card', kitchen.name).should('be.visible');
      cy.get('app-view-action').should('not.exist');
    });
  });
});
