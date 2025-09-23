import { Component, OnInit, ViewChildren, Input, ChangeDetectorRef, ViewChild, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import * as _ from "underscore";
import * as commonModuleReducers from "../../store/reducers/index";
import { State, orderBy } from "@progress/kendo-data-query";
import { StatusreportService } from "../../services/statusreport.service";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../../models/soft-labels.model';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { ProbationConfigurationModel } from "../../models/probationConfiguration.model";

@Component({
    selector: "app-profile-configure-probation",
    templateUrl: "configure-probation.component.html"
})

export class ConfigureProbationComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteConfigurationPopup") deleteConfigurationPopup;
    @ViewChild("uniqueProbationDialog", { static: true }) private probationDialog: TemplateRef<any>;
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
    probationName: string;
    formJson: string;
    selectedRoleIds: any[];
    isDraft: boolean;
    probationConfigurationsList: GridDataResult = {
        data: [],
        total: 0
    };
    state: State = {
        skip: 0,
        take: 10
    };
    probationConfigurations: ProbationConfigurationModel[] = [];
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
        //if (this.canAccess_feature_ConfigureProbation == true) {
            this.getProbationConfigurations();
        //}
    }

    getProbationConfigurations() {
        this.state.skip = 0;
        this.state.take = 10;
        this.isAnyOperationIsInprogress = true;
        const configModel = new ProbationConfigurationModel();
        configModel.isArchived = false;
        configModel.isDraft = true;
        configModel.considerRole = false;
        configModel.ofUserId = null;
        this.statusreportService.GetProbationConfiguration(configModel).subscribe((result: any) => {
            if (result.success === true) {
                this.probationConfigurations = result.data;
                this.probationConfigurationsList = {
                    data: this.probationConfigurations.slice(this.state.skip, this.state.take + this.state.skip),
                    total: this.probationConfigurations.length
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
            this.probationConfigurations = orderBy(this.probationConfigurations, this.state.sort);
        }
        this.probationConfigurationsList = {
            data: this.probationConfigurations.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.probationConfigurations.length
        }
    }

    openAddNewConfiguration(row: ProbationConfigurationModel, isForConfiguration) {
        let dialogId = "unique-probation-dialog";
        const dialogRef = this.dialog.open(this.probationDialog, {
            width: "95vw",
            height: "93vh",
            maxWidth: "95vw",
            id: dialogId,
            data: {
                isForConfiguration,
                formData: null,
                formJson: row ? row.formJson : null,
                probationName: row ? row.configurationName : null,
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
                this.getProbationConfigurations();
            }
        });
    }

    openDeletePopup(row, deleteConfigurationPopup) {
        this.timeStamp = row.timeStamp;
        this.configurationId = row.configurationId;
        this.probationName = row.configurationName;
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
        const probationConfig = new ProbationConfigurationModel();
        probationConfig.configurationName = this.probationName;
        probationConfig.formJson = this.formJson;
        probationConfig.isDraft = this.isDraft;
        probationConfig.isArchived = true;
        probationConfig.timeStamp = this.timeStamp;
        probationConfig.configurationId = this.configurationId;
        probationConfig.selectedRoleIds = this.selectedRoleIds;
        this.statusreportService.UpsertProbationConfiguration(probationConfig).subscribe((result: any) => {
            if (result.success === true) {
                this.deleteConfigurationPopup.forEach((p) => { p.closePopover(); });
                this.getProbationConfigurations();
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
        this.probationName = null;
        this.formJson = null;
        this.isDraft = false;
        this.selectedRoleIds = [];
    }
}
