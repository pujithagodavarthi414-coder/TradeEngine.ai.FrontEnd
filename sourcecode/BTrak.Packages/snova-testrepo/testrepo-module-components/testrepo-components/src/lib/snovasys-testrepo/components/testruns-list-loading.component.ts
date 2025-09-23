import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

import "../../globaldependencies/helpers/fontawesome-icons";

@Component({
    selector: "testruns-list-loading",
    templateUrl: "./testruns-list-loading.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunsListLoadingComponent {
    Array = Array;
    num: number = 3;
}