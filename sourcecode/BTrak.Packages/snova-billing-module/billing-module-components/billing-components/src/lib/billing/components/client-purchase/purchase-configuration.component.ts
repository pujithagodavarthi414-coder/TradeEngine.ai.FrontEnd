import { Component, OnInit, ViewChildren, Input, ChangeDetectorRef, ViewChild, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import * as _ from "underscore";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import '../../../globaldependencies/helpers/fontawesome-icons';
import { AppBaseComponent } from "../componentbase";
import { DashboardFilterModel } from "../../models/dashboardFilterModel";
import { orderBy, State } from "@progress/kendo-data-query";
import { SoftLabelConfigurationModel } from "../../models/softlabels-model";
import { BillingDashboardService } from "../../services/billing-dashboard.service";
import { ContractConfigurationModel } from "../../models/purchase-contract";

@Component({
    selector: "app-purchase-configuration",
    templateUrl: "./purchase-configuration.component.html"
})

export class PurchaseContractComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("deleteConfigurationPopup") deleteConfigurationPopup;
    @ViewChild("uniquePurchaseDialog", { static: true }) private purchaseDialog: TemplateRef<any>;
    temp: ContractConfigurationModel[];
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    searchText:string;
    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean;
    validationMessage: string;
    timeStamp: any;
    configurationId: string;
    performanceName: string;
    formJson: string;
    selectedRoleIds: any[];
    isDraft: boolean;
    performanceConfigurationsList: GridDataResult = {
        data: [],
        total: 0
    };
    state: State = {
        skip: 0,
        take: 10
    };
    performanceConfigurations: ContractConfigurationModel[] = [];
    softLabels: SoftLabelConfigurationModel[];
    roleFeaturesIsInProgress$: Observable<Boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;

    constructor(
        public dialog: MatDialog, private statusreportService: BillingDashboardService,
        private toastr: ToastrService,
        private store: Store<State>, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();

        this.GetPurchaseConfiguration();

    }

    GetPurchaseConfiguration() {
        this.state.skip = 0;
        this.state.take = 10;
        this.isAnyOperationIsInprogress = true;
        const configModel = new ContractConfigurationModel();
        configModel.isArchived = false;
        configModel.isDraft = true;
        configModel.considerRole = false;
        configModel.ofUserId = null;
        this.statusreportService.GetPurchaseConfiguration(configModel).subscribe((result: any) => {
            if (result.success === true) {
                this.performanceConfigurations = result.data;
                this.temp =this.performanceConfigurations;
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

    openAddNewConfiguration(row: ContractConfigurationModel, isForConfiguration) {
        let dialogId = "unique-purchase-dialog";
        const dialogRef = this.dialog.open(this.purchaseDialog, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                isForConfiguration,
                formData: null,
                formJson: row ? row.formJson : null,
                performanceName: row ? row.purchaseName : null,
                timeStamp: row ? row.timeStamp : null,
                configurationId: row ? row.purchaseId : null,
                isDraft: row ? row.isDraft : false,
                isEdit: false,
                isForApproval: false,
                selectedRoleIds: row ? row.selectedRoleIds : [],
                dialogId: dialogId
            }
        });
        dialogRef.afterClosed().subscribe((isReloadRequired: any) => {
            // this.dialog.closeAll();
            if (isReloadRequired.success == true) {
                this.GetPurchaseConfiguration();
            }
        });
    }

    openDeletePopup(row, deleteConfigurationPopup) {
        this.timeStamp = row.timeStamp;
        this.configurationId = row.purchaseId;
        this.performanceName = row.purchaseName;
        this.formJson = row.formJson;
        this.isDraft = row.isDraft;
        this.selectedRoleIds = row.selectedRoleIds;
        deleteConfigurationPopup.openPopover();
    }

    closeDeletePopup() {
        this.clearForm();
        this.deleteConfigurationPopup.forEach((p) => { p.closePopover(); });
    }

    deleteConfiguration() {
        const performanceConfig = new ContractConfigurationModel();
        performanceConfig.purchaseName = this.performanceName;
        performanceConfig.formJson = this.formJson;
        performanceConfig.isDraft = this.isDraft;
        performanceConfig.isArchived = true;
        performanceConfig.timeStamp = this.timeStamp;
        performanceConfig.purchaseId = this.configurationId;
        performanceConfig.selectedRoleIds = this.selectedRoleIds;
        this.statusreportService.UpsertPurchaseConfiguration(performanceConfig).subscribe((result: any) => {
            if (result.success === true) {
                this.deleteConfigurationPopup.forEach((p) => { p.closePopover(); });
                this.GetPurchaseConfiguration();
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
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
        this.selectedRoleIds = [];
    }
    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
        const temp = this.temp.filter(address => (address.purchaseName.toLowerCase().indexOf(this.searchText) > -1));

        this.performanceConfigurations = temp;
    }

    closeSearch() {
        this.searchText = '';
        this.filterByName(null);
    }
}
