import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ViewUtilsService} from '../../../services/view-utils/view-utils.service';
import {FullView} from '../../../interfaces/full-view';
import {Field} from '../../../interfaces/field';
import {ActionFieldRendererParameter} from '../../../interfaces/field-renderer-parameter/action-field-renderer-parameter';
import {EditFieldRendererParameter} from '../../../interfaces/field-renderer-parameter/edit-field-renderer-parameter';
import {Size} from '../../../interfaces/size';
import {UserPreferencesService} from '../../../services/user-preferences/user-preferences.service';

@Component({
  selector: 'app-view-renderer',
  templateUrl: './view-renderer.component.html',
  styleUrls: ['./view-renderer.component.scss'],
})
export class ViewRendererComponent implements OnInit {
  @Output() fieldPress: EventEmitter<Field> = new EventEmitter();
  @Input() fieldRenderParameter: ActionFieldRendererParameter | EditFieldRendererParameter;
  @Input() view: FullView;
  @Input() isEditMode: boolean;
  // @ViewChild('fieldContainer', {static: true}) fieldContainerRef: ElementRef;
  @Input() reInitEvent: EventEmitter<void> = new EventEmitter<void>();

  @Input() private readonly containerSize: Size;

  private fieldWidth = 100;
  private fieldHeight = 100;

  constructor(
    private readonly viewUtils: ViewUtilsService,
    private readonly preferencesService: UserPreferencesService
  ) {
  }

  ngOnInit(): void {
    this.reInitEvent.subscribe(() => {
      this.init();
    });
    this.init();
  }

  private init(): void {
    console.log('view-renderer init: (view, isEdit): ', this.view, this.isEditMode);

    // cache field size calculation
    this.fieldWidth = this.viewUtils.getFieldWidth(this.getView(), this.getFieldContainerSize());
    this.fieldHeight = this.viewUtils.getFieldHeight(this.getView(), this.getFieldContainerSize());
  }

  /*
    Utils
   */
  public getView(): FullView {
    return this.view || this.viewUtils.getDummyView();
  }

  public getFieldWidth(): number {
    return this.fieldWidth;
  }

  public getFieldHeight(): number {
    return this.fieldHeight;
  }

  private getFieldContainerSize(): Size {
    // return {
    //   width: this.fieldContainerRef.nativeElement.clientWidth,
    //   height: this.fieldContainerRef.nativeElement.clientHeight,
    // };
    return this.containerSize;
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

  public get prefs(): UserPreferencesService {
    return this.preferencesService;
  }
}
