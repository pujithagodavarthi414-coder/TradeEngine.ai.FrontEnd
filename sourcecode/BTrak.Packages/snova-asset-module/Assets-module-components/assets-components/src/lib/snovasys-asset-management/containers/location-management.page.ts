import { Component } from "@angular/core";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

@Component({
    selector: "app-am-page-location-management",
    templateUrl: "location-management.page.html"
})

export class LocationManagementPageComponent extends CustomAppBaseComponent {

    constructor() {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }
}
