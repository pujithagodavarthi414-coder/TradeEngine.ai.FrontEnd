import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
    selector: 'app-consolidated-palm-oil-dashboard',
    templateUrl: './palm-oil-consolidated-dashboard.component.html'
})

export class PalmOilConsolidatedDashboard implements OnInit {
   @Output() fileBytes = new EventEmitter<any>();
    productGroup: string;
    model: any;
    constructor() {
        this.productGroup = "Palm Oil";
    }

    ngOnInit() {

    }

    fileBytesEvent(event) {
     this.model = event;
     this.model.widgetName = "Consolidated Palm Oil dashboard";
     this.fileBytes.emit(this.model);
    }
}