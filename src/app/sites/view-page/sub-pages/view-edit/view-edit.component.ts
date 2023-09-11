import {Component,  Input, OnChanges,  SimpleChanges} from '@angular/core';
import {EditFieldRendererParameter} from '../../../../types/field-renderer-parameter/edit-field-renderer-parameter';
import {ActionService} from '../../../../services/action/action.service';
import {FieldDTO, FullViewDTO} from "../../../../../gen";

@Component({
  selector: 'app-view-edit',
  templateUrl: './view-edit.component.html',
  styleUrls: ['./view-edit.component.scss']
})
export class ViewEditComponent implements  OnChanges {
  @Input() public view: FullViewDTO;
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

  public onEditFieldPress(field: FieldDTO): void {
    // Unselect Field if pressed 2nd time
    this.selectedField = (field === this.selectedField ? null : field);
    console.log('editing Field: ', this.selectedField);
  }


  /*
    Other
   */

  public onActionFieldPress(field: FieldDTO) {
    this.actionService.executeAction(field.action);
  }

  /*
   Utils
  */

  public get selectedField(): FieldDTO {
    return this.fieldParams.selectedField;
  }

  private set selectedField(field: FieldDTO) {
    this.fieldParams.selectedField = field;
  }
}
