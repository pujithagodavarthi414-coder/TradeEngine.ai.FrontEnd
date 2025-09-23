import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
    selector: 'app-consolidated-sunflower-oil-dashboard',
    templateUrl: './sunflower-oil-consolidated-dashboard.component.html'
})

export class SunflowerOilConsolidatedDashboard implements OnInit {
    @Output() fileBytes = new EventEmitter<any>();
    productGroup: string;
    model: any;
    constructor() {
        this.productGroup = "Sun Flower Oil";
    }

    ngOnInit() {

    }

    fileBytesEvent(event) {
        this.model = event;
        this.model.widgetName = "Consolidated Sunflower Oil dashboard";
        this.fileBytes.emit(this.model);
       }
}