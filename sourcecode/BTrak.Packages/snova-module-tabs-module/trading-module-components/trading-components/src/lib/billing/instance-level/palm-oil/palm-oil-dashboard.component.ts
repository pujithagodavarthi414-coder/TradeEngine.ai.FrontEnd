import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-palm-oil-dashboard',
    templateUrl: './palm-oil-dashboard.component.html'
})

export class PalmOilDashboard implements OnInit {
    productGroup : string;
    constructor() {
      this.productGroup = "Palm Oil";
    }

    ngOnInit() {
        
    }
}