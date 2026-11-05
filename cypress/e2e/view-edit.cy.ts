import {DESKTOP_AUTOMATION_PREFIX} from '../support/commands';

describe('View page - edit mode', () => {
  const editTiles = () => cy.get('#editViewDisplay app-edit-field-render');
  const editTile = (text: string | RegExp) => cy.contains('#editViewDisplay app-edit-field-render', text);
  const previewTiles = () => cy.get('#previewViewDisplay app-action-field-render');
  const previewTile = (text: string) => cy.contains('#previewViewDisplay app-action-field-render', text);
  const fieldSection = () => cy.get('#fieldEditSection');
  const viewSection = () => cy.get('#editViewSection');
  const unsavedIndicator = () => cy.contains('unsaved-view-changes!!!');
  const exact = (text: string) => new RegExp(`^\\s*${text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}\\s*$`);

  const selectOption = (formFieldLabel: string, option: string) => {
    fieldSection().contains('mat-form-field', formFieldLabel).find('mat-select').click();
    cy.contains('mat-option', exact(option)).click();
  };

  /** Clicks "Save View" and yields the view that was sent to the backend. */
  const saveView = () => {
    viewSection().contains('button', 'Save View').click();
    return cy.wait('@saveView').its('request.body');
  };

  beforeEach(() => {
    cy.stubBackend();
    cy.visitApp('/view?view=1&edit=true');
    cy.wait('@getView1');
  });

  describe('layout', () => {
    it('renders the editable view, the preview and the view edit section', () => {
      editTiles().should('have.length', 4);
      previewTiles().should('have.length', 4);
      [11, 12, 13, 14].forEach(id => editTiles().contains(exact(String(id))).should('exist'));

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
        .and('contain.text', 'Id: 11')
        .and('contain.text', 'ID: 1001')
        .and('contain.text', 'ID: 101');
      editTile('Lights').find('div[style*="background-color"]').should('exist');
      fieldSection().contains('mat-form-field', 'Text').find('input').should('have.value', 'Lights');
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
      fieldSection().should('contain.text', 'Id: 11');

      editTile('Go to Kitchen').click();
      fieldSection().should('contain.text', 'Id: 12')
        .and('contain.text', 'View-Action editing section');
      fieldSection().contains('mat-form-field', 'ViewActionType').should('contain.text', 'SWITCH_TO');
      fieldSection().contains('mat-form-field', 'View-ID').find('input').should('have.value', '2');
    });
  });

  describe('view tools', () => {
    it('adds a row and a column', () => {
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
    });

    it('deletes the last row and column after confirmation', () => {
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

    it('updates the title alignment and color', () => {
      fieldSection().find('mat-button-toggle').contains('format_align_right').click();
      fieldSection().find('mat-button-toggle').contains('vertical_align_bottom').click();
      fieldSection().contains('mat-form-field', 'Color').find('input[type="color"]')
        .invoke('val', '#123456').trigger('input');

      previewTile('Lights').find('#actionTitleRenderContainer')
        .should('have.css', 'justify-content', 'end')
        .and('have.css', 'align-items', 'end')
        .and('have.css', 'color', 'rgb(18, 52, 86)');
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
      fieldSection().should('contain.text', 'Id: 11');
    });

    it('switches the action type and shows the matching editing section', () => {
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

  describe('desktop automation function select', () => {
    beforeEach(() => {
      editTile('Play/Pause').click();
      cy.wait('@getFunctions');
    });

    it('preselects the configured function', () => {
      fieldSection().find('app-desktop-automation-function-select mat-select').should('contain.text', 'playPause');
    });

    it('filters and selects another function', () => {
      fieldSection().find('app-desktop-automation-function-select mat-select').click();
      cy.get('mat-option:not(:has(ngx-mat-select-search))').should('have.length', 3);

      cy.get('ngx-mat-select-search input.mat-select-search-input:visible').type('vol');
      cy.get('mat-option:not(:has(ngx-mat-select-search))').should('have.length', 1);
      cy.contains('mat-option', 'volumeUp').click();

      fieldSection().find('app-desktop-automation-function-select mat-select').should('contain.text', 'volumeUp');
      saveView().then(view => {
        expect(view.fields[1][0].action).to.include({type: 'DESKTOP_AUTOMATION', functionName: 'volumeUp'});
      });
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

    it('uploads new background images before saving the view', () => {
      editTile('Lights').click();
      fieldSection().find('input[type="file"]').selectFile('cypress/fixtures/images/background.png');
      fieldSection().find('img').should('exist');

      viewSection().contains('button', 'Save View').click();

      cy.wait('@uploadImage').then(({request}) => {
        expect(request.headers['content-type']).to.match(/^multipart\/form-data/);
      });
      cy.wait('@saveView').its('request.body.fields.0.0.backgroundId').should('eq', 42);
    });

    it('removes an existing background', () => {
      editTile(exact('14')).click();
      fieldSection().find('img[alt="background image with id: 7"]').should('exist');

      fieldSection().contains('button', 'delete').click();
      fieldSection().find('img').should('not.exist');
      fieldSection().contains('button', 'delete').should('not.exist');

      saveView().its('fields.1.1.backgroundId').should('eq', -1);
    });
  });

  describe('saving', () => {
    it('sends the edited view to the backend and reloads it', () => {
      editTile('Lights').click();
      fieldSection().contains('mat-form-field', 'Text').find('input').clear().type('Ceiling Lamp');
      fieldSection().find('input[placeholder="URL"]').clear().type('http://rest-target.test/ceiling');
      selectOption('RestType', 'GET');
      viewSection().contains('button', 'Add Row').click();

      saveView().then(view => {
        expect(view).to.include({id: 1, name: 'Living Room'});
        expect(view.fields).to.have.length(3);
        expect(view.fields[0][0].title.text).to.eq('Ceiling Lamp');
        expect(view.fields[0][0].action).to.include({type: 'REST', restType: 'GET', url: 'http://rest-target.test/ceiling'});
        // untouched fields are sent unchanged
        expect(view.fields[0][1].action).to.include({type: 'VIEW', viewActionType: 'SWITCH_TO', viewId: 2});
        // new fields are marked with a negative id so the backend creates them
        expect(view.fields[2]).to.have.length(2);
        view.fields[2].forEach((field: { id: number }) => expect(field.id).to.eq(-1));
      });

      // the page reloads the view from the backend after a successful save
      cy.wait('@getView1');
      editTile('Lights').should('exist');
      unsavedIndicator().should('not.exist');
    });

    it('does not send placeholder actions of fields without an action', () => {
      editTile(exact('14')).click();
      // selecting a field without action / title creates editable placeholders
      fieldSection().contains('mat-form-field', 'ActionType').should('contain.text', 'UNDEFINED');

      saveView().its('fields.1.1.action').should('be.null');
    });
  });
});

describe('View page - edit mode - keybindings disabled', () => {
  it('ignores field hotkeys when they are disabled in the settings', () => {
    cy.stubBackend();
    cy.visitApp('/view?view=1&edit=true', {fieldKeybindingEnabled: false});
    cy.wait('@getView1');

    cy.contains('#editViewDisplay app-edit-field-render', 'Lights').click();
    cy.get('body').trigger('keydown', {key: 'Delete'});

    cy.contains('#previewViewDisplay app-action-field-render', 'Lights').should('exist');
  });
});

describe('View page - edit mode - unknown desktop automation host', () => {
  it('shows an alert when the function list cannot be loaded', () => {
    cy.stubBackend();
    cy.intercept('GET', `${DESKTOP_AUTOMATION_PREFIX}/function`, {forceNetworkError: true}).as('getFunctions');
    const alert = cy.stub().as('alert');
    cy.on('window:alert', alert);

    cy.visitApp('/view?view=1&edit=true');
    cy.contains('#editViewDisplay app-edit-field-render', 'Play/Pause').click();

    cy.wait('@getFunctions');
    cy.get('@alert').should('have.been.calledWithMatch', /^REST-Service:/);
  });
});
