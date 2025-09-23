import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import '../../../globaldependencies/helpers/fontawesome-icons'

@Component({
    selector: "estimate-details-preview",
    templateUrl: "estimate-details-preview.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EstimateDetailsPreviewComponent {
    @Input("estimateDetails")
    set _estimateDetails(data: any) {
        if (data) {
            this.estimateDetails = data;
        }
    }

    softLabels: SoftLabelConfigurationModel[];

    estimateDetails: any;

    constructor() {
        this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    calculateTaskTotal(task, rate) {
        return (task * rate).toFixed(2);
    }

    calculateItemTotal(price, quantity) {
        return (price * quantity).toFixed(2);
    }
}