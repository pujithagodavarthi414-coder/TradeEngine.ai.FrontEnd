import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

@Component({
    selector: "app-am-page-assets-dashboard",
    templateUrl: `./assets-dashboard.page.template.html`
})
export class AssetsDashboardPageComponent extends CustomAppBaseComponent {
    constructor(private routes: Router) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    gotoAddAsset() {
        this.routes.navigate(["assetmanagement/listofassets/addasset"]);
    }

    gotoAllAssets() {
        // this.routes.navigate(["listofassets"]);
        this.routes.navigate(["assetmanagement/allassets"]);
    }
}
