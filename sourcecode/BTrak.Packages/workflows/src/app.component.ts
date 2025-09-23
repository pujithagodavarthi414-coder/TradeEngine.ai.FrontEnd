import { Component } from "@angular/core";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})

export class AppComponent {
    selectedIds : string;
    constructor() {
        this.selectedIds = "9e75d578-31f5-4b3f-a919-f1a4cd7bc1b2";
    }
}