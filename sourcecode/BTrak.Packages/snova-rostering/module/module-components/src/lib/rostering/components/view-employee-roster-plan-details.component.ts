import { Component, OnInit, Input, Inject } from "@angular/core";
import * as _ from "underscore";
import { RosterPlanOutput } from "../models/roster-planoutput-model";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { RosterPlanSolution } from "../models/roster-plan-solution-model";
import { process, State as KendoState } from "@progress/kendo-data-query";
import { CurrencyModel } from "../models/currency-model";
import { DataStateChangeEvent, GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { CommonService } from "../services/common.service";
import { ConstantVariables } from '../models/constant-variables';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Router } from '@angular/router';
import * as moment_ from "moment";
const moment = moment_;

export interface ViewRosterDialogData {
    solution: RosterPlanSolution;
    currency: CurrencyModel;
    dateFormat: any;
}

@Component({
    selector: "app-hr-component-view-roster-plan-details",
    templateUrl: `view-employee-roster-plan-details.component.html`
})

export class ViewRosterPlanDetailsComponent extends CustomAppBaseComponent implements OnInit {

    selectedPlan: RosterPlanOutput[];
    gridView: any;
    kendoState: KendoState;
    requestListGridData: GridDataResult;
    dateFormat: any;
    timePattern = "HH:mm";
    selectedCurrency: CurrencyModel;
    pageSize = 5;
    skip = 0;

    constructor(public dialogRef: MatDialogRef<ViewRosterPlanDetailsComponent>,
        private toastr: ToastrService, private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: ViewRosterDialogData, private commonService: CommonService) {
        super();
        this.selectedPlan = data.solution.plans;
        if (data.dateFormat && data.dateFormat.pattern) {
            this.dateFormat = data.dateFormat;
        } else {
            this.dateFormat = {};
            this.dateFormat.pattern = ConstantVariables.DateFormat;
        }
        if (data.currency && data.currency.currencyCode) {
            this.selectedCurrency = data.currency;
        } else {
            this.selectedCurrency = new CurrencyModel();
            this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
        }
    }

    ngOnInit() {
        this.kendoState = {
            skip: 0,
            take: 5,
            filter: {
                logic: 'or',
                filters: []
            }
        };
        this.loadGridData();
    }

    loadGridData() {
        this.gridView = {
            data: this.selectedPlan.slice(this.skip, this.skip + this.pageSize),
            total: this.selectedPlan.length
        }
        this.requestListGridData = process(this.gridView, this.kendoState);
    }

    closePopover(): void {
        this.dialogRef.close();
        this.gridView.data = [];
    }

    public dataStateChange(state: DataStateChangeEvent): void {
        this.kendoState = state;
        this.loadGridData();
    }

    public pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.loadGridData();
    }

    getDatewithFormat(dateObjet) {
        if (!dateObjet)
            return "";
        if (moment(dateObjet).isValid()) {
            let value = moment(dateObjet);
            return value.format("HH:mm");
        } else {
            let value = moment(dateObjet, "HH:mm:ss");
            return this.commonService.convertUtcToLocal(value).format("HH:mm");
        }
    }

    goToUserProfile(event, selectedUserId) {
        event.stopPropagation();
        this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
    }
}
