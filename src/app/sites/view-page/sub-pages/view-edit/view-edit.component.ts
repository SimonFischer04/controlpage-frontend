import {Component,  Input, OnChanges,  SimpleChanges} from '@angular/core';
import {FullView} from '../../../../types/view/full-view';
import {Field} from '../../../../types/view/field/field';
import {EditFieldRendererParameter} from '../../../../types/field-renderer-parameter/edit-field-renderer-parameter';
import {ActionService} from '../../../../services/action/action.service';

@Component({
  selector: 'app-view-edit',
  templateUrl: './view-edit.component.html',
  styleUrls: ['./view-edit.component.scss']
})
export class ViewEditComponent implements  OnChanges {
  @Input() public view: FullView;
  public fieldParams: EditFieldRendererParameter = {selectedField: null};

  constructor(
    private readonly actionService: ActionService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.view) {
      console.log('view changed: ', changes.view.currentValue);
      this.selectedField = null;
    }
  }

  public onEditFieldPress(field: Field): void {
    // Unselect Field if pressed 2nd time
    this.selectedField = (field === this.selectedField ? null : field);
    console.log('editing Field: ', this.selectedField);
  }


  /*
    Other
   */

  public onActionFieldPress(field: Field) {
    this.actionService.executeAction(field.action);
  }

  /*
   Utils
  */

  public get selectedField(): Field {
    return this.fieldParams.selectedField;
  }

  private set selectedField(field: Field) {
    this.fieldParams.selectedField = field;
  }
}
