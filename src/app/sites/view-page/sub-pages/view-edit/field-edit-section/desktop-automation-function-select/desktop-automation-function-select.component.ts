import {Component, Input, OnInit} from '@angular/core';
import {DesktopAutomationAction} from '../../../../../../types/view/action/impl/desktop-automation-action';
import {ControlPageFunctionsResponse} from '../../../../../../types/desktop-automation-interface/ControlPageFunctionsResponse';
import {RestService} from '../../../../../../services/rest/rest.service';
import {FormControl} from '@angular/forms';
import {ControlPageFunction} from '../../../../../../types/desktop-automation-interface/ControlPageFunction';
import {ReplaySubject} from 'rxjs';

@Component({
    selector: 'app-desktop-automation-function-select',
    templateUrl: './desktop-automation-function-select.component.html',
    styleUrls: ['./desktop-automation-function-select.component.scss']
})
export class DesktopAutomationFunctionSelectComponent implements OnInit {
    @Input() public action: DesktopAutomationAction;

    // list of ControlPageFunction's
    private functions: ControlPageFunction[] = [];

    // control for the selected ControlPageFunction
    public functionCtr: FormControl = new FormControl<ControlPageFunction>(null);

    // control for the MatSelect filter keyword
    public functionFilterCtr: FormControl = new FormControl<string>('');

    /** list of ControlPageFunction filtered by search keyword */
    public filteredFunctions: ReplaySubject<ControlPageFunction[]> = new ReplaySubject<ControlPageFunction[]>(1);

    constructor(
        private readonly rest: RestService,
    ) {
    }

    public ngOnInit(): void {
        this.rest.getDesktopAutomationFunctions().subscribe((response: ControlPageFunctionsResponse): void => {
            this.functions = response.functions;

            // set initial selection
            this.functionCtr.setValue(this.functions.find(candidate => candidate.name === this.action.functionName));

            // load the initial function list
            this.filteredFunctions.next(this.functions);

            // listen for search field value changes
            this.functionFilterCtr.valueChanges.subscribe((search: string) => {
                this.filterFunctions(search);
            });
        });

        this.functionCtr.valueChanges.subscribe((selectedFunction: ControlPageFunction) => {
            this.action.functionName = selectedFunction.name;
        });
    }

    private filterFunctions(search: string) {
        if (!search) {
            this.filteredFunctions.next(this.functions);
            return;
        } else {
            search = search.toLowerCase();
        }

        // filter the functions
        this.filteredFunctions.next(
            this.functions.filter(func => func.name.indexOf(search) > -1)
        );
    }
}
