import { Component, OnInit, ViewChildren, Input, ChangeDetectorRef, ViewChild, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import * as _ from "underscore";
import * as commonModuleReducers from "../../store/reducers/index";
import { State, orderBy } from "@progress/kendo-data-query";
import { PerformanceConfigurationModel } from "../../models/performanceConfigurationModel";
import { StatusreportService } from "../../services/statusreport.service";
import { PerformanceDialogComponent } from "./performanceDialog.component";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../../models/soft-labels.model';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-profile-configure-performance",
    templateUrl: "./configure-performance.component.html"
})

export class ConfigurePerformanceComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteConfigurationPopup") deleteConfigurationPopup;
    @ViewChild("uniquePerformanceDialog", { static: true }) private performanceDialog: TemplateRef<any>;
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
    performanceConfigurations: PerformanceConfigurationModel[] = [];
    softLabels: SoftLabelConfigurationModel[];
    roleFeaturesIsInProgress$: Observable<Boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;

    constructor(
        public dialog: MatDialog, private statusreportService: StatusreportService,
        private toastr: ToastrService, public googleAnalyticsService: GoogleAnalyticsService,
        private store: Store<State>, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
        if (this.canAccess_feature_ConfigurePerformance == true) {
            this.getPerformanceConfigurations();
        }
    }

    getPerformanceConfigurations() {
        this.state.skip = 0;
        this.state.take = 10;
        this.isAnyOperationIsInprogress = true;
        const configModel = new PerformanceConfigurationModel();
        configModel.isArchived = false;
        configModel.isDraft = true;
        configModel.considerRole = false;
        configModel.ofUserId = null;
        this.statusreportService.GetPerformanceConfiguration(configModel).subscribe((result: any) => {
            if (result.success === true) {
                this.performanceConfigurations = result.data;
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

    openAddNewConfiguration(row: PerformanceConfigurationModel, isForConfiguration) {
        let dialogId = "unique-performance-dialog";
        const dialogRef = this.dialog.open(this.performanceDialog, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                isForConfiguration,
                formData: null,
                formJson: row ? row.formJson : null,
                performanceName: row ? row.configurationName : null,
                timeStamp: row ? row.timeStamp : null,
                configurationId: row ? row.configurationId : null,
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
                this.getPerformanceConfigurations();
            }
        });
    }

    openDeletePopup(row, deleteConfigurationPopup) {
        this.timeStamp = row.timeStamp;
        this.configurationId = row.configurationId;
        this.performanceName = row.configurationName;
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
        const performanceConfig = new PerformanceConfigurationModel();
        performanceConfig.configurationName = this.performanceName;
        performanceConfig.formJson = this.formJson;
        performanceConfig.isDraft = this.isDraft;
        performanceConfig.isArchived = true;
        performanceConfig.timeStamp = this.timeStamp;
        performanceConfig.configurationId = this.configurationId;
        performanceConfig.selectedRoleIds = this.selectedRoleIds;
        this.statusreportService.UpsertPerformanceConfiguration(performanceConfig).subscribe((result: any) => {
            if (result.success === true) {
                this.deleteConfigurationPopup.forEach((p) => { p.closePopover(); });
                this.getPerformanceConfigurations();
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
}
