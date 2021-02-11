import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ViewUtilsService} from '../../../services/view-utils/view-utils.service';
import {FullView} from '../../../interfaces/full-view';
import {Field} from '../../../interfaces/field';
import {ActionFieldRendererParameter} from '../../../interfaces/field-renderer-parameter/action-field-renderer-parameter';
import {EditFieldRendererParameter} from '../../../interfaces/field-renderer-parameter/edit-field-renderer-parameter';

@Component({
  selector: 'app-view-renderer',
  templateUrl: './view-renderer.component.html',
  styleUrls: ['./view-renderer.component.scss']
})
export class ViewRendererComponent implements OnInit {
  @Output() fieldPress: EventEmitter<Field> = new EventEmitter();
  @Input() fieldRenderParameter: ActionFieldRendererParameter | EditFieldRendererParameter;
  @Input() view: FullView;
  @Input() isEditMode: boolean;
  @ViewChild('fieldContainer') fieldContainerRed: ElementRef;

  constructor(
    private viewUtils: ViewUtilsService
  ) {
  }

  ngOnInit(): void {
    console.log('rendering view-init: ', this.view);
    console.log('edit? ', this.isEditMode);
  }

  test(): void {
    console.log('[ViewRender]test');
    console.log('rendering view: ', this.view);
    console.log('edit? ', this.isEditMode);
  }

  getEdit(): boolean {
    console.log('f-edit? ', this.isEditMode);
    console.log(typeof this.isEditMode);
    return this.isEditMode;
  }

  /*
    Utils
   */
  getView(): FullView {
    return this.view || this.viewUtils.getDummyView();
  }

  getFieldWidth(): number {
    return 100;
  }

  getFieldHeight(): number {
    return 100;
  }

  onFieldPress(field: Field): void {
    this.fieldPress.emit(field);
  }
}
