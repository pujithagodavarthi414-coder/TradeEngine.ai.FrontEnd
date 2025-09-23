import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-sunflower-oil-dashboard',
    templateUrl: './sunflower-oil-dashboard.component.html'
})

export class SunFlowerDashboardComponent implements OnInit {
    productGroup : string;
    constructor() {
       this.productGroup = "Sun Flower Oil";
    }

    ngOnInit() {

    }

}