import { Component } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

@Component({
    selector: 'app-am-page-vendor-management',
    templateUrl: 'vendor-management.page.html'
})

export class VendorManagementPageComponent extends CustomAppBaseComponent {

    constructor() {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }
}