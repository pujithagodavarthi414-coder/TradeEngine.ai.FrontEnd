import { Component } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

@Component({
    selector: 'app-am-page-assets-report',
    template: `<ng-container><app-am-component-assets-report></app-am-component-assets-report></ng-container>`
})
export class AssetsReportPageComponent extends CustomAppBaseComponent {

    constructor() {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }
}