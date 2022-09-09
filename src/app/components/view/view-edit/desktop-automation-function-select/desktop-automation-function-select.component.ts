import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ControlPageFunction} from '../../../../interfaces/desktop-automation-interface/ControlPageFunction';
import {DesktopAutomationAction} from '../../../../interfaces/action/desktop-automation-action';

@Component({
  selector: 'app-desktop-automation-function-select',
  templateUrl: './desktop-automation-function-select.component.html',
  styleUrls: ['./desktop-automation-function-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopAutomationFunctionSelectComponent implements OnInit {
  @Input() action: DesktopAutomationAction;

  @Input() functions: ControlPageFunction[];
  private mappedFunctions: Record<string, string>[];

  filteredFunctions: Record<string, string>[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.mappedFunctions = this.functions.map(func => ({name: func.name}));
  }

  getFunctions() {
    return this.mappedFunctions;
  }
}
