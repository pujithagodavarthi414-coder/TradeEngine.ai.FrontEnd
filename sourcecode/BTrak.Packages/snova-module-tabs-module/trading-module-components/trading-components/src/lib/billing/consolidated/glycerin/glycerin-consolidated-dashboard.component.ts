import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
    selector: 'app-consolidated-glycerin-dashboard',
    templateUrl: './glycerin-consolidated-dashboard.component.html'
})

export class GlycerinConsolidatedDashboard implements OnInit {
    @Output() fileBytes = new EventEmitter<any>();
    productGroup: string;
    model: any;
    constructor() {
        this.productGroup = "Glycerin";
    }

    ngOnInit() {

    }

    fileBytesEvent(event) {
        this.model = event;
        this.model.widgetName = "Consolidated Glycerin dashboard";
        this.fileBytes.emit(this.model);
       }
}