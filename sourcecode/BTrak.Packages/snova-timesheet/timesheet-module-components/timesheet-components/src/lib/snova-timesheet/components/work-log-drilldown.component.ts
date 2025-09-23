import { ChangeDetectorRef, Component, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Page } from '../models/Page';
import { State, process } from '@progress/kendo-data-query';
import { TimesheetService } from '../services/timesheet-service.service';
import { WorkLoggingReportModel } from '../models/workLoggingReport';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Persistance } from '../models/persistance.model';
import { PersistanceService } from '../services/persistance.service';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { CustomWorkLogHeaderModel } from '../models/custom-work-log-header.model';
import { GridSettings } from '../models/grid-settings.model';
import { WorkLogGridSettings } from '../models/work-log-grid-settings.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { RepositoryCommitsModel } from '../models/repository-commits.model';
import { SearchCommitModel } from '../models/search-repository-commits.model';

@Component({
    selector: "app-work-log-drill-down",
    templateUrl: "work-log-drilldown.component.html"
})

export class WorkLogDrillDownComponent extends CustomAppBaseComponent {

    @ViewChildren("commentPopUp") commentPopover;
    @ViewChildren("commitPopUp") commitPopover;
    @Output() closePopUp = new EventEmitter<any>();
    @ViewChild("screenShotComponent") private screenShotComponent: TemplateRef<any>;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            let trackerData = data[0];
            if (trackerData) {
                this.currentDialogId = trackerData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                this.trackerParameters = trackerData.trackerParameters;
                // let dateFrom = this.trackerParameters.dateFrom;
                // dateFrom = dateFrom.split('-');
                // let monthDate = dateFrom[2].split('T');
                // monthDate[0] = '01';
                // this.trackerParameters.dateFrom = dateFrom[0] + '-' + dateFrom[1] + '-' + monthDate[0];
                // this.trackerParameters.dateTo = new Date();
            }
        }
    }

    sortDirection: boolean;
    loadingIndicator: boolean = false;
    page = new Page();
    state: State = {
        skip: 0,
        take: 20,
    };
    sortBy: string;
    isAnyOperationIsInprogress: boolean;
    loggingReport: any;
    pageable: boolean;
    validationMessage: string;
    comments: any;
    commits: RepositoryCommitsModel[] = [];
    currentDialogId: string;
    currentDialog: any;
    trackerParameters: any;
    persistanceObject: any;
    softLabels: SoftLabelConfigurationModel[];
    persistanceId: string;
    referenceId: string = "268AB23D-AE83-4A51-9120-AE57A0BD5AFD";
    loading: boolean = false;

    public gridSettings: WorkLogGridSettings = {
        state: {
            skip: 0,
            take: 30,
        },
        gridData: { data: [], total: 0 },
        columnsConfig: []
    };

    columns: CustomWorkLogHeaderModel[] = [
        {
            field: 'date',
            hidden: false,
            orderIndex: 0,
            title: 'WORKLOGGING.DATE'
        },
        {
            field: 'projectName',
            hidden: false,
            orderIndex: 1,
            title: 'WORKLOGGING.PROJECT'
        },
        {
            field: 'goalName',
            hidden: false,
            orderIndex: 2,
            title: 'WORKLOGGING.GOALNAME'
        },
        {
            field: 'developerName',
            hidden: false,
            orderIndex: 3,
            title: 'WORKLOGGING.EMPLOYEENAME'
        },
        // {
        //     field: 'loggedUserName',
        //     hidden: false,
        //     orderIndex: 4,
        //     title: 'WORKLOGGING.LOGGEDUSERNAME'
        // },
        {
            field: 'boardType',
            hidden: false,
            orderIndex: 4,
            title: 'WORKLOGGING.BOARDTYPE'
        },
        {
            field: 'userStoryName',
            hidden: false,
            orderIndex: 5,
            title: 'WORKLOGGING.TASKNAME'
        },
        {
            field: 'userStoryUniqueName',
            hidden: false,
            orderIndex: 6,
            title: 'GOALREPLANHISTORY.USERSTORYUNIQUENAME'
        },
        {
            field: 'originalEstimate',
            hidden: false,
            orderIndex: 7,
            title: 'HISTORICALREPORT.ESTIMATEDTIME'
        },
        {
            field: 'totalSpentTimeSoFar',
            hidden: false,
            orderIndex: 8,
            title: 'WORKLOGGING.TIMESPENTSOFAR'
        },
        {
            field: 'spentToday',
            hidden: false,
            orderIndex: 9,
            title: 'WORKLOGGING.TIMESPENTTODAY'
        },
        {
            field: 'remainingTime',
            hidden: false,
            orderIndex: 10,
            title: 'WORKLOGGING.REMAININGTIME'
        },
        {
            field: 'comments',
            hidden: false,
            orderIndex: 11,
            title: 'WORKLOGGING.DESCRIPTION'
        },
        {
            field: 'commits',
            hidden: false,
            orderIndex: 12,
            title: 'REPOSITORYCOMMITS.REPOCOMMITS'
        },
    ]

    constructor(private timesheetService: TimesheetService, private toaster: ToastrService, public dialog: MatDialog, private cdRef: ChangeDetectorRef,
        private persistanceService: PersistanceService, private router: Router, private translateService: TranslateService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.page.size = 30;
        this.page.pageNumber = 0;
        this.state.skip = 0;
        this.state.take = 20;
        this.getWorkLoggingReport();
        this.getPersistance();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    getWorkLoggingReport() {
        this.isAnyOperationIsInprogress = true;
        var workLoggingReportModel = new WorkLoggingReportModel();
        workLoggingReportModel.userId = this.trackerParameters.userId;
        workLoggingReportModel.dateFrom = this.trackerParameters.dateFrom;
        workLoggingReportModel.dateTo = this.trackerParameters.dateTo;
        workLoggingReportModel.sortBy = this.sortBy;
        workLoggingReportModel.sortDirectionAsc = this.sortDirection;
        workLoggingReportModel.pageNumber = (this.state.skip / this.state.take) + 1;
        workLoggingReportModel.pageSize = this.state.take;
        workLoggingReportModel.state = this.state;
        this.persistanceObject = workLoggingReportModel;
        this.timesheetService.getWorkLogging(workLoggingReportModel).subscribe((response: any) => {
            if (response.success == true) {
                this.gridSettings = new WorkLogGridSettings();
                this.gridSettings = {
                    state: {
                        skip: 0,
                        take: 30,
                    },
                    gridData: { data: [], total: 0 },
                    columnsConfig: [...this.columns]
                };
                this.loggingReport = response.data != null && response.data != undefined ? response.data : [];
                this.loadData(this.gridSettings.state);
                this.cdRef.markForCheck();
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
                this.toaster.error(this.validationMessage);
            }
        })
    }

    private loadData(state: State): void {
        this.gridSettings.gridData = process(this.loggingReport, state);
        if (this.gridSettings.columnsConfig.length == 0) {
            this.gridSettings.columnsConfig = [...this.columns];
        }
        this.isAnyOperationIsInprogress = false;
        this.loading = true;
        this.cdRef.detectChanges();
    }

    commentView(row, commentPopUp) {
        this.comments = row.commentsList;
        commentPopUp.openPopover();
    }

    SearchRepositoryCommits(data, commitPopUp) {
        this.loadingIndicator = true;
        let searchCommits = new SearchCommitModel();
        searchCommits.userId = this.trackerParameters.userId;
        searchCommits.onDate = this.trackerParameters.dateFrom;
        searchCommits.searchText = data.userStoryUniqueName + ":";
        this.timesheetService.SearchRepositoryCommits(searchCommits).subscribe((responseData: any) => {
            if (responseData.success == false || responseData.data == null) {
                this.commits = [];
            } else {
                this.commits = responseData.data;
            }
            this.loadingIndicator = false;
        });
        commitPopUp.openPopover();
    }
    
    openInNewTab(dataItem) {
        if (dataItem.commitReferenceUrl) {
            window.open(dataItem.commitReferenceUrl, "_blank");
        }
    }

    closeCommitPopOver() {
        this.commitPopover.forEach((p) => p.closePopover());
    }

    closePopOver() {
        this.commentPopover.forEach((p) => p.closePopover());
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridSettings.state = state;
        this.gridSettings.gridData = process(this.loggingReport, state);
        this.saveGridSettings();
    }

    public onVisibilityChange(e: any): void {
        e.columns.forEach((column) => {
            this.gridSettings.columnsConfig.find((col) => col.field === column.field).hidden = column.hidden;
        });
        this.saveGridSettings();
    }

    onNoClick() {
        this.currentDialog.close();
    }

    public saveGridSettings(): void {
        if (this.referenceId) {
            const persistance = new Persistance();
            persistance.referenceId = this.referenceId;
            persistance.isUserLevel = true;
            persistance.persistanceJson = JSON.stringify(this.gridSettings);
            this.persistanceService.UpsertPersistance(persistance).subscribe(() => {
            });
        }
    }

    public onReorder(e: any): void {
        const reorderedColumn = this.gridSettings.columnsConfig.splice(e.oldIndex, 1);
        this.gridSettings.columnsConfig.splice(e.newIndex, 0, ...reorderedColumn);
        this.gridSettings.columnsConfig.forEach((column, i) => {
            column.orderIndex = i;
        });
        this.saveGridSettings();
    }

    getPersistance() {
        if (this.referenceId) {
            this.isAnyOperationIsInprogress = true;
            const persistance = new Persistance();
            persistance.referenceId = this.referenceId;
            persistance.isUserLevel = true;
            this.persistanceService.GetPersistance(persistance).subscribe((response: any) => {
                if (response.success) {
                    const data = response.data;
                    if (data && data.persistanceJson) {
                        this.isAnyOperationIsInprogress = false;
                        this.gridSettings = this.mapGridSettings(JSON.parse(data.persistanceJson));
                        this.columns = this.gridSettings.columnsConfig;
                        this.columns.forEach((element) => {
                            if (element.field == 'originalEstimate') {
                                element.title = 'HISTORICALREPORT.ESTIMATEDTIME';
                            }
                        })
                        this.cdRef.detectChanges();
                        this.loadData(this.gridSettings.state);
                    } else {
                        this.isAnyOperationIsInprogress = false;
                        this.gridSettings = this.mapGridSettings(null);
                        this.loadData(this.gridSettings.state);
                    }
                } else {
                    this.isAnyOperationIsInprogress = false;
                    this.cdRef.detectChanges();
                }
            });
        } else {
            this.gridSettings = this.mapGridSettings(null);
            this.cdRef.detectChanges();
            this.loadData(this.gridSettings.state);

        }
    }

    public mapGridSettings(gridSetting: any) {

        if (gridSetting) {
            const state = gridSetting.state;
            if (gridSetting.state) {
                //this.mapDateFilter(state.filter);
            }
            let gridSettignsNew = new WorkLogGridSettings();
            gridSettignsNew.state = state;
            gridSettignsNew.columnsConfig = gridSetting.columnsConfig ? gridSetting.columnsConfig.sort((a, b) => a.orderIndex - b.orderIndex) : null;
            if (this.loggingReport == undefined) {
                this.loggingReport = [];
            }
            gridSettignsNew.gridData = state ? process(this.loggingReport, state) : null;
            return gridSettignsNew;
        } else {
            let gridSettignsNew = new WorkLogGridSettings();
            gridSettignsNew.state = {
                skip: 0,
                take: 30,
            }
            const state = gridSettignsNew.state;
            if (gridSettignsNew.state) {
                //this.mapDateFilter(state.filter);
            }
            gridSettignsNew.columnsConfig = [...this.columns];
            if (this.loggingReport == undefined) {
                this.loggingReport = [];
            }
            gridSettignsNew.gridData = state ? process(this.loggingReport, state) : null;
            return gridSettignsNew;
        }
    }

    navigateToProjectDetailsPage(project) {
        if (!project.isProjectArchived) {
            this.onNoClick();
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
            this.onNoClick();
            this.router.navigate([
                "projects/goal",
                goal.goalId
            ]);
        }
    }

    goToProfile(url) {
        this.onNoClick();
        this.router.navigateByUrl("dashboard/profile/" + url);
    }

    openScreenShotsDialog(dataItem) {
        let dialogId = "app-activity-tracker-screenshot";
        const activityScreenshotDialog = this.dialog.open(this.screenShotComponent, {
            width: "79%",
            minHeight: "85vh",
            id: dialogId,
            data: {
                dialogId: dialogId,
                userId: dataItem.userId, dateFrom: this.trackerParameters.dateFrom, dateTo: this.trackerParameters.dateTo,
                employeeName: null,userStoryId: dataItem.userStoryId, loggedUserId: dataItem.loggedUserId

            },
        });
        activityScreenshotDialog.afterClosed().subscribe((result) => {

        });
    }
}
