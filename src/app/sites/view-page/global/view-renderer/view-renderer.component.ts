import {Component, DoCheck, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild} from '@angular/core';
import {ViewUtilsService} from '../../../../services/view-utils/view-utils.service';
import {FullView} from '../../../../types/view/full-view';
import {Field} from '../../../../types/view/field/field';
import {ActionFieldRendererParameter} from '../../../../types/field-renderer-parameter/action-field-renderer-parameter';
import {EditFieldRendererParameter} from '../../../../types/field-renderer-parameter/edit-field-renderer-parameter';
import {Size} from '../../../../types/size';
import {UserPreferencesService} from '../../../../services/user-preferences/user-preferences.service';

@Component({
  selector: 'app-view-renderer',
  templateUrl: './view-renderer.component.html',
  styleUrls: ['./view-renderer.component.scss'],
})
export class ViewRendererComponent implements  DoCheck {
  @Output() fieldPress: EventEmitter<Field> = new EventEmitter();
  @Input() private fieldRenderParameter: ActionFieldRendererParameter | EditFieldRendererParameter;
  @Input() public view: FullView;
  @Input() public isEditMode: boolean;

  @ViewChild('fieldsContainer', {static: true}) private fieldsContainerRef: ElementRef;

  private fieldWidth = 100;
  private fieldHeight = 100;

  private oldViewSize: Size = {width: -1, height: -1};

  constructor(
    private readonly viewUtils: ViewUtilsService,
    private readonly preferencesService: UserPreferencesService
  ) {
  }

  ngDoCheck(): void {
    // manual change detection implementation, because angular using === for dirty check
    // (so, only primitive types or reference change, but NOT field push! - get detected by ngOnChanges)

    // check, if view updated
    if (
      this.view && this.view.fields && this.view.fields.length > 0 &&
      (this.oldViewSize.height !== this.view.fields.length || this.oldViewSize.width !== this.view.fields[0].length)
    ) {
      this.init();
      this.oldViewSize = {
        height: this.view.fields.length,
        width: this.view.fields[0].length
      };
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.init();
  }

  private init(): void {
    console.log('view-renderer init: (view, isEdit): ', this.view, this.isEditMode, this.fieldsContainerSize);

    // cache field size calculation
    this.fieldWidth = this.viewUtils.getFieldWidth(this.view, this.fieldsContainerSize);
    this.fieldHeight = this.viewUtils.getFieldHeight(this.view, this.fieldsContainerSize);

    console.log('view-renderer init - done: ', this.fieldWidth, this.fieldHeight);
  }

  /*
    Utils
   */

  public getFieldWidth(): number {
    return this.fieldWidth;
  }

  public getFieldHeight(): number {
    return this.fieldHeight;
  }

  private get fieldsContainerSize(): Size {
    return {
      width: this.fieldsContainerRef.nativeElement?.clientWidth,
      height: this.fieldsContainerRef.nativeElement?.clientHeight
    };
  }

  public onFieldPress(field: Field): void {
    this.fieldPress.emit(field);
  }

  public getEditFieldRendererParameter(): EditFieldRendererParameter {
    if (!this.isEditMode) {
      console.error('getEditFieldRendererParameter: not edit mode!!!');
      return undefined;
    }
    return this.fieldRenderParameter as EditFieldRendererParameter;
  }

  public getActionFieldRendererParameter(): ActionFieldRendererParameter {
    if (this.isEditMode) {
      console.error('getEditFieldRendererParameter: not Action mode!!!');
      return undefined;
    }
    return this.fieldRenderParameter as ActionFieldRendererParameter;
  }

  public get preferences(): UserPreferencesService {
    return this.preferencesService;
  }
}
