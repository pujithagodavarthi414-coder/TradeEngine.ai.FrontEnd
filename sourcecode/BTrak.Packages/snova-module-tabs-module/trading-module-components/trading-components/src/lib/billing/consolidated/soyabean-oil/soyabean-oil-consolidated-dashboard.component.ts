import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
    selector: 'app-consolidated-soyabean-oil-dashboard',
    templateUrl: './soyabean-oil-consolidated-dashboard.component.html'
})

export class SoyabeanOilConsolidatedDashboard implements OnInit {
    @Output() fileBytes = new EventEmitter<any>();
    productGroup: string;
    model: any;
    constructor() {
        this.productGroup = "Soyabean Oil";
    }

    ngOnInit() {

    }

    fileBytesEvent(event) {
        this.model = event;
        this.model.widgetName = "Consolidated Soyabean Oil dashboard";
        this.fileBytes.emit(this.model);
    }
}