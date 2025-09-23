import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { State } from "../../store/reducers/index";
import { Store, select } from "@ngrx/store";

import { ToastrService } from 'ngx-toastr';

import { ProjectMember } from "../../models/projectMember";
import { UserStory } from '../../models/userStory';

import { GoalLevelReportsService } from '../../services/reports.service';

import * as projectModuleReducer from "../../store/reducers/index";

import { LoadMemberProjectsTriggered } from '../../store/actions/project-members.actions';
import { ITooltipEventArgs } from '@syncfusion/ej2-heatmap';
import { SatPopover } from '@ncstate/sat-popover';
import { AssigneefilterPipe } from '../../pipes/assigneeFilter.pipes';
import { SprintModel } from '../../models/sprints-model';
import { tap } from 'rxjs/operators';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { Router } from '@angular/router';
import * as $_ from 'jquery';
import { StatusReportModel } from '../../models/statusReportInputModel';
import { GoalModel } from '../../models/GoalModel';

const $ = $_;

@Component({
    selector: 'app-dashBoard-component-UserStoriesBasedOnDeveloper',
    templateUrl: 'user-stories -dependent-on-developer.component.html'
})

export class UserStoriesBasedOnDeveloperComponent extends CustomAppBaseComponent implements OnInit {
    @Output() closePopUp = new EventEmitter<any>();

    @ViewChild('namePopover') namePopover: SatPopover;

    anyOperationInProgress: boolean;

    @Input("minDate")
    set _minDate(data: any) {
        this.minDate = data;
    }

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
            this.selectedEmployeeId = null;
            this.goalId = this.dashboardFilters.goalId;
            this.projectId = this.dashboardFilters.projectId;
            this.sprintId = this.dashboardFilters.sprintId;
            this.fromDate = this.dashboardFilters.date;
            if (this.goalId) {
                this.isFromSprint = false;

            } else if (this.sprintId) {
                this.isFromSprint = true;
            }
            this.getUserStoriesList();
            this.getAllEmployees();
            this.dateTo = new Date();
            var dateFrom = new Date();
            var minDate = this.fromDate;
            minDate = new Date(minDate);
            var diff = Math.abs(this.dateTo.getTime() - minDate.getTime());
            var diffDays = Math.floor(diff / (1000 * 3600 * 24));
            if (diffDays > 7) {
                dateFrom.setDate(dateFrom.getDate() - 7);
            } else {
                dateFrom.setDate(dateFrom.getDate() - diffDays);
            }
            this.dateFrom = dateFrom;
            this.toMinDate = this.dateFrom;
            this.GetDeveloperGoalHeatMap();
            if (this.dashboardFilters.userId && this.dashboardFilters.userId !== undefined) {
                this.selectedEmployeesIdFind(this.dashboardFilters.userId);
            }
        }
    }

    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data) {
            this.dashboardId = data;
            this.dashboardId = 'd' + this.dashboardId.replace(/[-]/g, '');
        }
    }
  

    filteredUserStories: UserStory[];
    dashboardFilters: DashboardFilterModel;
    projectMembers$: Observable<ProjectMember[]>;
    employeeList$: Observable<any[]>;
    userStories: UserStory[];
    userStories$: Observable<UserStory[]>;
    sprint: SprintModel;
    userId: string = null;
    fromDate: Date;
    dateFrom: Date;
    dateTo: Date;
    minDate: Date;
    toMinDate: Date;
    userName: string;
    allUserStories: any;
    ownerName: string;
    validationMessage: string;
    dataSource: Object[];
    isFromSprint: boolean;
    goalId: string = null;
    projectId: string = null;
    sprintId: string = null;
    selectEmployeeFilterIsActive: boolean = false;
    isOpen: boolean = true;
    selectedEmployeeId: any = "";
    isVisible: boolean = true
    height: any;
    softLabels: SoftLabelConfigurationModel[];
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    employeeName: string;
    dashboardId: string;
    data: any;

    constructor(private goalLevelReportsService: GoalLevelReportsService, private store: Store<State>, private toastr: ToastrService,
        private assigneeFilterPipe: AssigneefilterPipe, private cdRef: ChangeDetectorRef, private router: Router) {
        super();

    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.selectedEmployeeId = null;
        if (!this.dashboardFilters)
            this.GetDeveloperGoalHeatMap();
    }

    getUserStoriesList() {
        if (this.isFromSprint) {
            this.userStories$ = this.store.pipe(
                select(projectModuleReducer.getSprintWorkItemsAll));
            this.userStories$.subscribe(x => this.userStories = x);
        } else {
            this.userStories$ = this.store.pipe(
                select(projectModuleReducer.getAllUserStories));
            this.userStories$.subscribe(x => this.userStories = x);
        }
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    public tooltipRender(args: ITooltipEventArgs): void {
        args.content = [args.xLabel + ' | ' + args.yLabel];
    };

    titleSettings2: Object = {
        text: 'user stories dependent on developer',
        textStyle: {
            size: '15px',
            fontWeight: '500',
            fontStyle: 'Normal',
            fontFamily: 'Segoe UI'
        }
    };
    yAxis: Object = [];
    xAxis: Object = [];
    public legendSettings2: Object = {
        visible: true,
    };
    public cellSettings2: Object = {
        showLabel: false,
    };
    public showTooltip: boolean = true;

    public paletteSettings2: Object = [];

    GetDeveloperGoalHeatMap() {
        if ((this.goalId == null && !this.isFromSprint) || (this.sprintId == null && this.isFromSprint)) {
            this.isVisible = false;
            this.cdRef.detectChanges();
            return;
        }
        this.anyOperationInProgress = true;
        this.userId = this.selectedEmployeeId;
        const goalId = this.goalId;
        const sprintId = this.sprintId;
        var statusReportModel = new StatusReportModel();
        statusReportModel.goalId = this.goalId;
        statusReportModel.sprintId = this.sprintId;
        statusReportModel.userId = this.userId;
        statusReportModel.dateFrom = this.dateFrom;
        statusReportModel.dateTo = this.dateTo
        this.goalLevelReportsService.getUserStoryStatusReport(statusReportModel).subscribe((Response: any) => {
            let success = Response.success;
            if (success) {
                this.data = Response.data;
                if (Response.data != null) {
                    this.isVisible = true;
                    this.paletteSettings2 = {
                        palette: Response.data.workFlowModels,
                        type: 'Fixed'
                    }

                    this.allUserStories = Response.data;
                    this.dataSource = Response.data.summaryValue;
                    this.height = Response.data.subSummaryValues.length;
                    if (this.height <= 25) {
                        this.height = '500px'
                    }
                    else {
                        this.height = this.height * 20;
                        this.height = this.height.toString();
                        this.height = this.height + 'px';
                    }
                    this.xAxis = {
                        valueType: "Category",
                        labels: Response.data.date,
                        labelRotation: 90
                    };
                    this.yAxis = {
                        valueType: "Category",
                        labels: Response.data.userStoryUniqueName,
                    };
                }
                else {
                    this.data = null;
                    this.paletteSettings2 = [];
                    this.dataSource = null;
                    this.isVisible = false;
                    this.cdRef.detectChanges();
                }
            } else {
                this.validationMessage = Response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
                this.anyOperationInProgress = false;
            }
            this.anyOperationInProgress = false;
            this.cdRef.detectChanges();
        })
    }

    getAllEmployees() {
        if ((this.goalId == null && !this.isFromSprint) || (this.sprintId == null && this.isFromSprint)) {
            return;
        }
        this.store.dispatch(new LoadMemberProjectsTriggered(this.projectId));
        this.employeeList$ = this.store.pipe(select(projectModuleReducer.getProjectMembersAll));
    }

    getDateFrom(date) {
        this.toMinDate = date;
        this.dateFrom = date;
        this.dateTo = null;
        this.GetDeveloperGoalHeatMap();
    }

    getDateTo(date) {
        this.dateTo = date;
        this.GetDeveloperGoalHeatMap();
    }

    clearDateFromFilter() {
        var dateFrom = new Date();
        var fromDate = new Date(this.fromDate);
        var diff = Math.abs(this.dateTo.getTime() - fromDate.getTime());
        var diffDays = Math.floor(diff / (1000 * 3600 * 24));
        if (diffDays > 7) {
            dateFrom.setDate(dateFrom.getDate() - 7);
        } else {
            dateFrom.setDate(dateFrom.getDate() - diffDays);
        }
        this.dateFrom = dateFrom;
        this.GetDeveloperGoalHeatMap();
    }

    clearDateToFilter() {
        this.dateTo = new Date();
        this.GetDeveloperGoalHeatMap();
    }

    selectedEmployeesId(employeeId, event) {
        if (employeeId == "all") {
            this.selectedEmployeeId = null;
            if (event == null)
                this.employeeName = null;
            else
                this.employeeName = event.source.selected._element.nativeElement.innerText.trim();
            this.selectEmployeeFilterIsActive = false;
        } else {
            this.employeeName = event.source.selected._element.nativeElement.innerText.trim();
            this.selectedEmployeeId = employeeId;
            this.selectEmployeeFilterIsActive = true;
        }
        //this.namePopover.close();
        this.GetDeveloperGoalHeatMap();
    }

    selectedEmployeesIdFind(employeeId) {
        this.filteredUserStories = this.assigneeFilterPipe.transform(this.userStories, "ownerName", this.userStories);
        let filteredUserStories = this.filteredUserStories;
        this.employeeName = filteredUserStories.find(x => x.ownerUserId == employeeId).ownerName;
        this.selectedEmployeeId = employeeId;
        this.GetDeveloperGoalHeatMap();
    }


    filterClick() {
        this.isOpen = !this.isOpen;
    }

    resetAllFilters() {
        this.selectedEmployeeId = null;
        this.selectEmployeeFilterIsActive = false;
        this.isVisible = true;
        this.employeeName = null;
        this.dateTo = new Date();
        var dateFrom = new Date();
        var fromDate = new Date(this.fromDate);
        var diff = Math.abs(this.dateTo.getTime() - fromDate.getTime());
        var diffDays = Math.floor(diff / (1000 * 3600 * 24));
        if (diffDays > 7) {
            dateFrom.setDate(dateFrom.getDate() - 7);
        } else {
            dateFrom.setDate(dateFrom.getDate() - diffDays);
        }
        this.dateFrom = dateFrom;
        this.toMinDate = this.dateFrom;
        this.GetDeveloperGoalHeatMap();
    }

    navigateToProjects() {
        this.closePopUp.emit(true);
        this.router.navigateByUrl('/projects');
    }

    fitContent(optionalParameters: any) {
        var interval;
        var count = 0;
        if (optionalParameters['individualPageView']) {
            interval = setInterval(() => {
                try {
                    if (count > 30) {
                        clearInterval(interval);
                    }
                    count++;
                    if ($(optionalParameters['individualPageSelector'] + ' .heat-map').length > 0) {
                        $(optionalParameters['individualPageSelector'] + ' .heat-map').css({"height": "calc(100vh - 300px)"});
                        clearInterval(interval);
                    }
                } catch (err) {
                    clearInterval(interval);
                }
            }, 1000);
        }

        if (optionalParameters['gridsterView']) {
            interval = setInterval(() => {
                try {
                    if (count > 30) {
                        clearInterval(interval);
                    }
                    count++;
                    if ($(optionalParameters['gridsterViewSelector'] + ' .heat-map').length > 0) {
                        $(optionalParameters['gridsterViewSelector'] + ' .heat-map').css({"min-width": "500px" });

                        var appHeight = $(optionalParameters['gridsterViewSelector']).height();
                        var appWidth = $(optionalParameters['gridsterViewSelector']).width();
                        var contentHeight = appWidth < 250? (appHeight - 170) : (appHeight - 99);  
                        $(optionalParameters['gridsterViewSelector'] + ' .heat-map').height(contentHeight);
                        clearInterval(interval);
                    }
                } catch (err) {
                    clearInterval(interval);
                }
            }, 1000);
        }
    }

}