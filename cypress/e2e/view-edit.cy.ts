import {BACKEND_URL, DESKTOP_AUTOMATION_PREFIX, title, View} from '../support/constants';

describe('View page - edit mode', () => {
  const exact = (text: string | number) => new RegExp(`^\\s*${String(text).replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}\\s*$`);

  const editTiles = () => cy.get('#editViewDisplay app-edit-field-render');
  const editTile = (text: string | RegExp) => cy.contains('#editViewDisplay app-edit-field-render', text);
  const previewTiles = () => cy.get('#previewViewDisplay app-action-field-render');
  const previewTile = (text: string | RegExp) => cy.contains('#previewViewDisplay app-action-field-render', text);
  const fieldSection = () => cy.get('#fieldEditSection');
  const viewSection = () => cy.get('#editViewSection');
  const unsavedIndicator = () => cy.contains('unsaved-view-changes!!!');

  const selectOption = (formFieldLabel: string, option: string) => {
    fieldSection().contains('mat-form-field', formFieldLabel).find('mat-select').click();
    cy.contains('mat-option', exact(option)).click();
  };

  /** The view the "Go to Kitchen" field switches to. */
  let kitchen: View;

  /** The view under test, created for every test: [[Lights, Go to Kitchen], [Play/Pause, <field with only a background>]] */
  let view: View;
  let backgroundImageId: number;
  const lights = () => view.fields[0][0];
  const goToKitchen = () => view.fields[0][1];
  const backgroundOnly = () => view.fields[1][1];

  /**
   * Clicks "Save View", waits until the backend stored the view and the page reloaded it,
   * and yields the view as it is stored in the backend now.
   */
  const saveAndFetchView = () => {
    viewSection().contains('button', 'Save View').click();
    cy.wait('@saveView').its('response.statusCode').should('eq', 200);
    // after a successful save the page reloads and fetches the view again
    cy.wait('@loadView');
    return cy.fetchView(view.id);
  };

  before(() => {
    cy.createView('Kitchen', [[{title: title('Oven')}]]).then(created => kitchen = created);
  });

  beforeEach(() => {
    // in the backend an image belongs to exactly one field: every view needs its own
    cy.uploadImage('images/background.png').then(imageId => backgroundImageId = imageId);

    cy.createView('Living Room', [
      [
        {
          title: title('Lights'),
          description: 'toggle the lights',
          action: {type: 'REST', runPolicy: 'ASYNC', restType: 'POST', url: 'http://rest-target.test/lights', body: 'on'}
        },
        {
          title: title('Go to Kitchen'),
          action: {type: 'VIEW', runPolicy: 'ASYNC', viewActionType: 'SWITCH_TO', viewId: kitchen.id}
        },
      ],
      [
        {
          title: title('Play/Pause'),
          action: {type: 'DESKTOP_AUTOMATION', runPolicy: 'ASYNC', functionName: 'playPause'}
        },
        {},
      ]
    ]).then(created => {
      created.fields[1][1].backgroundId = backgroundImageId;
      cy.saveView(created).then(saved => view = saved);
    });

    // Not stubs: these requests go to the real backend, the aliases are only used to wait for them.
    // (The image upload must not be intercepted: Cypress re-encodes intercepted bodies, which corrupts binary uploads.)
    cy.then(() => {
      cy.intercept('POST', `${BACKEND_URL}/api/view`).as('saveView');
      cy.intercept('GET', `${BACKEND_URL}/api/view/${view.id}`).as('loadView');

      cy.visitApp(`/view?view=${view.id}&edit=true`);
      cy.wait('@loadView');
    });
  });

  describe('layout', () => {
    it('renders the editable view, the preview and the view edit section', () => {
      cy.get('#editViewDisplay').should('contain.text', view.name);
      editTiles().should('have.length', 4);
      previewTiles().should('have.length', 4);
      view.fields.flat().forEach(field => editTiles().contains(exact(field.id)).should('exist'));

      viewSection().within(() => {
        ['Add Row', 'Delete Row', 'Add Column', 'Delete Column', 'Save View']
          .forEach(label => cy.contains('button', label).should('be.visible'));
      });

      fieldSection().should('not.exist');
      unsavedIndicator().should('not.exist');
    });

    it('selects a field on click and deselects it on a second click', () => {
      editTile('Lights').click();

      fieldSection().should('be.visible')
        .and('contain.text', `Id: ${lights().id}`)
        .and('contain.text', `ID: ${lights().title.id}`)
        .and('contain.text', `ID: ${lights().action.id}`);
      editTile('Lights').find('div[style*="background-color"]').should('exist');
      fieldSection().contains('mat-form-field', 'Text').find('input').should('have.value', 'Lights');
      fieldSection().find('input[placeholder="Description"]').should('have.value', 'toggle the lights');
      fieldSection().contains('mat-form-field', 'ActionType').should('contain.text', 'REST');
      fieldSection().should('contain.text', 'REST-Action editing section');
      fieldSection().find('input[placeholder="URL"]').should('have.value', 'http://rest-target.test/lights');
      fieldSection().find('input[placeholder="Body"]').should('have.value', 'on');

      editTile('Lights').click();
      fieldSection().should('not.exist');
      editTile('Lights').find('div[style*="background-color"]').should('not.exist');
    });

    it('switches the selected field', () => {
      editTile('Lights').click();
      fieldSection().should('contain.text', `Id: ${lights().id}`);

      editTile('Go to Kitchen').click();
      fieldSection().should('contain.text', `Id: ${goToKitchen().id}`)
        .and('contain.text', 'View-Action editing section');
      fieldSection().contains('mat-form-field', 'ViewActionType').should('contain.text', 'SWITCH_TO');
      fieldSection().contains('mat-form-field', 'View-ID').find('input').should('have.value', String(kitchen.id));
    });
  });

  describe('view tools', () => {
    it('adds a row and a column and stores them in the backend', () => {
      viewSection().contains('button', 'Add Row').click();
      editTiles().should('have.length', 6);
      cy.get('#editViewDisplay .field-row').should('have.length', 3);
      unsavedIndicator().should('be.visible');

      viewSection().contains('button', 'Add Column').click();
      editTiles().should('have.length', 9);
      cy.get('#editViewDisplay .field-row').each(row => {
        cy.wrap(row).find('app-edit-field-render').should('have.length', 3);
      });
      previewTiles().should('have.length', 9);

      saveAndFetchView().then(stored => {
        expect(stored.fields.map(row => row.length), 'fields per row').to.deep.eq([3, 3, 3]);
        // the existing fields kept their place, the new ones got an id from the database
        expect(stored.fields[0][0].title.text).to.eq('Lights');
        expect(stored.fields[1][1].backgroundId).to.eq(backgroundImageId);
        stored.fields.flat().forEach(field => expect(field.id).to.be.greaterThan(0));
        expect(new Set(stored.fields.flat().map(field => field.id)).size, 'distinct field ids').to.eq(9);
      });

      editTiles().should('have.length', 9);
      unsavedIndicator().should('not.exist');
    });

    it('deletes the last row and column after confirmation and stores that in the backend', () => {
      const confirm = cy.stub().as('confirm').returns(true);
      cy.on('window:confirm', confirm);

      viewSection().contains('button', 'Delete Row').click();
      cy.get('@confirm').should('have.been.calledOnce');
      editTiles().should('have.length', 2);
      editTile('Play/Pause').should('not.exist');

      viewSection().contains('button', 'Delete Column').click();
      cy.get('@confirm').should('have.been.calledTwice');
      editTiles().should('have.length', 1);
      editTile('Lights').should('exist');
      editTile('Go to Kitchen').should('not.exist');
      unsavedIndicator().should('be.visible');

      saveAndFetchView().then(stored => {
        expect(stored.fields.map(row => row.length), 'fields per row').to.deep.eq([1]);
        expect(stored.fields[0][0].id).to.eq(lights().id);
      });

      editTiles().should('have.length', 1);
      editTile('Lights').should('exist');
    });

    it('keeps rows and columns when the confirmation is cancelled', () => {
      cy.on('window:confirm', () => false);

      viewSection().contains('button', 'Delete Row').click();
      viewSection().contains('button', 'Delete Column').click();

      editTiles().should('have.length', 4);
      unsavedIndicator().should('not.exist');
    });

    it('creates a 1x1 view when adding a row to an empty view', () => {
      cy.on('window:confirm', () => true);
      viewSection().contains('button', 'Delete Row').click();
      viewSection().contains('button', 'Delete Row').click();
      editTiles().should('have.length', 0);

      viewSection().contains('button', 'Add Row').click();
      editTiles().should('have.length', 1);
    });
  });

  describe('field editing', () => {
    beforeEach(() => {
      editTile('Lights').click();
    });

    it('updates the title text in the editor and the preview', () => {
      unsavedIndicator().should('not.exist');

      fieldSection().contains('mat-form-field', 'Text').find('input').clear().type('Ceiling Lamp');

      editTile('Ceiling Lamp').should('exist');
      previewTile('Ceiling Lamp').should('exist');
      previewTile('Lights').should('not.exist');
      unsavedIndicator().should('be.visible');
    });

    it('updates the title alignment and color and stores them in the backend', () => {
      fieldSection().find('mat-button-toggle').contains('format_align_right').click();
      fieldSection().find('mat-button-toggle').contains('vertical_align_bottom').click();
      fieldSection().contains('mat-form-field', 'Color').find('input[type="color"]')
        .invoke('val', '#123456').trigger('input');

      const expectStyledTitle = () => previewTile('Lights').find('#actionTitleRenderContainer')
        .should('have.css', 'justify-content', 'end')
        .and('have.css', 'align-items', 'end')
        .and('have.css', 'color', 'rgb(18, 52, 86)');
      expectStyledTitle();

      saveAndFetchView().its('fields.0.0.title').should('include', {
        text: 'Lights', horizontalAlignment: 'RIGHT', verticalAlignment: 'BOTTOM', color: '#123456'
      });

      // rendered the same from what the backend stored
      expectStyledTitle();
    });

    it('clears a field and restores it with undo / redo', () => {
      fieldSection().contains('button', 'Clear').click();
      previewTile('Lights').should('not.exist');
      fieldSection().contains('mat-form-field', 'Text').find('input').should('have.value', '');

      fieldSection().contains('button', 'Undo').click();
      previewTile('Lights').should('exist');
      fieldSection().contains('mat-form-field', 'Text').find('input').should('have.value', 'Lights');

      fieldSection().contains('button', 'Redo').click();
      previewTile('Lights').should('not.exist');
    });

    it('clears the selected field with the Delete key when keybindings are enabled', () => {
      cy.get('body').trigger('keydown', {key: 'Delete'});
      previewTile('Lights').should('not.exist');

      cy.get('body').trigger('keydown', {key: 'z', ctrlKey: true});
      previewTile('Lights').should('exist');
    });

    it('pastes a field from the clipboard', () => {
      cy.window().then(win => {
        // resolve with the app window's (zone.js patched) Promise, so Angular runs change detection afterwards
        cy.stub(win.navigator.clipboard, 'readText').callsFake(() => win.Promise.resolve(JSON.stringify({
          id: 999,
          colspan: 1,
          rowspan: 1,
          title: {id: 5, text: 'Pasted', color: '#ffffff', horizontalAlignment: 'CENTER', verticalAlignment: 'CENTER'},
          action: null
        })));
      });

      fieldSection().contains('button', 'Paste').click();

      previewTile('Pasted').should('exist');
      // the id of the target field is kept
      fieldSection().should('contain.text', `Id: ${lights().id}`);
    });

    it('switches the action type and shows the matching editing section', () => {
      cy.stubDesktopAutomationFunctions();

      selectOption('ActionType', 'VIEW');
      fieldSection().should('contain.text', 'View-Action editing section')
        .and('not.contain.text', 'REST-Action editing section');

      selectOption('ViewActionType', 'SWITCH_TO');
      fieldSection().contains('mat-form-field', 'View-ID').should('be.visible');

      selectOption('ViewActionType', 'CLOSE');
      fieldSection().contains('mat-form-field', 'View-ID').should('not.exist');

      selectOption('ActionType', 'DESKTOP_AUTOMATION');
      fieldSection().should('contain.text', 'Desktop-Automation editing section');
      cy.wait('@getFunctions');
    });
  });

  // The function list comes from the desktop-automation service, which is not part of this project: it is stubbed.
  describe('desktop automation function select', () => {
    beforeEach(() => {
      cy.stubDesktopAutomationFunctions();
      editTile('Play/Pause').click();
      cy.wait('@getFunctions');
    });

    it('preselects the configured function', () => {
      fieldSection().find('app-desktop-automation-function-select mat-select').should('contain.text', 'playPause');
    });

    it('filters and selects another function and stores it in the backend', () => {
      fieldSection().find('app-desktop-automation-function-select mat-select').click();
      cy.get('mat-option:not(:has(ngx-mat-select-search))').should('have.length', 3);

      cy.get('ngx-mat-select-search input.mat-select-search-input:visible').type('vol');
      cy.get('mat-option:not(:has(ngx-mat-select-search))').should('have.length', 1);
      cy.contains('mat-option', 'volumeUp').click();

      fieldSection().find('app-desktop-automation-function-select mat-select').should('contain.text', 'volumeUp');

      saveAndFetchView().its('fields.1.0.action')
        .should('include', {type: 'DESKTOP_AUTOMATION', functionName: 'volumeUp'});
    });
  });

  describe('backgrounds', () => {
    it('shows a preview of a newly selected background image', () => {
      editTile('Lights').click();
      fieldSection().find('input[type="file"]').selectFile('cypress/fixtures/images/background.png');

      fieldSection().find('img[alt="(recently uploaded background-image)"]')
        .should('have.attr', 'src').and('match', /^data:image\/png;base64,/);
      editTile('Lights').find('img').should('be.visible');
      previewTile('Lights').find('img').should('be.visible');
    });

    it('uploads a new background image and stores it in the backend', () => {
      editTile('Lights').click();
      fieldSection().find('input[type="file"]').selectFile('cypress/fixtures/images/background.png');
      fieldSection().find('img').should('exist');

      saveAndFetchView().its('fields.0.0.backgroundId').should('be.greaterThan', 0).then(imageId => {
        // a new image was stored, and it is byte for byte the uploaded file
        expect(imageId).not.to.eq(backgroundImageId);
        cy.request({url: `${BACKEND_URL}/api/image/${imageId}`, encoding: 'base64'}).then(response => {
          expect(response.headers['content-type']).to.eq('image/png');
          cy.fixture('images/background.png', 'base64').should('eq', response.body);
        });

        // and the reloaded page renders it from the backend
        previewTile('Lights').find(`img[alt="background image with id: ${imageId}"]`)
          .should('be.visible')
          .and($img => expect(($img[0] as HTMLImageElement).naturalWidth).to.eq(16));
      });
    });

    it('removes an existing background and stores that in the backend', () => {
      editTile(exact(backgroundOnly().id)).click();
      fieldSection().find(`img[alt="background image with id: ${backgroundImageId}"]`).should('exist');

      fieldSection().contains('button', 'delete').click();
      fieldSection().find('img').should('not.exist');
      fieldSection().contains('button', 'delete').should('not.exist');

      saveAndFetchView().its('fields.1.1.backgroundId').should('be.lessThan', 1);

      editTiles().should('have.length', 4);
      cy.get('#editViewDisplay img').should('not.exist');
    });
  });

  describe('saving', () => {
    it('stores the edited view in the backend and reloads it', () => {
      editTile('Lights').click();
      fieldSection().contains('mat-form-field', 'Text').find('input').clear().type('Ceiling Lamp');
      fieldSection().find('input[placeholder="Description"]').clear().type('the big one');
      fieldSection().find('input[placeholder="URL"]').clear().type('http://rest-target.test/ceiling');
      fieldSection().find('input[placeholder="Body"]').clear().type('toggle');
      selectOption('RestType', 'GET');

      saveAndFetchView().then(stored => {
        expect(stored).to.include({id: view.id, name: view.name});
        expect(stored.fields[0][0]).to.include({id: lights().id, description: 'the big one'});
        expect(stored.fields[0][0].title.text).to.eq('Ceiling Lamp');
        expect(stored.fields[0][0].action).to.include({
          type: 'REST', restType: 'GET', url: 'http://rest-target.test/ceiling', body: 'toggle'
        });
        // untouched fields are stored unchanged
        expect(stored.fields[0][1]).to.deep.eq(goToKitchen());
        expect(stored.fields[1]).to.deep.eq(view.fields[1]);
      });

      // the reloaded page shows what the backend stored
      editTile('Ceiling Lamp').should('exist');
      editTile('Lights').should('not.exist');
      unsavedIndicator().should('not.exist');
      editTile('Ceiling Lamp').click();
      fieldSection().find('input[placeholder="URL"]').should('have.value', 'http://rest-target.test/ceiling');
      fieldSection().contains('mat-form-field', 'RestType').should('contain.text', 'GET');
    });

    it('changes the type of an action and stores it in the backend', () => {
      editTile('Lights').click();
      selectOption('ActionType', 'VIEW');
      selectOption('ViewActionType', 'SWITCH_TO');
      fieldSection().contains('mat-form-field', 'View-ID').find('input').clear().type(String(kitchen.id));

      saveAndFetchView().its('fields.0.0.action')
        .should('include', {type: 'VIEW', viewActionType: 'SWITCH_TO', viewId: kitchen.id});

      // the stored action works: the preview switches to the kitchen
      previewTile('Lights').click();
      cy.get('#previewViewDisplay').should('contain.text', kitchen.name).and('contain.text', 'Oven');
    });

    it('does not store the placeholder action of a field without an action', () => {
      editTile(exact(backgroundOnly().id)).click();
      // selecting a field without action / title creates editable placeholders
      fieldSection().contains('mat-form-field', 'ActionType').should('contain.text', 'UNDEFINED');

      saveAndFetchView().its('fields.1.1.action').should('be.null');
    });
  });

  it('ignores field hotkeys when they are disabled in the settings', () => {
    cy.visitApp(`/view?view=${view.id}&edit=true`, {fieldKeybindingEnabled: false});

    editTile('Lights').click();
    cy.get('body').trigger('keydown', {key: 'Delete'});

    previewTile('Lights').should('exist');
  });

  it('shows an alert when the desktop automation service is not reachable', () => {
    cy.intercept('GET', `${DESKTOP_AUTOMATION_PREFIX}/function`, {forceNetworkError: true}).as('getFunctions');
    const alert = cy.stub().as('alert');
    cy.on('window:alert', alert);

    editTile('Play/Pause').click();

    cy.wait('@getFunctions');
    cy.get('@alert').should('have.been.calledWithMatch', /^REST-Service:/);
  });
});
