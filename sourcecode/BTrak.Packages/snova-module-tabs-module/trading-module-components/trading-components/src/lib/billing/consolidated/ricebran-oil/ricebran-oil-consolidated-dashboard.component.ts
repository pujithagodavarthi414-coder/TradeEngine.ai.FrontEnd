import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
    selector: 'app-consolidated-ricebran-oil-dashboard',
    templateUrl: './ricebran-oil-consolidated-dashboard.component.html'
})

export class RicebranOilConsolidatedDashboard implements OnInit {
    @Output() fileBytes = new EventEmitter<any>();
    productGroup: string;
    model: any;
    constructor() {
        this.productGroup = "Ricebran Oil";
    }

    ngOnInit() {

    }

    fileBytesEvent(event) {
        this.model = event;
        this.model.widgetName = "Consolidated Ricebran Oil dashboard";
        this.fileBytes.emit(this.model);
       }
}