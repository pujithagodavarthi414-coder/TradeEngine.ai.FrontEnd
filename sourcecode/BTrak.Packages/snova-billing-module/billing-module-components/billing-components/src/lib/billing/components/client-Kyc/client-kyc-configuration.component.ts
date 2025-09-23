import { Component, OnInit, ViewChildren, Input, ChangeDetectorRef, ViewChild, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { KycConfigurationModel } from "../../models/clientKyc.model";
import { DashboardFilterModel } from "../../models/dashboardFilterModel";
import { SoftLabelConfigurationModel } from "../../models/softlabels-model";
import { AppBaseComponent } from "../componentbase";
import * as _ from "underscore";
import { BillingDashboardService } from "../../services/billing-dashboard.service";
import { SoftLabelPipe } from "../../pipes/softlabels.pipes";


@Component({
    selector: "app-client-kyc-configuration",
    templateUrl: "./client-kyc-configuration.component.html"
})
export class ClientKycConfigurationComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("deleteConfigurationPopup") deleteConfigurationPopup;
    @ViewChild("uniqueKycDialog", { static: true }) private kycConfigDialog: TemplateRef<any>;
    selectedLegalEntityIds: any;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }
    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean;
    validationMessage: string;
    timeStamp: any;
    configurationId: string;
    performanceName: string;
    searchText : string;
    formJson: string;
    // selectedRoleIds: any[];
    // clientTypeId: any;
    // clientType: any;
    isDraft: boolean;
    performanceConfigurationsList: GridDataResult = {
        data: [],
        total: 0
    };
    state: State = {
        skip: 0,
        take: 10
    };
    performanceConfigurations: KycConfigurationModel[] = [];
    temp : KycConfigurationModel[] = [];
    softLabels: SoftLabelConfigurationModel[];
    roleFeaturesIsInProgress$: Observable<Boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;

    constructor(
        public dialog: MatDialog, private clientForm: SoftLabelPipe,
        private statusreportService: BillingDashboardService,
        private toastr: ToastrService,
        private store: Store<State>, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();

        this.getKycConfigurations();

    }

    getKycConfigurations() {
        this.state.skip = 0;
        this.state.take = 10;
        this.isAnyOperationIsInprogress = true;
        const configModel = new KycConfigurationModel();
        configModel.isArchived = false;
        configModel.isDraft = true;
        // configModel.considerRole = false;
        configModel.ofUserId = null;
        this.statusreportService.GetClientKycConfiguration(configModel).subscribe((result: any) => {
            if (result.success === true) {
                this.performanceConfigurations = result.data;
                this.temp = this.performanceConfigurations;
                this.performanceConfigurationsList = {
                    data: this.performanceConfigurations.slice(this.state.skip, this.state.take + this.state.skip),
                    total: this.performanceConfigurations.length
                }
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort) {
            this.performanceConfigurations = orderBy(this.performanceConfigurations, this.state.sort);
        }
        this.performanceConfigurationsList = {
            data: this.performanceConfigurations.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.performanceConfigurations.length
        }
    }

    openAddNewConfiguration(row: KycConfigurationModel, isForConfiguration) {
        let dialogId = "unique-Kyc-dialog";
        const dialogRef = this.dialog.open(this.kycConfigDialog, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                isForConfiguration,
                formData: null,
                formJson: row ? row.formJson : null,
                performanceName: row ? row.clientKycName : null,
                timeStamp: row ? row.timeStamp : null,
                configurationId: row ? row.clientKycId : null,
                isDraft: row ? row.isDraft : false,
                isEdit: false,
                isForApproval: false,
                selectedRoleIds: row ? row.selectedRoleIds : [],
                selectedLegalEntityIds: row ? row.selectedLegalEntityIds : [],
                // clientTypeId: row ? row.clientTypeId : null,
                // clientType: row ? row.clientType : null,
                legalEntityTypeId: row ? row.legalEntityTypeId : null,
                dialogId: dialogId,
                formBgColor: row ? row.formBgColor: null
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.getKycConfigurations();
            this.cdRef.detectChanges();
        });
    }

    openDeletePopup(row, deleteConfigurationPopup) {
        this.timeStamp = row.timeStamp;
        this.configurationId = row.clientKycId;
        this.performanceName = row.clientKycName;
        this.formJson = row.formJson;
        this.isDraft = row.isDraft;
        // this.selectedRoleIds = row.selectedRoleIds;
        this.selectedLegalEntityIds = row.selectedLegalEntityIds;
        // this.clientTypeId = row.clientTypeId;
        // this.clientType = row.clientType;
        deleteConfigurationPopup.openPopover();
    }

    closeDeletePopup() {
        this.clearForm();
        this.deleteConfigurationPopup.forEach((p) => { p.closePopover(); });
    }

    deleteConfiguration() {
        const performanceConfig = new KycConfigurationModel();
        performanceConfig.clientKycName = this.performanceName;
        performanceConfig.formJson = this.formJson;
        performanceConfig.isDraft = this.isDraft;
        performanceConfig.isArchived = true;
        performanceConfig.isFromApp = true;
        performanceConfig.timeStamp = this.timeStamp;
        performanceConfig.clientKycId = this.configurationId;
        // performanceConfig.selectedRoleIds = this.selectedRoleIds;
        performanceConfig.selectedLegalEntityIds = this.selectedLegalEntityIds;
        // performanceConfig.clientTypeId = this.clientTypeId;
        this.statusreportService.UpsertClientKycConfiguration(performanceConfig).subscribe((result: any) => {
            if (result.success === true) {
                this.deleteConfigurationPopup.forEach((p) => { p.closePopover(); });
                this.getKycConfigurations();
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error("This configuration is used for client please delete the dependencies before deleting the configuration");
            }
        })

    }

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.configurationId = null;
        this.performanceName = null;
        this.formJson = null;
        this.isDraft = false;
        // this.clientTypeId = null;
        // this.clientType = null;
        // this.selectedRoleIds = [];
        this.selectedLegalEntityIds = [];
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((kyc) =>
            (kyc.clientKycName.toLowerCase().indexOf(this.searchText) > -1)));
            this.performanceConfigurationsList = {
                data: temp.slice(this.state.skip, this.state.take + this.state.skip),
                total: temp.length
            }
    }

    closeSearch() {
        this.searchText = null;
        this.filterByName(null);
    }
}