import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatSnackBar } from "@angular/material/snack-bar";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import * as commonModuleReducers from "../../store/reducers/index";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import * as _ from "underscore";
import { FormSubmissionModel } from "../../models/formsubmission.Model";
import { PerformanceModel } from "../../models/performanceModel";
import { StatusreportService } from "../../services/statusreport.service";
import { FormSubmissionDialogComponent } from "./formSubmissionDialog.component";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardService } from '../../services/dashboard.service';
import { SoftLabelPipe } from '../../pipes/soft-labels.pipe';
import { SoftLabelConfigurationModel, WorkspaceDashboardFilterModel } from '../../models/soft-labels.model';
import { DashboardFilterModel } from '../../models/dashboardfilter.model';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { Dashboard } from '../../models/dashboard.model';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-custom-form-submit",
    templateUrl: "./form-submission.component.html"
})

export class CustomFormSubmissionsComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteConfigurationPopup") deleteConfigurationPopup;
    @ViewChild("uniqueFormSubmissionDialog", { static: true }) private formSubmissionDialog: TemplateRef<any>;
    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data != null && data !== undefined && data !== this.dashboardId) {
            this.state.take = 30;
            this.state.skip = 0;
            this.dashboardId = data;
            this.getFormDashboardFilter();
        }
    }

    @Input("dashboardName")
    set _dashboardName(data: string) {
        if (data != null && data !== undefined) {
            this.dashboardName = data;
        } else {
            this.dashboardName = this.translateService.instant("FORMSUBMISSION.FORMSUBMISSIONS");
        }
    }

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    isEditAppName: boolean = false;
    changedAppName: string;
    dashboardId: string;
    dashboardName: string;
    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean;
    validationMessage: string;
    timeStamp: any;
    configurationId: string;
    performanceName: string;
    formJson: string;
    performance: PerformanceModel;
    isDraft: boolean;
    totalCount = 0;
    state: State = {
        skip: 0,
        take: 30
    };
    pagable = false;
    isFromClosed = false;
    assignedByYou = false;
    approver: string;
    showTitleTooltip = false;
    users: any;
    searchText: string;
    workspaceDashboardFilterId: string;
    sortBy: string;
    sortDirection: boolean;
    formTypes: any;
    genericFormListDetails: any;
    formSubmissions: GridDataResult;
    formTypeId: string;
    softLabels: SoftLabelConfigurationModel[];
    roleFeaturesIsInProgress$: Observable<Boolean>;
    selectedConfigurationId: string;
    genericFormId: any;
    referenceId: string;
    userId: string;
    formForSubmit: FormSubmissionModel;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

    constructor(
        public dialog: MatDialog, private statusreportService: StatusreportService,
        private toastr: ToastrService, public googleAnalyticsService: GoogleAnalyticsService,
        public translateService: TranslateService, private cookieService: CookieService,
        private softLabelPipe: SoftLabelPipe, private cdRef: ChangeDetectorRef,
        private dashboardService: DashboardService, private snackbar: MatSnackBar,
        private store: Store<State>) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.statusreportService.GetFormTypes().subscribe((response: any) => {
            this.formTypes = response.data;
        });
        this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.dashboardService.getUsersDropDown('').subscribe((response: any) => {
            this.users = response.data;
        });
        this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
        if (this.canAccess_feature_ManageCustomFormSubmissions == true && !this.dashboardId) {
            this.state.take = 30;
            this.state.skip = 0;
            this.getFormSubmissions();
        }
    }

    getForms(formTypeId) {
        this.genericFormListDetails = [];
        this.formTypeId = formTypeId;
        this.statusreportService.GetGenericFormsByTypeId(formTypeId).subscribe((response: any) => {
            this.genericFormListDetails = response.data;
        })
    }

    openMenu() {
        this.formTypeId = null;
    }

    formIdSelected(genericFormId) {
        this.trigger.closeMenu();
        this.referenceId = null;
        this.formForSubmit = new FormSubmissionModel();
        this.formForSubmit.genericFormId = genericFormId;
        this.formForSubmit.status = "New";
        this.formForSubmit.assignedByUserId = this.userId;
        const index = this.genericFormListDetails.findIndex((p) => p.id == genericFormId);
        this.formForSubmit.formJson = this.genericFormListDetails[index].formJson;
        this.selectedFormForSubmission();
    }

    openDeletePopup(row, deleteConfigurationPopup, isFromClosed) {
        this.formForSubmit = new FormSubmissionModel()
        this.formForSubmit = row;
        this.isFromClosed = isFromClosed;
        deleteConfigurationPopup.openPopover();
    }

    closeDeletePopup() {
        this.formForSubmit = new FormSubmissionModel()
        this.deleteConfigurationPopup.forEach((p) => { p.closePopover(); });
    }

    deletePopup() {
        this.formForSubmit.status = this.isFromClosed == true ? "Closed" : "Reopened";
        this.upsertFormSubmission();
    }

    editFormSubmission(row) {
        this.referenceId = row.formSubmissionId;
        this.formForSubmit = new FormSubmissionModel();
        this.formForSubmit = row;
        this.selectedFormForSubmission();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    getFormSubmissions() {
        this.isAnyOperationIsInprogress = true;
        const formSubmissionModel = new FormSubmissionModel();
        formSubmissionModel.assignedByYou = !this.assignedByYou;
        formSubmissionModel.sortBy = this.sortBy;
        formSubmissionModel.sortDirectionAsc = this.sortDirection;
        formSubmissionModel.searchText = this.searchText;
        formSubmissionModel.pageSize = this.state.take;
        formSubmissionModel.pageNumber = (this.state.skip / this.state.take) + 1;
        this.dashboardService.getAllCustomFormSubmission(formSubmissionModel).subscribe((result: any) => {
            if (result.success === true) {
                if (result.data.length > 0) {
                    this.totalCount = result.data[0].totalCount;
                } else {
                    this.totalCount = 0;
                }
                if ((this.totalCount > this.state.take)) {
                    this.pagable = true;
                } else {
                    this.pagable = false;
                }
                this.formSubmissions = {
                    data: result.data,
                    total: result.data.length > 0 ? result.data[0].totalCount : 0
                }
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    closeSearch() {
        this.searchText = null;
        this.getFormSubmissions();
        this.updateFormDashboardFilter();
    }

    searchByInput(event) {
        if (event.keyCode == 13) {
            this.getFormSubmissions();
            this.updateFormDashboardFilter();
        }
    }

    delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    updateFormDashboardFilter() {
        if (this.dashboardId) {
            let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
            workspaceDashboardFilterModel.workspaceDashboardId = this.dashboardId;
            workspaceDashboardFilterModel.workspaceDashboardFilterId = this.workspaceDashboardFilterId;
            let filters = new WorkspaceDashboardFilterModel();
            filters.searchText = this.searchText;
            filters.isArchived = this.assignedByYou;
            filters.state = this.state;
            workspaceDashboardFilterModel.filterJson = JSON.stringify(filters);
            this.dashboardService.updateworkspaceDashboardFilter(workspaceDashboardFilterModel)
                .subscribe((responseData: any) => {
                    if (responseData.success) {
                        this.workspaceDashboardFilterId = responseData.data;
                        this.cdRef.detectChanges();
                    } else {
                        this.validationMessage = responseData.apiResponseMessages[0].message;
                        this.toastr.warning("", this.validationMessage);
                        this.cdRef.markForCheck();
                    }
                });
        }
    }

    getFormDashboardFilter() {
        this.isAnyOperationIsInprogress = true;
        let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
        workspaceDashboardFilterModel.workspaceDashboardId = this.dashboardId;
        this.dashboardService.getWorkspaceDashboardFilter(workspaceDashboardFilterModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    if (responseData.data && responseData.data.length > 0) {
                        let dashboardFilters = responseData.data[0];
                        this.workspaceDashboardFilterId = dashboardFilters.workspaceDashboardFilterId;
                        let filters = JSON.parse(dashboardFilters.filterJson);
                        this.searchText = filters.searchText == undefined ? null : filters.searchText;
                        this.assignedByYou = filters.isArchived;
                        this.state = filters.state;
                        if (this.state.sort && this.state.sort[0]) {
                            this.sortBy = this.state.sort[0].field;
                            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
                        }
                        this.getFormSubmissions();
                        this.cdRef.detectChanges();
                    } else {
                        this.getFormSubmissions();
                    }
                } else {
                    this.getFormSubmissions();
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.warning("", this.validationMessage);
                }
            });
    }

    selectedFormForSubmission() {
        let dialogId = "unique-form-submission-dialog";
        const dialogRef = this.dialog.open(this.formSubmissionDialog, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                formData: this.formForSubmit ? this.formForSubmit.formData ? this.formForSubmit.formData : null : null,
                formJson: this.formForSubmit ? this.formForSubmit.formJson ? this.formForSubmit.formJson : null : null,
                referenceId: this.referenceId,
                users: this.users,
                assignedToUserId: this.formForSubmit.assignedToUserId,
                dialogId: dialogId
            }
        });
        dialogRef.afterClosed().subscribe((data: FormSubmissionModel) => {
            // this.dialog.closeAll();
            if (data !=undefined && data != null) {
                this.isAnyOperationIsInprogress = true;
                if (this.formForSubmit.assignedByUserId &&
                    this.formForSubmit.assignedByUserId.toString().toLowerCase() != this.userId.toString().toLowerCase()) {
                    this.formForSubmit.status = "In progress";
                }
                this.formForSubmit.assignedToUserId = data.assignedToUserId;
                this.formForSubmit.formData = data.formData;
                this.formForSubmit.isArchived = false;
                this.upsertFormSubmission();
            }
        });
    }

    upsertFormSubmission() {
        this.dashboardService.UpsertCustomFormSubmission(this.formForSubmit).subscribe((result: any) => {
            if (result.success === true) {
                this.getFormSubmissions();
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getFormSubmissions();
        this.updateFormDashboardFilter();
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
            this.dashboardService.updateDashboardName(dashBoardModel)
                .subscribe((responseData: any) => {
                    const success = responseData.success;
                    if (success) {
                        this.snackbar.open("App name updated successfully",
                            this.translateService.instant(ConstantVariables.success), { duration: 3000 });
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

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.configurationId = null;
        this.performanceName = null;
        this.formJson = null;
        this.isDraft = false;
    }

}
