import { Component, ChangeDetectionStrategy } from "@angular/core";

import "../../globaldependencies/helpers/fontawesome-icons";

@Component({
    selector: "reports-list-loading",
    templateUrl: "./reports-list-loading.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReportsListLoadingComponent {
    Array = Array;
    num: number = 3;
}