import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-glycerin-dashboard',
    templateUrl: './glycerin-dashboard.component.html'
})

export class GlycerinDashboardComponent implements OnInit {
    productGroup: string;
    constructor() {
        this.productGroup = "Glycerin";
    }

    ngOnInit() {

    }

}