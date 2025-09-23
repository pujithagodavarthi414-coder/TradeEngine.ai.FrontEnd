import { Component, ChangeDetectorRef, TemplateRef, ViewChild, Input } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {  MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardService } from '../services/dashboard.service';
import { TimeSheetManagementSearchInputModel } from '../models/timesheet.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { GridSettings } from '../models/grid-settings.model';
import { PersistanceService } from '../services/persistance.service';
import { CustomQueryHeadersModel } from '../models/custom-query-headers.model';
import { Persistance } from '../models/persistance.model';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from "@progress/kendo-data-query";
import { TranslateService } from '@ngx-translate/core';
import { BreakTimesDisplayComponent } from './break-timings-dialog.component'
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { TimeZoneDataPipe } from '../pipes/timeZoneData.pipe';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import * as introJs from 'intro.js/intro.js';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: 'app-profile-component-viewTimeSheet',
    templateUrl: `viewTimeSheet.component.html`
})
export class ViewTimeSheetComponentProfile extends CustomAppBaseComponent {
    @ViewChild('openBreakDialogComponent') openBreakDialogComponent: TemplateRef<any>;
    @ViewChild("activityTrackerDialog") private activityTrackerDialogComponent: TemplateRef<any>;
    @ViewChild("workDrillDownDialog") private workDrillDownDialog: TemplateRef<any>;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
            if(this.dashboardFilters.userId){
                this.userId = this.dashboardFilters.userId;
                this.cdRef.markForCheck();
            }
            else{
                this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
                this.cdRef.markForCheck();
            }
            if(this.dashboardFilters.dateFrom && this.dashboardFilters.dateTo){
                this.dateTo = new Date(this.dashboardFilters.dateTo);
                this.dateFrom = new Date(this.dashboardFilters.dateFrom);
            }
            else{
                this.dateFrom = this.dashboardFilters.date ? new Date(this.dashboardFilters.date) : null;
                this.dateTo =this.dashboardFilters.date ? new Date(this.dashboardFilters.date) : null;
              }
            this.getviewTimeSheet();
        }
    }
    dashboardFilters: DashboardFilterModel;
    dateTo = new Date();
    dateFrom = new Date(this.dateTo.getFullYear(), this.dateTo.getMonth(), 1);
    maxDate = new Date();
    timeSheetDetails: any[];
    minDate = this.dateFrom;
    dateFromValue: Date;
    dateToValue: Date;
    dateFromSelected: Date;
    dateToSelected: Date;
    teamLeadId: string;
    branchId: string;
    userId: string;
    Date: any;
    isAnyOperationIsInprogress: boolean;
    sortBy: string;
    sortDirection: boolean;
    validationMessage: string;
    referenceId: string = '45A4AAC3-9C42-4F04-8115-2DDFCB6A1888';
    cursor = 'default';
    isPersistanceLoaded = false;
    introJS = new introJs();
    multiPage: string = null;
    isHrModuleAccess: boolean = false;
    columns: CustomQueryHeadersModel[] = [
        {
            field: 'date',
            hidden: false,
            filter: '',
            orderIndex: 0,
            maxLength: 1000,
            width: 100,
            title: 'VIEWTIMESHEET.DATE'
        },
        {
            field: 'inTime',
            hidden: false,
            filter: '',
            orderIndex: 1,
            maxLength: 1000,
            width: 80,
            title: 'TIMESHEET.STARTTIME'
        },
        {
            field: 'outTime',
            hidden: false,
            filter: '',
            orderIndex: 2,
            maxLength: 1000,
            width: 80,
            title: 'TIMESHEET.FINISHTIME'
        },
        {
            field: 'spentTimeDiff',
            hidden: false,
            filter: '',
            orderIndex: 3,
            maxLength: 1000,
            width: 100,
            title: 'ACTIVITYTRACKER.TOTALTIME'
        },
        {
            field: 'lunchBreakDiff',
            hidden: true,
            filter: '',
            orderIndex: 4,
            maxLength: 1000,
            width: 80,
            title: 'ACTIVITYTRACKER.PUNCHCARDLUNCH'
        },
        {
            field: 'userBreaks',
            hidden: true,
            filter: '',
            orderIndex: 5,
            maxLength: 1000,
            width: 80,
            title: 'ACTIVITYTRACKER.PUNCHCARDBREAK'
        },
        {
            field: 'activeTimeInMin',
            hidden: false,
            filter: '',
            orderIndex: 6,
            maxLength: 1000,
            width: 100,
            title: 'ACTIVITYTRACKER.SYSTEMUSAGETIME'
        },
        {
            field: 'totalIdleTime',
            hidden: false,
            filter: '',
            orderIndex: 7,
            maxLength: 1000,
            width: 100,
            title: 'ACTIVITYTRACKER.SYSTEMIDLETIME'
        },
        {
            field: 'productiveTimeInMin',
            hidden: false,
            filter: '',
            orderIndex: 8,
            maxLength: 1000,
            width: 100,
            title: 'ACTIVITYTRACKER.SYSTEMPRODUCTIVETIME'
        },
        {
            field: 'screenshots',
            hidden: false,
            filter: '',
            orderIndex: 9,
            maxLength: 1000,
            width: 100,
            title: 'ACTIVITYTRACKER.NOOFSCREENSHOTS'
        },
        {
            field: 'loggedTime',
            hidden: false,
            filter: '',
            orderIndex: 10,
            maxLength: 1000,
            width: 150,
            title: 'ACTIVITYTRACKER.TIMESPENTONONWORKITEM'
        },
        {
            field: 'leaveReason',
            hidden: true,
            filter: '',
            orderIndex: 11,
            maxLength: 1000,
            width: 100,
            title: 'TIMESHEETSUBMISSION.ISONLEAVE'
        },
        {
          field: 'statusName',
          hidden: false,
          filter: '',
          orderIndex: 12,
          maxLength: 1000,
          width: 140,
          title: 'TIMESHEET.SUBMISSIONSTATUS'
        }
    ];
    lunchToolTipValue: string;
    showLunchBreakTooltip = false;
    softLabels: SoftLabelConfigurationModel[];

    public gridSettings: GridSettings = {
        state: {
            skip: 0,
            take: 30,

            filter: {
                logic: "and",
                filters: []
            }
        },
        gridData: { data: [], total: 0 },
        columnsConfig: []
    };

    constructor(private datePipe: DatePipe, private persistanceService: PersistanceService, private translateService: TranslateService,
        private dashboardService: DashboardService, private cdRef: ChangeDetectorRef, private timeZoneData: TimeZoneDataPipe,
        private toastr: ToastrService, private activatedRoute: ActivatedRoute, private routes: Router, public dialog: MatDialog, private cookieService: CookieService) {
        super();
        this.activatedRoute.params.subscribe(routeParams => {
            this.userId = routeParams.id;
        });
        this.activatedRoute.queryParams.subscribe(params => {
            if (!this.multiPage) {
                this.multiPage = params['multipage'];
            }
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.getviewTimeSheet();
        this.getSoftLabels();
    }
    ngAfterViewInit() {
        this.introJS.setOptions({
            steps: [
                {
                    element: '#view-1',
                    intro: this.translateService.instant('INTROTEXT.VIEW-1'),
                    position: 'bottom'
                },
                {
                    element: '#view-2',
                    intro: this.translateService.instant('INTROTEXT.VIEW-2'),
                    position: 'bottom'
                },
            ]
        });
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.dateFromSelected = event.target.value;
        this.minDate = this.dateFrom;
        this.getviewTimeSheet();
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.dateToSelected = event.target.value;
        this.getviewTimeSheet();
    }

    viewPermissionsBySorting(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        console.log(sort);
        if (sort.dir === 'asc')
            this.sortDirection = true;
        else
            this.sortDirection = false;
        this.getviewTimeSheet();
    }

    getviewTimeSheet() {
        this.isAnyOperationIsInprogress = true;
        let dateFromValue = this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd');
        let dateToValue = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd');
        // let dateFromValue = this.dateFrom;
        // let dateToValue = this.dateTo;
        var timeSheetDetailsInputModel = new TimeSheetManagementSearchInputModel();
        if (this.routes.url.includes("profile") && this.routes.url.split("/")[3]) {
            timeSheetDetailsInputModel.userId = this.routes.url.split("/")[3];
        }
        else {
            timeSheetDetailsInputModel.userId = this.userId;
        }
        timeSheetDetailsInputModel.dateFrom = dateFromValue;
        timeSheetDetailsInputModel.dateTo = dateToValue;
        timeSheetDetailsInputModel.teamLeadId = this.teamLeadId;
        timeSheetDetailsInputModel.sortBy = this.sortBy;
        timeSheetDetailsInputModel.sortDirectionAsc = this.sortDirection;
        timeSheetDetailsInputModel.branchId = this.branchId;
        timeSheetDetailsInputModel.includeEmptyRecords = false;
        this.dashboardService.getviewTimeSheet(timeSheetDetailsInputModel).subscribe((responseData: any) => {
            if (responseData.success === true) {
                this.timeSheetDetails = responseData.data;
                if (!this.isPersistanceLoaded) {
                    this.isPersistanceLoaded = true;
                    this.getPersistance();
                }
                this.gridSettings = new GridSettings();
                this.gridSettings = {
                    state: {
                        skip: 0,
                        take: 30,

                        filter: {
                            logic: "and",
                            filters: []
                        }
                    },
                    gridData: { data: [], total: 0 },
                    columnsConfig: [...this.columns]
                };
                this.gridSettings.state.sort = [{ field: 'date', dir: 'desc' }];
                this.loadData(this.gridSettings.state);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            if (this.multiPage == "true") {
                this.introStart();
                this.multiPage = null;
            }
        })
    }

    checkLunchBreakTooltip(row) {
        this.lunchToolTipValue = "";
        this.showLunchBreakTooltip = false;
        if ((row.lunchBreakStartTime != null) && (row.lunchBreakEndTime != null)) {
            this.lunchToolTipValue = "(" + this.timeZoneData.transform(row.lunchBreakStartTime, "HH:mm") + " " + row.lunchStartAbbreviation + " - " + this.timeZoneData.transform(row.lunchBreakEndTime, "HH:mm") + " " + row.lunchEndAbbreviation + ")";
            this.showLunchBreakTooltip = true;
        } else if (row.lunchBreakStartTime != null) {
            this.lunchToolTipValue = this.translateService.instant('TIMESHEET.LUNCHSTARTON');
            this.showLunchBreakTooltip = true;
        }
    }

    viewUserBreakDetails(dataItem) {
        if (dataItem.userBreaksCount > 0) {
            let dialogId = 'break-timings-user';
            const dialogRef = this.dialog.open(this.openBreakDialogComponent, {
                width: "25vw",
                maxHeight: "50vh",
                disableClose: false,
                id: dialogId,
                data: { breakDetails: dataItem.userBreaks, dialogId: dialogId }
            });
        }
    }
    removeHandler() { }

    pageChange({ skip, take }: PageChangeEvent): void {
        this.gridSettings.state.skip = skip;
        this.gridSettings.state.take = take;
        this.loadData(this.gridSettings.state);
    }

    public dataStateChange(state: State): void {
        this.gridSettings.state = state;
        this.gridSettings.gridData = process(this.timeSheetDetails, state);
        this.saveGridSettings();
    }

    public onReorder(e: any): void {
        const reorderedColumn = this.gridSettings.columnsConfig.splice(e.oldIndex, 1);
        this.gridSettings.columnsConfig.splice(e.newIndex, 0, ...reorderedColumn);
        this.gridSettings.columnsConfig.forEach((column, i) => {
            column.orderIndex = i;
        });
        this.saveGridSettings();
    }

    public onVisibilityChange(e: any): void {
        e.columns.forEach((column) => {
            this.gridSettings.columnsConfig.find((col) => col.field === column.field).hidden = column.hidden;
        });
        this.saveGridSettings();
    }

    public onResize(e: any): void {
        e.forEach((item) => {
            this.gridSettings.columnsConfig.find((col) => col.field === item.column.field).width = item.newWidth;
        });
        this.saveGridSettings();
    }

    private loadData(state: State): void {
        this.gridSettings.gridData = process(this.timeSheetDetails, state);
        if (this.gridSettings.columnsConfig.length == 0) {
            this.gridSettings.columnsConfig = [...this.columns];
        }
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
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
                this.mapDateFilter(state.filter);
            }
            let gridSettignsNew = new GridSettings();
            gridSettignsNew.state = state;
            gridSettignsNew.columnsConfig = gridSetting.columnsConfig ? gridSetting.columnsConfig.sort((a, b) => a.orderIndex - b.orderIndex) : null;
            gridSettignsNew.gridData = state ? process(this.timeSheetDetails, state) : null;
            return gridSettignsNew;
        } else {
            let gridSettignsNew = new GridSettings();
            gridSettignsNew.state = {
                skip: 0,
                take: 30,
                filter: {
                    logic: "and",
                    filters: []
                }
            }
            const state = gridSettignsNew.state;
            if (gridSettignsNew.state) {
                this.mapDateFilter(state.filter);
            }
            gridSettignsNew.columnsConfig = [...this.columns];
            gridSettignsNew.gridData = state ? process(this.timeSheetDetails, state) : null;
            return gridSettignsNew;
        }
    }

    private mapDateFilter = (descriptor: any) => {
        const filters = descriptor.filters || [];

        filters.forEach((filter) => {
            if (filter.filters) {
                this.mapDateFilter(filter);
            }
        });
    }

    openActivityTrackerDetails(dataItem, type) {
        let dialogId = "app-activity-tracker-dialog";
        const activityDialog = this.dialog.open(this.activityTrackerDialogComponent, {
            width: "50%",
            minHeight: "85vh",
            id: dialogId,
            data: {
                dialogId: dialogId, trackerParameters: {
                    userId: dataItem.userId, dateFrom: dataItem.date, dateTo: dataItem.date,
                    profileImage: dataItem.userProfileImage, totalTime: dataItem.totalActiveTimeInMin, usageTime: dataItem.activeTimeInMin, employeeName: dataItem.employeeName, type: type
                }
            },
        });
        activityDialog.afterClosed().subscribe((result) => {

        });
    }

    openWorkDrillDown(dataItem) {
        let dialogId = "work-drilldown-dialogue";
        const dialog = this.dialog.open(this.workDrillDownDialog, {
            width: "50%",
            minHeight: "85vh",
            id: dialogId,
            data: { dialogId: dialogId, trackerParameters: { userId: dataItem.userId, dateFrom: dataItem.date, dateTo: dataItem.date } },
        });
        dialog.afterClosed().subscribe((result) => {

        });
    }
    public async introStart() {
        await this.delay(2000);
        const navigationExtras: NavigationExtras = {
            queryParams: { multipage: true },
            queryParamsHandling: 'merge',
            //preserveQueryParams: true
        }

        this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
            this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase();
            let userModules = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModules));
            if (this.canAccess_feature_CanAccessPerformance && (this.isHrModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0)) {
                this.routes.navigate(["dashboard/profile/" + this.userId + "/performance"], navigationExtras);
            }
        });
    }
    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
