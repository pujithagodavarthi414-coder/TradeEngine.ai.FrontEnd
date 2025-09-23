import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-ricebran-oil-dashboard',
    templateUrl: './ricebran-oil-dashboard.component.html'
})

export class RicebranDashboardComponent implements OnInit {
    productGroup : string;
    constructor() {
        this.productGroup = "Ricebran Oil";
    }
    ngOnInit() {
        
    }
}