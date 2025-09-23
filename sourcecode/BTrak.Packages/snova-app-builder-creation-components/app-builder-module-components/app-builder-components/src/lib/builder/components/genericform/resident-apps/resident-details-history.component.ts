import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import * as _ from "underscore";
import { FormHistoryModel } from "../models/form-history.model";
import { GenericFormService } from "../services/generic-form.service";
import { State } from '@progress/kendo-data-query';
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../../models/dashboard-filter.model';
import { SoftLabelConfigurationModel } from '../../../models/softlabels.model';
import { SoftLabelPipe } from '../../../pipes/softlabels.pipes';
import { WidgetService } from '../../../services/widget.service';
import { LocalStorageProperties } from '../../../../globaldependencies/constants/localstorage-properties';
import { Dashboard } from '../../../models/dashboard.model';
import { ConstantVariables } from '../../../../globaldependencies/constants/constant-variables';

@Component({
    selector: "app-resident-details-history",
    templateUrl: "resident-details-history.component.html"
})

export class ResidentDetailsHistoryComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data != null && data !== undefined && data !== this.dashboardId) {
            this.dashboardId = data;
        }
    }

    @Input("dashboardName")
    set _dashboardName(data: string) {
        if (data != null && data !== undefined) {
            this.dashboardName = data;
        } else {
            this.dashboardName = "Form history";
        }
    }

    isEditAppName = false;
    changedAppName: string;
    dashboardId: string;
    dashboardName: string;
    validationMessage: string;
    formId: string;
    isAnyOperationIsInprogress = false;
    historyDetails = { data: [], total: 0 };
    sortBy: string;
    searchText: string;
    sortDirection: boolean;
    pageable: boolean = false;
    state: State = {
        skip: 0,
        take: 10,
    };

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];

    constructor(
        private route: ActivatedRoute, private genericFormService: GenericFormService,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService,
        private softLabelPipe: SoftLabelPipe, private snackbar: MatSnackBar, private translateService: TranslateService,
        private widgetService: WidgetService) {
        super();
        this.route.params.subscribe((params) => {
            if (params["formid"] != null && params["formid"] !== undefined) {
                this.formId = params["formid"];
                this.getResidentDetailsHistory();
            }
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
    }

    getSoftLabels() {
        this.softLabels = localStorage.getItem(LocalStorageProperties.SoftLabels) ? JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels)) : [];
    }

    getResidentDetailsHistory() {
        if (this.formId) {
            this.isAnyOperationIsInprogress = true;
            const formHistoryModel = new FormHistoryModel();
            formHistoryModel.genericFormSubmittedId = this.formId;
            formHistoryModel.pageSize = this.state.take;
            formHistoryModel.pageNumber = (this.state.skip / this.state.take) + 1;
            formHistoryModel.sortBy = this.sortBy;
            formHistoryModel.sortDirectionAsc = this.sortDirection;
            this.genericFormService.getFormHistory(formHistoryModel).subscribe((response: any) => {
                if (response.data && response.data.length > 0) {
                    response.data.findIndex(x => x.fieldName == 'submit') != -1 ?
                        response.data.splice(response.data.findIndex(x => x.fieldName == 'submit'), 1) : response.data;
                    this.historyDetails = {
                        data: response.data,
                        total: response.data.length > 0 ? response.data[0].totalCount : 0,
                    }
                    if ((response.data.length > 0)) {
                        this.pageable = true;
                    }
                }
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
        }
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getResidentDetailsHistory();
    }

    editAppName() {
        this.isEditAppName = true;
        this.changedAppName = this.dashboardName;
    }

    updateAppName() {
        if (this.changedAppName) {
            const dashBoardModel = new Dashboard();
            dashBoardModel.dashboardId = this.dashboardId;
            dashBoardModel.dashboardName = this.changedAppName;
            this.widgetService.updateDashboardName(dashBoardModel)
                .subscribe((responseData: any) => {
                    const success = responseData.success;
                    if (success) {
                        this.snackbar.open("App name updated successfully", this.translateService.instant(ConstantVariables.success),
                            { duration: 3000 });
                        this.dashboardName = JSON.parse(JSON.stringify(this.changedAppName));
                        this.changedAppName = '';
                        this.isEditAppName = false;
                        this.cdRef.detectChanges();
                    } else {
                        this.validationMessage = responseData.apiResponseMessages[0].message;
                        this.toastr.warning("", this.validationMessage);
                    }
                });
        } else {
            const message = this.softLabelPipe.transform("Please enter app name", this.softLabels);
            this.toastr.warning("", message);
        }
    }

    keyUpFunction(event) {
        if (event.keyCode == 13) {
            this.updateAppName();
        }
    }
}
