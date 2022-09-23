import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DesktopAutomationAction} from '../../../../../../types/view/action/impl/desktop-automation-action';
import {ControlPageFunctionsResponse} from '../../../../../../types/desktop-automation-interface/ControlPageFunctionsResponse';
import {RestService} from '../../../../../../services/rest/rest.service';

@Component({
  selector: 'app-desktop-automation-function-select',
  templateUrl: './desktop-automation-function-select.component.html',
  styleUrls: ['./desktop-automation-function-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopAutomationFunctionSelectComponent implements OnInit {
  @Input() public action: DesktopAutomationAction;
  public filteredFunctions: Record<string, string>[] = [];

  private mappedFunctions: Record<string, string>[];

  constructor(
    private readonly rest: RestService,
  ) {
  }

  ngOnInit(): void {
    this.rest.getDesktopAutomationFunctions().subscribe((response: ControlPageFunctionsResponse): void => {
      this.mappedFunctions = response.functions.map(func => ({name: func.name}));
    });
  }

  getFunctions() {
    return this.mappedFunctions;
  }
}
