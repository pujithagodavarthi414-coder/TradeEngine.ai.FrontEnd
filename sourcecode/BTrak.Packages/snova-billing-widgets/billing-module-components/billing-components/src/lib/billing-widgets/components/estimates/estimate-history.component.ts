import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";

import { EstimateService } from "../../services/estimate.service";
import { EstimateInputModel } from "../../models/estimate-input.model";
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import '../../../globaldependencies/helpers/fontawesome-icons'

@Component({
    selector: "estimate-history",
    templateUrl: "estimate-history.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EstimateHistoryComponent {
    @Input("estimateId")
    set _estimateId(data: any) {
        if (data) {
            this.estimateId = data;
            this.loadHistory(this.estimateId);
        }
    }

    softLabels: SoftLabelConfigurationModel[];

    estimateHistory = [];

    estimateId: string;
    validationMessage: string;
    anyOperationIsInprogress: boolean = false;

    constructor(private estimateService: EstimateService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    loadHistory(estimateId) {
        this.anyOperationIsInprogress = true;
        let estimateModel = new EstimateInputModel();
        estimateModel.estimateId = estimateId;
        this.estimateService.getEstimateHistory(estimateModel).subscribe((result: any) => {
            if (result.success) {
                this.estimateHistory = result.data;
                this.anyOperationIsInprogress = false;
                this.cdRef.markForCheck();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.anyOperationIsInprogress = false;
                this.cdRef.markForCheck();
            }
        });
    }

    convertValue(value) {
        if (value == '' || value == null)
            return '0.00';
        else
            return parseFloat(value).toFixed(2);
    }
}