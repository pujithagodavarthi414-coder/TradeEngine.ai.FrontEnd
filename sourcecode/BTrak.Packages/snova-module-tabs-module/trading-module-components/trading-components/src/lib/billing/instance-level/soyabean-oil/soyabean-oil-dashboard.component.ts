import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-soyabean-oil-dashboard',
    templateUrl: './soyabean-oil-dashboard.component.html'
})

export class SoyabeanOilDashboardComponent implements OnInit {
    productGroup : string;
    constructor() {
      this.productGroup = "Soyabean Oil"
    }
    ngOnInit() {
        
    }
}