import { Component, ViewChildren, ChangeDetectorRef, Input, OnInit, ViewChild, TemplateRef, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ProductivityDashboardService } from "../services/productivity-dashboard.service";
import { WorkLoggingReportModel } from "../models/workLoggingReport";
import { HrDashboardService } from "../services/hr-dashboard.service";
import { LineManagersModel } from "../models/line-mangaers-model";
import { ToastrService } from "ngx-toastr";
import { TeamLeadsService } from "../services/teamleads.service";
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import * as commonModuleReducers from "../store/reducers/index";
import * as roleState from "../store/reducers/authentication.reducers";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { Page } from '../models/Page.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { State } from '@progress/kendo-data-query';
import { Persistance } from '../models/persistance.model';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { DashboardService } from '../services/dashboard.service';
import { TranslateService } from '@ngx-translate/core';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { DatePipe } from '@angular/common';
import { SearchCommitModel } from '../models/search-repository-commits.model';
import { RepositoryCommitsModel } from '../models/repository-commits.model';

@Component({
    selector: 'app-dashboard-component-workLoggingReport',
    templateUrl: 'work-logging-report.component.html',
})

export class EmployeeWorkLoggingReportComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("commentPopUp") commentPopover;
    @ViewChildren("commitPopUp") commitPopover;
    @ViewChild("uniqueUserstoryDialogWorkLogging", { static: true }) private uniqueUserstoryDialog: TemplateRef<any>;
    @ViewChild("screenShotComponent", { static: true }) private screenShotComponent: TemplateRef<any>;

    @Output() closePopUp = new EventEmitter<any>();
    Offset: string;

    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data != null && data !== undefined && data !== this.persistanceId) {
            this.persistanceId = data;
        }
    }

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.selectedEmployeeId = null;
            this.dashboardFilters = data;

        }
    }

    columns = [];

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean = false;
    isPermissionForWorkLog: Boolean;
    loggingReport: any;
    validationMessage: string;
    selectedUserId: string;
    persistanceId: string;
    persistanceObject: any;
    sortDirection: boolean;
    page = new Page();
    searchText: string = '';
    sortBy: string;
    fromDate: Date = new Date();
    isOpen: boolean = true;
    toDate: Date = new Date();
    minDate = this.fromDate;
    employeeList: any;
    lineManager: LineManagersModel[];
    selectedLineId: string;
    selectedEmployeeId: string;
    selectLineManagerfilter: boolean = false;
    selectEmployeeFilterIsActive: boolean = false;
    scroll: boolean = false;
    pageable: boolean = false;
    loadingIndicator: boolean = false;
    commits: RepositoryCommitsModel[] = [];
    comments: any;
    softLabels: SoftLabelConfigurationModel[];
    roleFeaturesIsInProgress$: Observable<boolean>;

    state: State = {
        skip: 0,
        take: 20,
    };

    constructor(
        private productivityDashboardService: ProductivityDashboardService,
        private cdRef: ChangeDetectorRef, private router: Router,
        private cookieService: CookieService,
        private teamLeadsService: TeamLeadsService,
        private hrdashboardservice: HrDashboardService,
        private dashboardService: DashboardService,
        private translateService: TranslateService, public dialog: MatDialog,
        private toaster: ToastrService, private store: Store<roleState.State>, private datePipe: DatePipe) {
        super();
        // if (this.router.url.split("/")[3] && this.router.url.includes('projects')) {
        //     this.selectedUserId = this.router.url.split("/")[3];
        // } else {
        //     this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        // }
    }

    ngOnInit() {
        super.ngOnInit();
        this.Offset=String (-(new Date().getTimezoneOffset()));
        this.isPermissionForWorkLog = this.canAccess_feature_EmployeeWorkLogReport;
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.state.skip = 0;
        this.state.take = 20;
        this.getSoftLabels();
        if (this.isPermissionForWorkLog) {
            this.oneMonthBack();
            // this.getWorkLoggingReport();
            this.getPersistance();
            this.getAllEmployees();
            this.getLineManagers();
        }
        this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    onVisibilityChange(event) {
        let columns = event.columns;
        if (columns && columns.length > 0) {
            // this.columns = [];
            for (let i = 0; i < columns.length; i++) {
                let object = {};
                object['field'] = columns[i].field;
                object['hidden'] = columns[i].hidden;
                let index = this.columns.findIndex(x => x.field == columns[i].field);
                if (index == -1)
                    this.columns.push(object);
                else {
                    this.columns[index].field = columns[i].field;
                    this.columns[index].hidden = columns[i].hidden;
                }
            }
            this.persistanceObject.columns = this.columns;
            this.updatePersistance();
        }
    }

    checkVisibility(fieldName) {
        let index = this.columns.findIndex(x => x.field == fieldName);
        if (index != -1) {
            return this.columns[index].hidden;
        }
        else {
            return false;
        }
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getWorkLoggingReport();
    }

    updatePersistance() {
        let persistance = new Persistance();
        if (this.persistanceId) {
            persistance.referenceId = this.persistanceId;
            persistance.isUserLevel = true;
            persistance.persistanceJson = JSON.stringify(this.persistanceObject);
            this.dashboardService.UpsertPersistance(persistance).subscribe((response: any) => {
                if (response.success) {
                    // this.persistanceId = response.data;
                }
            });
        }
    }

    getPersistance() {
        if (this.persistanceId) {
            let persistance = new Persistance();
            persistance.referenceId = this.persistanceId;
            persistance.isUserLevel = true;
            this.dashboardService.GetPersistance(persistance).subscribe((response: any) => {
                if (response.success) {
                    if (response.data) {
                        let result = response.data;
                        let data = JSON.parse(result.persistanceJson);
                        this.setPersistanceValues(data);
                        this.getWorkLoggingReport();
                    }
                    else {
                        this.getWorkLoggingReport();
                    }
                }
                else {
                    this.getWorkLoggingReport();
                }
            });
        }
        else {
            this.getWorkLoggingReport();
        }
    }

    setPersistanceValues(data) {
        this.state = data.state;
        this.columns = (data.columns == null || data.columns.length == 0) ? [] : data.columns;
        this.selectedUserId = data.userId;
        this.fromDate = data.dateFrom;
        this.toDate = data.dateTo;
        // this.selectedEmployeeId = data.userId;
        this.selectedLineId = data.lineManagerId;
        this.cdRef.detectChanges();
    }
    
    SearchRepositoryCommits(data, commitPopUp) {
        this.loadingIndicator = true;
        let searchCommits = new SearchCommitModel();
        searchCommits.userId = data.userId;
        searchCommits.onDate = data.date;
        searchCommits.searchText = data.userStoryUniqueName + ":";
        this.dashboardService.SearchRepositoryCommits(searchCommits).subscribe((responseData: any) => {
            if (responseData.success == false || responseData.data == null) {
                this.commits = [];
            } else {
                this.commits = responseData.data;
            }
            this.loadingIndicator = false;
            this.cdRef.detectChanges();
        });
        commitPopUp.openPopover();
        this.cdRef.detectChanges();
    }
    
    openInNewTab(dataItem) {
        if (dataItem.commitReferenceUrl) {
            window.open(dataItem.commitReferenceUrl, "_blank");
        }
    }

    closeCommitPopOver() {
        this.commitPopover.forEach((p) => p.closePopover());
    }


    // onSort(event) {
    //     const sort = event.sorts[0];
    //     this.sortBy = sort.prop;
    //     if (sort.dir === 'asc') {
    //         this.sortDirection = true;
    //     } else {
    //         this.sortDirection = false;
    //     }
    //     this.page.size = 30;
    //     this.page.pageNumber = 0;
    //     this.getWorkLoggingReport();
    // }

    // setPage(pageInfo) {
    //     this.page.pageNumber = pageInfo.offset;
    //     this.getWorkLoggingReport();
    // }

    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.fromDate = event.target.value;
        this.minDate = this.fromDate;
        this.state.skip = 0;
        this.state.take = 20;
        this.getWorkLoggingReport();
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.target.value;
        this.state.skip = 0;
        this.state.take = 20;
        this.getWorkLoggingReport();
    }

    commentView(row, commentPopUp) {
        this.comments = row.commentsList;
        commentPopUp.openPopover();
    }

    closePopOver() {
        this.commentPopover.forEach((p) => p.closePopover());
    }

    getWorkLoggingReport() {
        this.isAnyOperationIsInprogress = true;
        this.scroll = false;
        var workLoggingReportModel = new WorkLoggingReportModel();
        workLoggingReportModel.userId = this.selectedUserId;
        workLoggingReportModel.dateFrom = this.fromDate;
        workLoggingReportModel.dateTo = this.toDate;
        // workLoggingReportModel.userId = this.selectedEmployeeId;
        workLoggingReportModel.lineManagerId = this.selectedLineId;
        workLoggingReportModel.sortBy = this.sortBy;
        workLoggingReportModel.sortDirectionAsc = this.sortDirection;
        // workLoggingReportModel.pageNumber = this.page.pageNumber + 1;
        // workLoggingReportModel.pageSize = this.page.size;
        workLoggingReportModel.pageNumber = (this.state.skip / this.state.take) + 1;
        workLoggingReportModel.pageSize = this.state.take;
        workLoggingReportModel.projectId = (this.dashboardFilters && this.dashboardFilters.projectId) ? this.dashboardFilters.projectId : null;

        workLoggingReportModel.state = this.state;
        workLoggingReportModel.columns = this.columns;
        this.persistanceObject = workLoggingReportModel;
        this.updatePersistance();

        this.productivityDashboardService.getWorkLogging(workLoggingReportModel).subscribe((response: any) => {
            if (response.success == true) {
                // this.loggingReport = response.data;
                // this.page.totalElements = this.loggingReport.length > 0 ? this.loggingReport[0].totalCount : 0;
                // this.page.totalPages = this.page.totalElements / this.page.size;
                this.loggingReport = {
                    data: response.data,
                    total: response.data.length > 0 ? response.data[0].totalCount : 0,
                }
                if (this.loggingReport.total > this.state.take) {
                    this.pageable = true;
                }
                else {
                    this.pageable = false;
                }
                this.isAnyOperationIsInprogress = false;
                this.scroll = true;
                this.cdRef.detectChanges();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.toaster.error(this.validationMessage);
                this.cdRef.detectChanges();
            }
        })
    }

    getAllEmployees() {
        this.teamLeadsService.getTeamLeadsList().subscribe((response: any) => {
            if (response.success == true) {
                this.employeeList = response.data;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        })
    }

    selectedEmployeesId(employeeId) {
        if (employeeId == "all") {
            this.selectedUserId = null;
            this.selectEmployeeFilterIsActive = false;
        } else {
            this.selectedUserId = employeeId;
            this.selectEmployeeFilterIsActive = true;
        }
        this.state.skip = 0;
        this.state.take = 20;
        this.getWorkLoggingReport();
    }

    getLineManagers() {
        let searchText = '';
        this.hrdashboardservice.getLineManagers(searchText).subscribe((result: any) => {
            if (result.success == true) {
                this.lineManager = result.data
            }
            if (result.success == false) {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        })
    }

    selectedLineManagerId(employmentStatusId) {
        if (employmentStatusId == "all") {
            this.selectedLineId = null;
            this.selectLineManagerfilter = false;
        } else {
            this.selectedLineId = employmentStatusId;
            this.selectLineManagerfilter = true;
        }
        this.state.skip = 0;
        this.state.take = 20;
        this.getWorkLoggingReport();
    }

    oneMonthBack() {
        const day = this.fromDate.getDate();
        const month = 0 + (this.fromDate.getMonth() - 0);
        const year = this.fromDate.getFullYear();
        const newDate = day + '/' + month + '/' + year;
        this.fromDate = this.parse(newDate);
        console.log(this.fromDate);
    }

    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        } else if ((typeof value === 'string') && value === '') {
            return new Date();
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    resetAllFilters() {
        this.selectedLineId = null;
        this.selectedEmployeeId = null;
        this.selectedUserId = null;
        this.selectLineManagerfilter = false;
        this.selectEmployeeFilterIsActive = false;
        this.fromDate = new Date();
        this.toDate = new Date();
        this.state.skip = 0;
        this.state.take = 20;
        this.oneMonthBack();
        this.getWorkLoggingReport();
    }

    navigateToProjectDetailsPage(project) {
        if (!project.isProjectArchived) {
            this.closePopUp.emit(true);
            this.router.navigate([
                "projects/projectstatus/" + project.projectId + "/active-goals"
            ]);
        }
        else if (project.IsProjectArchived) {
            this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDPROJECT"));
        }
    }

    navigateToGoalDetailsPage(goal) {
        if (goal.isProjectArchived) {
            this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDPROJECT"));
        }
        else if (goal.isGoalParked) {
            this.toaster.error(this.translateService.instant("HISTORICALREPORT.PARKEDGOAL"));
        }
        else if (goal.isGoalArchived) {
            this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDGOAL"));
        } else {
            this.closePopUp.emit(true);
            this.router.navigate([
                "projects/goal",
                goal.goalId
            ]);
        }
    }

    goToProfile(url) {
        this.closePopUp.emit(true);
        this.router.navigateByUrl("dashboard/profile/" + url);
    }

    navigateToUserStoriesPage(event) {
        if (event.isProjectArchived) {
            this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDPROJECT"));
        }
        else if (event.isGoalArchived || event.isGoalParked) {
            if (event.isGoalArchived) {
                this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDGOAL"));
            }
            else if (event.isGoalParked) {
                this.toaster.error(this.translateService.instant("HISTORICALREPORT.PARKEDGOAL"));
            }
        }
        else if (event.isSprintDelete) {
            this.toaster.error(this.translateService.instant("HISTORICALREPORT.SPRINTARCHIVED"));
        }
        else if (event.isUserStoryArchived == false && event.isUserStoryParked == false) {
            if (event) {
                let dialogId = "unique-userstory-dialog-employee-log";
                const dialogRef = this.dialog.open(this.uniqueUserstoryDialog, {
                    height: "90vh",
                    width: "70%",
                    direction: 'ltr',
                    id: dialogId,
                    data: { userStory: { isSprintUserStory: event.isFromSprint, userStoryId: event.userStoryId }, notFromAudits: true, dialogId: dialogId, isFromSprint: event.isFromSprint },
                    disableClose: true,
                    panelClass: 'userstory-dialog-scroll'
                });
                dialogRef.afterClosed().subscribe((result: any) => {
                    if (result.redirection) {
                        this.closePopUp.emit(true);
                    }
                    if (result.success == 'yes') {
                        this.getWorkLoggingReport();
                    }
                });;
            }
        }
        else if (event.isUserStoryArchived) {
            this.toaster.error(this.translateService.instant(ConstantVariables.ThisUserStoryIsArchived));
        }
        else if (event.isUserStoryParked) {
            this.toaster.error(this.translateService.instant(ConstantVariables.ThisUserStoryIsParked));
        }
    }

    openScreenShotsDialog(dataItem) {
        let dialogId = "app-activity-tracker-screenshot";
        const activityScreenshotDialog = this.dialog.open(this.screenShotComponent, {
            width: "79%",
            minHeight: "85vh",
            id: dialogId,
            data: {
                dialogId: dialogId,
                userId: dataItem.userId, dateFrom: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'), dateTo:this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
                userStoryId: dataItem.userStoryId,

            },
        });
        activityScreenshotDialog.afterClosed().subscribe((result) => {

        });
    }
}
