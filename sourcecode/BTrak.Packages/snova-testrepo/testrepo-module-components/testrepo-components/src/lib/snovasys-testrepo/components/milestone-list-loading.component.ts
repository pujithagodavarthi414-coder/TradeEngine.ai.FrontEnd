import { Component } from "@angular/core";

import "../../globaldependencies/helpers/fontawesome-icons";

@Component({
    selector: "milestone-list-loading",
    templateUrl: "./milestone-list-loading.component.html"
})

export class MileStonesListLoadingComponent {
    Array = Array;
    num: number = 3;
}